import { GoContainer } from "react-icons/go";
import { IoMdSettings } from "react-icons/io";
import { HiOutlineDocumentText, HiOutlineChartBar } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { MdColorLens } from "react-icons/md";

type SidebarProps = {
  id: string;
  open: boolean;
  onClose?: () => void;
};

export default function Sidebar({ id, open, onClose }: SidebarProps) {
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
        {/* Container dropdown */}
        <details className="dropdown" open>
          <summary className="dropdown__summary">
            <GoContainer className="dropdown__icon" />
            <span className="dropdown__title">Container</span>
            <span className="dropdown__arrow">›</span>
          </summary>
          <div className="dropdown__content">
            <a className="dropdown__item" href="#">
              <HiOutlineChartBar className="dropdown__item-icon" />
              Overview
            </a>
            <a className="dropdown__item" href="#">
              <HiOutlineDocumentText className="dropdown__item-icon" />
              Logs
            </a>
          </div>
        </details>

        {/* Settings dropdown */}
        <details className="dropdown">
          <summary className="dropdown__summary">
            <IoMdSettings className="dropdown__icon" />
            <span className="dropdown__title">Settings</span>
            <span className="dropdown__arrow">›</span>
          </summary>
          <div className="dropdown__content">
            <a className="dropdown__item" href="#">
              <FiUser className="dropdown__item-icon" />
              Profile
            </a>
            <a className="dropdown__item" href="#">
              <MdColorLens className="dropdown__item-icon" />
              Preferences
            </a>
          </div>
        </details>
      </nav>

      {/* optinial if we want to add email and profile info to the down . */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">
            <FiUser />
          </div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">Admin User</div>
            <div className="sidebar__user-email">admin@example.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
