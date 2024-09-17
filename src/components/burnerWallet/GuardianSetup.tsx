import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { Button } from "../Button";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import infoIcon from "../../assets/infoIcon.svg";
import { useAppContext } from "../../context/AppContextHook";

import { abi as universalEmailRecoveryModuleAbi } from "../../abi/UniversalEmailRecoveryModule.json";
import { universalEmailRecoveryModule } from "../../../contracts.base-sepolia.json";
import {
  genAccountCode,
  getRequestGuardianCommand,
  templateIdx,
} from "../../utils/email";
import { readContract } from "wagmi/actions";
import { config } from "../../providers/config";
import { relayer } from "../../services/relayer";
import { StepsContext } from "../../App";
import { STEPS } from "../../constants";
import toast from "react-hot-toast";

import { run } from "./deploy";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import {
  ENTRYPOINT_ADDRESS_V07,
  walletClientToSmartAccountSigner,
} from "permissionless";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { baseSepolia } from "viem/chains";

export const publicClient = createPublicClient({
  transport: http("https://sepolia.base.org"),
});

import InputField from "../InputField";
import {
  Box,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material";
import Loader from "../Loader";
import { useGetSafeAccountAddress } from "../../utils/useGetSafeAccountAddress";

const TIME_UNITS = {
  SECS: {
    value: "SECS",
    multiplier: 1,
    label: "Secs",
  },
  MINS: {
    value: "MINS",
    multiplier: 60,
    label: "Mins",
  },
  HOURS: {
    value: "HOURS",
    multiplier: 60 * 60,
    label: "Hours",
  },
  DAYS: {
    value: "DAYS",
    multiplier: 60 * 60 * 24,
    label: "Days",
  },
};

//logic for valid email address check for input
const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const GuardianSetup = () => {
  const address = useGetSafeAccountAddress();
  const { writeContractAsync } = useWriteContract();
  const [account, setAccount] = useState<string>(null);
  const [accountCreationError, setAccountCreationError] = useState(false);

  const { guardianEmail, setGuardianEmail, accountCode, setAccountCode } =
    useAppContext();
  const stepsContext = useContext(StepsContext);

  const [isAccountInitialized, setIsAccountInitialized] = useState(false);
  const [isAccountInitializedLoading, setIsAccountInitializedLoading] =
    useState(false);
  const [loading, setLoading] = useState(false);
  // 0 = 2 week default delay, don't do for demo
  const [recoveryDelay, setRecoveryDelay] = useState(1);
  const [recoveryExpiry, setRecoveryExpiry] = useState(7);
  const [isWalletPresent, setIsWalletPresent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [recoveryDelayUnit, setRecoveryDelayUnit] = useState(
    TIME_UNITS.SECS.value
  );
  const [recoveryExpiryUnit, setRecoveryExpiryUnit] = useState(
    TIME_UNITS.DAYS.value
  );
  const [isBurnerWalletCreating, setIsBurnerWalletCreating] = useState(false);

  console.log(accountCode, "accountCode");
  const localStorageAccountCode = localStorage.getItem("accountCode");

  let interval: NodeJS.Timeout;

  const isMobile = window.innerWidth < 768;

  const checkIfRecoveryIsConfigured = async () => {
    if (!address) {
      return;
    }
    setIsAccountInitializedLoading(true);
    const getGuardianConfig = await readContract(config, {
      abi: universalEmailRecoveryModuleAbi,
      address: universalEmailRecoveryModule as `0x${string}`,
      functionName: "getGuardianConfig",
      args: [address],
    });

    console.log(getGuardianConfig);

    // TODO: add polling for this
    if (
      getGuardianConfig.acceptedWeight === getGuardianConfig.threshold &&
      getGuardianConfig.threshold !== 0n
    ) {
      // setIsAccountInitialized(getGuardianConfig?.initialized);
      setLoading(false);
      stepsContext?.setStep(STEPS.REQUESTED_RECOVERIES);
    }
    setIsAccountInitializedLoading(false);
  };

  const connectWallet = async () => {
    setIsBurnerWalletCreating(true);
    // Assuming install function sets the account
    const addresses = await window.ethereum.request({
      method: "eth_requestAccounts",
    }); // Cast the result to string[]
    const [address] = addresses;

    try {
      const client = createWalletClient({
        account: address, // Type assertion to match the expected format
        chain: baseSepolia,
        transport: custom(window.ethereum),
      });

      const safeAccount = await signerToSafeSmartAccount(publicClient, {
        signer: walletClientToSmartAccountSigner(client),
        safeVersion: "1.4.1",
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        safe4337ModuleAddress: "0x3Fdb5BC686e861480ef99A6E3FaAe03c0b9F32e2",
        erc7569LaunchpadAddress: "0xEBe001b3D534B9B6E2500FB78E67a1A137f561CE",
        validators: [
          {
            address: "0xd9Ef4a48E4C067d640a9f784dC302E97B21Fd691",
            context: "0x",
          },
        ],
      });

      const acctCode = await genAccountCode();

      // if (localStorage.getItem("accountCode")) {
      //   return;
      // }

      localStorage.setItem("accountCode", acctCode);
      await setAccountCode(accountCode);

      const guardianSalt = await relayer.getAccountSalt(
        acctCode,
        guardianEmail
      );

      const guardianAddr = await readContract(config, {
        abi: universalEmailRecoveryModuleAbi,
        address: universalEmailRecoveryModule as `0x${string}`,
        functionName: "computeEmailAuthAddress",
        args: [safeAccount.address, guardianSalt],
      });

      const burnerWalletAddress = await run(client, safeAccount, guardianAddr);
      setAccount(burnerWalletAddress);
      localStorage.setItem(
        "burnerWalletConfig",
        JSON.stringify({ burnerWalletAddress })
      );
      setIsWalletPresent(true);
    } catch (error) {
      console.log(error);
      toast.error(`Something went wrong. Err: ${error.shortMessage}`);
      setAccountCreationError(error);
    } finally {
      setIsBurnerWalletCreating(false);
    }
  };

  useEffect(() => {
    checkIfRecoveryIsConfigured();
    const burnerWalletConfig = localStorage.getItem("burnerWalletConfig");
    if (burnerWalletConfig && burnerWalletConfig != undefined) {
      setIsWalletPresent(true);
    }

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

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
    if (!address) {
      throw new Error("unable to get account address");
    }

    if (!guardianEmail) {
      throw new Error("guardian email not set");
    }

    try {
      setLoading(true);
      toast(
        "Please check your email",
        {
          icon: <img src={infoIcon} />,
          style: {
            background: "white",
          },
        }
      );

      // const guardianSalt = await relayer.getAccountSalt(
      //   acctCode,
      //   guardianEmail
      // );
      // const guardianAddr = await readContract(config, {
      //   abi: universalEmailRecoveryModuleAbi,
      //   address: universalEmailRecoveryModule as `0x${string}`,
      //   functionName: "computeEmailAuthAddress",
      //   args: [address, guardianSalt],
      // });

      // await writeContractAsync({
      //   abi: universalEmailRecoveryModuleAbi,
      //   address: universalEmailRecoveryModule as `0x${string}`,
      //   functionName: "configureRecovery",
      //   args: [
      //     [guardianAddr],
      //     [1n],
      //     1n,
      //     recoveryDelay * TIME_UNITS[recoveryDelayUnit].multiplier,
      //     recoveryExpiry * 60 * 60 * 24 * 30,
      //   ],
      // });

      console.debug("recovery configured");

      const subject = getRequestGuardianCommand(address);
      const { requestId } = await relayer.acceptanceRequest(
        universalEmailRecoveryModule as `0x${string}`,
        guardianEmail,
        localStorageAccountCode,
        templateIdx,
        subject
      );

      console.debug("accept req id", requestId);

      // Setting up interval for polling
      interval = setInterval(() => {
        checkIfRecoveryIsConfigured();
      }, 5000); // Adjust the interval time (in milliseconds) as needed
    } catch (err) {
      console.log(err);
      toast.error(
        err?.shortMessage ?? "Something went wrong, please try again."
      );
      setLoading(false);
    }
  }, [
    address,
    guardianEmail,
    setAccountCode,
    accountCode,
    writeContractAsync,
    recoveryDelay,
    recoveryExpiry,
    stepsContext,
  ]);

  return (
    <Box sx={{ marginX: "auto", marginTop: "100px", marginBottom: "100px" }}>
      <Typography variant="h2" sx={{ paddingBottom: "1.5rem" }}>
        Set Up Guardian Details
      </Typography>
      <Typography variant="h6" sx={{ paddingBottom: "5rem" }}>
        Choose a Guardian you trust to be enable wallet recovery via email.
        They'll receive an email request.
      </Typography>

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
          md={5.5}
          justifyContent={"space-around"}
          xs={12}
          sx={{ gap: { xs: 3, sm: 0 } }}
        >
          <Grid
            item
            container
            direction={"row"}
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Grid item>
              <Typography variant="body1">Timelock</Typography>
            </Grid>
            <Grid item container xs={"auto"} gap={2}>
              <TextField
                type="number"
                size="small"
                sx={{ maxWidth: "6rem" }}
                value={recoveryDelay}
                onChange={(e) =>
                  setRecoveryDelay(
                    parseInt((e.target as HTMLInputElement).value)
                  )
                }
                title="Recovery Delay"
                // helperText="This is the delay you the actual wallet owner has to cancel recovery after recovery has been initiated, helpful for preventing malicious behavior from guardians."
              />

              <Select
                value={recoveryDelayUnit}
                size="small"
                onChange={(e) => setRecoveryDelayUnit(e.target.value)}
              >
                {Object.keys(TIME_UNITS).map((timeUnit) => {
                  return (
                    <MenuItem value={TIME_UNITS[timeUnit].value}>
                      {TIME_UNITS[timeUnit].label}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
          </Grid>

          {/* <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ marginRight: "35px" }}
          >
            <Typography variant="body1" sx={{ marginRight: '25px', textAlign:'left' }}>Recovery Expiry (hours)</Typography>
              <InputNumber
                type="number"
                min={1}
                value={recoveryExpiry}
                onChange={(e) =>
                  setRecoveryExpiry(
                    parseInt((e.target as HTMLInputElement).value)
                  )
                }
                title='Recovery Expiry (hours)'
                message='This is the expiry delay that...'
              />
          </Box> */}

          {/* <Grid
            item
            container
            gap="1rem"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="body1">Connected Wallet:</Typography>
            <ConnectKitButton />
          </Grid> */}
        </Grid>
        <Grid item sx={{ borderRight: { md: "1px solid #EBEBEB" } }} />

        <Grid item md={5.5} xs={12} sx={{ textAlign: "left" }}>
          <Box>
            <Typography
              variant="h5"
              sx={{ paddingBottom: "20px", fontWeight: 700 }}
            >
              Guardian Details:
            </Typography>
            <Box display="flex" flexDirection="column" gap="1rem">
              {[1].map((index) => (
                <InputField
                  placeholderText="guardian@prove.email"
                  key={index}
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  label={`Guardian's Email`}
                  locked={false}
                  {...(guardianEmail && {
                    status: emailError ? "error" : "okay",
                    statusNote: emailError
                      ? "Please enter the correct email address"
                      : "Okay",
                  })}
                />
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid item sx={{ marginX: "auto" }}>
          <Box
            sx={{ width: "330px", marginX: "auto", marginTop: "30px" }}
          ></Box>
          {isWalletPresent ? (
            <Button
              disabled={!guardianEmail || isAccountInitialized}
              loading={loading}
              onClick={configureRecoveryAndRequestGuardian}
              filled={true}
            >
              Configure Recovery & Request Guardian
            </Button>
          ) : (
            <Button
              disabled={!guardianEmail || isAccountInitialized}
              loading={isBurnerWalletCreating}
              onClick={connectWallet}
              filled={true}
            >
              Create burner wallet
            </Button>
          )}{" "}
        </Grid>
      </Grid>
    </Box>
  );
};

export default GuardianSetup;
