export default function Header() {
  return (
    <header
      className="surface border"
      style={{
        padding: "var(--space-16) var(--space-24)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <strong>AppName</strong>
      <nav style={{ fontSize: "var(--fs-sm)", color: "var(--color-muted)" }}>
        {/* plaats voor links */}
      </nav>
    </header>
  );
}
