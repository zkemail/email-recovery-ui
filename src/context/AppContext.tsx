import { createContext } from "react";

type AppContextType = {
  accountCode: `0x${string}` | null;
  setAccountCode: (ac: `0x${string}`) => void;
  guardianEmail: string;
  setGuardianEmail: (ge: string) => void;
  newOwnerAddress: `0x${string}` | null;
  setNewOwnerAddress: (address: `0x${string}` | null) => void;
};

export const appContext = createContext<AppContextType>({
  accountCode: null,
  setAccountCode: () => {},
  guardianEmail: "",
  setGuardianEmail: () => {},
  newOwnerAddress: null,
  setNewOwnerAddress: () => {},
});
