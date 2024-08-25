import { useAccount } from "wagmi";

export const useGetSafeAccountAddress = () => {
  const { address } = useAccount();
  const burnerWalletConfig = localStorage.getItem("burnerWalletConfig");

  if (burnerWalletConfig) {
    return JSON.parse(burnerWalletConfig).burnerWalletAddress;
  }

  return address;
};
