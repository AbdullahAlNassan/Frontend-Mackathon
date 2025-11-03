import { useState } from "react";
import { Button, Modal } from "../../components/ui";

export default function PlaceholderPage() {
  const [open, setOpen] = useState(false);
  return (
    <section className="stack" style={{ padding: "var(--space-40)" }}>
      <h1>Template werkt ✅</h1>
      <p>Layout, sidebar en grid actief.</p>

      <Button onClick={() => setOpen(true)}>Open modal</Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Voorbeeld modal">
        <div className="stack">
          <p>Dit is test content in de modal.</p>
          <div className="inline">
            <Button onClick={() => setOpen(false)}>Oké</Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Annuleren
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
