import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { Button } from "./Button";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { abi as safeAbi } from "../abi/Safe.json";
import infoIcon from "../assets/infoIcon.svg";
import { useAppContext } from "../context/AppContextHook";

import { abi as safeEmailRecoveryModuleAbi } from "../abi/SafeEmailRecoveryModule.json";
import { safeEmailRecoveryModule } from "../../contracts.base-sepolia.json";
import {
  genAccountCode,
  getRequestGuardianSubject,
  templateIdx,
} from "../utils/email";
import { readContract } from "wagmi/actions";
import { config } from "../providers/config";
import { relayer } from "../services/relayer";
import { StepsContext } from "../App";
import { STEPS } from "../constants";
import toast from "react-hot-toast";

import InputField from "./InputField";
import InputNumber from "./InputNumber"; 
import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from "@mui/material";
import Loader from "./Loader";



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
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};


const GuardianSetup = () => {
  const theme = useTheme();

  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

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
  const [emailError, setEmailError] = useState(false);
  const [recoveryDelayUnit, setRecoveryDelayUnit] = useState(
    TIME_UNITS.SECS.value
  );
  const [recoveryExpiryUnit, setRecoveryExpiryUnit] = useState(
    TIME_UNITS.DAYS.value
  );

  const isMobile = window.innerWidth < 768;

  const { data: safeOwnersData } = useReadContract({
    address,
    abi: safeAbi,
    functionName: "getOwners",
  });
  console.log(safeOwnersData);
  const firstSafeOwner = useMemo(() => {
    const safeOwners = safeOwnersData as string[];
    if (!safeOwners?.length) {
      return;
    }
    return safeOwners[0];
  }, [safeOwnersData]);

  const checkIfRecoveryIsConfigured = async () => {
    setIsAccountInitializedLoading(true);
    const getGuardianConfig = await readContract(config, {
      abi: safeEmailRecoveryModuleAbi,
      address: safeEmailRecoveryModule as `0x${string}`,
      functionName: "getGuardianConfig",
      args: [address],
    });

    // TODO: add polling for this
    if (getGuardianConfig?.initialized) {
      setIsAccountInitialized(getGuardianConfig?.initialized);
    }
    // stepsContext?.setStep(STEPS.REQUESTED_RECOVERIES);
    setIsAccountInitializedLoading(false);
  };

  useEffect(() => {
    checkIfRecoveryIsConfigured();
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

    if (!firstSafeOwner) {
      throw new Error("safe owner not found");
    }

    if (recoveryExpiry - recoveryDelay < 48) {
      toast.error(
        "Differnece between recovery expiry and recovery delay can't be less than 48 hrs"
      );
      throw new Error(
        "Differnece between recovery expiry and recovery delay can't be less than 48 hrs"
      );
    }

    try {
      setLoading(true);
      toast(
        "Please check Safe Website to complete transaction and check your email later",
        {
          icon: <img src={infoIcon} />,
          style: {
            background: "white",
          },
        }
      );

      const acctCode = await genAccountCode();
      setAccountCode(accountCode);

      const guardianSalt = await relayer.getAccountSalt(
        acctCode,
        guardianEmail
      );
      const guardianAddr = await readContract(config, {
        abi: safeEmailRecoveryModuleAbi,
        address: safeEmailRecoveryModule as `0x${string}`,
        functionName: "computeEmailAuthAddress",
        args: [address, guardianSalt],
      });

      await writeContractAsync({
        abi: safeEmailRecoveryModuleAbi,
        address: safeEmailRecoveryModule as `0x${string}`,
        functionName: "configureRecovery",
        args: [
          [guardianAddr],
          [1n],
          [1n],
          recoveryDelay * TIME_UNITS[recoveryDelayUnit].multiplier,
          recoveryExpiry * TIME_UNITS[recoveryExpiryUnit].multiplier,
        ],
      });

      console.debug("recovery configured");

      const subject = getRequestGuardianSubject(address);
      const { requestId } = await relayer.acceptanceRequest(
        safeEmailRecoveryModule as `0x${string}`,
        guardianEmail,
        acctCode,
        templateIdx,
        subject
      );

      console.debug("accept req id", requestId);

      // TODO: Use polling instead
      stepsContext?.setStep(STEPS.REQUESTED_RECOVERIES);
    } catch (err) {
      console.log(err);
      toast.error(err.shortMessage);
    } finally {
      setLoading(false);
    }
  }, [
    address,
    guardianEmail,
    firstSafeOwner,
    setAccountCode,
    accountCode,
    writeContractAsync,
    recoveryDelay,
    recoveryExpiry,
    stepsContext,
  ]);

  if (isAccountInitializedLoading) {
    return <Loader/>;
  }
  console.log(
    recoveryDelay * TIME_UNITS[recoveryDelayUnit].multiplier,
    recoveryExpiry * TIME_UNITS[recoveryExpiryUnit].multiplier,
  );
  return (
    <div
      style={{
        maxWidth: isMobile ? "100%" : "50%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "2rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        Connected wallet:
        <ConnectKitButton />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
        }}
      >
        Guardian Details:
        <div className="container">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "2rem",
              width: "100%",
              alignItems: "flex-end",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: isMobile ? "90%" : "60%",
              }}
            >
              <p>Guardian's Email</p>
              <input
                style={{ width: "100%" }}
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
              />
            </div>
            <div>
              <span>Recovery delay</span>
              <input
                style={{ width: "1.875rem", marginLeft: "1rem" }}
                type="number"
                min={1}
                value={recoveryDelay}
                onChange={(e) =>
                  setRecoveryDelay(
                    parseInt((e.target as HTMLInputElement).value)
                  )
                }
              />
              <select
                style={{ marginLeft: "1rem" }}
                value={recoveryDelayUnit}
                onChange={(e) => setRecoveryDelayUnit(e.target.value)}
              >
                {Object.keys(TIME_UNITS).map((timeUnit) => {
                  return (
                    <option value={TIME_UNITS[timeUnit].value}>
                      {TIME_UNITS[timeUnit].label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <span>Recovery Expiry</span>
              <input
                style={{ width: "1.875rem", marginLeft: "1rem" }}
                type="number"
                min={1}
                value={recoveryExpiry}
                onChange={(e) =>
                  setRecoveryExpiry(
                    parseInt((e.target as HTMLInputElement).value)
                  )
                }
              />
              <select
                style={{ marginLeft: "1rem" }}
                value={recoveryExpiryUnit}
                onChange={(e) => setRecoveryExpiryUnit(e.target.value)}
              >
                {Object.keys(TIME_UNITS).map((timeUnit) => {
                  return (
                    <option value={TIME_UNITS[timeUnit].value}>
                      {TIME_UNITS[timeUnit].label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div style={{ margin: "auto" }}>
        <Button
          disabled={!guardianEmail || isAccountInitialized}
          loading={loading}
          onClick={configureRecoveryAndRequestGuardian}
        >
          Configure Recovery and Request Guardian
        </Button>
      </div>
    </div>
  );
};

export default GuardianSetup;
