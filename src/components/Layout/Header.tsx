import { useState } from "react";
import { useClock } from "../../composables/useClock";
import { HiMenuAlt2 } from "react-icons/hi";
import { MdLogout } from "react-icons/md";
import logo from "../../assets/images/logo.png";
import { Button } from "../ui";
import { useAuth } from "../../hooks";
type HeaderProps = {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
  onTechChange?: (enabled: boolean) => void;
  onAlertChange?: (enabled: boolean) => void;
  onRefreshChange?: (ms: number) => void;
};

export default function Header({
  onMenuToggle,
  menuOpen,
  onTechChange,
  onAlertChange,
  onRefreshChange,
}: HeaderProps) {
  const [tech, setTech] = useState(true);
  const [alert, setAlert] = useState(true);
  const [refreshMs, setRefreshMs] = useState(5000);
  const time = useClock(30000);

  const handleTechToggle = () => {
    const newValue = !tech;
    setTech(newValue);
    onTechChange?.(newValue);
  };

  const handleAlertToggle = () => {
    const newValue = !alert;
    setAlert(newValue);
    onAlertChange?.(newValue);
  };

  const handleRefreshChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    setRefreshMs(newValue);
    onRefreshChange?.(newValue);
  };

  const { logout } = useAuth();

  return (
    <header className="header">
      <div className="header__left">
        {/* driodown button */}
        {onMenuToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="header__menu-btn"
            leftIcon={<HiMenuAlt2 />}
            aria-label="Menu"
          />
        )}

        {/* Logo  IMAGE */}
        <div className="header__logo-group">
          <img src={logo} alt="Mackathon logo" className="header__logo-img" />
          <strong className="header__brand"></strong>
        </div>
      </div>

      <div className="header__right">
        {/* Tech Toggle Switch - */}
        <label className="toggle-switch">
          <span className="toggle-switch__label">tech</span>
          <input
            type="checkbox"
            checked={tech}
            onChange={handleTechToggle}
            aria-label="Tech toggle"
          />
          <span className="toggle-switch__slider"></span>
        </label>

        {/* Alert Toggle Switch - */}
        <label className="toggle-switch">
          <span className="toggle-switch__label">alert</span>
          <input
            type="checkbox"
            checked={alert}
            onChange={handleAlertToggle}
            aria-label="Alert toggle"
          />
          <span className="toggle-switch__slider"></span>
        </label>

        {/* Tijd dropdown - alleen desktop */}
        <select
          className="time-select"
          value={refreshMs}
          onChange={handleRefreshChange}
          aria-label="Refresh interval"
        >
          <option value={2000}>2 sec</option>
          <option value={5000}>5 sec</option>
          <option value={10000}>10 sec</option>
        </select>

        {/* Time*/}
        <span className="time" aria-label="tijd">
          {time}
        </span>

        {/* Logout  with componemnt*/}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="logout"
          leftIcon={<MdLogout />}
          aria-label="Log uit"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
