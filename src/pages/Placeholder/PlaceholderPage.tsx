import { useState } from "react";
import { Input } from "../../components/ui";
export default function PlaceholderPage() {
  const [email, setEmail] = useState("");

  return (
    <section className="stack" style={{ padding: "var(--space-40)" }}>
      <h2>Input test</h2>

      <Input
        label="E-mail"
        name="email"
        type="email"
        placeholder="jij@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        helperText="Gebruik je werkmail"
      />

      <Input
        label="Wachtwoord"
        name="password"
        type="password"
        placeholder="••••••"
        error="Wachtwoord is te kort"
      />

      <Input label="Disabled veld" placeholder="Niet beschikbaar" disabled />
    </section>
  );
}
