import React, { useState } from "react";
import { run } from "./deploy";

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    // Assuming install function sets the account
    const account = await run();
    console.log(account, "account")
    setAccount(account);
  };

  return (
    <div>
      {!account ? (
        <button color="primary" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <>{account}</>
      )}
    </div>
  );
};

export default ConnectWallet;
