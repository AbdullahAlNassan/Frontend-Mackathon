import { useEffect, useId, useState } from "react";
import Header from "../../components/Layout/Header";
import Sidebar from "../../components/Layout/Sidebar";
import MapView from "./MapView";
import ContainerList from "./ContainerList";
import type { Container } from "./types";
import { Button } from "../../components/ui";
export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [techEnabled, setTechEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [refreshMs, setRefreshMs] = useState(5000);
  const sidebarId = useId();

  // we can replace this later with api
  const [containers, setContainers] = useState<Container[]>([
    { id: 1, name: "Container 1", lat: 52.37, lng: 4.9, status: "active" },
    { id: 2, name: "Container 2", lat: 52.375, lng: 4.91, status: "active" },
    { id: 3, name: "Container 3", lat: 52.365, lng: 4.89, status: "warning" },
    { id: 4, name: "Container 4", lat: 52.38, lng: 4.92, status: "offline" },
    { id: 5, name: "Container 5", lat: 52.36, lng: 4.88, status: "active" },
  ]);

  //  Fetch containers from b
  useEffect(() => {
    // Example:
    // fetch('/api/containers')
    //   .then(res => res.json())
    //   .then(data => setContainers(data));
  }, [refreshMs]); // Re-fetch when refresh interval changes

  const handleContainerClick = (container: Container) => {
    // TODO: Navigate to Grafana or detail page (later)
    console.log("Container clicked:", container);
    // Example: window.location.href = `/grafana/${container.id}`;
    // Or: navigate(`/container/${container.id}`);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    if (menuOpen) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <section className={`dashboard ${menuOpen ? "dashboard--menu-open" : ""}`}>
      <Header
        onMenuToggle={() => setMenuOpen((v) => !v)}
        menuOpen={menuOpen}
        onTechChange={setTechEnabled}
        onAlertChange={setAlertsEnabled}
        onRefreshChange={setRefreshMs}
      />

      <Sidebar
        id={sidebarId}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <Button
        className={`backdrop ${menuOpen ? "is-visible" : ""}`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
        tabIndex={-1}
      />

      <main className="dashboard__content" role="main">
        {/* Desktop +tablet : Map met markers */}
        <div className="dashboard__map dashboard__map--desktop">
          <MapView
            containers={containers}
            onContainerClick={handleContainerClick}
            reflowDeps={[menuOpen, refreshMs, techEnabled, alertsEnabled]}
            techEnabled={techEnabled}
            alertsEnabled={alertsEnabled}
          />
        </div>

        {/* Mobile: Container list */}
        <div className="dashboard__container-list dashboard__container-list--mobile">
          <ContainerList
            containers={containers}
            onContainerClick={handleContainerClick}
          />
        </div>
      </main>
    </section>
  );
}
