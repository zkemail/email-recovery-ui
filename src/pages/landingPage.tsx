import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import NavBar from "../components/NavBar";

import { useTheme, Grid, Typography, Box, TextField, Stack } from '@mui/material';
import '../App.css';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SvgWrapper from '../components/SvgIconWrapper';
import gnosisSafeLogo from '../assets/gnosis-safe-logo.svg';
import MoreInfoDialog from "../components/MoreInfoDialog";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Toggle from '../components/Toggle';
import { Link } from 'react-router-dom';
import InputField from "../components/InputField";
import { createContext, useEffect, useState } from "react";
import ConnectWallets from "../components/ConnectWallets";
import ConnectWallet from "../components/ConnectWallet";


type actionType = "SAFE_WALLET" | "BURNER_WALLET" | "WALLET_RECOVERY";
type FlowType = 'setup' | 'recover';

const LandingPage = () => {
  const theme = useTheme();
  const [flow, setFlow] = useState<FlowType>('setup');

  const navigate = useNavigate();

  const handleFlowChange = (newFlow: FlowType) => {
    setFlow(newFlow);
    console.log(flow);
  };

  const handleClick = async (action: actionType) => {
    switch (action) {
      case "SAFE_WALLET":
        return navigate("/safe-wallet");
      case "BURNER_WALLET":
        return navigate("/burner-wallet");
      case "WALLET_RECOVERY":
        return navigate("/wallet-recovery");
      default:
        console.log(action);
        break;
    }
  };
  return (
    <div>
        <NavBar/>
        <div className='bg-white'>
              <Grid sx={{color:'10px', paddingTop: '120px'}}>
                <Box display='flex' justifyContent='center' alignItems='center' sx={{borderRadius:'25.95px', border:'1px solid #CECFD2', width: '170px', marginX: 'auto', padding:'5px', marginBottom:'20px'}}>
                  <DraftsOutlinedIcon sx={{marginX:'5px', padding:'4px', color:'#000000'}} />
                    <Typography>ZK Email Tech</Typography>
                </Box>
                <Typography variant='h1' sx={{color: theme.palette.primary.main}}>
                  Email Recovery Demo
                </Typography>   
                <Typography sx={{color: theme.palette.secondary.main, paddingTop:'15px', fontWeight:'medium', lineHeight:'140%'}}>
                    3 assigned Guardians must reply back to an email to <br></br>
                    enable wallet recovery to a new address.
                </Typography>
                <Toggle onFlowChange={handleFlowChange} />
              </Grid>

              {flow === 'setup' ? (
                // SETUP FLOW
                <Box sx={{height:'250px', alignContent: 'center', justifyContent: 'center', marginX: 'auto'}}>
                  <Grid container>
                    {/* GNOSIS SAFE */}
                    <Grid item xs={6} padding='20px'>
                      <Box sx={{height:'250px', width:'500px', marginX: 'auto', background:'#FFFFFF', border:'1px solid #DDDDDD', borderRadius:'18px', position:'relative'}}>
                        <Box sx={{ position: 'absolute', top: '10px', right: '12px'}}>
                          <MoreInfoDialog
                            title='Gnosis Safe Wallet Recovery Setup' 
                            message='This message will get sent along in the email with our default instructions. This can be helpful later for your guardians to find the email that contains your lost wallet without having to remember the lost wallet address.'
                          />
                        </Box>
                        <SvgWrapper src={gnosisSafeLogo} sx={{marginTop:'25px', width: '40px', height: '40px'}} />
                        <Typography variant='h4' sx={{fontWeight:'medium', letterSpacing: -2, paddingBottom:'10px', paddingTop:'10px'}}>Gnosis Safe</Typography>
                        <Typography sx={{color:'#848281', fontWeight:'regular', fontSize: '16px', paddingBottom:'10px'}}>Copy the link and import into your Safe wallet</Typography>
                        {/* <ConnectWallet /> */}
                        <Box width='190px' margin='auto'>
                          <Button onClick={() => handleClick("SAFE_WALLET")}>
                            Safe Wallet Flow
                          </Button>
                        </Box>
                      </Box>
                    </Grid>



                    {/* TEST WALLET */}
                    <Grid item xs={6} padding='20px'>
                      <Box sx={{height:'250px', width:'500px', marginX: 'auto', background:'#FFFFFF', border:'1px solid #DDDDDD', borderRadius:'18px', position:'relative'}}>
                        <Box sx={{ position: 'absolute', top: '10px', right: '12px'}}>
                          <MoreInfoDialog
                            title='Test Wallet Recovery Setup' 
                            message='Test out our setup and recovery flow with a test wallet.'
                          />
                        </Box>
                        <AccountBalanceWalletOutlinedIcon sx={{marginTop:'25px', width: '35px', height: '35px',  color:'#000000'}} />
                        <Typography variant='h4' sx={{fontWeight:'medium', letterSpacing: -2, paddingBottom:'10px', paddingTop:'10px'}}>Test Wallet </Typography>
                        <Typography sx={{color:'#848281', fontWeight:'regular', fontSize: '16px', paddingBottom:'10px'}}>Connect to see the test wallet flow</Typography>
                        {/* <ConnectWallet /> */}
                        <Box width='190px' margin='auto'>
                          <Button onClick={() => handleClick("BURNER_WALLET")}>
                            Burner Wallet Flow
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>



                  {/*  PROMPT TO CONTACT IF U WANT ANOTHER WALLET AT BOTTOM*/}
                  <Box sx={{ paddingTop: '50px', paddingBottom: '40px' }}>
                    <Typography>
                      Want us to setup account recovery for a different wallet?&nbsp;
                      <Link to='https://t.me/zkemail' target="_blank" style={{ fontWeight: 'bold' }}>
                        Contact Us!
                      </Link>
                    </Typography>
                  </Box>

                </Box>

              ) : (


                /* RECOVERY FLOW! */
                <Box sx={{height:'310px', width:'800px', marginX: 'auto', background:'#FFFFFF', border:'1px solid #DDDDDD', borderRadius:'18px', marginY:'25px', paddingY: '20px', paddingX: '50px', position:'relative'}}>
                  <Box sx={{ position: 'absolute', top: '10px', right: '15px'}}>
                    <MoreInfoDialog
                      title='Recover Your Lost Recovery Enabled Wallet' 
                      message='If you forgot your lost wallet address reach out to your gaurdians, they will have the lost wallet address inside the emails they got when they agreed to be gaurdians, they can also identify the email by looking for your gaurdian message inside the email. If you forgot your gaurdian emails you can still atempt recovery'
                    />
                  </Box>
                  <Typography variant='h4' sx={{fontWeight:'medium', letterSpacing: -2, paddingBottom:'30px', paddingTop:'20px'}}>Recover Wallet</Typography>

                  <Grid container spacing={2} sx={{textAlign:'left'}}>
                    <Grid item xs={6}>
                      <InputField label="Lost Wallet" type='text' value=" " />
                    </Grid>
                    <Grid item xs={6}>
                      <InputField label="Requested New Wallet Address" type='text' value=" " />
                    </Grid>
                  </Grid>

                  <Stack  sx={{ marginTop: '30px', width:'270px', marginX: 'auto'}}>
                    {/* <Button>Request Wallet Transfer</Button> */}

                    <Button onClick={() => handleClick("WALLET_RECOVERY")}>
                      Recover Wallet Flow
                    </Button>
                  </Stack>

                  {/* <Box sx={{display:'flex', justifyContent:'center', paddingTop:'13px'}}>
                    <Typography>Copy the link and import into your Safe wallet</Typography>
                  </Box> */}
                </Box>
              )}
            </div>

    </div>
  );
};

export default LandingPage;
