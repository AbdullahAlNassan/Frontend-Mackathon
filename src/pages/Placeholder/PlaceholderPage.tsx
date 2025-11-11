import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Modal } from "../../components/ui";
import type { User } from "../../types/auth";

export default function PlaceholderPage() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const user = location.state?.user as User;

  return (
    <section className="stack" style={{ padding: "var(--space-40)" }}>
      {/* Toon user info */}
      {user && (
        <div className="user-info" style={{ 
          background: "var(--color-surface)", 
          padding: "var(--space-16)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
          marginBottom: "var(--space-24)"
        }}>
          <h3>Ingelogd als:</h3>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Gebruiker:</strong> {user.username}</p>
          <p><strong>Rol:</strong> {user.role}</p>
        </div>
      )}

      <h1>Dashboard</h1>
      <p>Welkom op het dashboard! Je bent succesvol ingelogd.</p>
      
      <Button onClick={() => setOpen(true)}>Open modal</Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Voorbeeld modal">
        <p>Dit is content in de modal.</p>
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