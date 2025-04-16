import { Box, Grid, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { keccak256, parseAbiParameters } from "viem";
import { encodeAbiParameters } from "viem";
import { encodeFunctionData } from "viem";
import { createOwnerFromMetaMask, getSafeAccount, publicClient } from "./client";
import { CompleteRecoveryResponseSchema } from "./types";
import { universalEmailRecoveryModule } from "../../../contracts.base-sepolia.json";
import { safeAbi } from "../../abi/Safe";
import { abi as universalEmailRecoveryModuleAbi } from "../../abi/UniversalEmailRecoveryModule.json";
import { StepsContext } from "../../App";
import cancelRecoveryIcon from "../../assets/cancelRecoveryIcon.svg";
import completeRecoveryIcon from "../../assets/completeRecoveryIcon.svg";
import infoIcon from "../../assets/infoIcon.svg";
import { STEPS } from "../../constants";
import { useAppContext } from "../../context/AppContextHook";

import { useBurnerAccount } from "../../context/BurnerAccountContext";
import { config } from "../../providers/config";
import { relayer } from "../../services/relayer";

import {
  getPreviousOwnerInLinkedList,
} from "../../utils/recoveryDataUtils";
import { Button } from "../Button";
import InputField from "../InputField";

const BUTTON_STATES = {
  TRIGGER_RECOVERY: "Trigger Recovery",
  CANCEL_RECOVERY: "Cancel Recovery",
  COMPLETE_RECOVERY: "Complete Recovery",
  RECOVERY_COMPLETED: "Recovery Completed",
};

const RequestedRecoveries = () => {
  const { guardianEmail } = useAppContext();
  const navigate = useNavigate();
  const { burnerAccountClient } = useBurnerAccount();
  const stepsContext = useContext(StepsContext);

  const [newOwner, setNewOwner] = useState<`0x${string}`>();

  const [guardianEmailAddress, setGuardianEmailAddress] =
    useState(guardianEmail);
  const [buttonState, setButtonState] = useState(
    BUTTON_STATES.TRIGGER_RECOVERY
  );

  const [isTriggerRecoveryLoading, setIsTriggerRecoveryLoading] =
    useState<boolean>(false);
  const [isCompleteRecoveryLoading, setIsCompleteRecoveryLoading] =
    useState<boolean>(false);
  const [isCancelRecoveryLoading, setIsCancelRecoveryLoading] =
    useState<boolean>(false);
  const [isRecoveryStatusLoading, setIsRecoveryStatusLoading] = useState(false);
  console.log(isRecoveryStatusLoading);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkIfRecoveryCanBeCompleted = useCallback(async () => {
    const address = localStorage.getItem('burnerWallerOwner');
    const burnerWallerOwner = await createOwnerFromMetaMask(address);

    const safeAccount = await getSafeAccount(burnerWallerOwner);

    setIsRecoveryStatusLoading(true);
    const getRecoveryRequest = await publicClient.readContract({
      abi: universalEmailRecoveryModuleAbi,
      address: universalEmailRecoveryModule as `0x${string}`,
      functionName: "getRecoveryRequest",
      args: [safeAccount.address],
    });

    console.log(getRecoveryRequest);

    const getGuardianConfig = await publicClient.readContract({
      abi: universalEmailRecoveryModuleAbi,
      address: universalEmailRecoveryModule as `0x${string}`,
      functionName: "getGuardianConfig",
      args: [safeAccount.address],
    });

    // Update the button state based on the condition. The current weight represents the number of users who have confirmed the email, and the threshold indicates the number of confirmations required before the complete recovery can be called
    if (getRecoveryRequest.currentWeight < getGuardianConfig.threshold) {
      setButtonState(BUTTON_STATES.TRIGGER_RECOVERY);
    } else {
      setButtonState(BUTTON_STATES.COMPLETE_RECOVERY);
      clearInterval(intervalRef.current);
    }
    setIsRecoveryStatusLoading(false);
  }, [intervalRef]);

  useEffect(() => {
    checkIfRecoveryCanBeCompleted();
  }, [checkIfRecoveryCanBeCompleted]);

  const requestRecovery = useCallback(async () => {
    setIsTriggerRecoveryLoading(true);
    toast("Please check your email and reply to the email", {
      icon: <img src={infoIcon} />,
      style: {
        background: "white",
      },
    });
    // if (!safeWalletAddress) {
    //   throw new Error("unable to get account address");
    // }

    if (!guardianEmailAddress) {
      throw new Error("guardian email not set");
    }

    if (!newOwner) {
      throw new Error("new owner not set");
    }

    // const recoveryCallData = getRecoveryCallData(newOwner);

    const address = localStorage.getItem('burnerWallerOwner');
    const burnerWallerOwner = await createOwnerFromMetaMask(address);

    const safeAccount = await getSafeAccount(burnerWallerOwner);

    const safeOwners = await publicClient.readContract({
      abi: safeAbi,
      address: safeAccount.address,
      functionName: "getOwners",
      args: [],
    });

    const oldOwner = owner.address;
    const previousOwnerInLinkedList = getPreviousOwnerInLinkedList(
      oldOwner,
      safeOwners
    );

    // This function fetches the command template for the recoveryRequest API call. The command template will be in the following format: ['Recover', 'account', '{ethAddr}', 'using', 'recovery', 'hash', '{string}']
    // const command = (await readContract(config, {
    //   abi: universalEmailRecoveryModuleAbi,
    //   address: universalEmailRecoveryModule as `0x${string}`,
    //   functionName: "recoveryCommandTemplates",
    //   args: [],
    // })) as [][];

    const recoveryCallData = encodeFunctionData({
      abi: safeAbi,
      functionName: "swapOwner",
      args: [previousOwnerInLinkedList, oldOwner, newOwner],
    });

    const recoveryData = encodeAbiParameters(
      parseAbiParameters("address, bytes"),
      [safeAccount.address, recoveryCallData]
    );

    const templateIdx = 0;
    const recoveryCommandTemplates = await publicClient.readContract({
      abi: universalEmailRecoveryModuleAbi,
      address: universalEmailRecoveryModule as `0x${string}`,
      functionName: "recoveryCommandTemplates",
      args: [],
    });

    const recoveryDataHash = keccak256(recoveryData);

    const processRecoveryCommand = recoveryCommandTemplates[0]
      ?.join()
      .replaceAll(",", " ")
      .replace("{ethAddr}", safeAccount.address)
      .replace("{string}", recoveryDataHash);

    try {
      // requestId
      await relayer.recoveryRequest(
        universalEmailRecoveryModule as string,
        guardianEmailAddress,
        templateIdx,
        processRecoveryCommand
      );

      intervalRef.current = setInterval(() => {
        checkIfRecoveryCanBeCompleted();
      }, 5000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while requesting recovery");
      setIsTriggerRecoveryLoading(false);
    }
  }, [guardianEmailAddress, newOwner, checkIfRecoveryCanBeCompleted]);

  const completeRecovery = useCallback(async () => {
    const address = localStorage.getItem('burnerWallerOwner');
    const burnerWallerOwner = await createOwnerFromMetaMask(address);

    const safeAccount = await getSafeAccount(burnerWallerOwner);

    setIsCompleteRecoveryLoading(true);

    const recoveryRequest = await publicClient.readContract({
      abi: universalEmailRecoveryModuleAbi,
      address: universalEmailRecoveryModule as `0x${string}`,
      functionName: "getRecoveryRequest",
      args: [safeAccount.address],
    });

    // const recoveryCallData = getRecoveryCallData(newOwner!);

    const block = await publicClient.getBlock();
    if (recoveryRequest.executeAfter == 0n) {
      throw new Error("Recovery request for account not found");
    }

    if (block.timestamp < recoveryRequest.executeAfter) {
      const timeLeft = recoveryRequest.executeAfter - block.timestamp;
      throw new Error(
        `Recovery delay has not passed. You have ${timeLeft} seconds left.`
      );
    }

    const safeOwners = await publicClient.readContract({
      abi: safeAbi,
      address: safeAccount.address,
      functionName: "getOwners",
      args: [],
    });

    const oldOwner = owner.address;
    const previousOwnerInLinkedList = getPreviousOwnerInLinkedList(
      oldOwner,
      safeOwners
    );
    const newOwner = config.newOwner;

    const recoveryCallData = encodeFunctionData({
      abi: safeAbi,
      functionName: "swapOwner",
      args: [previousOwnerInLinkedList, oldOwner, newOwner],
    });

    const recoveryData = encodeAbiParameters(
      parseAbiParameters("address, bytes"),
      [safeAccount.address, recoveryCallData]
    );

    try {
      const completeRecoveryResponse = await relayer.completeRecovery(
        universalEmailRecoveryModule as string,
        safeAccount.address,
        recoveryData
      );

      if (completeRecoveryResponse.status === 200) {
        const completeRecoveryResponseData =
          CompleteRecoveryResponseSchema.parse(completeRecoveryResponse.data);
        console.log("Result:", completeRecoveryResponseData);
      }

      setButtonState(BUTTON_STATES.RECOVERY_COMPLETED);
    } catch (err) {
      toast.error("Something went wrong while completing recovery process");
    } finally {
      setIsCompleteRecoveryLoading(false);
    }
  }, [newOwner]);

  const handleCancelRecovery = useCallback(async () => {
    setIsCancelRecoveryLoading(true);
    setIsTriggerRecoveryLoading(false);
    try {
      await burnerAccountClient.writeContract({
        abi: universalEmailRecoveryModuleAbi,
        address: universalEmailRecoveryModule as `0x${string}`,
        functionName: "cancelRecovery",
        args: [],
      });

      setButtonState(BUTTON_STATES.TRIGGER_RECOVERY);
      toast.success("Recovery Cancelled");
      console.log("Recovery Cancelled");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while completing recovery process");
    } finally {
      setIsCancelRecoveryLoading(false);
    }
  }, [newOwner]);

  const getButtonComponent = () => {
    // Renders the appropriate buttons based on the button state.
    switch (buttonState) {
      case BUTTON_STATES.TRIGGER_RECOVERY:
        return (
          <Button
            loading={isTriggerRecoveryLoading}
            variant="contained"
            onClick={requestRecovery}
          >
            Trigger Recovery
          </Button>
        );
      case BUTTON_STATES.COMPLETE_RECOVERY:
        return (
          <Button
            loading={isCompleteRecoveryLoading}
            disabled={!newOwner}
            variant="contained"
            onClick={completeRecovery}
            endIcon={<img src={completeRecoveryIcon} />}
          >
            Complete Recovery
          </Button>
        );
      case BUTTON_STATES.RECOVERY_COMPLETED:
        return (
          <Button variant={"contained"} onClick={() => navigate("/")}>
            Complete! Connect new wallet to set new guardians ➔
          </Button>
        );
    }
  };

  console.log(isRecoveryStatusLoading);

  // // Since we are polling for every actions but only wants to show full screen loader for the initial request
  // if (
  //   isRecoveryStatusLoading &&
  //   !isTriggerRecoveryLoading &&
  //   !isCompleteRecoveryLoading &&
  //   !isCancelRecoveryLoading
  // ) {
  //   return <Loader />;
  // }

  return (
    <Box>
      <Grid item xs={12} textAlign={"start"}>
        <Button
          variant="text"
          onClick={() => {
            stepsContext?.setStep(STEPS.WALLET_ACTIONS);
          }}
          sx={{ textAlign: "left", width: "auto" }}
        >
          ← Back
        </Button>
      </Grid>
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
          maxWidth: "100%",
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
                  placeholderText="test@gmail.com"
                  tooltipTitle="Enter the email address of the guardian you used for account recovery"
                  value={guardianEmailAddress}
                  onChange={(e) => setGuardianEmailAddress(e.target.value)}
                  locked={guardianEmail ? true : false}
                  label="Guardian's Email"
                />
              </Grid>
              <Grid item xs={12} sm={5.5}>
                <InputField
                  type="string"
                  value={newOwner || ""}
                  placeholderText="0xAB12..."
                  onChange={(e) => setNewOwner(e.target.value)}
                  label="Requested New Owner Address"
                  tooltipTitle="Enter the wallet address of the new owner of this safe account"
                />
              </Grid>
            </Grid>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            margin: "auto",
          }}
        >
          {buttonState === BUTTON_STATES.COMPLETE_RECOVERY ? (
            <div style={{ minWidth: "300px" }}>
              <Button
                onClick={() => handleCancelRecovery()}
                endIcon={<img src={cancelRecoveryIcon} />}
                variant="outlined"
                loading={isCancelRecoveryLoading}
              >
                Cancel Recovery
              </Button>
            </div>
          ) : null}
          <div style={{ minWidth: "300px" }}>{getButtonComponent()}</div>
        </div>
      </div>
    </Box>
  );
};

export default RequestedRecoveries;
