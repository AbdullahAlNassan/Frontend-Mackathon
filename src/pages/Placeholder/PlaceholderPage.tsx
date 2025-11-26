import { Loader } from "../../components/ui";
export default function LoaderTest() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Loader Test</h1>

      {/* Circular */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Circular (draaiende cirkel)</h2>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Loader variant="circular" size="sm" />
          <Loader variant="circular" size="md" />
          <Loader variant="circular" size="lg" />
        </div>
      </section>

      {/* Dots */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Dots (stuiterende stippen)</h2>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Loader variant="dots" size="sm" />
          <Loader variant="dots" size="md" />
          <Loader variant="dots" size="lg" />
        </div>
      </section>

      {/* Pulse */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Pulse (pulserende cirkel)</h2>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Loader variant="pulse" size="sm" />
          <Loader variant="pulse" size="md" />
          <Loader variant="pulse" size="lg" />
        </div>
      </section>

      {/* Met label */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Met Label</h2>
        <Loader variant="circular" label="Bezig met laden..." />
      </section>

      {/* Default */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Default (geen props)</h2>
        <Loader />
      </section>

      {/* In een card */}
      <section style={{ marginBottom: "32px" }}>
        <h2>In Card</h2>
        <div
          style={{
            padding: "48px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            backgroundColor: "#f9fafb",
          }}
        >
          <Loader variant="dots" size="lg" />
          <p style={{ margin: 0, color: "#6b7280" }}>Laden van data...</p>
        </div>
      </section>

      {/* Met tekst inline */}
      <section>
        <h2>Inline met tekst</h2>
        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Loader size="sm" />
          <span>Bezig met verwerken...</span>
        </p>
      </section>
    </div>
  );
}
