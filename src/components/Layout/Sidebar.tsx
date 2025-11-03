export default function Sidebar() {
  return (
    <aside
      className="surface border"
      style={{
        padding: "var(--space-24)",
        minWidth: 220,
      }}
    >
      <nav className="stack" style={{ fontSize: "var(--fs-sm)" }}>
        <strong style={{ fontSize: "var(--fs-md)" }}>Menu</strong>
        <a href="#">Dashboard</a>
        <a href="#">Instellingen</a>
        <a href="#">Help</a>
      </nav>
    </aside>
  );
}
