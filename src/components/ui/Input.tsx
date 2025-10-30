import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: ReactNode;
};

export default function Input({
  label,
  error,
  helperText,
  ...rest
}: InputProps) {
  const border = error ? "var(--color-error)" : "var(--color-border)";

  return (
    <label className="stack" style={{ display: "block" }}>
      {label && (
        <span style={{ fontSize: "var(--fs-sm)", color: "var(--color-muted)" }}>
          {label}
        </span>
      )}
      <input
        {...rest}
        style={{
          width: "100%",
          padding: "12px 14px", // 4px grid
          borderRadius: "var(--radius-sm)",
          background: "var(--color-surface)",
          border: `1px solid ${border}`,
          color: "var(--color-text)",
        }}
      />
      {helperText && !error && (
        <span style={{ fontSize: "var(--fs-sm)", color: "var(--color-muted)" }}>
          {helperText}
        </span>
      )}
      {error && (
        <span style={{ fontSize: "var(--fs-sm)", color: "var(--color-error)" }}>
          {error}
        </span>
      )}
    </label>
  );
}
