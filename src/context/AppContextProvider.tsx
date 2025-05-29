import { ReactNode, useMemo, useState } from "react";
import { appContext } from "./AppContext";

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [accountCode, setAccountCode] = useState<`0x${string}` | null>(null);
  const [guardianEmail, setGuardianEmail] = useState<string>("");
  const [newOwnerAddress, setNewOwnerAddress] = useState<`0x${string}` | null>(
    null,
  );

  const ctxVal = useMemo(
    () => ({
      accountCode,
      setAccountCode,
      guardianEmail,
      setGuardianEmail,
      newOwnerAddress,
      setNewOwnerAddress,
    }),
    [accountCode, guardianEmail, newOwnerAddress],
  );

  return <appContext.Provider value={ctxVal}>{children}</appContext.Provider>;
};
