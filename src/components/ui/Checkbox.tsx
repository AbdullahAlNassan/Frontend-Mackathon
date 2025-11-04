import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
};

export default function Checkbox({
  label,
  error,
  id,
  name,
  ...rest
}: CheckboxProps) {
  const inputId = id ?? name ?? undefined;
  const errorId = inputId ? `${inputId}-error` : undefined;

  return (
    <label className="checkbox" htmlFor={inputId}>
      <input
        id={inputId}
        type="checkbox"
        className={`checkbox__control ${
          error ? "checkbox__control--error" : ""
        }`}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {label && <span className="checkbox__label">{label}</span>}
      {error && (
        <span id={errorId} className="checkbox__error">
          {error}
        </span>
      )}
    </label>
  );
}
