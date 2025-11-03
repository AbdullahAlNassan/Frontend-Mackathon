type Option = { label: string; value: string };

interface SelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
}: SelectProps) {
  return (
    <label className="stack">
      {label && (
        <span style={{ fontSize: "var(--fs-sm)", color: "var(--color-muted)" }}>
          {label}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "var(--radius-sm)",
          background: "var(--color-surface)",
          border: `1px solid ${
            error ? "var(--color-error)" : "var(--color-border)"
          }`,
          color: "var(--color-text)",
          cursor: "pointer",
        }}
      >
        <option value="">{placeholder || "Selecteer..."}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ fontSize: "var(--fs-sm)", color: "var(--color-error)" }}>
          {error}
        </span>
      )}
    </label>
  );
}
