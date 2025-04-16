import { createSmartAccountClient } from "permissionless";
import {
  type SafeSmartAccountImplementation,
  toSafeSmartAccount,
} from "permissionless/accounts";
import {
  erc7579Actions,
  type Erc7579Actions,
} from "permissionless/actions/erc7579";
import {
  createPimlicoClient,
  type PimlicoClient,
} from "permissionless/clients/pimlico";
import {
  type Chain,
  type Client,
  createPublicClient,
  http,
  PrivateKeyAccount,
  type RpcSchema,
  type Transport,
} from "viem";
import {
  entryPoint07Address,
  type SmartAccount,
} from "viem/account-abstraction";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import config from "./config.ts";

export const publicClient = createPublicClient({
  transport: http(config.rpcUrl),
  chain: baseSepolia,
});

export const pimlicoClient: PimlicoClient = createPimlicoClient({
  transport: http(config.bundlerUrl),
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7",
  },
  chain: baseSepolia,
});

// Function to connect to MetaMask and get the selected account
export const connectToMetaMask = async (): Promise<string> => {
  // Check if MetaMask is installed
  if (typeof window.ethereum === "undefined") {
    throw new Error(
      "MetaMask is not installed. Please install MetaMask and try again."
    );
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      throw new Error("No MetaMask accounts found.");
    }

    // Return the first selected account
    return accounts[0];
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    throw error;
  }
};

// Function to create an owner object from the MetaMask account
export const createOwnerFromMetaMask = async (
  address?: string | null
): Promise<PrivateKeyAccount> => {
  if (!address) {
    address = await connectToMetaMask();
  }

  // Since we can't get the private key from MetaMask, we'll create a signer object
  // that will use MetaMask for signing operations
  const signer = {
    address,
    signMessage: async (message: { message: string }) => {
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message.message, address],
      });
      return signature;
    },
    signTypedData: async (typedData: any) => {
      const signature = await window.ethereum.request({
        method: "eth_signTypedData_v4",
        params: [address, JSON.stringify(typedData)],
      });
      return signature;
    },
  };

  return signer;
};

export const getSafeAccount = async (
  owner: PrivateKeyAccount
): Promise<SmartAccount<SafeSmartAccountImplementation>> => {
  return await toSafeSmartAccount({
    client: publicClient,
    owners: [owner],
    version: "1.4.1",
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
    safe4337ModuleAddress: config.addresses.safe4337ModuleAddress,
    erc7579LaunchpadAddress: config.addresses.erc7569LaunchpadAddress,
    attesters: [config.addresses.attestor],
    attestersThreshold: 1,
    saltNonce: config.saltNonce,
  });
};

export const getSmartAccountClient = async (
  owner: PrivateKeyAccount
): Promise<
  Client<Transport, Chain, SmartAccount, RpcSchema> &
    Erc7579Actions<SmartAccount<SafeSmartAccountImplementation>>
> => {
  return createSmartAccountClient({
    account: await getSafeAccount(owner),
    chain: baseSepolia,
    bundlerTransport: http(config.bundlerUrl),
    paymaster: pimlicoClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await pimlicoClient.getUserOperationGasPrice()).fast;
      },
    },
  }).extend(erc7579Actions());
};
