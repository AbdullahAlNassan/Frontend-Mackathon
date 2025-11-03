import { useState } from "react";
import { Select, Button } from "../../components/ui";

export default function PlaceholderPage() {
  const [role, setRole] = useState(""); // 👈 HIER maak je de 'role' variabele

  return (
    <section>
      <Button variant="primary" size="md">
        Opslaan
      </Button>
      <Button variant="ghost" size="sm">
        Annuleren
      </Button>
      <Button size="lg" isLoading>
        Opslaan...
      </Button>
      <Button disabled>Disabled</Button>
    </section>
  );
}
