import { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "./Button";
import cancelRecoveryIcon from "../assets/cancelRecoveryIcon.svg";
import completeRecoveryIcon from "../assets/completeRecoveryIcon.svg";
import { useAppContext } from "../context/AppContextHook";
import { useReadContract } from "wagmi";
import infoIcon from "../assets/infoIcon.svg";

import { relayer } from "../services/relayer";
import { templateIdx } from "../utils/email";
import { safeEmailRecoveryModule } from "../../contracts.base-sepolia.json";
import { StepsContext } from "../App";
import toast from "react-hot-toast";
import { readContract } from "wagmi/actions";
import { config } from "../providers/config";
import { safeAbi } from "../abi/Safe";
import { safeEmailRecoveryModuleAbi } from "../abi/SafeEmailRecoveryModule";
import { encodeAbiParameters, encodeFunctionData } from "viem";
import { Box, Grid, Typography } from "@mui/material";

import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InputField from "./InputField";
import { useNavigate } from "react-router-dom";
import ConnectedWalletCard from "./ConnectedWalletCard";
import { useGetSafeAccountAddress } from "../utils/useGetSafeAccountAddress";

const BUTTON_STATES = {
  TRIGGER_RECOVERY: "Trigger Recovery",
  CANCEL_RECOVERY: "Cancel Recovery",
  COMPLETE_RECOVERY: "Complete Recovery",
  RECOVERY_COMPLETED: "Recovery Completed",
};

const RequestedRecoveries = () => {
  // const theme = useTheme(); for some reason this was causing trigger recovery button to be skipped??
  const isMobile = window.innerWidth < 768;
  const address = useGetSafeAccountAddress()
  const { guardianEmail } = useAppContext();
  const stepsContext = useContext(StepsContext);
  const navigate = useNavigate();

  const [newOwner, setNewOwner] = useState<string>();
  const [safeWalletAddress, setSafeWalletAddress] = useState(address);
  const [guardianEmailAddress, setGuardianEmailAddress] =
    useState(guardianEmail);
  const [buttonState, setButtonState] = useState(
    BUTTON_STATES.TRIGGER_RECOVERY
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [gurdianRequestId, setGuardianRequestId] = useState<number>();
  const [isButtonStateLoading, setIsButtonStateLoading] = useState(false);

  let interval: NodeJS.Timeout;

  const checkIfRecoveryCanBeCompleted = async () => {
    setIsButtonStateLoading(true);
    const getRecoveryRequest = await readContract(config, {
      abi: safeEmailRecoveryModuleAbi,
      address: safeEmailRecoveryModule as `0x${string}`,
      functionName: "getRecoveryRequest",
      args: [address as `0x${string}`],
    });

    const getGuardianConfig = await readContract(config, {
      abi: safeEmailRecoveryModuleAbi,
      address: safeEmailRecoveryModule as `0x${string}`,
      functionName: "getGuardianConfig",
      args: [address as `0x${string}`],
    });

    console.log(getRecoveryRequest.currentWeight, getGuardianConfig.threshold);

    if (getRecoveryRequest.currentWeight < getGuardianConfig.threshold) {
      setButtonState(BUTTON_STATES.TRIGGER_RECOVERY);
    } else {
      setButtonState(BUTTON_STATES.COMPLETE_RECOVERY);
      setLoading(false);
      clearInterval(interval);
    }
    setIsButtonStateLoading(false);
  };

  useEffect(() => {
    checkIfRecoveryCanBeCompleted();
  }, []);

  const { data: safeOwnersData } = useReadContract({
    address,
    abi: safeAbi,
    functionName: "getOwners",
  });

  console.log(safeOwnersData);

  const requestRecovery = useCallback(async () => {
    setLoading(true);
    toast("Please check your email and accept the email", {
      icon: <img src={infoIcon} />,
      style: {
        background: "white",
      },
    });
    if (!safeWalletAddress) {
      throw new Error("unable to get account address");
    }

    if (!guardianEmailAddress) {
      throw new Error("guardian email not set");
    }

    if (!newOwner) {
      throw new Error("new owner not set");
    }

    if (!safeOwnersData[0]) {
      toast.error(
        "Could not find safe owner. Please check if safe is configured correctly."
      );
    }

    const command = await readContract(config, {
      abi: safeEmailRecoveryModuleAbi,
      address: safeEmailRecoveryModule as `0x${string}`,
      functionName: "recoveryCommandTemplates",
      args: [],
    });

    try {
      const { requestId } = await relayer.recoveryRequest(
        safeEmailRecoveryModule as string,
        guardianEmailAddress,
        templateIdx,
        command[0].join()?.replaceAll(',', ' ').replace('{ethAddr}', safeWalletAddress).replace('{ethAddr}', safeOwnersData[0]).replace('{ethAddr}', newOwner)
      );
      setGuardianRequestId(requestId);

      interval = setInterval(() => {
        checkIfRecoveryCanBeCompleted();
      }, 5000); // Adjust the interval time (in milliseconds) as needed

      // Clean up the interval on component unmount

      // setButtonState(BUTTON_STATES.COMPLETE_RECOVERY);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while requesting recovery");
      setLoading(false);
    }
  }, [safeWalletAddress, guardianEmailAddress, newOwner]);

  const completeRecovery = useCallback(async () => {
    setLoading(true);
    console.log(`newOwner: ${newOwner}`);
    console.log(`safeWalletAddress: ${safeWalletAddress}`);


    const swapOwnerCallData = encodeFunctionData({
      abi: safeAbi,
      functionName: "swapOwner",
      args: [
        "0x0000000000000000000000000000000000000001",
        safeOwnersData[0],
        newOwner,
      ],
    });
    const completeCalldata = encodeAbiParameters(
      [
        { type: "address" },
        { type: "bytes" }
      ],
      [
        safeWalletAddress,
        swapOwnerCallData
      ]
    );

    try {
      const res = await relayer.completeRecovery(
        safeEmailRecoveryModule as string,
        safeWalletAddress as string,
        completeCalldata
      );

      console.debug("complete recovery res", res);
      setButtonState(BUTTON_STATES.RECOVERY_COMPLETED);
    } catch (err) {
      toast.error("Something went wrong while completing recovery process");
    } finally {
      setLoading(false);
    }
  }, [newOwner]);

  const getButtonComponent = () => {
    switch (buttonState) {
      case BUTTON_STATES.TRIGGER_RECOVERY:
        return (
          <Button loading={loading} onClick={requestRecovery}>
            { loading ? "Waiting for Email Confirmation" : "Trigger Recovery"}
          </Button>
        );
      case BUTTON_STATES.CANCEL_RECOVERY:
        return (
          <Button endIcon={<img src={cancelRecoveryIcon} />}>
            Cancel Recovery
          </Button>
        );
      case BUTTON_STATES.COMPLETE_RECOVERY:
        return (
          <Button
            loading={loading}
            onClick={completeRecovery}
            endIcon={<img src={completeRecoveryIcon} />}
          >
            Complete Recovery
          </Button>
        );
      case BUTTON_STATES.RECOVERY_COMPLETED:
        return (
          <Button filled={true} loading={loading} onClick={() => navigate("/")}>
            Complete! Connect new wallet to set new guardians ➔
          </Button>
        );
    }
  };

  return (
    <Box
      sx={{
        marginX: "auto",
        marginTop: { xs: "2rem", sm: "9.375rem" },
        marginBottom: "6.25rem",
      }}
    >
      {buttonState === BUTTON_STATES.RECOVERY_COMPLETED ? (
        <>
          <Typography variant="h2" sx={{ paddingBottom: "1.25rem" }}>
            Completed Wallet Transfer!
          </Typography>
          <Typography variant="h6" sx={{ paddingBottom: "3.125rem" }}>
            Great job your old wallet has successfully transferred ownership
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h2" sx={{ paddingBottom: "1.25rem" }}>
            Recover Your Wallet
          </Typography>
          <Typography variant="h6" sx={{ paddingBottom: "3.125rem" }}>
            Enter your guardian email address and the new wallet you want to
            transfer to
          </Typography>
        </>
      )}

      <div
        style={{
          maxWidth: isMobile ? "100%" : "50%",
          margin: "auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {buttonState === BUTTON_STATES.RECOVERY_COMPLETED ? (
              <Box
                width="100%"
                height="100px"
                alignContent="center"
                justifyItems="center"
                borderRadius={3}
                sx={{
                  position: "relative",
                }}
              >
                <ConnectedWalletCard address={address} />
                <div
                  style={{
                    display: "flex",
                    background: "#E7FDED",
                    border: "1px solid #6DD88B",
                    color: "#0A6825",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "26px",
                    width: "fit-content",
                    height: "18px",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: "-10px",
                    right: "-12px",
                  }}
                >
                  <Typography
                    sx={{
                      marginLeft: "0.5rem",
                      fontSize: "12px",
                      color: "#0A6825",
                    }}
                  >
                    Recovered
                  </Typography>
                  <MonetizationOnIcon
                    sx={{ padding: "6px", fontSize: "12px" }}
                  />
                </div>
              </Box>
            ) : (
              <ConnectedWalletCard address={address} />
            )}
          </div>
        </div>
        {buttonState === BUTTON_STATES.RECOVERY_COMPLETED ? null : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
              textAlign: "left",
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>
              Requested Recoveries:
            </Typography>
            <Grid container gap={3} justifyContent={"space-around"}>
              <Grid item xs={12} sm={5.5}>
                <InputField
                  type="email"
                  value={guardianEmailAddress}
                  onChange={(e) => setGuardianEmailAddress(e.target.value)}
                  locked={guardianEmail ? true : false}
                  label="Guardian's Email"
                />
              </Grid>
              <Grid item xs={12} sm={5.5}>
                <InputField
                  type="email"
                  value={newOwner || ""}
                  onChange={(e) => setNewOwner(e.target.value)}
                  label="Requested New Wallet Address"
                />
              </Grid>
            </Grid>
          </div>
        )}
        <div style={{ margin: "auto", minWidth: "300px" }}>
          {getButtonComponent()}
        </div>
      </div>
    </Box>
  );
};

export default RequestedRecoveries;
