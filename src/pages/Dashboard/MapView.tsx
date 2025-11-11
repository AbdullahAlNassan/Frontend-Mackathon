import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

function Reflow({ deps = [] as unknown[] }) {
  const map = useMap();

  useEffect(() => {
    // ietsje uitstellen voor CSS transition
    const t = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(t);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [map]);

  return null;
}

export default function MapView({ reflowDeps = [] as unknown[] }) {
  return (
    <MapContainer
      center={[52.37, 4.9]}
      zoom={12}
      scrollWheelZoom
      dragging
      touchZoom
      zoomControl={true}
      className="map"
    >
      <Reflow deps={reflowDeps} />
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
