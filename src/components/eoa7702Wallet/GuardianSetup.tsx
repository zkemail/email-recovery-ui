import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { PrivateKeyAccount } from "viem";
import {
  getSafeAccount,
  getSafeSmartAccountClient,
  publicClient,
} from "./client";
import { run } from "./deploy";
import { AcceptanceCommandTemplatesResult, GuardianConfig } from "./types";
import { universalEmailRecoveryModule } from "../../../contracts.base-sepolia.json";
import { abi as universalEmailRecoveryModuleAbi } from "../../abi/UniversalEmailRecoveryModule.json";
import { StepsContext } from "../../App";
import infoIcon from "../../assets/infoIcon.svg";
import { STEPS } from "../../constants";
import { useAppContext } from "../../context/AppContextHook";
import { useBurnerAccount } from "../../context/BurnerAccountContext";
import { useOwnerPasskey } from "../../context/OwnerPasskeyContext";
import { relayer } from "../../services/relayer";
import { genAccountCode, templateIdx } from "../../utils/email";
import { TIME_UNITS } from "../../utils/recoveryDataUtils";
import { Button } from "../Button";
import ConnectionInfoCard from "../ConnectionInfoCard";
import Loader from "../Loader";

//logic for valid email address check for input
const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const GuardianSetup = () => {
  const { burnerAccountClient, burnerAccount } = useBurnerAccount();
  const { guardianEmail, setGuardianEmail, setAccountCode } = useAppContext();
  const stepsContext = useContext(StepsContext);
  const { ownerPasskeyAccount, isLoading: isOwnerPasskeyLoading } =
    useOwnerPasskey();

  const [isAccountInitializedLoading, setIsAccountInitializedLoading] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [moduleInstalled, setModuleInstalled] = useState(false);
  const [recoveryDelay, setRecoveryDelay] = useState(6);
  const [emailError, setEmailError] = useState(false);
  const [recoveryDelayUnit, setRecoveryDelayUnit] = useState<
    keyof typeof TIME_UNITS
  >(TIME_UNITS.HOURS.value as keyof typeof TIME_UNITS);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkIfRecoveryIsConfigured = useCallback(async () => {
    let burnerWalletAddress;

    const safeAccount = localStorage.getItem("safeAccount");

    if (safeAccount) {
      burnerWalletAddress = JSON.parse(safeAccount).address;
    }

    if (!burnerWalletAddress) {
      return;
    }

    setIsAccountInitializedLoading(true);
    const getGuardianConfig = (await publicClient.readContract({
      abi: universalEmailRecoveryModuleAbi,
      address: universalEmailRecoveryModule as `0x${string}`,
      functionName: "getGuardianConfig",
      args: [burnerWalletAddress],
    })) as GuardianConfig;

    // Check whether recovery is configured ( module installed)
    if (getGuardianConfig.threshold !== 0n) {
      setModuleInstalled(true);
      setLoading(false);

      // Check if the guardian has accepted the request
      if (getGuardianConfig.acceptedWeight === getGuardianConfig.threshold) {
        stepsContext?.setStep(STEPS.WALLET_ACTIONS);
      }
    }
    setIsAccountInitializedLoading(false);
  }, [stepsContext]);

  useEffect(() => {
    checkIfRecoveryIsConfigured();

    // If burnerAccountClient (from previous EOA7702 step) is not ready, redirect.
    if (!burnerAccountClient) {
      stepsContext?.setStep(STEPS.CONNECT_WALLETS);
      return;
    }

    // If ownerPasskeyAccount is not loaded yet, wait. If loaded and null, redirect.
    if (!isOwnerPasskeyLoading && !ownerPasskeyAccount) {
      toast.error("Owner passkey not found. Please connect your wallet.");
      stepsContext?.setStep(STEPS.CONNECT_WALLETS);
      return;
    }

    // Clean up the interval on component unmount
    const currentInterval = intervalRef.current;
    return () => {
      if (currentInterval) {
        clearInterval(currentInterval);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    burnerAccountClient,
    stepsContext,
    ownerPasskeyAccount,
    isOwnerPasskeyLoading,
  ]);

  // To preload guardian email if module is already installed
  useEffect(() => {
    if (moduleInstalled) {
      const storedGuardianEmail = localStorage.getItem("guardianEmail");
      if (storedGuardianEmail) {
        setGuardianEmail(storedGuardianEmail);
      }
    }
  }, [moduleInstalled, setGuardianEmail]);

  //logic to check if email input is a valid email
  useEffect(() => {
    if (!guardianEmail) {
      setEmailError(false);
    } else if (!isValidEmail(guardianEmail)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  }, [guardianEmail]);

  const configureRecoveryAndRequestGuardian = useCallback(async () => {
    try {
      if (!guardianEmail) {
        throw new Error("guardian email not set");
      }

      if (!burnerAccountClient || !burnerAccount) {
        console.log("Burner Account not found ");
        toast.error("Burner account not available. Please ensure it's set up.");
        return;
      }

      if (!ownerPasskeyAccount) {
        console.log("Owner passkey account not connected");
        toast.error("Owner passkey account not connected.");
        return;
      }

      setLoading(true);

      const safeAccount = await getSafeAccount(
        ownerPasskeyAccount,
        burnerAccount as PrivateKeyAccount,
      );

      const smartAccountClient = await getSafeSmartAccountClient(
        ownerPasskeyAccount,
        burnerAccount as PrivateKeyAccount,
      );

      let finalAccountCode: `0x${string}`;

      if (moduleInstalled) {
        console.log("Module already installed, skipping installation step.");
        const storedAccountCode = localStorage.getItem("accountCode");
        if (!storedAccountCode) {
          toast.error(
            "Account code not found in storage despite module being installed. Please reset and try again.",
          );
          setLoading(false);
          return;
        }
        finalAccountCode = storedAccountCode as `0x${string}`;
        setAccountCode(finalAccountCode);
      } else {
        console.log("Module not installed. Proceeding with installation.");
        const generatedAccountCode = await genAccountCode();
        finalAccountCode = generatedAccountCode as `0x${string}`;

        localStorage.setItem("accountCode", finalAccountCode);
        setAccountCode(finalAccountCode);
        localStorage.setItem("guardianEmail", guardianEmail);

        console.log("installing module.....");
        // The run function installs the recovery module, and returns the wallet's address.
        const userOpReciept = await run(
          finalAccountCode,
          guardianEmail,
          ownerPasskeyAccount,
          safeAccount,
          smartAccountClient,
          recoveryDelay * TIME_UNITS[recoveryDelayUnit].multiplier,
        );

        if (!userOpReciept) {
          setLoading(false);
          throw new Error("Failed to install recovery module");
        }

        // const txHash = userOpReciept.receipt.transactionHash;
        console.log("Recovery module installed");
      }

      // This function fetches the command template for the acceptanceRequest API call.
      const subject = (await publicClient.readContract({
        abi: universalEmailRecoveryModuleAbi,
        address: universalEmailRecoveryModule as `0x${string}`,
        functionName: "acceptanceCommandTemplates",
        args: [],
      })) as AcceptanceCommandTemplatesResult;

      try {
        // Attempt the API call
        await relayer.acceptanceRequest(
          universalEmailRecoveryModule as `0x${string}`,
          guardianEmail,
          finalAccountCode.slice(2),
          templateIdx,
          subject[0]
            .join()
            .replace(/,/g, " ")
            .replace("{ethAddr}", safeAccount.address),
        );
      } catch (error) {
        // retry mechanism as this API call fails for the first time
        console.warn("API call failed, retrying...", error);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await relayer.acceptanceRequest(
          universalEmailRecoveryModule as `0x${string}`,
          guardianEmail,
          finalAccountCode.slice(2),
          templateIdx,
          subject[0]
            .join()
            .replace(/,/g, " ")
            .replace("{ethAddr}", safeAccount.address),
        );
      }

      toast("Please check your email", {
        icon: <img src={infoIcon} />,
        style: {
          background: "white",
        },
      });

      // NOTE: Disabling the wait logic for configuring recovery
      // Setting up interval for polling
      // intervalRef.current = setInterval(() => {
      //   checkIfRecoveryIsConfigured();
      // }, 5000);

      stepsContext?.setStep(STEPS.WALLET_ACTIONS);
    } catch (err: unknown) {
      if (!(err instanceof Error)) {
        console.error(
          "Unexpected error in configureRecoveryAndRequestGuardian:",
          err,
        );
      } else {
        console.error("Error in configureRecoveryAndRequestGuardian:", err);
        toast.error(
          err?.shortMessage ||
            err?.message ||
            "Something went wrong while configuring guardians, please try again.",
        );
        setLoading(false);
      }
    }
  }, [
    guardianEmail,
    burnerAccountClient,
    burnerAccount,
    ownerPasskeyAccount,
    setAccountCode,
    recoveryDelay,
    recoveryDelayUnit,
    moduleInstalled,
    stepsContext,
  ]);

  if (isAccountInitializedLoading && !loading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        textAlign: "center",
        marginX: "auto",
        maxWidth: "600px",
        padding: "2rem",
      }}
    >
      <Typography variant="h2" sx={{ paddingBottom: "1.5rem" }}>
        Set Up Guardian Details
      </Typography>
      <ConnectionInfoCard />
      <Typography variant="h6" sx={{ paddingBottom: "5rem" }}>
        Choose a Guardian you trust to be enable wallet recovery via email.
        They'll receive an email request.
      </Typography>
      {moduleInstalled && (
        <Typography variant="h6" sx={{ paddingBottom: "5rem" }}>
          You have already set up a guardian. You can resend the request to the
          guardian if needed or refresh the page to see the current status.
        </Typography>
      )}

      <Grid
        container
        gap={3}
        justifyContent={"center"}
        sx={{
          maxWidth: { xs: "100%", lg: "60%" },
          width: "100%",
          marginX: "auto",
        }}
      >
        <Grid
          item
          container
          md={9}
          justifyContent={"space-around"}
          xs={12}
          sx={{ gap: 3 }}
        >
          <Grid item container>
            <Grid item container xs alignItems={"center"}>
              <Typography variant="body1">Guardian's Email</Typography>
              <Tooltip
                placement="top"
                title={
                  "Enter the email address of the guardian you want to set up for account recovery."
                }
                arrow
              >
                <IconButton
                  size="small"
                  aria-label="info"
                  sx={{ marginLeft: 1 }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item container xs={6} gap={2}>
              <TextField
                type="email"
                size="medium"
                fullWidth
                value={guardianEmail}
                error={emailError}
                helperText={
                  emailError ? "Please enter the correct email address" : null
                }
                placeholder="guardian@prove.email"
                onChange={(e) => setGuardianEmail(e.target.value)}
                title="Guardian's Email"
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction={"row"}
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Grid item container xs alignItems={"center"}>
              <Typography variant="body1">Timelock</Typography>
              <Tooltip
                placement="top"
                title={
                  "This is the duration during which guardians cannot initiate recovery. Recovery can only be triggered once this period has ended."
                }
                arrow
              >
                <IconButton
                  size="small"
                  aria-label="info"
                  sx={{ marginLeft: 1 }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item container xs gap={2}>
              <Grid item container xs={12} gap={2}>
                <TextField
                  type="number"
                  size="small"
                  sx={{ maxWidth: "6rem" }}
                  value={recoveryDelay}
                  onChange={(e) =>
                    setRecoveryDelay(
                      parseInt((e.target as HTMLInputElement).value),
                    )
                  }
                  error={
                    recoveryDelay * TIME_UNITS[recoveryDelayUnit].multiplier <
                    21600
                  }
                  title="Recovery Delay"
                />

                <Select
                  value={recoveryDelayUnit}
                  size="small"
                  onChange={(e) =>
                    setRecoveryDelayUnit(
                      e.target.value as keyof typeof TIME_UNITS,
                    )
                  }
                >
                  {Object.keys(TIME_UNITS).map((timeUnitKey) => {
                    const timeUnit = timeUnitKey as keyof typeof TIME_UNITS;
                    return (
                      <MenuItem
                        key={timeUnit}
                        value={TIME_UNITS[timeUnit].value}
                      >
                        {TIME_UNITS[timeUnit].label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" textAlign={"left"} color={"error"}>
                  {recoveryDelay * TIME_UNITS[recoveryDelayUnit].multiplier <
                  21600
                    ? "Recovery delay must be at least 6 hours"
                    : null}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item sx={{ marginX: "auto" }}>
          <Box
            sx={{ width: "330px", marginX: "auto", marginTop: "30px" }}
          ></Box>
          {isOwnerPasskeyLoading ? (
            <Typography sx={{ paddingBottom: "1.5rem" }}>
              Loading owner passkey...
            </Typography>
          ) : ownerPasskeyAccount ? (
            <Button
              disabled={
                !guardianEmail ||
                loading ||
                emailError ||
                recoveryDelay * TIME_UNITS[recoveryDelayUnit].multiplier < 21600
              }
              loading={loading}
              onClick={configureRecoveryAndRequestGuardian}
              variant={"contained"}
            >
              {loading
                ? "Configuring..."
                : moduleInstalled
                  ? "Resend Guardian Request"
                  : "Configure Recovery & Request Guardian"}
            </Button>
          ) : (
            <Typography sx={{ paddingBottom: "1.5rem" }}>
              Owner Passkey Not Connected. Please go back and connect.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default GuardianSetup;
