import { useContext, useEffect, useState } from "react";
import { StepsContext } from "../App";
import GuardianSetup from "../components/burnerWallet/GuardianSetup";
import RequestedRecoveries from "../components/burnerWallet/RequestedRecoveries";
import { STEPS } from "../constants";

const BurnerWalletFlow = () => {
  const stepsContext = useContext(StepsContext);
  const [burnerWalletAddress, setBurnerWalletAddress] = useState();

  useEffect(() => {
    const burnerWalletAddressPollingInterval = setInterval(() => {
      const burnerWalletConfig = localStorage.getItem("burnerWalletConfig");
      if (burnerWalletConfig !== undefined && burnerWalletConfig !== null) {
        setBurnerWalletAddress(
          JSON.parse(burnerWalletConfig)?.burnerWalletAddress
        );
        clearInterval(burnerWalletAddressPollingInterval);
      }
    }, 1000);
  }, []);

  const renderBody = () => {
    switch (stepsContext?.step) {
      // Step to create a new safe and install the universal email recovery module. This step requires guardian emails before the recovery module can be installed
      case STEPS.REQUEST_GUARDIAN:
        return <GuardianSetup />;

      // Step to add the new owner's address and trigger/complete the recovery process. This flow is similar to Safe v1.3
      case STEPS.REQUESTED_RECOVERIES:
        return <RequestedRecoveries />;

      default:
        return <GuardianSetup />;
    }
  };

  return (
    <div className="app">
      {burnerWalletAddress ? (
        <>
          Burner Wallet Address:{" "}
          <a
            href={`https://app.safe.global/home?safe=basesep%3A${burnerWalletAddress}`}
            target="_blank"
          >
            {burnerWalletAddress}
          </a>
        </>
      ) : null}
      {renderBody()}
    </div>
  );
};

export default BurnerWalletFlow;
