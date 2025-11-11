import { Button } from "../ui";
import { useId, useState } from "react";
import { useClock } from "../../composables/useClock";

type HeaderProps = {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
};

export default function Header({ onMenuToggle, menuOpen }: HeaderProps) {
  const [tech, setTech] = useState(false);
  const [alert, setAlert] = useState(false);
  const time = useClock(30000);
  const sidebarId = useId();

  return (
    <header className="header">
      <div className="header__left">
        {onMenuToggle && (
          <Button
            variant="ghost"
            className="header__menu-btn"
            onClick={onMenuToggle}
            aria-label={menuOpen ? "Sluit menu" : "Open menu"}
            aria-controls={sidebarId}
            aria-expanded={!!menuOpen}
          >
            ☰
          </Button>
        )}
        <span className="header__logo" aria-label="logo">
          🛰️
        </span>
        <strong className="header__brand">Mackathon</strong>
      </div>

      <div className="header__right">
        <button
          className={`toggle ${tech ? "toggle--active" : ""}`}
          aria-pressed={tech}
          onClick={() => setTech((v) => !v)}
        >
          tech
        </button>
        <button
          className={`toggle ${alert ? "toggle--active" : ""}`}
          aria-pressed={alert}
          onClick={() => setAlert((v) => !v)}
        >
          alert
        </button>

        <span className="time" aria-label="tijd">
          {time}
        </span>

        <button
          className="logout"
          onClick={() => console.log("logout")}
          aria-label="Log uit"
        >
          logout
        </button>
      </div>
    </header>
  );
}
