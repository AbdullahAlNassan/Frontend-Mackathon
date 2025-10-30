import { useState } from "react";

type Option = { label: string; value: string };

interface SelectProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export default function Select({
  label,
  options,
  placeholder,
  onChange,
}: SelectProps) {
  const [selected, setSelected] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setSelected(value);
    onChange?.(value);
  }

  return (
    <label className="stack">
      {label && (
        <span style={{ fontSize: "var(--fs-sm)", color: "var(--color-muted)" }}>
          {label}
        </span>
      )}
      <select
        value={selected}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "var(--radius-sm)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text)",
          cursor: "pointer",
        }}
      >
        <option value="" disabled>
          {placeholder || "Selecteer..."}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
