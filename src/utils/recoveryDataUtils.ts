import { AbiCoder } from "ethers";
import { encodeFunctionData } from "viem";
import { abi as ownableValidatorAbi } from "../abi/OwnableValidator.json";

/**
 * Encodes the recovery data using the validator address and recovery call data.
 * @param {string} validator - The address of the validator.
 * @param {string} recoveryCalldata - The encoded function data for recovery.
 * @returns {string} The encoded recovery data as a string.
 */
export const getRecoveryData = (
  validator: string,
  recoveryCalldata: string,
): string => {
  const defaultAbiCoder = AbiCoder.defaultAbiCoder();
  return defaultAbiCoder.encode(
    ["address", "bytes"],
    [validator, recoveryCalldata],
  );
};

/**
 * Generates the recoveryCallData for changing the owner of a contract.
 * @param {string} newOwner - The address of the new owner.
 * @returns {string} The recoveryCallData for the ownership change.
 */
export const getRecoveryCallData = (newOwner: string): string => {
  return encodeFunctionData({
    abi: ownableValidatorAbi,
    functionName: "changeOwner",
    args: [newOwner],
  });
};
