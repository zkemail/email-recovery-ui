import { useCallback, useEffect, useState } from "react";
import { Button } from "../Button";
import cancelRecoveryIcon from "../../assets/cancelRecoveryIcon.svg";
import completeRecoveryIcon from "../../assets/completeRecoveryIcon.svg";
import { useAppContext } from "../../context/AppContextHook";
import infoIcon from "../../assets/infoIcon.svg";

import { relayer } from "../../services/relayer";
import { templateIdx } from "../../utils/email";
import toast from "react-hot-toast";
import { readContract } from "wagmi/actions";
import { config } from "../../providers/config";
import { keccak256 } from "viem";
import { Box, Grid, Typography } from "@mui/material";

import InputField from "../InputField";
import { useNavigate } from "react-router-dom";
import { useGetSafeAccountAddress } from "../../utils/useGetSafeAccountAddress";
import { abi as universalEmailRecoveryModuleAbi } from "../../abi/UniversalEmailRecoveryModule.json";
import { universalEmailRecoveryModule } from "../../../contracts.base-sepolia.json";
import {
  getRecoveryCallData,
  getRecoveryData,
} from "../../utils/recoveryDataUtils";

const BUTTON_STATES = {
  TRIGGER_RECOVERY: "Trigger Recovery",
  CANCEL_RECOVERY: "Cancel Recovery",
  COMPLETE_RECOVERY: "Complete Recovery",
  RECOVERY_COMPLETED: "Recovery Completed",
};

const RequestedRecoveries = () => {
  const isMobile = window.innerWidth < 768;
  const address = useGetSafeAccountAddress();
  const { guardianEmail } = useAppContext();
  const navigate = useNavigate();

  const [newOwner, setNewOwner] = useState<`0x${string}`>();
  const safeWalletAddress = address;
  const [guardianEmailAddress, setGuardianEmailAddress] =
    useState(guardianEmail);
  const [buttonState, setButtonState] = useState(
    BUTTON_STATES.TRIGGER_RECOVERY
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [gurdianRequestId, setGuardianRequestId] = useState<number>();

  let interval: NodeJS.Timeout;

  const checkIfRecoveryCanBeCompleted = async () => {
    const getRecoveryRequest = await readContract(config, {
      abi: universalEmailRecoveryModuleAbi,
      address: universalEmailRecoveryModule as `0x${string}`,
      functionName: "getRecoveryRequest",
      args: [address],
    });

    const getGuardianConfig = await readContract(config, {
      abi: universalEmailRecoveryModuleAbi,
      address: universalEmailRecoveryModule as `0x${string}`,
      functionName: "getGuardianConfig",
      args: [address],
    });

    if (getRecoveryRequest.currentWeight < getGuardianConfig.threshold) {
      setButtonState(BUTTON_STATES.TRIGGER_RECOVERY);
    } else {
      setButtonState(BUTTON_STATES.COMPLETE_RECOVERY);
      setLoading(false);
      clearInterval(interval);
    }
  };

  useEffect(() => {
    checkIfRecoveryCanBeCompleted();
  }, []);

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

    const recoveryCallData = getRecoveryCallData(newOwner);

    const recoveryData = getRecoveryData(
      "0xd9Ef4a48E4C067d640a9f784dC302E97B21Fd691", // validator's address
      recoveryCallData
    ) as `0x${string}`;

    const recoveryDataHash = keccak256(recoveryData);

    // subject = ['Recover', 'account', '{ethAddr}', 'using', 'recovery', 'hash', '{string}']
    const subject = await readContract(config, {
      abi: universalEmailRecoveryModuleAbi,
      address: universalEmailRecoveryModule as `0x${string}`,
      functionName: "recoveryCommandTemplates",
      args: [],
    }) as [][];

    try {
      const { requestId } = await relayer.recoveryRequest(
        universalEmailRecoveryModule as string,
        guardianEmailAddress,
        templateIdx,
        subject[0]
          .join()
          ?.replaceAll(",", " ")
          .replace("{ethAddr}", safeWalletAddress)
          .replace("{string}", recoveryDataHash)
      );
      setGuardianRequestId(requestId);

      // eslint-disable-next-line react-hooks/exhaustive-deps
      interval = setInterval(() => {
        checkIfRecoveryCanBeCompleted();
      }, 5000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while requesting recovery");
      setLoading(false);
    }
  }, [safeWalletAddress, guardianEmailAddress, newOwner]);

  const completeRecovery = useCallback(async () => {
    setLoading(true);

    const recoveryCallData = getRecoveryCallData(newOwner!);

    const recoveryData = getRecoveryData(
      "0xd9Ef4a48E4C067d640a9f784dC302E97B21Fd691", // validator address
      recoveryCallData
    );

    try {
      await relayer.completeRecovery(
        universalEmailRecoveryModule as string,
        safeWalletAddress as string,
        recoveryData
      );

      setButtonState(BUTTON_STATES.RECOVERY_COMPLETED);
    } catch (err) {
      toast.error("Something went wrong while completing recovery process");
    } finally {
      setLoading(false);
    }
  }, [newOwner, safeWalletAddress]);

  const getButtonComponent = () => {
    switch (buttonState) {
      case BUTTON_STATES.TRIGGER_RECOVERY:
        return (
          <Button loading={loading} onClick={requestRecovery}>
            Trigger Recovery
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
            disabled={!newOwner}
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
