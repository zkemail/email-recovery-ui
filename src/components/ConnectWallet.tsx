// import { Button } from "./Button";
// // import walletIcon from "../assets/wallet.svg";
// import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
// import { ConnectKitButton } from "connectkit";
// import { useAccount } from "wagmi";
// import { useContext } from "react";
// import { StepsContext } from "../App";
// import { STEPS } from "../constants";

// const ConnectWallets = () => {
//   const { address } = useAccount();
//   const stepsContext = useContext(StepsContext);

//   if (address) {
//     console.log(stepsContext);
//     stepsContext?.setStep(STEPS.SAFE_MODULE_RECOVERY);
//   }

//   return (
//     <div className="connect-wallets-container">
//       {/* <Button endIcon={<img src={walletIcon} />}>Connect Genosis Safe</Button>

//       <p color="#CECFD2" style={{ display: "flex", gap: "0.5rem" }}>
//         <img src={infoIcon} alt="info" />
//         Copy the link and import into your safe wallet
//       </p> */}
//       <ConnectKitButton.Custom>
//         {({ show }) => {
//           return (
//             <Button onClick={show} endIcon={<AccountBalanceWalletOutlinedIcon/>}>
//               Connect Safe
//             </Button>
//           );
//         }}
//       </ConnectKitButton.Custom>
//       {/* <p style={{ textDecoration: "underline" }}>
//         Or, recover existing wallet instead ➔
//       </p> */}
//     </div>
//   );
// };

// export default ConnectWallets;




import { Button } from "./Button";
// import walletIcon from "../assets/wallet.svg";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { useContext } from "react";
import { StepsContext } from "../App";
import { STEPS } from "../constants";
import { Box, Typography } from "@mui/material";
import { Web3Provider } from "../providers/Web3Provider";


const ConnectWallet = () => {
  const { address } = useAccount();
  const stepsContext = useContext(StepsContext);

  if (address) {
    console.log(stepsContext);
    stepsContext?.setStep(STEPS.SAFE_MODULE_RECOVERY);
  }

  return (
    <div className="connect-wallets-container">

      
      <Typography></Typography>
      {/* <Button endIcon={<img src={walletIcon} />}>Connect Genosis Safe</Button>

      <p color="#CECFD2" style={{ display: "flex", gap: "0.5rem" }}>
        <img src={infoIcon} alt="info" />
        Copy the link and import into your safe wallet
      </p> */}
      <ConnectKitButton.Custom>
        {({ show }) => {
          return (
            <Box width='170px' margin='auto'>
              <Web3Provider>
              <Button filled={true} onClick={show} endIcon={<AccountBalanceWalletOutlinedIcon sx={{color:'#000000'}}/>}>
                Connect Safe
              </Button>
              </Web3Provider>
            </Box>
          );
        }}
      </ConnectKitButton.Custom>
      {/* <p style={{ textDecoration: "underline" }}>
        Or, recover existing wallet instead ➔
      </p> */}
    </div>
  );
};

export default ConnectWallet;
