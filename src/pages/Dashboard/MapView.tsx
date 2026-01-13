// src/pages/Dashboard/MapView.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import type { Container } from "./types";

import L from "leaflet";

// Fix voor missing marker icons in bundlers (Vite)
// (anders zie je soms geen marker icon)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Reflow({ deps = [] as unknown[] }) {
  const map = useMap();

  useEffect(() => {
    const fixSize = () => map.invalidateSize();

    const t1 = setTimeout(fixSize, 100);
    const t2 = setTimeout(fixSize, 300);
    const t3 = setTimeout(fixSize, 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const onResize = () => setTimeout(() => map.invalidateSize(), 120);

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [map]);

  return null;
}

type MapViewProps = {
  containers: Container[];
  onContainerClick: (container: Container) => void;
  reflowDeps?: unknown[];
  techEnabled?: boolean;
  alertsEnabled?: boolean;
};

export default function MapView({
  containers,
  onContainerClick,
  reflowDeps = [],
}: MapViewProps) {
  // Maak 3 icon variants (active/warning/offline)
  const icons = useMemo(() => {
    const make = (color: string) =>
      new L.DivIcon({
        className: "container-marker",
        html: `
          <div style="
            width: 14px;
            height: 14px;
            border-radius: 9999px;
            background: ${color};
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,.25);
          "></div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

    return {
      active: make("#10b981"),
      warning: make("#f59e0b"),
      offline: make("#ef4444"),
      unknown: make("#6b7280"),
    };
  }, []);

  const center = useMemo<[number, number]>(() => [52.37, 4.9], []);

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      dragging
      touchZoom
      doubleClickZoom
      zoomControl
      className="map"
      style={{ height: "100%", width: "100%" }}
      preferCanvas
      whenCreated={(map) => {
        setTimeout(() => map.invalidateSize(), 200);
      }}
    >
      <Reflow deps={reflowDeps} />

      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        keepBuffer={4}
      />

      {containers.map((c) => {
        const icon =
          c.status === "active"
            ? icons.active
            : c.status === "warning"
            ? icons.warning
            : c.status === "offline"
            ? icons.offline
            : icons.unknown;

        return (
          <Marker
            key={c.id}
            position={[c.lat, c.lng]}
            icon={icon}
            eventHandlers={{
              click: () => onContainerClick(c),
            }}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>{c.name}</strong>
                <div>Status: {c.status ?? "unknown"}</div>
                <div>
                  GPS: {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
