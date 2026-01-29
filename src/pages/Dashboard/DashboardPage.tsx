import { useEffect, useId, useState } from "react";
import Header from "../../components/Layout/Header";
import Sidebar from "../../components/Layout/Sidebar";
import MapView from "./MapView";
import ContainerList from "./ContainerList";
import type { Container } from "./types";
import { Button } from "../../components/ui";
import { useNavigate } from "react-router-dom";

type BackendDevice = {
  deviceId: string;
  lastSeen: string;
  online: boolean;
  alert?: { level: "ok" | "warning" | "critical" };
  location?: { lat: number; lon: number; time: string } | null;
};

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [techEnabled, setTechEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [refreshMs, setRefreshMs] = useState(5000);
  const sidebarId = useId();
  const navigate = useNavigate();
  const apiBase =
    import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    const fetchDevices = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiBase}/devices`, {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("accessToken") ?? ""
            }`,
          },
        });

        const json = await res.json();

        const mapped: Container[] = json.data.map(
          (d: BackendDevice, index: number) => {
            let status: Container["status"] = "active";

            if (!d.online) status = "offline";
            else if (alertsEnabled && d.alert?.level === "critical")
              status = "offline";
            else if (alertsEnabled && d.alert?.level === "warning")
              status = "warning";

            return {
              id: d.deviceId,
              name: `Container ${index + 1}`,
              lat: d.location?.lat ?? 52.37,
              lng: d.location?.lon ?? 4.9,
              status,
            };
          }
        );

        setContainers(mapped);
      } catch (e) {
        console.error("Failed to fetch devices", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
    timer = setInterval(fetchDevices, refreshMs);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [refreshMs, alertsEnabled]);

  const handleContainerClick = (container: Container) => {
    navigate(`/containers/${container.id}`);
  };

  // Close sidebar on resize (desktop)
  useEffect(() => {
    const handler = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // ESC close menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) window.addEventListener("keydown", onKey);
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
        {/* Desktop / Tablet Map */}
        <div className="dashboard__map dashboard__map--desktop">
          <MapView
            containers={containers}
            onContainerClick={handleContainerClick}
            reflowDeps={[menuOpen, refreshMs, techEnabled, alertsEnabled]}
            techEnabled={techEnabled}
            alertsEnabled={alertsEnabled}
          />
        </div>

        {/* Mobile list */}
        <div className="dashboard__container-list dashboard__container-list--mobile">
          {loading ? (
            <p>Loading containers...</p>
          ) : (
            <ContainerList
              containers={containers}
              onContainerClick={handleContainerClick}
            />
          )}
        </div>
      </main>
    </section>
  );
}
