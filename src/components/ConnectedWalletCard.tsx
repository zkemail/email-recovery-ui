import CircleIcon from "@mui/icons-material/Circle";
import { Box, Grid, Typography } from "@mui/material";
import { ConnectKitButton } from "connectkit";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { walletConnect } from "wagmi/connectors";
import { Button } from "./Button";
import CustomConnectButton from "./CustomConnectKitButton";

const ConnectedWalletCard = ({ address }: { address?: string }) => {
  const { connect } = useConnect({});

  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  return (
    <Box
      borderRadius={3}
      sx={{
        marginX: "auto",
        backgroundColor: "#FCFCFC",
        border: "1px solid #E3E3E3",
        padding: { xs: 2, md: 1 },
      }}
    >
      <Grid container justifyContent={"center"} alignItems={"center"} gap={2}>
        <Grid item container xs="auto">
          <CircleIcon
            sx={{
              color: address ? "#6DD88B" : "#FB3E3E",
              transition: "color 0.5s ease-in-out",
            }}
          />
          <Grid item>
            <Typography> Connected Wallet: </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <CustomConnectButton />
          {isConnected ? (
            <div>
              <p>Connected Wallet: {address}</p>
              <button onClick={() => disconnect()}>Disconnect</button>
            </div>
          ) : (
            <Button
              onClick={() =>
                connect({
                  connector: walletConnect({
                    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
                  }),
                })
              }
            >
              Connect Safe
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConnectedWalletCard;
