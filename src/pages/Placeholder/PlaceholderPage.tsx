import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Modal } from "../../components/ui";
import type { User } from "../../types/auth";

export default function PlaceholderPage() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const user = location.state?.user as User | undefined;

  const summary = useMemo(
    () =>
      user
        ? [
            { label: "ID", value: user.id },
            { label: "Gebruiker", value: user.username },
            { label: "Rol", value: user.role },
          ]
        : [],
    [user]
  );

  return (
    <section className="stack dashboard-page">
      {summary.length > 0 && (
        <section className="dashboard-page__summary">
          <h2>Ingelogd als</h2>
          <ul>
            {summary.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="dashboard-page__content">
        <h1>Dashboard</h1>
        <p>Welkom op het dashboard. Gebruik dit scherm om verder te bouwen.</p>

        <Button onClick={() => setOpen(true)}>Toon voorbeeldmodal</Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Voorbeeld">
        <p>Je kunt deze modal vullen met inhoud naar keuze.</p>
        <div className="inline">
          <Button onClick={() => setOpen(false)}>Oké</Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Annuleren
          </Button>
        </div>
      </Modal>
    </section>
  );
}