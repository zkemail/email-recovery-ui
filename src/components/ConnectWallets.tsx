import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { Box, Typography } from "@mui/material";
import { ConnectKitButton } from "connectkit";
import { useContext } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./Button";
import { StepsContext } from "../App";
import { STEPS } from "../constants";
import { walletConnect } from "wagmi/connectors";
import CustomConnectButton from "./CustomConnectKitButton";

const ConnectWallets = () => {
  // const { address } = useAccount();
  const stepsContext = useContext(StepsContext);
  const { address, isConnected } = useAccount();
  console.log(address, isConnected)

  if (address) {
    // If we have the address, we can assume the user has successfully connected the safe wallet. Proceeding to the next step.
    stepsContext?.setStep(STEPS.SAFE_MODULE_RECOVERY);
  }

  return (
    <div className="connect-wallets-container">
      <Box sx={{ marginX: "auto", marginTop: "180px" }}>
        <Typography variant="h2" sx={{ paddingBottom: "20px" }}>
          Set Up Wallet Recovery
        </Typography>
        <Typography variant="h6" sx={{ paddingBottom: "30px" }}>
          Connect your wallet now to make your wallet <br></br>recoverable by
          guardian.
        </Typography>

        {/* <ConnectKitButton.Custom>
          {({ show, chain, unsupported }) => {
            console.log(show, chain, unsupported);
            return (
              <Box width="200px" margin="auto">
                <Button
                  variant="contained"
                  onClick={show}
                  endIcon={<AccountBalanceWalletOutlinedIcon />}
                >
                  Connect Safe
                </Button>
              </Box>
            );
          }}
        </ConnectKitButton.Custom> */}
            <div>
      <CustomConnectButton />
    </div>

        {/* <Button
          onClick={() =>
            connect({
              connector: walletConnect({
                projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
              }),
            })
          }
        >
          Connect Safe
        </Button> */}
      </Box>
    </div>
  );
};

export default ConnectWallets;
