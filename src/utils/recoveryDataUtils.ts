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

// TIME_UNITS is an object that defines various time units.
// Each unit includes:
// - value: A string identifier for the unit.
// - multiplier: The number of seconds equivalent to the unit.
// - label: A human-readable label for display purposes.
// This structure allows for easy conversion between different time units.
export const TIME_UNITS = {
  SECS: {
    value: "SECS",
    multiplier: 1,
    label: "Secs",
  },
  MINS: {
    value: "MINS",
    multiplier: 60,
    label: "Mins",
  },
  HOURS: {
    value: "HOURS",
    multiplier: 60 * 60,
    label: "Hours",
  },
  DAYS: {
    value: "DAYS",
    multiplier: 60 * 60 * 24,
    label: "Days",
  },
};
