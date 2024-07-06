import React, { ReactNode } from "react";

type ButtonProps = {
  endIcon?: ReactNode;
  loading?: boolean;
  tooltipText?: string;
} & React.ComponentPropsWithoutRef<"button">;

export function Button({
  children,
  endIcon,
  tooltipText,
  loading,
  ...buttonProps
}: ButtonProps) {
  return (
    <div className="tooltip">
      {tooltipText ? <span className="tooltiptext">{tooltipText}</span>: null}
      <div className="button">
        <button {...buttonProps}>
          {children}
          {endIcon ? endIcon : null}
          {loading ? <div className="loader" /> : null}
        </button>
      </div>
    </div>
  );
}
