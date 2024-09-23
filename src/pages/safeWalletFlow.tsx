import { useContext } from "react";
import { StepsContext } from "../App";
import ConnectWallets from "../components/ConnectWallets";
import EnableSafeModule from "../components/EnableSafeModule";
import GuardianSetup from "../components/GuardianSetup";
import RequestedRecoveries from "../components/RequestedRecoveries";
import { STEPS } from "../constants";
import { Web3Provider } from "../providers/Web3Provider";

const SafeWalletFlow = () => {
  const stepsContext = useContext(StepsContext);

  const renderBody = () => {
    switch (stepsContext?.step) {
      // Step to connect the safe wallet using WalletConnect
      case STEPS.CONNECT_WALLETS:
        return <ConnectWallets />;

      // Step to enable the safe module in the connected safe
      case STEPS.SAFE_MODULE_RECOVERY:
        return <EnableSafeModule />;

      // Step to set up the guardian email
      case STEPS.REQUEST_GUARDIAN:
        return <GuardianSetup />;

      // Step to add the new owner's address and trigger/complete the recovery process
      case STEPS.REQUESTED_RECOVERIES:
        return <RequestedRecoveries />;

      default:
        return <ConnectWallets />;
    }
  };

  return (
    <div>
      <div className="app">{renderBody()}</div>
    </div>
  );
};

export default SafeWalletFlow;
