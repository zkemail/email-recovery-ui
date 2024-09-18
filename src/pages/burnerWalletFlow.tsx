import { useContext } from "react";
import { StepsContext } from "../App";
import { STEPS } from "../constants";
import GuardianSetup from "../components/burnerWallet/GuardianSetup";
import RequestedRecoveries from "../components/burnerWallet/RequestedRecoveries";
import { Web3Provider } from "../providers/Web3Provider";

const BurnerWalletFlow = () => {
  const stepsContext = useContext(StepsContext);

  const renderBody = () => {
    switch (stepsContext?.step) {
      case STEPS.REQUEST_GUARDIAN:
        return <GuardianSetup />;
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
