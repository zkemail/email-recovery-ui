import React, { ReactNode } from "react";

type ButtonProps = {
  endIcon?: ReactNode;
  loading?: boolean;
} & React.ComponentPropsWithoutRef<"button">;

export function Button({ children, endIcon, loading, ...buttonProps }: ButtonProps) {
  return (
    <div className="button">
      <button {...buttonProps}>
        {children}
        {endIcon ? endIcon : null}
        {loading ? <div className="loader" /> : null}
      </button>
    </div>
  );
}
