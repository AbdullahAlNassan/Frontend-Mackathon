import { useState } from "react";
import { Select } from "../../components/ui";

export default function PlaceholderPage() {
  const [role, setRole] = useState(""); // 👈 HIER maak je de 'role' variabele

  return (
    <section className="stack" style={{ padding: "var(--space-40)" }}>
      <h1>Test Select Component</h1>

      <Select
        label="Rol"
        value={role}
        onChange={setRole}
        options={[
          { label: "Gebruiker", value: "user" },
          { label: "Beheerder", value: "admin" },
        ]}
      />

      <p>Geselecteerde rol: {role || "geen"}</p>
    </section>
  );
}
