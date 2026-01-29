import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import { useState } from "react";
import type { ReactNode } from "react";

type LayoutProps = {
  children?: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarId = "app-sidebar";

  return (
    <div className={`layout ${menuOpen ? "layout--menu-open" : ""}`}>
      <Header
        onMenuToggle={() => setMenuOpen((v) => !v)}
        menuOpen={menuOpen}
      />
      <Sidebar
        id={sidebarId}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <Content>{children}</Content>
    </div>
  );
}
