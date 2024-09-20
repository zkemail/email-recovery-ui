import { useContext } from "react";
import { StepsContext } from "../App";
import RequestedRecoveries from "../components/RequestedRecoveries";
import { STEPS } from "../constants";
import { Web3Provider } from "../providers/Web3Provider";

const RecoverWalletFlow = () => {
  const stepsContext = useContext(StepsContext);

  const renderBody = () => {
    switch (stepsContext?.step) {
      case STEPS.REQUESTED_RECOVERIES:
        return <RequestedRecoveries />;
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
