import { Typography } from "@mui/material";
import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { walletConnect } from "wagmi/connectors";

// Utility function to shorten the wallet address
function shortenAddress(address) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
}

const CustomConnectButton = () => {
  // Hooks for connection, disconnection, and account information
  const { connect, error } = useConnect({});

  const { disconnect } = useDisconnect();
  const account = useAccount();
  const { address, isConnected } = useAccount();
  console.log(address, account)

  // UI Logic: show the correct button depending on connection state
  return (
    <div style={styles.container}>
      {isConnected ? (
        <div style={styles.infoContainer}>
          {/* Show the connected wallet address */}
          <Typography style={styles.address}>Connected: {shortenAddress(address)}</Typography>
          {/* Disconnect button */}
          <button style={styles.disconnectButton} onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      ) : (
        <button
          style={styles.connectButton}
          onClick={() =>
            connect({
              connector: walletConnect({
                projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
              }),
            })
          }
        >
          Connect Wallet
        </button>
      )}

      {/* Error handling */}
      {error && <p style={styles.error}>Error: {error.message}</p>}
    </div>
  );
};

// Inline styles for the component (you can replace this with your own styling)
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  address: {
    marginRight: "10px",
  },
  connectButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  disconnectButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  error: {
    marginTop: "10px",
    color: "red",
  },
};

export default CustomConnectButton;
