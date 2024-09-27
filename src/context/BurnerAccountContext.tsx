import React, { createContext, useContext, useState, ReactNode } from "react";
import "viem/window";

interface BurnerAccountContextType {
  burnerAccountClient: any; // Replace 'any' with the actual type if known
  setBurnerAccountClient: (client: any) => void; // Adjust the type as necessary
}

const BurnerAccountContext = createContext<BurnerAccountContextType | null>(
  null
);

export const BurnerAccountProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [burnerAccountClient, setBurnerAccountClient] = useState<any>(null); // Adjust type as needed

  return (
    <BurnerAccountContext.Provider
      value={{ burnerAccountClient, setBurnerAccountClient }}
    >
      {children}
    </BurnerAccountContext.Provider>
  );
};

export const useBurnerAccount = () => {
  const context = useContext(BurnerAccountContext);
  if (!context) {
    throw new Error(
      "useBurnerAccount must be used within a BurnerAccountProvider"
    );
  }
  return context;
};
