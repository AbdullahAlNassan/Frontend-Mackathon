export default function Sidebar() {
  return (
    <aside className="sidebar">
      <details className="dropdown" open>
        <summary className="dropdown__summary">container</summary>
        <nav className="dropdown__list">
          <a className="dropdown__item" href="#">
            overview
          </a>
          <a className="dropdown__item" href="#">
            logs
          </a>
        </nav>
      </details>

      <details className="dropdown">
        <summary className="dropdown__summary">settings</summary>
        <nav className="dropdown__list">
          <a className="dropdown__item" href="#">
            profile
          </a>
          <a className="dropdown__item" href="#">
            preferences
          </a>
        </nav>
      </details>
    </aside>
  );
}
