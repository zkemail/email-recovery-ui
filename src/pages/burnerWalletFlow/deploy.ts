import "viem/window";
import {
  createWalletClient,
  custom,
  parseEther,
  parseAbiParameters,
  keccak256,
  encodeAbiParameters,
  getAddress,
} from "viem";
import {
  ENTRYPOINT_ADDRESS_V07,
  createSmartAccountClient,
} from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import {
  createPimlicoBundlerClient,
  //   createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico";
import { walletClientToSmartAccountSigner } from "permissionless/utils";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { erc7579Actions } from "permissionless/actions/erc7579";

export const publicClient = createPublicClient({
  transport: http("https://sepolia.base.org"),
});

export const pimlicoBundlerClient = createPimlicoBundlerClient({
  transport: http(
    `https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${import.meta.env.VITE_PIMLICO_API_KEY}`
  ),
  entryPoint: ENTRYPOINT_ADDRESS_V07,
});

export async function run(client, safeAccount, guardianAddr) {

  const ownableValidatorAddress = "0xd9Ef4a48E4C067d640a9f784dC302E97B21Fd691";
  // Universal Email Recovery Module with
  // ECDSAOwnedDKIMRegistry
  // Verifier
  // EmailAuth
  // EmailRecoveryCommandHandler
  const universalEmailRecoveryModuleAddress = "0xc0EFFe5d3D240d35450A43a3F9Ebd98091f2e6a7";


  const addresses = await window.ethereum.request({
    method: "eth_requestAccounts",
  }); // Cast the result to string[]
  const [address] = addresses;
  console.log("address", address);
  console.log("client", client);
  console.log("safeAccount", safeAccount);
  console.log("guardianAddr", guardianAddr);

  const hash = await client.sendTransaction({
    to: safeAccount.address,
    value: parseEther("0.003"),
  });
  console.log("hash", hash);

  const smartAccountClient = createSmartAccountClient({
    account: safeAccount,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    chain: baseSepolia,
    bundlerTransport: http(
      `https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${import.meta.env.VITE_PIMLICO_API_KEY}`
    ),
    middleware: {
      gasPrice: async () =>
        (await pimlicoBundlerClient.getUserOperationGasPrice()).fast, // if using pimlico bundler
    },
  }).extend(erc7579Actions({ entryPoint: ENTRYPOINT_ADDRESS_V07 }));

  const txHash = await smartAccountClient.sendTransaction({
    to: address,
    value: parseEther("0.00001"),
  });
  console.log("txHash", txHash);

  // Convert Uint8Array to hex string without using Buffer
  const toHexString = (bytes) =>
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

  const account = safeAccount.address;
  const isInstalledContext = new Uint8Array([0]);
  const functionSelector = keccak256(
    new TextEncoder().encode("swapOwner(address,address,address)")
  ).slice(0, 10);
  const guardians = [guardianAddr];
  const guardianWeights = [1];
  const threshold = 1;
  const delay = 0; // seconds
  const expiry = 2 * 7 * 24 * 60 * 60; // 2 weeks in seconds

  console.log("account", account);

  const callData = encodeAbiParameters(
    parseAbiParameters(
      "address, bytes, bytes4, address[], uint256[], uint256, uint256, uint256"
    ),
    [
      ownableValidatorAddress,
      isInstalledContext instanceof Uint8Array
        ? `0x${toHexString(isInstalledContext)}`
        : isInstalledContext, // Convert Uint8Array to hex string if necessary
      functionSelector, // Assuming `functionSelector` is already a string
      guardians, // Ensure each `guardian` address is a string
      guardianWeights, // Convert `guardianWeights` to strings
      threshold.toString(),
      delay.toString(),
      expiry.toString(),
    ]
  );

  console.log("callData", callData);

  // acceptanceSubjectTemplates -> [["Accept", "guardian", "request", "for", "{ethAddr}"]]
  // recoverySubjectTemplates -> [["Recover", "account", "{ethAddr}", "using", "recovery", "hash", "{string}"]]
  const opHash = await smartAccountClient.installModule({
    type: "executor",
    address: universalEmailRecoveryModuleAddress,
    context: callData,
  });
  console.log("opHash", opHash);

  const receipt = await pimlicoBundlerClient.waitForUserOperationReceipt({
    hash: opHash,
  });

  console.log("receipt", receipt);

  return account;
}
