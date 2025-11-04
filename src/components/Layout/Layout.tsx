import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import { useState } from "react";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`layout ${menuOpen ? "layout--menu-open" : ""}`}>
      <Header onMenuToggle={() => setMenuOpen(!menuOpen)} />
      <Sidebar />
      <Content />
    </div>
  );
}
