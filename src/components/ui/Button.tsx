import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const className = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    isLoading ? "button--loading" : "",
  ]
    .join(" ")
    .trim();

  return (
    <button
      {...rest}
      className={className}
      disabled={isLoading || disabled}
      aria-busy={isLoading || undefined}
    >
      {isLoading && <span className="button__spinner" aria-hidden />}
      {children}
    </button>
  );
}
