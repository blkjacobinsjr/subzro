import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import "./AppButton.css";

// BoardUI's native button composition, adapted to React 18 and this app's tokens.
export const AppButton = forwardRef(function AppButton({
  variant = "primary",
  size = "medium",
  iconOnly = false,
  leadingIcon: Leading,
  trailingIcon: Trailing,
  children,
  className = "",
  type = "button",
  ...props
}, ref) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-icon-only={iconOnly || undefined}
      className={twMerge("app-button inline-flex items-center justify-center gap-2", className)}
    >
      {Leading && <Leading className="app-button__icon" aria-hidden="true" />}
      {!iconOnly && children != null && <span className="app-button__label">{children}</span>}
      {!iconOnly && Trailing && <Trailing className="app-button__icon" aria-hidden="true" />}
    </button>
  );
});
