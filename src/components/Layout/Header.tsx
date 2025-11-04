import { Button } from "../ui";
type HeaderProps = {
  onMenuToggle: () => void;
};

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="header">
      <Button
        variant="ghost"
        className="header__menu-btn"
        onClick={onMenuToggle}
      >
        ☰
      </Button>
      <h1 className="header__title">Dashboard</h1>
    </header>
  );
}
