import type { SelectHTMLAttributes } from "react";

type Option = {
  label: string;
  value: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
};

export default function Select({
  label,
  options,
  error,
  helperText,
  value,
  onChange,
  name,
  id,
  disabled,
  ...rest
}: SelectProps) {
  const selectId = id ?? name;
  const errorId = selectId ? `${selectId}-error` : undefined;

  return (
    <label className="select" htmlFor={selectId}>
      {label && <span className="select__label">{label}</span>}

      <select
        id={selectId}
        name={name}
        className={`select__control ${error ? "select__control--error" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {!error && helperText && (
        <span className="select__hint">{helperText}</span>
      )}
      {error && (
        <span id={errorId} className="select__error">
          {error}
        </span>
      )}
    </label>
  );
}