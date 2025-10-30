import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
};

export default function Checkbox({ label, error, ...rest }: CheckboxProps) {
  return (
    <label
      className="inline"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-8)",
        cursor: "pointer",
      }}
    >
      <input
        {...rest}
        type="checkbox"
        style={{
          width: 18,
          height: 18,
          accentColor: "var(--color-primary)",
          borderRadius: "var(--radius-sm)",
        }}
      />
      {label && <span>{label}</span>}
      {error && (
        <span
          style={{
            fontSize: "var(--fs-sm)",
            color: "var(--color-error)",
            marginLeft: "var(--space-8)",
          }}
        >
          {error}
        </span>
      )}
    </label>
  );
}
