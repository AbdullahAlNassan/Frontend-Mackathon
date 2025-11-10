import { Button } from "../ui";
import { useState } from "react";
import { useClock } from "../../composables/useClock";
type HeaderProps = { onMenuToggle?: () => void };

export default function Header({ onMenuToggle }: HeaderProps) {
  const [tech, setTech] = useState(false);
  const [alert, setAlert] = useState(false);
  const time = useClock(30000);

  return (
    <header className="header">
      <div className="header__left">
        {onMenuToggle && (
          <Button
            variant="ghost"
            className="header__menu-btn"
            onClick={onMenuToggle}
            aria-label="open menu"
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
        <button className="time" aria-label="tijd">
          {time}
        </button>
        <button className="logout" onClick={() => console.log("logout")}>
          logout
        </button>
      </div>
    </header>
  );
}
