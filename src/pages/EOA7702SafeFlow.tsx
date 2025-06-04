import { useContext, useEffect } from "react"; // Removed useState
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { StepsContext } from "../App";
import { generateNewAccount } from "../components/burnerWallet/helpers/generateNewAccount";
import EOA7702Entry from "../components/eoa7702Wallet/EOA7702Entry";
import GuardianSetup from "../components/eoa7702Wallet/GuardianSetup";
import RequestedRecoveries from "../components/eoa7702Wallet/RequestedRecoveries";
import WalletActions from "../components/WalletActions";
import { STEPS } from "../constants";
import {
  BurnerAccountProvider,
  useBurnerAccount,
} from "../context/BurnerAccountContext";
import {
  OwnerPasskeyProvider,
  useOwnerPasskey,
} from "../context/OwnerPasskeyContext";

const EOA7702SafeFlowContent = () => {
  const stepsContext = useContext(StepsContext);
  const {
    setBurnerEOAWalletAddress,
    setBurnerAccount,
    setBurnerAccountClient,
  } = useBurnerAccount();

  const { isLoading: isOwnerPasskeyLoading } = useOwnerPasskey();

  // Create a new burner eoa that will be upgraded to a safe account
  useEffect(() => {
    if (!localStorage.getItem("burnerEOA7702Owner")) {
      generateNewAccount().then((newAccount) => {
        setBurnerEOAWalletAddress(newAccount.address);
        localStorage.setItem("burnerEOA7702Owner", newAccount.address);
        localStorage.setItem(
          "burnerEOA7702OwnerPrivateKey",
          newAccount.privateKey,
        );

        const burnerEOA7702Owner = privateKeyToAccount(
          newAccount.privateKey as `0x${string}`,
        );
        setBurnerAccount(burnerEOA7702Owner);

        const burnerWalletClient = createWalletClient({
          account: burnerEOA7702Owner,
          chain: baseSepolia,
          transport: http(),
        });
        setBurnerAccountClient(burnerWalletClient);
      });
    } else {
      setBurnerEOAWalletAddress(
        localStorage.getItem("burnerEOA7702Owner") as string,
      );
    }

    const handleBeforeUnload = (event: unknown) => {
      if (!(event instanceof BeforeUnloadEvent)) {
        console.log("Before unload event triggered");
      } else {
        // Standard across browsers (Chrome, Firefox, etc.)
        event.preventDefault();
        event.returnValue = ""; // Required for Chrome to show the alert

        // Return any string for some older browsers (though modern browsers ignore it)
        return "Are you sure you want to leave? Your changes may not be saved.";
      }
    };

    // Add event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [setBurnerEOAWalletAddress, setBurnerAccount, setBurnerAccountClient]);

  const renderBody = () => {
    switch (stepsContext?.step) {
      // Step to upgrade the burner EOA to a safe account using EIP7702 and adding a secondary passkey signer
      case STEPS.CONNECT_WALLETS:
        return <EOA7702Entry />;

      // Configuring the email recovery module on smart account and adding the guardian
      case STEPS.REQUEST_GUARDIAN:
        return <GuardianSetup />;

      // Step to set up the guardian email
      case STEPS.WALLET_ACTIONS:
        return <WalletActions />;

      // Step to add the new owner's address and trigger/complete the recovery process. This flow is similar to Safe v1.3
      case STEPS.REQUESTED_RECOVERIES:
        return <RequestedRecoveries />;

      default:
        return <EOA7702Entry />;
    }
  };

  return (
    <div className="app">
      {isOwnerPasskeyLoading ? <p>Loading passkey...</p> : renderBody()}
    </div>
  );
};

const EOA7702SafeFlow = () => {
  return (
    <OwnerPasskeyProvider>
      <BurnerAccountProvider>
        <EOA7702SafeFlowContent />
      </BurnerAccountProvider>
    </OwnerPasskeyProvider>
  );
};

export default EOA7702SafeFlow;
