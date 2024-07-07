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

import MoreInfoDialog from "./MoreInfoDialog";
import InputField from "./InputField";
import InputNumber from "./InputNumber"; 
import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from "@mui/material";


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
  const [recoveryExpiry, setRecoveryExpiry] = useState(1);
  const [emailError, setEmailError] = useState(false);

  const isMobile = window.innerWidth < 768;

  const { data: safeOwnersData } = useReadContract({
    address,
    abi: safeAbi,
    functionName: "getOwners",
  });
  console.log(safeOwnersData)
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

    setIsAccountInitialized(getGuardianConfig?.initialized);
    stepsContext?.setStep(STEPS.REQUESTED_RECOVERIES);
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
    
    if(recoveryExpiry - recoveryDelay < 48) {
      toast.error("Differnece between recovery expiry and recovery delay can't be less than 48 hrs");
      throw new Error("Differnece between recovery expiry and recovery delay can't be less than 48 hrs");
    }

    try {
      setLoading(true);
      toast("Please check Safe Website to complete transaction and check your email later", {
        icon: <img src={infoIcon} />,
        style: {
          background: "white",
        },
      });

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
        args: [[guardianAddr], [1n], [1n], recoveryDelay, recoveryExpiry * 3600],
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
    return <>Loading...</>;
  }

  return (
    <Box sx={{ marginX: 'auto', marginTop:'200px', marginBottom:'100px'  }}>
      <Typography variant='h2' sx={{ paddingBottom: '20px'}}>Set Up Guardian Details </Typography>
      <Typography variant='h6' sx={{paddingBottom: '80px'}}>Choose a Guardian you trust to be enable wallet recovery <br></br> via email. They'll receive an email request.</Typography>

      <Grid container spacing={3} sx={{ maxWidth: isMobile ? "100%" : "60%", width: "100%", marginX: 'auto' }}>

        <Grid item xs={6} sx={{ borderRight: '1px solid #EBEBEB', paddingRight: '30px' }}>
          <Box display="flex" flexDirection="column" gap="1rem" sx={{ paddingRight: '5px' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ marginRight: '25px' }}>Recovery Delay (seconds)</Typography>
                <InputNumber
                  type='number'
                  value={recoveryDelay}
                  onChange={(e) =>
                    setRecoveryDelay(
                      parseInt((e.target as HTMLInputElement).value)
                    )
                  }
                  min={1}
                />
              </Box>
              <MoreInfoDialog
                title='Recovery Delay'
                message='This is the delay you the actual wallet owner has to cancel recovery after recovery has been initiated, helpful for preventing malicious behavior from guardians.'
              />
            </Box>

            <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ marginRight: '25px' }}>Recovery Expiry (hours)</Typography>
              <InputNumber
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
              <MoreInfoDialog
                title='Recovery Expiry'
                message='This is the expiry delay that...'
              />
            </Box>


            <Box display="flex" flexDirection="column" gap="1rem" sx={{ textAlign: 'left' }}>
              <Typography variant="body1">Connected wallet:</Typography>
              <ConnectKitButton />
            </Box>
            {/* <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ textAlign: 'left' }}>
              <Box flex="1" sx={{ marginRight: '25px' }}>
                <InputField
                  placeholderText='message'
                  type="text"
                  value={guardianMessage}
                  onChange={(e) => setGuardianMessage(e.target.value)}
                  label="Add a Guardian Message"
                  locked={false}
                />
              </Box>
              <Box>
                <MoreInfoDialog
                  title='Guardian Message'
                  message='This message will get sent along in the email with our default instructions. This can be helpful later for your guardians to find the email that contains your lost wallet without having to remember the lost wallet address.'
                />
              </Box>
            </Box> */}

          </Box>
        </Grid>

        <Grid item xs={6} sx={{ textAlign: 'left' }}>
          <Box sx={{ paddingLeft: '25px' }}>
            <Typography variant="h5" sx={{ paddingBottom: '20px', fontWeight: 700 }}>Guardian Details:</Typography>
            <Box display="flex" flexDirection="column" gap="1rem">
              {[1].map((index) => (
                <InputField
                  placeholderText='guardian@prove.email'
                  key={index}
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  label={`Guardian's Email`}
                  locked={false}
                  {...(guardianEmail && {
                    status: emailError ? 'error' : 'okay',
                    statusNote: emailError ? 'Please enter the correct email address' : 'Okay'
                  })}
                />
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid item sx={{marginX: 'auto'}}>
          <Box  sx={{width:'330px', marginX: 'auto'}}></Box>
          <Button
          disabled={!guardianEmail || isAccountInitialized}
          loading={loading}
          onClick={configureRecoveryAndRequestGuardian}
          filled={true}
          >
            Configure Recovery & Request Guardian
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GuardianSetup;
