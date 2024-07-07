import { useState } from "react";
import { Web3Provider } from "../providers/Web3Provider";
import { ConnectKitButton } from "connectkit";
import { Button } from "./Button";
import cancelRecoveryIcon from "../assets/cancelRecoveryIcon.svg";
import completeRecoveryIcon from "../assets/completeRecoveryIcon.svg";



import MoreInfoDialog from "./MoreInfoDialog";
import InputField from "./InputField";
import InputNumber from "./InputNumber"; 
import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from "@mui/material";

const BUTTON_STATES = {
  CANCEL_RECOVERY: "Cancel Recovery",
  COMPLETE_RECOVERY: "Complete Recovery",
};

const TriggerAccountRecovery = () => {
  const isMobile = window.innerWidth < 768;

  const [guardianEmail, setGuardianEmail] = useState("");
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [buttonState, setButtonState] = useState(BUTTON_STATES.CANCEL_RECOVERY);

  return (
    <Box sx={{ marginX: 'auto', marginTop:'200px' }}>
    <Typography variant='h2' sx={{ paddingBottom: '20px'}}>Account Recovery Triggered </Typography>
    <Typography variant='h6' sx={{paddingBottom: '80px'}}>Cancel or complete recovery to transfer to new wallet</Typography>

      <div
        style={{
          maxWidth: isMobile ? "100%" : "50%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "2rem",
          margin:'auto',
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign:'left'}}>
          <Typography>Connected wallet:</Typography>
          <ConnectKitButton />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
            textAlign:'left'
          }}
        >
          <Typography> Triggered Account Recoveries:</Typography>
          <div className="container">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: isMobile ? "1rem" : "3rem",
                width: "100%",
                alignItems: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: isMobile ? "90%" : "45%",
                  textAlign:'left'
                }}
              >
                <InputField
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  label="Guardian's Email"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: isMobile ? "90%" : "45%",
                  textAlign:'left'
                }}
              >
                
                <InputField
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  label='Safe Address'
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: isMobile ? "90%" : "45%",
                   textAlign:'left'
                }}
              >
                <InputField
                  type="email"
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                  label='New Wallet Address'
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ margin: "auto" }}>
          <Button
          filled={true}
            endIcon={
              buttonState === BUTTON_STATES.CANCEL_RECOVERY ? (
                <img src={cancelRecoveryIcon} />
              ) : (
                <img src={completeRecoveryIcon} />
              )
            }
          >
            {buttonState === BUTTON_STATES.CANCEL_RECOVERY
              ? "Cancel "
              : "Complete"}
            Recovery
          </Button>
        </div>
      </div>
      </Box>
  );
};

export default TriggerAccountRecovery;
