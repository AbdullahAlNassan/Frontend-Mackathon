type SidebarProps = {
  id: string;
  open: boolean;
  onClose?: () => void;
};

export default function Sidebar({ id, open, onClose }: SidebarProps) {
  // ESC sluit het menu op mobiel
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape" && open) onClose?.();
  }

  return (
    <aside
      id={id}
      className={`sidebar ${open ? "is-open" : ""}`}
      aria-hidden={!open}
      onKeyDown={onKeyDown}
    >
      <nav aria-label="Primaire navigatie" className="sidebar__nav">
        <details className="dropdown" open>
          <summary className="dropdown__summary">container</summary>
          <div className="dropdown__list" role="list">
            <a className="dropdown__item" href="#">
              overview
            </a>
            <a className="dropdown__item" href="#">
              logs
            </a>
          </div>
        </details>

        <details className="dropdown">
          <summary className="dropdown__summary">settings</summary>
          <div className="dropdown__list" role="list">
            <a className="dropdown__item" href="#">
              profile
            </a>
            <a className="dropdown__item" href="#">
              preferences
            </a>
          </div>
        </details>
      </nav>
    </aside>
  );
}
