import { useState } from "react";
import { Button, Modal } from "../../components/ui";
export default function PlaceholderPage() {
  const [open, setOpen] = useState(false);

  return (
    <section className="stack" style={{ padding: "var(--space-40)" }}>
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
