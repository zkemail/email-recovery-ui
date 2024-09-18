import { CircularProgress, Button as MuiButton, useTheme } from "@mui/material";
import React, { ReactNode } from "react";

type CustomButtonProps = {
  endIcon?: ReactNode;
  loading?: boolean;
  filled?: boolean; // Add the filled prop
} & React.ComponentPropsWithoutRef<"button">; // Ensure compatibility with standard button props

export function Button({
  children,
  endIcon,
  loading,
  filled = false,
  ...buttonProps
}: CustomButtonProps) {
  const theme = useTheme();

  return (
    <MuiButton
      sx={{
        borderColor: filled ? "transparent" : "#94969C",
        borderWidth: "1px",
        borderRadius: "26px",
        paddingX: "26px",
        paddingY: "13px",
        borderStyle: "solid",
        backgroundColor: filled ? "#FD4BA1" : "rgba(255, 255, 255, 0.87)",
        textTransform: "none",
        color: filled ? "#FFFFFF" : theme.palette.primary.main, // Set text color based on filled prop
        ":hover": {
          backgroundColor: filled ? "#FD4BA1" : "#E0F6FF", // Background color on hover
        },
        ":focus": {
          outline: "none", // Remove outline on focus
        },
        ":active": {
          outline: "none", // Remove outline on active
        },
        ":disabled": {
          backgroundColor: "#FAC5DF",
          color: "#ffffff",
        },
      }}
      fullWidth
      endIcon={loading ? <CircularProgress size={24} /> : endIcon}
      disabled={loading || buttonProps.disabled}
      {...buttonProps}
    >
      {children}
    </MuiButton>
  );
}
