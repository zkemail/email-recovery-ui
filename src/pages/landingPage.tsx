import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import KeyIcon from "@mui/icons-material/Key";
import { Grid, Typography, useTheme } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../App.css";
import { StepsContext } from "../App";
import FlowInfoCard from "../components/FlowsInfoCard";
import { STEPS } from "../constants";

type actionType = "BURNER_WALLET" | "EOA_7702_WALLET";

const LandingPage = () => {
  const theme = useTheme();

  const stepsContext = useContext(StepsContext);

  const navigate = useNavigate();

  const handleClick = async (action: actionType) => {
    await stepsContext?.setStep(STEPS.CONNECT_WALLETS);

    switch (action) {
      case "BURNER_WALLET":
        return navigate("/burner-wallet");
      case "EOA_7702_WALLET":
        return navigate("/7702-eoa-wallet");

      default:
        break;
    }
  };

  return (
    <div className="bg-white h-full">
      <Grid sx={{ marginBottom: "2rem" }}>
        <Typography variant="h1">Email Recovery Demo</Typography>
        <Typography
          sx={{
            color: theme.palette.secondary.main,
            paddingTop: "15px",
            fontWeight: "medium",
            lineHeight: "140%",
          }}
        >
          Assigned Guardians must reply back to an email to enable wallet
          recovery to a new address.
        </Typography>
      </Grid>

      <Grid container>
        <Grid item container xs={12} justifyContent={"center"} gap={3}>
          {/* Passkey EOA (EIP-7702) */}
          <FlowInfoCard
            icon={
              <KeyIcon
                sx={{
                  width: "2.25rem",
                  height: "2.25rem",
                  color: "#000000",
                }}
              />
            }
            buttonText={"Try Passkey Flow"}
            handleButtonClick={() => handleClick("EOA_7702_WALLET")}
            title={"Passkey"}
            description={
              "Control an existing EOA wallet with a passkey. This flow uses EIP-7702 to enable smart account features like social recovery."
            }
            infoIconTitle={"EIP-7702: Passkey-Controlled EOA"}
            infoIconDescription={
              "This flow demonstrates how EIP-7702 allows a passkey to authorize transactions for your EOA. You can set up guardians to recover access, combining the simplicity of passkeys with the security of social recovery."
            }
          />
          {/* TEST WALLET */}
          <FlowInfoCard
            icon={
              <AccountBalanceWalletOutlinedIcon
                sx={{
                  width: "2.25rem",
                  height: "2.25rem",
                  color: "#000000",
                }}
              />
            }
            buttonText={"Burner Safe Flow (v1.4.1)"}
            handleButtonClick={() => handleClick("BURNER_WALLET")}
            title={"Test Wallet"}
            description={
              "A burner wallet is a temporary crypto wallet for quick, low-value transactions, ideal for short-term use, events, or testing, with minimal security."
            }
            infoIconTitle={"Test Wallet Recovery Setup"}
            infoIconDescription={
              "Test out our setup and recovery flow with a test wallet."
            }
          />
        </Grid>

        {/*  PROMPT TO CONTACT IF U WANT ANOTHER WALLET AT BOTTOM*/}
        <Grid item xs={12} style={{ marginTop: "1rem" }}>
          <Typography>
            Want us to setup account recovery for a different wallet?&nbsp;
            <Link
              to="https://t.me/zkemail"
              target="_blank"
              style={{ fontWeight: "bold" }}
            >
              Contact Us!
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default LandingPage;
