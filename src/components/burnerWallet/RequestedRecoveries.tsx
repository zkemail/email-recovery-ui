import { Box, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { keccak256 } from "viem";
import { readContract } from "wagmi/actions";
import {
  universalEmailRecoveryModule,
  validatorsAddress,
} from "../../../contracts.base-sepolia.json";
import { abi as universalEmailRecoveryModuleAbi } from "../../abi/UniversalEmailRecoveryModule.json";
import cancelRecoveryIcon from "../../assets/cancelRecoveryIcon.svg";
import completeRecoveryIcon from "../../assets/completeRecoveryIcon.svg";
import infoIcon from "../../assets/infoIcon.svg";
import { useAppContext } from "../../context/AppContextHook";

import { config } from "../../providers/config";
import { relayer } from "../../services/relayer";
import { templateIdx } from "../../utils/email";

import {
  getPreviousOwnerInLinkedList,
  getRecoveryCallData,
  getRecoveryData,
} from "../../utils/recoveryDataUtils";
import { useGetSafeAccountAddress } from "../../utils/useGetSafeAccountAddress";
import { Button } from "../Button";
import InputField from "../InputField";
import { useReadContract } from "wagmi";
import { safeAbi } from "../../abi/Safe";

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
  const safeWalletAddress = address as `0x${string}`;
  const [guardianEmailAddress, setGuardianEmailAddress] =
    useState(guardianEmail);
  const [buttonState, setButtonState] = useState(
    BUTTON_STATES.TRIGGER_RECOVERY,
  );

  const [loading, setLoading] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkIfRecoveryCanBeCompleted = useCallback(async () => {
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

    // Update the button state based on the condition. The current weight represents the number of users who have confirmed the email, and the threshold indicates the number of confirmations required before the complete recovery can be called
    if (getRecoveryRequest.currentWeight < getGuardianConfig.threshold) {
      setButtonState(BUTTON_STATES.TRIGGER_RECOVERY);
    } else {
      setButtonState(BUTTON_STATES.COMPLETE_RECOVERY);
      setLoading(false);
      clearInterval(intervalRef.current);
    }
  }, [address, intervalRef]);

  useEffect(() => {
    checkIfRecoveryCanBeCompleted();
  }, [checkIfRecoveryCanBeCompleted]);

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

    // TODO: REMOVE IT LATER
    const newOwner: `0x${string}` = "0xe2835b8cD5B16E1736Ff1bB27a390067948445d5";

    if (!newOwner) {
      throw new Error("new owner not set");
    }

    const safeOwnersData = (await readContract(config, {
      address: safeWalletAddress,
      abi: safeAbi,
      functionName: "getOwners",
      args: [],
    })) as `0x${string}`[];
    if(!safeOwnersData) {
      throw new Error("safe owners data not found");
    }
  
    const prevOwner = getPreviousOwnerInLinkedList(safeOwnersData[0], safeOwnersData);

    const recoveryCallData = getRecoveryCallData(prevOwner, safeOwnersData[0], newOwner);

    const recoveryData = getRecoveryData(
      validatorsAddress,
      recoveryCallData,
    ) as `0x${string}`;

    const recoveryDataHash = keccak256(recoveryData);

    // This function fetches the command template for the recoveryRequest API call. The command template will be in the following format: ['Recover', 'account', '{ethAddr}', 'using', 'recovery', 'hash', '{string}']
    const command = (await readContract(config, {
      abi: universalEmailRecoveryModuleAbi,
      address: universalEmailRecoveryModule as `0x${string}`,
      functionName: "recoveryCommandTemplates",
      args: [],
    })) as readonly (readonly string[])[];


    try {
      // requestId
      await relayer.recoveryRequest(
        universalEmailRecoveryModule as string,
        guardianEmailAddress,
        templateIdx,
        command[0]
          .join()
          ?.replaceAll(",", " ")
          .replace("{ethAddr}", safeWalletAddress)
          .replace("{ethAddr}", safeOwnersData[0])
          .replace("{ethAddr}", newOwner),
      );

      intervalRef.current = setInterval(() => {
        checkIfRecoveryCanBeCompleted();
      }, 5000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while requesting recovery");
      setLoading(false);
    }
  }, [
    safeWalletAddress,
    guardianEmailAddress,
    newOwner,
    checkIfRecoveryCanBeCompleted,
  ]);

  const completeRecovery = useCallback(async () => {
    setLoading(true);

    const safeOwnersData = (await readContract(config, {
      address: safeWalletAddress,
      abi: safeAbi,
      functionName: "getOwners",
      args: [],
    })) as `0x${string}`[];
    if(!safeOwnersData) {
      throw new Error("safe owners data not found");
    }

    const prevOwner = getPreviousOwnerInLinkedList(safeOwnersData[0], safeOwnersData);

    // TODO: REMOVE IT LATER
    const newOwner: `0x${string}` = "0xe2835b8cD5B16E1736Ff1bB27a390067948445d5";

    const recoveryCallData = getRecoveryCallData(prevOwner, safeOwnersData[0], newOwner);

    // const recoveryCallData = getRecoveryCallData(newOwner!);

    const recoveryData = getRecoveryData(safeWalletAddress, recoveryCallData);

    try {
      await relayer.completeRecovery(
        universalEmailRecoveryModule as string,
        safeWalletAddress as string,
        recoveryData,
      );

      setButtonState(BUTTON_STATES.RECOVERY_COMPLETED);
    } catch (err) {
      toast.error("Something went wrong while completing recovery process");
    } finally {
      setLoading(false);
    }
  }, [newOwner, safeWalletAddress]);

  const getButtonComponent = () => {
    // Renders the appropriate buttons based on the button state.
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
