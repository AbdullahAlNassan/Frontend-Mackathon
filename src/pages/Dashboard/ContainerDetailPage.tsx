import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../lib/api";

type StatusRes = {
  data: { deviceId: string; online: boolean; lastSeen: string | null };
};

type AlertRes =
  | {
      data: {
        deviceId: string;
        level: "ok" | "warning" | "critical";
        reasons: string[];
        updatedAt: string;
      };
    }
  | { error: string };

type AlertHistoryRes = {
  data: {
    id: string;
    deviceId: string;
    level: "ok" | "warning" | "critical";
    reasons: string[];
    createdAt: string;
  }[];
};

type SeriesRes = {
  data: {
    time: string;
    tempInside: number | null;
    tempOutside: number | null;
    humidityInside: number | null;
  }[];
};

const GRAFANA_URL = import.meta.env.VITE_GRAFANA_URL || "http://localhost:3001";
const REFRESH_INTERVAL = 5000;

export default function ContainerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const deviceId = id ?? "";

  const [status, setStatus] = useState<StatusRes["data"] | null>(null);
  const [alert, setAlert] = useState<AlertRes | null>(null);
  const [history, setHistory] = useState<AlertHistoryRes["data"]>([]);
  const [series, setSeries] = useState<SeriesRes["data"]>([]);
  const [range, setRange] = useState<"1h" | "24h" | "7d">("24h");

  const [initialLoading, setInitialLoading] = useState(true);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh status + current alert + history every 5s
  useEffect(() => {
    if (!deviceId) return;

    let cancelled = false;

    async function loadStatusAlertAndHistory() {
      try {
        const [s, aRes, h] = await Promise.all([
          apiGet<StatusRes>(`/api/v1/devices/${deviceId}/status`),
          apiGet<AlertRes>(`/api/v1/alerts/${deviceId}`).catch(() => null),
          apiGet<AlertHistoryRes>(
            `/api/v1/alerts/${deviceId}/history?limit=50`,
          ).catch(() => ({ data: [] }) as AlertHistoryRes),
        ]);

        if (cancelled) return;

        setStatus(s.data);
        setAlert(aRes);
        setHistory(h.data);
        setError(null);
        setInitialLoading(false);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("Fout bij ophalen van gegevens");
          setInitialLoading(false);
        }
      }
    }

    loadStatusAlertAndHistory();
    const timer = setInterval(loadStatusAlertAndHistory, REFRESH_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [deviceId]);

  // Load series on init + when range changes
  useEffect(() => {
    if (!deviceId) return;

    let cancelled = false;

    async function loadSeries() {
      try {
        setSeriesLoading(true);
        const se = await apiGet<SeriesRes>(
          `/api/v1/sensor/series?deviceId=${deviceId}&range=${range}`,
        );
        if (cancelled) return;
        setSeries(se.data);
        setError(null);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("Fout bij ophalen van sensor data");
        }
      } finally {
        if (!cancelled) setSeriesLoading(false);
      }
    }

    loadSeries();
    return () => {
      cancelled = true;
    };
  }, [deviceId, range]);

  // Error state
  if (!deviceId) {
    return (
      <div className="error-state">
        <h2>Device ID ontbreekt</h2>
        <p>Ga terug naar het dashboard</p>
      </div>
    );
  }

  // Initial loading state
  if (initialLoading) {
    return (
      <div className="container-detail-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Gegevens laden...</p>
        </div>
      </div>
    );
  }

  const alertData = alert && "data" in alert ? alert.data : null;
  const alertLevel = alertData?.level ?? "ok";

  return (
    <div className="container-detail-page">
      {/* Header */}
      <div className="container-detail-header">
        <h1>Container Details</h1>
        <p className="device-id">Device ID: {deviceId}</p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="error-banner">
          <span>⚠</span>
          {error}
        </div>
      )}

      {/* Grid met cards */}
      <div className="detail-grid">
        {/* Status Card */}
        <div className="detail-card status-card">
          <h3>
            <span>●</span>
            Status
          </h3>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">Verbinding</span>
              <span
                className={`status-value ${
                  status?.online ? "online" : "offline"
                }`}
              >
                <span className="status-icon">
                  {status?.online ? "●" : "○"}
                </span>
                {status?.online ? "Online" : "Offline"}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Laatst gezien</span>
              <span className="last-seen">
                {status?.lastSeen
                  ? new Date(status.lastSeen).toLocaleString("nl-NL")
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Alert Card */}
        <div className={`detail-card alert-card level-${alertLevel}`}>
          <h3>
            <span>!</span>
            Meldingen
          </h3>
          {alertData ? (
            <>
              <div className={`alert-level ${alertLevel}`}>
                {alertLevel === "ok" && "✓ Alles OK"}
                {alertLevel === "warning" && "! Waarschuwing"}
                {alertLevel === "critical" && "× Kritiek"}
              </div>

              {alertData.reasons && alertData.reasons.length > 0 && (
                <ul className="alert-reasons">
                  {alertData.reasons.map((reason: string, i: number) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              )}

              <div className="alert-timestamp">
                Bijgewerkt:{" "}
                {new Date(alertData.updatedAt).toLocaleString("nl-NL")}
              </div>
            </>
          ) : (
            <div className="no-alert">Geen actieve meldingen</div>
          )}
        </div>

        {/* Alert History Card */}
        <div className="detail-card alert-history-card">
          <h3>
            <span>↻</span>
            Historie
          </h3>

          {history.length === 0 ? (
            <div className="no-alert">Geen historie events</div>
          ) : (
            <ul className="history-list">
              {history.slice(0, 20).map((ev) => (
                <li key={ev.id} className={`history-item level-${ev.level}`}>
                  <div className="history-top">
                    <span className={`badge badge-${ev.level}`}>
                      {ev.level}
                    </span>
                    <span className="history-time">
                      {new Date(ev.createdAt).toLocaleString("nl-NL")}
                    </span>
                  </div>

                  {ev.reasons?.length ? (
                    <ul className="history-reasons">
                      {ev.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Series Card (full width) */}
        <div className="detail-card series-card">
          <h3>
            <span>📊</span>
            Sensor Data
          </h3>

          <div className="range-selector">
            <button
              className={`range-button ${range === "1h" ? "active" : ""}`}
              onClick={() => setRange("1h")}
              disabled={seriesLoading}
            >
              Laatste uur
            </button>
            <button
              className={`range-button ${range === "24h" ? "active" : ""}`}
              onClick={() => setRange("24h")}
              disabled={seriesLoading}
            >
              Laatste 24 uur
            </button>
            <button
              className={`range-button ${range === "7d" ? "active" : ""}`}
              onClick={() => setRange("7d")}
              disabled={seriesLoading}
            >
              Laatste 7 dagen
            </button>
          </div>

          {seriesLoading && (
            <div className="series-loading">
              <div className="spinner-small"></div>
              <span>Data laden...</span>
            </div>
          )}

          <div className="data-summary">
            <span className="summary-label">Totaal datapunten:</span>
            <span className="summary-value">{series.length}</span>
          </div>

          {/* Grafana Chart */}
          <div className="chart-container">
            <iframe
              title="Grafana Chart"
              src={`${GRAFANA_URL}/d-solo/adh8jq6/new-dashboard?orgId=1&from=now-${range}&to=now&timezone=browser&var-deviceId=${deviceId}&panelId=2`}
              width="100%"
              height={400}
              frameBorder={0}
            />
          </div>

          {/* Grafana Table */}
          <div className="table-container">
            <iframe
              title="Grafana Table"
              src={`${GRAFANA_URL}/d-solo/adh8jq6/new-dashboard?orgId=1&from=now-${range}&to=now&timezone=browser&var-deviceId=${deviceId}&panelId=1`}
              width="100%"
              height={420}
              frameBorder={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
