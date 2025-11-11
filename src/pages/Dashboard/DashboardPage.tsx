import { useEffect, useId, useState } from "react";
import Header from "../../components/Layout/Header";
import Sidebar from "../../components/Layout/Sidebar";
import MapView from "./MapView";

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarId = useId();

  // Sluit automatisch bij resize naar desktop
  useEffect(() => {
    const handler = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Sluit met Escape als overlay zichtbaar is
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <section className={`dashboard ${menuOpen ? "dashboard--menu-open" : ""}`}>
      <Header onMenuToggle={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />
      <Sidebar
        id={sidebarId}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* overlay alleen mobiel/tablet */}
      <button
        className={`backdrop ${menuOpen ? "is-visible" : ""}`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
        tabIndex={-1}
      />

      <main className="dashboard__content" role="main">
        <div className="dashboard__map">
          <MapView reflowDeps={[menuOpen]} />
        </div>
      </main>
    </section>
  );
}
