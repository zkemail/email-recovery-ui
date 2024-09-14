import { useContext } from "react";
import { StepsContext } from "../App";
import ConnectWallets from "../components/ConnectWallets";
import EnableSafeModule from "../components/EnableSafeModule";
import GuardianSetup from "../components/GuardianSetup";
import RequestedRecoveries from "../components/RequestedRecoveries";
import TriggerAccountRecovery from "../components/TriggerAccountRecovery";
import { STEPS } from "../constants";
import { Web3Provider } from "../providers/Web3Provider";

const SafeWalletFlow = () => {
  const stepsContext = useContext(StepsContext);

  const renderBody = () => {
    switch (stepsContext?.step) {
      case STEPS.CONNECT_WALLETS:
        return <ConnectWallets />;
      case STEPS.SAFE_MODULE_RECOVERY:
        return <EnableSafeModule />;
      case STEPS.REQUEST_GUARDIAN:
        return <GuardianSetup />;
      case STEPS.REQUESTED_RECOVERIES:
        return <RequestedRecoveries />;
      case STEPS.TRIGGER_ACCOUNT_RECOVERY:
        return <TriggerAccountRecovery />;
      default:
        return <ConnectWallets />;
    }
  };

  return (
    <div>
      <Web3Provider>
        <div className="app">
           {renderBody()}           
        </div>
      </Web3Provider>
    </div>
  );
};

export default SafeWalletFlow;
