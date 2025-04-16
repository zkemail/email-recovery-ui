import "viem/window";
import { SafeSmartAccountImplementation } from "permissionless/accounts";
import { Erc7579Actions } from "permissionless/actions/erc7579";
import {
  Chain,
  Client,
  encodeAbiParameters,
  RpcSchema,
  toFunctionSelector,
  toHex,
  Transport,
} from "viem";
import { SmartAccount } from "viem/account-abstraction";
import { publicClient } from "./client";
import config from "./config";
import { computeGuardianAddress } from "./helpers/computeGuardianAddress";

/**
 * Executes a series of operations to configure a smart account, including transferring Ether,
 * setting up recovery modules, and installing modules using a smart account client.
 *
 * @async
 * @param {WalletClient} client - The wallet client used for transactions and interactions.
 * @param {object} safeAccount - The smart account object containing the address of the account.
 * @param {object} smartAccountClient - The safe account client
 * @param {string} guardianAddr - The address of the guardian used in the recovery module.
 * @returns {Promise<string>} The address of the configured smart account.
 */
export async function run(
  accountCode: `0x${string}`,
  guardianEmail: string,
  safeAccount: SmartAccount<SafeSmartAccountImplementation>,
  smartAccountClient: Client<Transport, Chain, SmartAccount, RpcSchema> &
    Erc7579Actions<SmartAccount<SafeSmartAccountImplementation>>
) {
  // Universal Email Recovery Module with
  // ECDSAOwnedDKIMRegistry
  // Verifier
  // EmailAuth
  // EmailRecoveryCommandHandler

  console.log("init run")
  
  const guardianAddress = await computeGuardianAddress(
    safeAccount.address,
    accountCode,
    guardianEmail
  );
  console.log(guardianAddress, "guardian address")
  
  const bytecode = await publicClient.getCode({
    address: safeAccount.address,
  });
  if (bytecode) {
    const isModuleInstalled = await smartAccountClient.isModuleInstalled({
      address: config.addresses.universalEmailRecoveryModule,
      type: "executor",
      context: toHex(0),
    });
    if (isModuleInstalled) {
      console.log("Module already installed");
      return;
    }
  }
  console.log(bytecode, "byte code")

  const validator = safeAccount.address;
  const isInstalledContext = toHex(0);
  const functionSelector = toFunctionSelector(
    "swapOwner(address,address,address)"
  );
  const guardians = [guardianAddress];
  const guardianWeights = [1n];
  const threshold = 1n;
  const delay = 6n * 60n * 60n; // 6 hours
  const expiry = 2n * 7n * 24n * 60n * 60n; // 2 weeks in seconds

  console.log(validator, isInstalledContext, functionSelector, guardians, guardianWeights, threshold, delay, expiry, "moduleData")

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
      delay,
      expiry,
    ]
  );

  console.log(moduleData, "moduleData")

  // acceptanceSubjectTemplates -> [["Accept", "guardian", "request", "for", "{ethAddr}"]]
  // recoverySubjectTemplates -> [["Recover", "account", "{ethAddr}", "using", "recovery", "hash", "{string}"]]
  try {
    const userOpHash = await smartAccountClient.installModule({
      type: "executor",
      address: config.addresses.universalEmailRecoveryModule,
      context: moduleData,
      account: safeAccount,
    });
    console.log("opHash", userOpHash);
  } catch (error: unknown) {
    console.error("Error installing module:", error);
    if (error instanceof Error && error.message.includes("Owners length mismatch")) {
      throw new Error("The Safe account owners are not configured correctly. Please ensure you have the correct owners set up.");
    }
    throw error;
  }
}
