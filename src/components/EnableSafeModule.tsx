import { ConnectKitButton } from "connectkit";
import { Button } from "./Button";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { safeEmailRecoveryModule } from "../../contracts.base-sepolia.json";
import { abi as safeAbi } from "../abi/Safe.json";
import { useCallback, useContext, useEffect, useState } from "react";
import { StepsContext } from "../App";
import { STEPS } from "../constants";
import Loader from "./Loader";
import infoIcon from "../assets/infoIcon.svg";
import toast from "react-hot-toast";
import { Box, Grid, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

const EnableSafeModule = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const stepsContext = useContext(StepsContext);
  const [isEnableModalLoading, setIsEnableModuleLoading] = useState(false);

  const { data: isModuleEnabled, isLoading: isCheckModuleEnabledLoading } =
    useReadContract({
      address,
      abi: safeAbi,
      functionName: "isModuleEnabled",
      args: [safeEmailRecoveryModule],
    });

  if (isModuleEnabled) {
    setIsEnableModuleLoading(false);
    stepsContext?.setStep(STEPS.REQUEST_GUARDIAN);
  }

  const enableEmailRecoveryModule = useCallback(async () => {
    setIsEnableModuleLoading(true);
    if (!address) {
      throw new Error("unable to get account address");
    }

    toast("Please check Safe Website to complete transaction", {
      icon: <img src={infoIcon} />,
      style: {
        background: "white",
      },
    });

    await writeContractAsync({
      abi: safeAbi,
      address,
      functionName: "enableModule",
      args: [safeEmailRecoveryModule],
    });
  }, [address, writeContractAsync]);

  if (isCheckModuleEnabledLoading) {
    return <Loader />;
  }

  return (
    <Box sx={{ marginX: "auto", marginTop: { xs: "2rem", sm: "9.375rem" } }}>
      <Typography variant="h2" sx={{ paddingBottom: "10px" }}>
        Set Up Wallet Recovery
      </Typography>
      <Typography variant="h6" sx={{ paddingBottom: "40px" }}>
        Connect your wallet now to make your wallet
        <br />
        recoverable by guardian.
      </Typography>
      <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
        <Box
          borderRadius={3}
          sx={{
            marginX: "auto",
            backgroundColor: "#FCFCFC",
            border: "1px solid #E3E3E3",
            padding: {xs: 2, md: 1},
          }}
        >
          <Grid
            container
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
          >
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
              <ConnectKitButton />
            </Grid>
          </Grid>
        </Box>

        {!isModuleEnabled ? (
          <Box sx={{ marginX: "auto", width: "18.75rem" }}>
            <Button
              filled={true}
              disabled={isEnableModalLoading}
              loading={isEnableModalLoading}
              onClick={enableEmailRecoveryModule}
            >
              Enable Email Recovery Module
            </Button>
          </Box>
        ) : null}
      </div>
    </Box>
  );
};

export default EnableSafeModule;
