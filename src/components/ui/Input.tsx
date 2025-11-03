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
  name,
  ...rest
}: InputProps) {
  const inputId = id ?? name ?? undefined;
  const errorId = inputId ? `${inputId}-error` : undefined;

  return (
    <label className="input" htmlFor={inputId}>
      {label && <span className="input__label">{label}</span>}

      <input
        id={inputId}
        className={`input__control ${error ? "input__control--error" : ""}`}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />

      {!error && helperText && (
        <span className="input__hint">{helperText}</span>
      )}
      {error && (
        <span id={errorId} className="input__error">
          {error}
        </span>
      )}
    </label>
  );
}
