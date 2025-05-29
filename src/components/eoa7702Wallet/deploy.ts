import "viem/window";
import { SmartAccountClient } from "permissionless";
import { SafeSmartAccountImplementation } from "permissionless/accounts";
import { Erc7579Actions } from "permissionless/actions/erc7579";
import {
  Chain,
  checksumAddress,
  Client,
  encodeAbiParameters,
  encodeFunctionData,
  RpcSchema,
  toFunctionSelector,
  toHex,
  Transport,
} from "viem";
import { SmartAccount, WebAuthnAccount } from "viem/account-abstraction";
import { publicClient } from "./client";
import { sendTransactionFromSafeWithWebAuthn } from "./utils";
import { universalEmailRecoveryModule } from "../../../contracts.base-sepolia.json";
import {
  DEFAULT_EXPIRATION_TIME,
  DEFAULT_SIGNER_THRESHOLD,
} from "../../constants";
import { computeGuardianAddress } from "../burnerWallet/helpers/computeGuardianAddress";

/**
 * Executes a series of operations to configure a smart account, including transferring Ether,
 * setting up recovery modules, and installing modules using a smart account client.
 *
 * @async
 * @param {WalletClient} client - The wallet client used for transactions and interactions.
 * @param {object} kernelAccount - The smart account object containing the address of the account.
 * @param {object} smartAccountClient - The safe account client
 * @param {string} guardianAddr - The address of the guardian used in the recovery module.
 * @returns {Promise<string>} The address of the configured smart account.
 */
export async function run(
  accountCode: `0x${string}`,
  guardianEmail: string,
  ownerAccount: WebAuthnAccount,
  kernelAccount: SmartAccount<SafeSmartAccountImplementation>,
  smartAccountClient: SmartAccountClient<
    Transport,
    Chain,
    SmartAccount<SafeSmartAccountImplementation>,
    Client,
    RpcSchema
  > &
    Erc7579Actions<SmartAccount<SafeSmartAccountImplementation>>,
  delay: number,
) {
  console.log("init run");

  const guardianAddress = await computeGuardianAddress(
    kernelAccount.address,
    accountCode,
    guardianEmail,
  );
  console.log(guardianAddress, "guardian address");

  const bytecode = await publicClient.getCode({
    address: kernelAccount.address,
  });
  if (bytecode) {
    const isModuleInstalled = await smartAccountClient.isModuleInstalled({
      address: universalEmailRecoveryModule as `0x${string}`,
      type: "executor",
      context: toHex(0),
    });
    if (isModuleInstalled) {
      console.log("Module already installed");
      return;
    } else {
      console.log("Module not installed");
    }
  }
  console.log(bytecode, "byte code");

  const validator = kernelAccount.address;
  const isInstalledContext = toHex(0);
  const functionSelector = toFunctionSelector(
    "swapOwner(address,address,address)",
  );
  const guardians = [guardianAddress];
  const guardianWeights = [1n];
  const threshold = DEFAULT_SIGNER_THRESHOLD;
  const expiry = DEFAULT_EXPIRATION_TIME;

  const moduleData = encodeAbiParameters(
    [
      { name: "validator", type: "address" },
      { name: "isInstalledContext", type: "bytes" },
      { name: "initialSelector", type: "bytes4" },
      { name: "guardians", type: "address[]" },
      { name: "weights", type: "uint256[]" },
      { name: "delay", type: "uint256" },
      { name: "expiry", type: "uint256" },
      { name: "threshold", type: "uint256" },
    ],
    [
      validator,
      isInstalledContext,
      functionSelector,
      guardians,
      guardianWeights,
      threshold,
      BigInt(delay),
      expiry,
    ],
  );

  const installModuleCall = {
    to: smartAccountClient.account.address as `0x${string}`,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: [
        {
          inputs: [
            { internalType: "uint256", name: "moduleType", type: "uint256" },
            { internalType: "address", name: "module", type: "address" },
            { internalType: "bytes", name: "initData", type: "bytes" },
          ],
          name: "installModule",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      functionName: "installModule",
      args: [
        BigInt(2),
        checksumAddress(universalEmailRecoveryModule as `0x${string}`),
        moduleData,
      ],
    }),
  };

  // acceptanceSubjectTemplates -> [["Accept", "guardian", "request", "for", "{ethAddr}"]]
  // recoverySubjectTemplates -> [["Recover", "account", "{ethAddr}", "using", "recovery", "hash", "{string}"]]
  const userOpReceipt = await sendTransactionFromSafeWithWebAuthn(
    ownerAccount,
    smartAccountClient,
    installModuleCall,
  );

  return userOpReceipt;
}
