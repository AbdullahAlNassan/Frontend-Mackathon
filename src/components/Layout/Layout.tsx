import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import { useId, useState } from "react";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarId = useId();

  return (
    <div className={`layout ${menuOpen ? "layout--menu-open" : ""}`}>
      <Header
        onMenuToggle={() => setMenuOpen((v) => !v)}
        menuOpen={menuOpen}
      />
      <Sidebar id={sidebarId} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Content />
    </div>
  );
}
