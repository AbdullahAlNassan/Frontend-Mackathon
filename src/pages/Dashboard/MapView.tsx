import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { Container } from "./types";

function Reflow({ deps = [] as unknown[] }) {
  const map = useMap();

  useEffect(() => {
    const fixSize = () => {
      map.invalidateSize();
    };

    const t1 = setTimeout(fixSize, 100);
    const t2 = setTimeout(fixSize, 300);
    const t3 = setTimeout(fixSize, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, deps);

  useEffect(() => {
    const onResize = () => {
      setTimeout(() => map.invalidateSize(), 100);
    };

    window.addEventListener("resize", onResize);
    // iPad orientation change
    window.addEventListener("orientationchange", () => {
      setTimeout(() => map.invalidateSize(), 200);
    });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [map]);

  useEffect(() => {
    const handleMapInteraction = () => {
      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    };

    map.on("zoomend", handleMapInteraction);
    map.on("moveend", handleMapInteraction);
    map.on("dragend", handleMapInteraction);

    return () => {
      map.off("zoomend", handleMapInteraction);
      map.off("moveend", handleMapInteraction);
      map.off("dragend", handleMapInteraction);
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
  return (
    <MapContainer
      center={[52.37, 4.9]}
      zoom={13}
      scrollWheelZoom={true}
      dragging={true}
      touchZoom={true}
      doubleClickZoom={true}
      zoomControl={true}
      className="map"
      style={{ height: "100%", width: "100%", background: "#f8f9fa" }}
      preferCanvas={true}
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

      {containers.map((container) => (
        <Marker
          key={container.id}
          position={[container.lat, container.lng]}
          eventHandlers={{
            click: () => onContainerClick(container),
          }}
        >
          <Popup>
            <strong>{container.name}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
