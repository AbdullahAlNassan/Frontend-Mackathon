import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  className: customClassName,
  ...rest
}: ButtonProps) {
  const baseClasses = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    isLoading && "button--loading",
    fullWidth && "button--full-width",
    customClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <button
      {...rest}
      className={baseClasses}
      disabled={isLoading || disabled}
      aria-busy={isLoading || undefined}
    >
      {isLoading ? (
        <span className="button__spinner" aria-hidden="true">
          <svg className="button__spinner-icon" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="32"
              strokeDashoffset="32"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="32;0"
                dur="1s"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      ) : (
        <>
          {leftIcon && (
            <span className="button__icon button__icon--left">{leftIcon}</span>
          )}
          {children && <span className="button__content">{children}</span>}
          {rightIcon && (
            <span className="button__icon button__icon--right">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
}
