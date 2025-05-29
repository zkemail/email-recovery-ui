import LaunchIcon from "@mui/icons-material/Launch";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { Button } from "./Button";
import { StepsContext } from "../App";
import { STEPS } from "../constants";
import { useBurnerAccount } from "../context/BurnerAccountContext";
import { useOwnerPasskey } from "../context/OwnerPasskeyContext";

const ConnectionInfoCard = () => {
  const stepsContext = useContext(StepsContext);
  const {
    ownerPasskeyCredential,
    isLoading: isOwnerPasskeyLoading,
    setOwnerPasskeyCredential,
  } = useOwnerPasskey();

  const {
    burnerEOAWalletAddress,
    setBurnerEOAWalletAddress,
    isResetBurnerWalletConfirmationModalOpen,
    setIsResetBurnerWalletConfirmationModalOpen,
  } = useBurnerAccount();

  return (
    <Box sx={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
      {!isOwnerPasskeyLoading && ownerPasskeyCredential && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: "1rem",
            gap: "1rem",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>
            Connected Passkey ID: {ownerPasskeyCredential.id}...
          </Typography>

          <Tooltip title="Disconnect passkey" placement="top">
            <IconButton
              sx={{ padding: "4px" }}
              onClick={() => {
                setOwnerPasskeyCredential(null);
                stepsContext?.setStep(STEPS.CONNECT_WALLETS);
              }}
            >
              <RestartAltIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {burnerEOAWalletAddress && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Tooltip
            title="This is your Smart EOA, upgraded using EIP-7702. It combines the simplicity of an EOA with smart contract capabilities like transaction batching, session keys, and enhanced security features, all controlled by your primary signer. NOTE: This is a burner wallet for the demo purpose only."
            placement="top"
          >
            <Typography sx={{ display: "flex", alignItems: "center" }}>
              Smart EOA (burner):{" "}
              <a
                href={`https://scope.sh/84532/address/${burnerEOAWalletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  // color: "inherit",
                }}
              >
                {burnerEOAWalletAddress}
                <LaunchIcon sx={{ marginLeft: "4px", fontSize: "1rem" }} />
              </a>
            </Typography>
          </Tooltip>

          <Tooltip title="Reset Wallet" placement="top">
            <IconButton
              onClick={async () => {
                setIsResetBurnerWalletConfirmationModalOpen(true);
              }}
              sx={{ padding: "4px" }}
            >
              <RestartAltIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Tooltip>
        </div>
      )}

      <Dialog
        open={isResetBurnerWalletConfirmationModalOpen}
        keepMounted
        onClose={() => setIsResetBurnerWalletConfirmationModalOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Reset Burner Wallet"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you certain you want to reset the burner wallet? Clicking
            "Reset" will permanently remove the burner wallet address from the
            website, and you won't be able to access it again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setIsResetBurnerWalletConfirmationModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              setIsResetBurnerWalletConfirmationModalOpen(false);
              localStorage.removeItem("burnerEOA7702Owner");
              localStorage.removeItem("burnerEOA7702OwnerPrivateKey");
              localStorage.removeItem("newOwnerAddress");
              localStorage.removeItem("guardianEmail");
              localStorage.removeItem("safeAccount");
              localStorage.removeItem("smartAccountClient");
              localStorage.removeItem("accountCode");
              // Also clear from context if it's being set there
              setBurnerEOAWalletAddress(null);
              window.location.reload();
            }}
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConnectionInfoCard;
