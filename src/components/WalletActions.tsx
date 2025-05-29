import { Box, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Button } from "./Button";
import ConnectionInfoCard from "./ConnectionInfoCard";
import { StepsContext } from "../App";
import { STEPS } from "../constants";

const WalletActions = () => {
  const stepsContext = useContext(StepsContext);
  const [guardianEmail, setGuardianEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedGuardianEmail = localStorage.getItem("guardianEmail");
    if (storedGuardianEmail) {
      setGuardianEmail(storedGuardianEmail);
    }
  }, []);

  return (
    <Box
      sx={{
        textAlign: "center",
        marginX: "auto",
        maxWidth: "600px",
        padding: "2rem",
      }}
    >
      <Typography variant="h2" sx={{ paddingBottom: "1rem" }}>
        Wallet Actions
      </Typography>
      <ConnectionInfoCard />
      <Typography variant="body1" sx={{ color: "text.secondary" }}>
        Manage your wallet actions and recovery options.
      </Typography>
      <Grid
        container
        direction="column"
        justifyContent={"center"}
        alignItems={"center"}
        gap="1rem"
      >
        {guardianEmail && (
          <Grid item>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Guardian Email: {guardianEmail}
            </Typography>
          </Grid>
        )}
        <Grid item>
          <Button
            variant="outlined"
            onClick={() => stepsContext?.setStep(STEPS.REQUESTED_RECOVERIES)}
          >
            Trigger Recovery
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WalletActions;
