import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  isLoading?: boolean;
};

export default function Button({
  variant = "primary",
  isLoading = false,
  children,
  ...rest
}: ButtonProps) {
  const style: React.CSSProperties = {
    padding: "12px 16px", // 4px grid
    borderRadius: "var(--radius-md)",
    border: "1px solid transparent",
    background: variant === "primary" ? "var(--color-primary)" : "transparent",
    color: variant === "primary" ? "#fff" : "var(--color-text)",
    boxShadow: "var(--shadow-sm)",
    cursor: isLoading ? "default" : "pointer",
    opacity: isLoading ? 0.7 : 1,
    transition: "transform .08s ease",
  };

  return (
    <button {...rest} disabled={isLoading || rest.disabled} style={style}>
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
