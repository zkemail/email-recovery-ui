import { createConfig } from "wagmi";
import { walletConnect } from "wagmi/connectors";
import { baseSepolia } from "viem/chains";
import { createPublicClient, http } from "viem";

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export const config = createConfig({
  chains: [baseSepolia], // Add your non-public RPC endpoint if available
  connectors: [
    walletConnect({
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    }),
  ],
  publicClient,
});
