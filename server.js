// server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());

const PORT = process.env.PORT || 3001; // Default to 3001 for local dev

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;
const ALCHEMY_API_KEY = process.env.VITE_ALCHEMY_API_KEY;

if (!RELAYER_PRIVATE_KEY || !ALCHEMY_API_KEY) {
  console.error(
    "FATAL ERROR: RELAYER_PRIVATE_KEY or ALCHEMY_API_KEY is not defined in the server environment.",
  );
  process.exit(1); // Exit if the key is not found
}

const relayAccount = privateKeyToAccount(RELAYER_PRIVATE_KEY);

export const relayClient = createWalletClient({
  account: relayAccount,
  chain: baseSepolia,
  transport: http(`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
});

// Serve the React app's static files
app.use(express.static(path.join(__dirname, "dist")));

// Define the /api/ping endpoint
app.get("/api/ping", (req, res) => {
  res.status(200).send("Hello world");
});

// Delegate the 7702 Authorisation via the relayer
// body: { to: `0x${string}`, data: `0x${string}, authorization:  Authorization (object) }
app.post("/api/relay/delegate", async (req, res) => {
  try {
    const body = req.body; // No await needed here

    if (!body.to || !body.data || !body.authorization) {
      return res.status(400).send({
        error: "Missing required fields: to, data, or authorization.",
      });
    }

    console.log("Relaying transaction with params:", {
      to: body.to,
      data: body.data,
      authorization: {
        address: body.authorization.address,
        chainId: body.authorization.chainId,
        nonce: body.authorization.nonce,
        r: body.authorization.r,
        s: body.authorization.s,
        v: BigInt(body.authorization.v),
        yParity: body.authorization.yParity,
      },
    });

    const txHash = await relayClient.sendTransaction({
      to: body.to,
      data: body.data,
      authorizationList: [
        {
          address: body.authorization.address,
          chainId: body.authorization.chainId,
          nonce: body.authorization.nonce,
          r: body.authorization.r,
          s: body.authorization.s,
          v: BigInt(body.authorization.v),
          yParity: body.authorization.yParity,
        },
      ],
    });

    console.log("Transaction relayed successfully. Hash:", txHash);
    res.send({ txHash });
  } catch (error) {
    console.error("Error in /api/relay/delegate:", error.message);
    res
      .status(500)
      .send({ error: "Failed to relay transaction.", details: error.message });
  }
});

// Handle any other routes and serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
