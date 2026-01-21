import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MilitaryOSMLayer from "./MilitaryLayer";

/**
 * Komponent SetView
 * Odpowiada za programową zmianę środka i przybliżenia mapy.
 */
function SetView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    // Aktualizuje widok mapy, gdy zmienią się parametry wejściowe
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

/**
 * Główny komponent aplikacji
 */
export default function App() {
  // Współrzędne środka Polski
  const center: [number, number] = [52.069167, 19.480556];
  const zoom = 7;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100vh", width: "100vw" }}
    >
      {/* Komponent sterujący widokiem */}
      <SetView center={center} zoom={zoom} />

      {/* Warstwa kafelków z OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}