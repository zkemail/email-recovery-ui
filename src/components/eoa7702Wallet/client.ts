import {
  MOCK_ATTESTER_ADDRESS,
  RHINESTONE_ATTESTER_ADDRESS,
} from "@rhinestone/module-sdk";
import { createSmartAccountClient } from "permissionless";
import {
  SafeSmartAccountImplementation,
  toSafeSmartAccount,
} from "permissionless/accounts";
import { erc7579Actions } from "permissionless/actions/erc7579";
import {
  createPimlicoClient,
  type PimlicoClient,
} from "permissionless/clients/pimlico";
import { createPublicClient, http, PrivateKeyAccount } from "viem";
import {
  entryPoint07Address,
  type SmartAccount,
  WebAuthnAccount,
} from "viem/account-abstraction";
import { toAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { getWebAuthnValidatorFromWebAuthnAccount } from "./utils.ts";
import {
  erc7569LaunchpadAddress,
  safe4337ModuleAddress,
} from "../../../contracts.base-sepolia.json";
import config from "../burnerWallet/config";

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

export const deadOwner = toAccount({
  address: "0x000000000000000000000000000000000000dead",
  async signMessage() {
    return "0x";
  },
  async signTransaction() {
    return "0x";
  },
  async signTypedData() {
    return "0x";
  },
});

export const getSafeAccount = async (
  owner: WebAuthnAccount,
  eoaAccount: PrivateKeyAccount,
): Promise<SmartAccount<SafeSmartAccountImplementation>> => {
  const webauthnValidator = getWebAuthnValidatorFromWebAuthnAccount(owner);

  return await toSafeSmartAccount({
    address: eoaAccount.address,
    client: publicClient,
    owners: [deadOwner],
    version: "1.4.1",
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
    safe4337ModuleAddress: safe4337ModuleAddress as `0x${string}`,
    erc7579LaunchpadAddress: erc7569LaunchpadAddress as `0x${string}`,
    attesters: [RHINESTONE_ATTESTER_ADDRESS, MOCK_ATTESTER_ADDRESS],
    attestersThreshold: 1,
    validators: [
      {
        address: webauthnValidator.address,
        context: webauthnValidator.initData,
      },
    ],
  });
};

export const getSafeSmartAccountClient = async (
  owner: WebAuthnAccount,
  eoaAccount: PrivateKeyAccount,
) => {
  return createSmartAccountClient({
    account: await getSafeAccount(owner, eoaAccount),
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
