import { Box, Grid, Tooltip, Typography } from "@mui/material";
import React from "react";
import { Button } from "../components/Button";
import "../App.css";
import MoreInfoDialog from "../components/MoreInfoDialog";

type FlowInfoCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  infoIconTitle: string;
  infoIconDescription: string;
  buttonText: string;
  isButtonDisabled?: boolean;
  handleButtonClick: () => void;
};

const FlowInfoCard = ({
  icon,
  title,
  description,
  infoIconTitle,
  infoIconDescription,
  buttonText,
  isButtonDisabled,
  handleButtonClick,
}: FlowInfoCardProps) => {
  return (
    <Grid
      item
      xs={12}
      md={4}
      sx={{
        background: "#FFFFFF",
        border: "1px solid #DDDDDD",
        borderRadius: "18px",
        padding: "1rem",
        maxWidth: "30rem",
      }}
    >
      <Box sx={{ position: "absolute", top: "10px", right: "12px" }}>
        <MoreInfoDialog title={infoIconTitle} message={infoIconDescription} />
      </Box>
      {icon}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "medium",
          letterSpacing: -2,
          paddingBottom: "10px",
          paddingTop: "10px",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: "#848281",
          fontWeight: "regular",
          fontSize: {
            xxs: "13px",
            xs: "13px",
            sm: "13px",
            md: "16px",
          },
          paddingBottom: "14px",
          px: "15px",
        }}
      >
        {description}
      </Typography>
      <Box margin="auto">
        <Tooltip title="Under Audit" placement="bottom">
          <span>
            <Button
              onClick={handleButtonClick}
              disabled={isButtonDisabled ?? false}
            >
              {buttonText}
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Grid>
  );
};

export default FlowInfoCard;
