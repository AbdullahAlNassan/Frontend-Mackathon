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
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? rest.name; // koppel label aan input
  const errorId = inputId ? `${inputId}-error` : undefined;
  const border = error ? "var(--color-error)" : "var(--color-border)";

  return (
    <label className="stack" htmlFor={inputId} style={{ display: "block" }}>
      {label && (
        <span style={{ fontSize: "var(--fs-sm)", color: "var(--color-muted)" }}>
          {label}
        </span>
      )}

      <input
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "var(--radius-sm)",
          background: "var(--color-surface)",
          border: `1px solid ${border}`,
          color: "var(--color-text)",
        }}
      />

      {!error && helperText && (
        <span style={{ fontSize: "var(--fs-sm)", color: "var(--color-muted)" }}>
          {helperText}
        </span>
      )}

      {error && (
        <span
          id={errorId}
          style={{ fontSize: "var(--fs-sm)", color: "var(--color-error)" }}
        >
          {error}
        </span>
      )}
    </label>
  );
}
