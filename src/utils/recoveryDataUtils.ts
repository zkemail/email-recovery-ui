import { encodeFunctionData, encodePacked } from 'viem'
import { abi as safeAbi } from "../abi/Safe.json"

export const getRecoveryData = (validator: string, recoveryCalldata: string) => {
    return encodePacked(
        ['address', 'bytes'],
        [validator, recoveryCalldata]
    );
};

export const getRecoveryCallData = (prevOwner: string, oldOwner: string, newOwner: string) => {
    return encodeFunctionData({
        abi: safeAbi,
        functionName: "swapOwner",
        args: [prevOwner, oldOwner, newOwner],
    })
}