import { encodeFunctionData } from "viem";
import { abi as ownableValidatorAbi } from "../abi/OwnableValidator.json";
import { AbiCoder } from "ethers";

export const getRecoveryData = (
  validator: string,
  recoveryCalldata: string,
) => {
  const defaultAbiCoder = AbiCoder.defaultAbiCoder();
  return defaultAbiCoder.encode(
    ["address", "bytes"],
    [validator, recoveryCalldata],
  );
};

export const getRecoveryCallData = (newOwner: string) => {
  return encodeFunctionData({
    abi: ownableValidatorAbi,
    functionName: "changeOwner",
    args: [newOwner],
  });
};
