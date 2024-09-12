import { encodeFunctionData, encodePacked } from 'viem'
import { abi as safeAbi } from "../abi/Safe.json"
import { AbiCoder, ethers } from 'ethers';

export const getRecoveryData = (validator: string, recoveryCalldata: string) => {
    const defaultAbiCoder = AbiCoder.defaultAbiCoder();
    return defaultAbiCoder.encode(['address', 'bytes'], [validator, recoveryCalldata]);
};

export const getRecoveryCallData = (prevOwner: string, oldOwner: string, newOwner: string) => {
    return encodeFunctionData({
        abi: safeAbi,
        functionName: "swapOwner",
        args: [prevOwner, oldOwner, newOwner],
    })
}