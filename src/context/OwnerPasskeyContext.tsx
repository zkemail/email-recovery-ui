import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  P256Credential,
  toWebAuthnAccount,
  WebAuthnAccount,
} from "viem/account-abstraction";

interface OwnerPasskeyContextType {
  ownerPasskeyCredential: P256Credential | null;
  ownerPasskeyAccount: WebAuthnAccount | null;
  setOwnerPasskeyCredential: (credential: P256Credential | null) => void;
  isLoading: boolean;
}

const OwnerPasskeyContext = createContext<OwnerPasskeyContextType | undefined>(
  undefined,
);

export const OwnerPasskeyProvider = ({ children }: { children: ReactNode }) => {
  const [ownerPasskeyCredential, setOwnerPasskeyCredentialState] =
    useState<P256Credential | null>(null);
  const [ownerPasskeyAccount, setOwnerPasskeyAccount] =
    useState<WebAuthnAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedCredentialStr = localStorage.getItem(
        "ownerPasskeyCredential",
      );
      if (storedCredentialStr) {
        const credential = JSON.parse(storedCredentialStr) as P256Credential;
        setOwnerPasskeyCredentialState(credential);
        if (credential) {
          const account = toWebAuthnAccount({ credential });
          setOwnerPasskeyAccount(account);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load owner passkey credential from local storage:",
        error,
      );
      localStorage.removeItem("ownerPasskeyCredential"); // Clear potentially corrupted item
      setOwnerPasskeyCredentialState(null);
      setOwnerPasskeyAccount(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setOwnerPasskeyCredentialCallback = useCallback(
    (credential: P256Credential | null) => {
      setIsLoading(true);
      try {
        if (credential) {
          localStorage.setItem(
            "ownerPasskeyCredential",
            JSON.stringify(credential),
          );
          setOwnerPasskeyCredentialState(credential);
          const account = toWebAuthnAccount({ credential });
          setOwnerPasskeyAccount(account);
        } else {
          localStorage.removeItem("ownerPasskeyCredential");
          setOwnerPasskeyCredentialState(null);
          setOwnerPasskeyAccount(null);
        }
      } catch (error) {
        console.error("Failed to set owner passkey credential:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return (
    <OwnerPasskeyContext.Provider
      value={{
        ownerPasskeyCredential,
        ownerPasskeyAccount,
        setOwnerPasskeyCredential: setOwnerPasskeyCredentialCallback,
        isLoading,
      }}
    >
      {children}
    </OwnerPasskeyContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOwnerPasskey = () => {
  const context = useContext(OwnerPasskeyContext);
  if (context === undefined) {
    throw new Error(
      "useOwnerPasskey must be used within an OwnerPasskeyProvider",
    );
  }
  return context;
};
