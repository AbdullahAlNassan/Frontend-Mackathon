import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../lib/api";

type BackendDevice = {
  deviceId: string;
  lastSeen: string;
  online: boolean;
  alert: {
    level: "ok" | "warning" | "critical";
    reasons: string[];
    updatedAt: string | null;
  };
  location: { lat: number; lon: number; time: string } | null;
};

type DevicesRes = { data: BackendDevice[] };

export default function LogsPage() {
  const [devices, setDevices] = useState<BackendDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "online" | "offline" | "critical"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const refreshMs = 10000; // 10 seconden

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!cancelled) setLoading(true);
        setErr(null);
        const json = await apiGet<DevicesRes>("/api/v1/devices");
        if (cancelled) return;
        setDevices(json.data ?? []);
        setLastUpdate(new Date());
      } catch (e: any) {
        if (cancelled) return;
        setErr(e?.message ?? "Failed to load devices");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, refreshMs);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Filter logica
  const filteredDevices = devices.filter((d) => {
    // Search filter
    if (
      searchTerm &&
      !d.deviceId.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (filter === "online" && !d.online) return false;
    if (filter === "offline" && d.online) return false;
    if (filter === "critical" && d.alert?.level !== "critical") return false;

    return true;
  });

  // Stats
  const stats = {
    total: devices.length,
    online: devices.filter((d) => d.online).length,
    offline: devices.filter((d) => !d.online).length,
    critical: devices.filter((d) => d.alert?.level === "critical").length,
    warning: devices.filter((d) => d.alert?.level === "warning").length,
  };

  return (
    <div className="logs-overview-page">
      {/* Header met live indicator */}
      <div className="logs-header">
        <div className="header-content">
          <h1>Container Monitoring</h1>
          <p>Real-time overzicht van alle containers en hun status</p>
        </div>
        <div className="live-indicator">
          <span className="pulse-dot"></span>
          <span className="live-text">Live</span>
          <span className="last-update">
            {lastUpdate.toLocaleTimeString("nl-NL")}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-label">Totaal Containers</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card stat-online">
          <div className="stat-icon">●</div>
          <div className="stat-info">
            <span className="stat-label">Online</span>
            <span className="stat-value">{stats.online}</span>
          </div>
        </div>
        <div className="stat-card stat-offline">
          <div className="stat-icon">○</div>
          <div className="stat-info">
            <span className="stat-label">Offline</span>
            <span className="stat-value">{stats.offline}</span>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-icon">⚠</div>
          <div className="stat-info">
            <span className="stat-label">Waarschuwingen</span>
            <span className="stat-value">{stats.warning}</span>
          </div>
        </div>
        <div className="stat-card stat-critical">
          <div className="stat-icon">✕</div>
          <div className="stat-info">
            <span className="stat-label">Kritiek</span>
            <span className="stat-value">{stats.critical}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="controls-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Zoek container ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Alle ({stats.total})
          </button>
          <button
            className={`filter-btn ${filter === "online" ? "active" : ""}`}
            onClick={() => setFilter("online")}
          >
            Online ({stats.online})
          </button>
          <button
            className={`filter-btn ${filter === "offline" ? "active" : ""}`}
            onClick={() => setFilter("offline")}
          >
            Offline ({stats.offline})
          </button>
          <button
            className={`filter-btn ${filter === "critical" ? "active" : ""}`}
            onClick={() => setFilter("critical")}
          >
            Kritiek ({stats.critical})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && devices.length === 0 ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Containers laden...</p>
        </div>
      ) : null}

      {/* Error State */}
      {err ? (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Er is iets misgegaan</h3>
          <p>{err}</p>
        </div>
      ) : null}

      {/* Empty State */}
      {!loading &&
      !err &&
      filteredDevices.length === 0 &&
      devices.length > 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Geen containers gevonden</h3>
          <p>Probeer een andere filter of zoekopdracht</p>
          <button
            className="reset-btn"
            onClick={() => {
              setFilter("all");
              setSearchTerm("");
            }}
          >
            Reset filters
          </button>
        </div>
      ) : null}

      {!loading && !err && devices.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Nog geen containers</h3>
          <p>Er zijn nog geen containers geregistreerd in het systeem</p>
        </div>
      ) : null}

      {/* Results count */}
      {!loading && !err && filteredDevices.length > 0 && (
        <div className="results-info">
          Toont {filteredDevices.length} van {devices.length} containers
        </div>
      )}

      {/* Container Grid */}
      <div className="logs-grid">
        {filteredDevices.map((d) => {
          const level = d.alert?.level ?? "ok";
          const timeSinceLastSeen = Date.now() - new Date(d.lastSeen).getTime();
          const hoursAgo = Math.floor(timeSinceLastSeen / (1000 * 60 * 60));
          const isStale = hoursAgo > 24;

          return (
            <Link
              key={d.deviceId}
              to={`/containers/${d.deviceId}`}
              className={`logs-card level-${level} ${isStale ? "stale" : ""}`}
            >
              {/* Status indicator ribbon */}
              <div
                className={`status-ribbon ${d.online ? "online" : "offline"}`}
              >
                <span className="status-dot">●</span>
                {d.online ? "Online" : "Offline"}
              </div>

              {/* Alert badge */}
              {level !== "ok" && (
                <div className={`alert-badge badge-${level}`}>
                  {level === "critical" ? "!" : "⚠"}
                </div>
              )}

              {/* Card Content */}
              <div className="logs-card-header">
                <div className="device-id-wrapper">
                  <span className="device-icon">📦</span>
                  <span className="device-id">{d.deviceId}</span>
                </div>
              </div>

              {/* Alert Reasons */}
              {d.alert?.reasons && d.alert.reasons.length > 0 && (
                <div className="alert-reasons-preview">
                  {d.alert.reasons.slice(0, 2).map((reason, i) => (
                    <div key={i} className="reason-tag">
                      {reason}
                    </div>
                  ))}
                  {d.alert.reasons.length > 2 && (
                    <div className="reason-tag more">
                      +{d.alert.reasons.length - 2} meer
                    </div>
                  )}
                </div>
              )}

              {/* Info Grid */}
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-icon">🕐</span>
                  <div className="info-text">
                    <span className="info-label">Laatst gezien</span>
                    <span className="info-value">
                      {hoursAgo < 1
                        ? "< 1 uur geleden"
                        : hoursAgo < 24
                        ? `${hoursAgo} uur geleden`
                        : `${Math.floor(hoursAgo / 24)} dagen geleden`}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <div className="info-text">
                    <span className="info-label">Locatie</span>
                    <span className="info-value">
                      {d.location
                        ? `${d.location.lat.toFixed(
                            4
                          )}, ${d.location.lon.toFixed(4)}`
                        : "Geen GPS data"}
                    </span>
                  </div>
                </div>
              </div>

              {/* View details button */}
              <div className="card-footer">
                <span className="view-link">Details bekijken →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
