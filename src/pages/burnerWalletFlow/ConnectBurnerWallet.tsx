import React, { useContext, useEffect, useState } from "react";
import { STEPS } from "../../constants";
import { StepsContext } from "../../App";
import { run } from "./deploy";

const ConnectBurnerWallet = () => {
  const [account, setAccount] = useState<string>(null);
  const [accountCreationError, setAccountCreationError] = useState(false);
  const stepsContext = useContext(StepsContext);

  const connectWallet = async () => {
    // Assuming install function sets the account
    try {
      const burnerWalletAddress = await run();
      console.log(burnerWalletAddress, "account");
      setAccount(burnerWalletAddress);
      localStorage.setItem(
        "burnerWalletConfig",
        JSON.stringify({ burnerWalletAddress })
      );
      stepsContext?.setStep(STEPS.REQUEST_GUARDIAN);
    } catch (error) {
      console.log(error);
      setAccountCreationError(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("burnerWalletConfig")) {
      return stepsContext?.setStep(STEPS.REQUEST_GUARDIAN);
    }
    connectWallet();
  }, []);

  if (accountCreationError) {
    return (
      <div>
        Something went wrong, please try again...
        <button color="primary" onClick={connectWallet}>
          Retry Creating wallet
        </button>
      </div>
    );
  }

  return <div>Creating wallet... </div>;
};

export default ConnectBurnerWallet;
