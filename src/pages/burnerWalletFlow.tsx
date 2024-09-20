import { useContext } from "react";
import { StepsContext } from "../App";
import GuardianSetup from "../components/burnerWallet/GuardianSetup";
import RequestedRecoveries from "../components/burnerWallet/RequestedRecoveries";
import { STEPS } from "../constants";
import { Web3Provider } from "../providers/Web3Provider";

const BurnerWalletFlow = () => {
  const stepsContext = useContext(StepsContext);

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
    <Web3Provider>
      <div className="app">{renderBody()}</div>
    </Web3Provider>
  );
};

export default BurnerWalletFlow;
