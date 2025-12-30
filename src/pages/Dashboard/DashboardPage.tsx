import { useEffect, useId, useState } from "react";
import Header from "../../components/Layout/Header";
import Sidebar from "../../components/Layout/Sidebar";
import { Button } from "../../components/ui";
export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [techEnabled, setTechEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [refreshMs, setRefreshMs] = useState(5000);
  const sidebarId = useId();

  const grafanaIframeSrcRaw = (
    import.meta.env.VITE_GRAFANA_IFRAME_SRC ?? ""
  ).trim();

  const formatGrafanaRefresh = (ms: number) => {
    if (!Number.isFinite(ms) || ms <= 0) return "5s";
    if (ms % 60000 === 0) return `${ms / 60000}m`;
    if (ms % 1000 === 0) return `${ms / 1000}s`;
    return `${ms}ms`;
  };

  let grafanaIframeSrc: string | null = null;
  let grafanaConfigError: string | null = null;

  if (!grafanaIframeSrcRaw) {
    grafanaConfigError =
      "Grafana embed is niet geconfigureerd. Zet VITE_GRAFANA_IFRAME_SRC in je .env/.env.local en herstart `npm run dev`. (Locatie: `frontend/Frontend-Mackathon/.env.local` óf project-root `.env`.)";
  } else {
    try {
      const url = new URL(grafanaIframeSrcRaw);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Unsupported protocol");
      }
      // Let Grafana auto-refresh the panel based on the dashboard refresh setting in our UI.
      url.searchParams.set("refresh", formatGrafanaRefresh(refreshMs));
      grafanaIframeSrc = url.toString();
    } catch {
      grafanaConfigError =
        "VITE_GRAFANA_IFRAME_SRC is geen geldige http(s) URL. Tip: zet hier alleen de URL (niet een volledige <iframe ...> tag) en herstart `npm run dev`.";
    }
  }

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
      {/* comp0onemnt button */}

      <Button
        className={`backdrop ${menuOpen ? "is-visible" : ""}`}
        aria-hidden={menuOpen ? "false" : "true"}
        onClick={() => setMenuOpen(false)}
        tabIndex={-1}
      />

      <main className="dashboard__content" role="main">
        <div className="dashboard__grafana" data-tech={techEnabled} data-alerts={alertsEnabled}>
          {grafanaIframeSrc ? (
            <iframe
              className="dashboard__grafana-iframe"
              src={grafanaIframeSrc}
              title="Grafana dashboard"
              loading="lazy"
              referrerPolicy="no-referrer"
              allow="fullscreen"
            />
          ) : (
            <div className="dashboard__grafana-empty" role="status">
              <p className="dashboard__grafana-empty-title">
                Grafana dashboard niet beschikbaar
              </p>
              <p className="dashboard__grafana-empty-body">{grafanaConfigError}</p>
            </div>
          )}
        </div>
      </main>
    </section>
  );
}
