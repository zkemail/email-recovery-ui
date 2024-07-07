// import React, { ReactNode } from "react";

// type ButtonProps = {
//   endIcon?: ReactNode;
//   loading?: boolean;
//   tooltipText?: string;
// } & React.ComponentPropsWithoutRef<"button">;

// export function Button({
//   children,
//   endIcon,
//   tooltipText,
//   loading,
//   ...buttonProps
// }: ButtonProps) {
//   return (
//     <div className="tooltip">
//       {tooltipText ? <span className="tooltiptext">{tooltipText}</span>: null}
//       <div className="button">
//         <button {...buttonProps}>
//           {children}
//           {endIcon ? endIcon : null}
//           {loading ? <div className="loader" /> : null}
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { ReactNode } from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress, useTheme } from "@mui/material";

type ButtonProps = {
  endIcon?: ReactNode;
  loading?: boolean;
  filled?: boolean; // Add the filled prop
} & MuiButtonProps;

export function Button({ children, endIcon, loading, filled = false, ...buttonProps }: ButtonProps) {
  const theme = useTheme();

  return (
    <MuiButton 
      sx={{
        width: '100%', // Make the button take the full width of its container
        borderColor: filled ? 'transparent' : '#94969C', 
        borderWidth: '1px', 
        borderRadius: '26px',
        paddingX: '26px',
        paddingY: '13px',
        borderStyle: 'solid', 
        backgroundColor: filled ? '#FD4BA1' : 'rgba(255, 255, 255, 0.87)',
        textTransform: 'none',
        color: filled ? '#FFFFFF' : theme.palette.primary.main, // Set text color based on filled prop
        ':hover': {
          backgroundColor: filled ? '#FD4BA1' : '#E0F6FF', // Background color on hover
        },
        ':focus': {
          outline: 'none', // Remove outline on focus
        },
        ':active': {
          outline: 'none', // Remove outline on active
        },
      }}
      {...buttonProps}
      endIcon={loading ? <CircularProgress size={24} /> : endIcon}
      disabled={loading || buttonProps.disabled}
    >
      {children}
    </MuiButton>
  );
}
