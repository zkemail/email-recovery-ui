import { useContext, useEffect, useState } from "react";
import { BurnerWalletProvider } from "../providers/BurnerWalletProvider";
import { createBurnerSafeConfig } from "../providers/burnerWalletConfig";
import { StepsContext } from "../App";
import { STEPS } from "../constants";
import SafeModuleRecovery from "../components/burnerWallet/SafeModuleRecovery";
import GuardianSetup from "../components/burnerWallet/GuardianSetup";
import RequestedRecoveries from "../components/RequestedRecoveries";
import TriggerAccountRecovery from "../components/TriggerAccountRecovery";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { install, run } from "../utils/burnerWalletUtils";
import ConnectBurnerWallet from "./burnerWalletFlow/ConnectBurnerWallet";

const BurnerWalletFlow = () => {
  const stepsContext = useContext(StepsContext);
  const [isBurnerWalletCreating, setIsBurnerWalletCreating] = useState(false);
  const [burnerWalletConfig, setBurnerWalletConfig] = useState();

  // useEffect(() => {
  //   run();
  //   install()
  // }, []);

  console.log(stepsContext?.step, STEPS)

  const renderBody = () => {
    switch (stepsContext?.step) {
      case STEPS.CONNECT_WALLETS:
        return <ConnectBurnerWallet />;
      case STEPS.REQUEST_GUARDIAN:
        return <GuardianSetup />;
      case STEPS.REQUESTED_RECOVERIES:
        return <RequestedRecoveries />;
      case STEPS.TRIGGER_ACCOUNT_RECOVERY:
        return <TriggerAccountRecovery />;
      default:
        return <ConnectBurnerWallet />;
    }
  };

  if (isBurnerWalletCreating) {
    return (
      <div className="app">
        <Loader />
      </div>
    );
  }
  // if (!burnerWalletConfig) {
  //   return <div className="app">Could not configure burner wallet</div>;
  // }

  return (
    <BurnerWalletProvider config={burnerWalletConfig}>
      <div className="app">{renderBody()}</div>
    </BurnerWalletProvider>
  );
};

export default BurnerWalletFlow;
