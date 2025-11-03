import { useState } from "react";
import { Select } from "../../components/ui";

export default function PlaceholderPage() {
  const [role, setRole] = useState("");

  return (
    <section className="stack" style={{ padding: "var(--space-40)" }}>
      <h2>Select test</h2>

      <Select
        label="Rol"
        value={role}
        onChange={setRole}
        options={[
          { label: "Gebruiker", value: "user" },
          { label: "Beheerder", value: "admin" },
        ]}
        helperText="Kies je rol"
      />

      <Select
        label="Met fout"
        value={role}
        onChange={setRole}
        options={[
          { label: "Optie A", value: "a" },
          { label: "Optie B", value: "b" },
        ]}
        error="Dit veld is verplicht"
      />
    </section>
  );
}
