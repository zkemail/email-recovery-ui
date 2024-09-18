import React from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

interface SvgImageWrapperProps extends SvgIconProps {
  src: string;
}

const SvgImageWrapper: React.FC<SvgImageWrapperProps> = ({ src, ...props }) => {
  return (
    <SvgIcon {...props}>
      <image href={src} width="100%" height="100%" />
    </SvgIcon>
  );
};

export default SvgImageWrapper;
