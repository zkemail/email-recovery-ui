import { useCallback, useContext, useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { Button } from "./Button";
import cancelRecoveryIcon from "../assets/cancelRecoveryIcon.svg";
import completeRecoveryIcon from "../assets/completeRecoveryIcon.svg";
import recoveredIcon from "../assets/recoveredIcon.svg";
import { useAppContext } from "../context/AppContextHook";
import { useAccount, useReadContract } from "wagmi";

import { relayer } from "../services/relayer";
import { abi as recoveryPluginAbi } from "../abi/SafeEmailRecoveryModule.json";
import { getRequestsRecoverySubject, templateIdx } from "../utils/email";
import { safeEmailRecoveryModule } from "../../contracts.base-sepolia.json";
import { StepsContext } from "../App";
import { STEPS } from "../constants";
import { FlowContext } from "./StepSelection";
import toast from "react-hot-toast";
import { readContract } from "wagmi/actions";
import { config } from "../providers/config";
import { abi as safeEmailRecoveryModuleAbi } from "../abi/SafeEmailRecoveryModule.json";
import { abi as safeAbi } from "../abi/Safe.json";
import { encodeFunctionData } from "viem";

const BUTTON_STATES = {
  TRIGGER_RECOVERY: "Trigger Recovery",
  CANCEL_RECOVERY: "Cancel Recovery",
  COMPLETE_RECOVERY: "Complete Recovery",
  RECOVERY_COMPLETED: "Recovery Completed",
};

const RequestedRecoveries = () => {
  
  const theme = useTheme();

  const isMobile = window.innerWidth < 768;
  const { address } = useAccount();
  const { guardianEmail } = useAppContext();
  const stepsContext = useContext(StepsContext);

  const [newOwner, setNewOwner] = useState<string>();
  const [safeWalletAddress, setSafeWalletAddress] = useState(address);
  const [guardianEmailAddress, setGuardianEmailAddress] =
    useState(guardianEmail);
  const [buttonState, setButtonState] = useState(
    BUTTON_STATES.TRIGGER_RECOVERY
  );
  const flowContext = useContext(FlowContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [gurdianRequestId, setGuardianRequestId] = useState<number>();
  const [isButtonStateLoading, setIsButtonStateLoading] = useState(false)

  const { data: recoveryRouterAddr } = useReadContract({
    abi: recoveryPluginAbi,
    address: safeEmailRecoveryModule as `0x${string}`,
    functionName: "getRouterForSafe",
    args: [safeWalletAddress],
  });

  const checkIfRecoveryCanBeCompleted = async () => {
    setIsButtonStateLoading(true)
    const getRecoveryRequest = await readContract(config, {
      abi: safeEmailRecoveryModuleAbi,
      address: safeEmailRecoveryModule as `0x${string}`,
      functionName: "getRecoveryRequest",
      args: [address],
    });

    const getGuardianConfig = await readContract(config, {
      abi: safeEmailRecoveryModuleAbi,
      address: safeEmailRecoveryModule as `0x${string}`,
      functionName: "getGuardianConfig",
      args: [address],
    });

    console.log(getRecoveryRequest.currentWeight, getGuardianConfig.threshold)

    if (getRecoveryRequest.currentWeight < getGuardianConfig.threshold) {
      setButtonState(BUTTON_STATES.TRIGGER_RECOVERY);
    } else {
      setButtonState(BUTTON_STATES.COMPLETE_RECOVERY);
    }
    setIsButtonStateLoading(false)
  };

  useEffect(() => {
  checkIfRecoveryCanBeCompleted();
  }, []);

  console.log(newOwner);

  const { data: safeOwnersData } = useReadContract({
    address,
    abi: safeAbi,
    functionName: "getOwners",
  });

  console.log(safeOwnersData)


  const requestRecovery = useCallback(async () => {
    setLoading(true);
    if (!safeWalletAddress) {
      throw new Error("unable to get account address");
    }

    if (!guardianEmailAddress) {
      throw new Error("guardian email not set");
    }

    if (!newOwner) {
      throw new Error("new owner not set");
    }


    // if (!recoveryRouterAddr) {
    //   throw new Error("could not find recovery router for safe");
    // }

    const subject = getRequestsRecoverySubject(safeWalletAddress, newOwner);

    try {
      const { requestId } = await relayer.recoveryRequest(
        safeEmailRecoveryModule as string,
        guardianEmailAddress,
        templateIdx,
        subject
      );
      setGuardianRequestId(requestId);

      setButtonState(BUTTON_STATES.COMPLETE_RECOVERY);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while requesting recovery");
      setLoading(false);
    } finally {
      setLoading(false);
    }

    // let checkRequestRecoveryStatusInterval = null

    // const checkGuardianAcceptance = async () => {
    //   if (!requestId) {
    //     throw new Error("missing guardian request id");
    //   }

    //   const resBody = await relayer.requestStatus(requestId);
    //   console.debug("guardian req res body", resBody);

    //   if(resBody?.is_success) {
    //     setLoading(false);
    //     setButtonState(BUTTON_STATES.COMPLETE_RECOVERY);
    //     checkRequestRecoveryStatusInterval?.clearInterval()
    //   }
    // }

    // checkRequestRecoveryStatusInterval = setInterval(async () => {
    //     const res = await checkGuardianAcceptance();
    //     console.log(res)
    // }, 5000);

  }, [recoveryRouterAddr, safeWalletAddress, guardianEmailAddress, newOwner]);

  const completeRecovery = useCallback(async () => {
    setLoading(true);

    const callData = encodeFunctionData(
      {
        abi: safeAbi,
        functionName: "swapOwner",
        args: ["0x0000000000000000000000000000000000000001" ,safeOwnersData[0], newOwner]
      }
    )

    try {
      const res = await relayer.completeRecovery(
        safeEmailRecoveryModule as string,
        safeWalletAddress as string,
        callData
      );

      console.debug("complete recovery res", res);
      setButtonState(BUTTON_STATES.RECOVERY_COMPLETED);
    } catch(err) {
      toast.error("Something went wrong while completing recovery process")
    } finally {
      setLoading(false);
    }



  }, [recoveryRouterAddr, newOwner]);

  const getButtonComponent = () => {
    switch (buttonState) {
      case BUTTON_STATES.TRIGGER_RECOVERY:
        return (
          <Button filled={true} loading={loading || isButtonStateLoading} onClick={requestRecovery}>
          <Button loading={loading || isButtonStateLoading} onClick={requestRecovery}>
            Trigger Recovery
          </Button>
        );
      case BUTTON_STATES.CANCEL_RECOVERY:
        return (
          <Button filled={true} endIcon={<img src={cancelRecoveryIcon} />}>
            Cancel Recovery
          </Button>
        );
      case BUTTON_STATES.COMPLETE_RECOVERY:
        return (
          <Button
            loading={loading || isButtonStateLoading}
            onClick={completeRecovery}
            endIcon={<img src={completeRecoveryIcon} />}
          >
            Complete Recovery
          </Button>
        );
      case BUTTON_STATES.RECOVERY_COMPLETED:
        return (
          <Button
            filled={true}
            loading={loading}
            onClick={() => stepsContext.setStep(STEPS.STEP_SELECTION)}
          >
            Complete! Connect new wallet to set new guardians ➔
          </Button>
        );
    }
  };



  return (
  
    <Box sx={{marginX:'auto', marginTop:'100px', marginBottom:'100px' }}>

      {buttonState === BUTTON_STATES.RECOVERY_COMPLETED ? (
        <>
          <Typography variant='h2' sx={{ paddingBottom: '20px'}}>Completed Wallet Transfer!</Typography>
          <Typography variant='h6' sx={{paddingBottom: '50px'}}>Great job your old wallet has successfully transferred ownership</Typography>
        </>
      ) : (
        <>
          <Typography variant='h2' sx={{ paddingBottom: '20px'}}>Recover Your Wallet</Typography>
          <Typography variant='h6' sx={{paddingBottom: '50px'}}>Enter your guardian email address and the new <br></br> wallet you want to transfer to</Typography>
        </>
      )}
      
      <div
        style={{
          maxWidth: isMobile ? "100%" : "50%",
          margin: 'auto',
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "2rem",
        }}
      >
        <div style={{ display: "flex", width:'100%', flexDirection: "column", gap: "1rem" }}>
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
              <Box width='100%' height='100px' alignContent='center' justifyItems='center' borderRadius={3} sx={{ marginX: 'auto', backgroundColor: '#FCFCFC', border: '1px solid #E3E3E3', paddingY: '20px', paddingX: '25px', position:'relative' }}>
              <Box  justifyContent='center' sx={{ display: "flex", alignItems: "center", gap: "1rem", marginX:'auto', marginTop:'10px'}}>
                <CircleIcon 
                  sx={{ 
                    padding: '5px', 
                    color: address ? '#6DD88B' : '#FB3E3E', 
                    marginRight: '-10px',
                    transition: 'color 0.5s ease-in-out'
                  }} 
                />
                <Typography> Connected Wallet: </Typography>
                <ConnectKitButton />
              </Box>
              <div
                style={{
                  display:'flex',
                  background: "#E7FDED",
                  border: "1px solid #6DD88B",
                  color: "#0A6825",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "26px",
                  width: "fit-content",
                  height: "18px",
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute', 
                  top: '10px', 
                  right: '12px'
                }}
              >
                <Typography sx={{ marginLeft: "0.5rem", fontSize:'12px', color:'#0A6825' }}>Recovered</Typography>
                <MonetizationOnIcon sx={{padding:'6px', fontSize:'12px'}}/>
              </div>
            </Box>
            ) : (
              
              <Box width='100%' height='70px' alignContent='center' justifyItems='center' borderRadius={3} sx={{ marginX: 'auto', backgroundColor: '#FCFCFC', border: '1px solid #E3E3E3', paddingY: '20px', paddingX: '25px', position:'relative' }}>
              <Box  justifyContent='center' sx={{ display: "flex", alignItems: "center", gap: "1rem", marginX:'auto', marginTop:'10px'}}>
                <CircleIcon 
                  sx={{ 
                    padding: '5px', 
                    color: address ? '#6DD88B' : '#FB3E3E', 
                    marginRight: '-10px',
                    transition: 'color 0.5s ease-in-out'
                  }} 
                />
                <Typography> Connected Wallet: </Typography>
                <ConnectKitButton />
              </Box>
            </Box>
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
              textAlign: 'left',
            }}
          >
            <Typography sx={{fontWeight:700}}>Requested Recoveries:</Typography>
            <div className="container">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: isMobile ? "1rem" : "3rem",
                  width: "100%",
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: isMobile ? "90%" : "45%",
                    textAlign: 'left',
                  }}
                >
                  <InputField
                    type="email"
                    value={guardianEmailAddress}
                    onChange={(e) => setGuardianEmailAddress(e.target.value)}
                    locked={guardianEmail ? true : false}
                    label="Guardian's Email"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: isMobile ? "90%" : "45%",
                    textAlign: 'left',
                  }}
                >
                  <InputField
                    type="email"
                    value={newOwner || ""}
                    onChange={(e) => setNewOwner(e.target.value)}
                    label="Requested New Wallet Address"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div style={{ margin: "auto", minWidth:'300px' }}>{getButtonComponent()}</div>
      </div>
    </Box>
  );
};

export default RequestedRecoveries;
