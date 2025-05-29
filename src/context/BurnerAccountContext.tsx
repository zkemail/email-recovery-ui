import React, { createContext, ReactNode, useContext, useState } from "react";
import "viem/window";

type BurnerAccountContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  burnerAccountClient: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setBurnerAccountClient: (accountClient: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  burnerAccount: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setBurnerAccount: (account: any) => void;
  burnerEOAWalletAddress: string | null;
  setBurnerEOAWalletAddress: (address: string | null) => void;
  isResetBurnerWalletConfirmationModalOpen: boolean;
  setIsResetBurnerWalletConfirmationModalOpen: (isOpen: boolean) => void;
};

const BurnerAccountContext = createContext<BurnerAccountContextType>({
  burnerAccountClient: null,
  setBurnerAccountClient: () => {},
  burnerAccount: null,
  setBurnerAccount: () => {},
  burnerEOAWalletAddress: null,
  setBurnerEOAWalletAddress: () => {},
  isResetBurnerWalletConfirmationModalOpen: false,
  setIsResetBurnerWalletConfirmationModalOpen: () => {},
});

export const BurnerAccountProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [burnerAccountClient, setBurnerAccountClient] = useState(null);
  const [burnerAccount, setBurnerAccount] = useState(null);
  const [burnerEOAWalletAddress, setBurnerEOAWalletAddress] = useState<
    string | null
  >(null);
  const [
    isResetBurnerWalletConfirmationModalOpen,
    setIsResetBurnerWalletConfirmationModalOpen,
  ] = useState<boolean>(false);

  return (
    <BurnerAccountContext.Provider
      value={{
        burnerAccountClient,
        setBurnerAccountClient,
        burnerAccount,
        setBurnerAccount,
        burnerEOAWalletAddress,
        setBurnerEOAWalletAddress,
        isResetBurnerWalletConfirmationModalOpen,
        setIsResetBurnerWalletConfirmationModalOpen,
      }}
    >
      {children}
    </BurnerAccountContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBurnerAccount = () => {
  const context = useContext(BurnerAccountContext);
  if (!context) {
    throw new Error(
      "useBurnerAccount must be used within a BurnerAccountProvider",
    );
  }
  return context;
};
