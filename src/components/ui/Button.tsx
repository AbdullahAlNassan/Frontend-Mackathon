import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
};

const paddings: Record<Size, string> = {
  sm: "8px 12px",
  md: "12px 16px",
  lg: "14px 20px",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const base: React.CSSProperties = {
    padding: paddings[size],
    borderRadius: "var(--radius-md)",
    border: "1px solid transparent",
    boxShadow: "var(--shadow-sm)",
    cursor: isLoading || disabled ? "default" : "pointer",
    opacity: isLoading || disabled ? 0.7 : 1,
    transition:
      "transform .08s ease, background .12s ease, border-color .12s ease",
    userSelect: "none",
  };

  const variants: Record<Variant, React.CSSProperties> = {
    primary: {
      background: "var(--color-primary)",
      color: "#fff",
    },
    ghost: {
      background: "transparent",
      color: "var(--color-text)",
      border: "1px solid var(--color-border)",
    },
  };

  const style: React.CSSProperties = { ...base, ...variants[variant] };

  return (
    <button
      {...rest}
      disabled={isLoading || disabled}
      style={style}
      onMouseDown={(e) => {
        if (!disabled && !isLoading)
          e.currentTarget.style.transform = "scale(0.98)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {isLoading ? (
        <span style={{ display: "inline-block", transform: "translateY(2px)" }}>
          ⏳
        </span>
      ) : (
        children
      )}
    </button>
  );
}
