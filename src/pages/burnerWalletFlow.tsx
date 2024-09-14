import { useContext } from "react";
import { BurnerWalletProvider } from "../providers/BurnerWalletProvider";
import { StepsContext } from "../App";
import { STEPS } from "../constants";
import GuardianSetup from "../components/burnerWallet/GuardianSetup";
import RequestedRecoveries from "../components/burnerWallet/RequestedRecoveries";
import TriggerAccountRecovery from "../components/TriggerAccountRecovery";
import { Web3Provider } from "../providers/Web3Provider";

const BurnerWalletFlow = () => {
  const stepsContext = useContext(StepsContext);

  const renderBody = () => {
    switch (stepsContext?.step) {
      case STEPS.REQUEST_GUARDIAN:
        return <GuardianSetup />;
      case STEPS.REQUESTED_RECOVERIES:
        return <RequestedRecoveries />;
      case STEPS.TRIGGER_ACCOUNT_RECOVERY:
        return <TriggerAccountRecovery />;
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
