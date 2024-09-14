import { useContext, useState } from "react";
import RequestedRecoveries from "../components/RequestedRecoveries";
import TriggerAccountRecovery from "../components/TriggerAccountRecovery";
import { STEPS } from "../constants";
import { StepsContext } from "../App";
import { Web3Provider } from "../providers/Web3Provider";

const RecoverWalletFlow = () => {
  const stepsContext = useContext(StepsContext);

  const renderBody = () => {
    switch (stepsContext?.step) {
      case STEPS.REQUESTED_RECOVERIES:
        return <RequestedRecoveries />;
      case STEPS.TRIGGER_ACCOUNT_RECOVERY:
        return <TriggerAccountRecovery />;
      default:
        return <RequestedRecoveries />;
    }
  };

  return (
    <div>
      <Web3Provider>
        <div className="app">{renderBody()}</div>
      </Web3Provider>
    </div>
  );
};

export default RecoverWalletFlow;
