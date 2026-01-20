import { useEffect, useState, useRef } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import axios from "axios";
import osmtogeojson from "osmtogeojson";
import L from "leaflet";


// ---- TYPY ----
type MilitaryType =
  | "barracks"
  | "naval_base"
  | "airfield"
  | "training_area"
  | "range"
  | "bunker";

type GeoJSONData = GeoJSON.FeatureCollection;

// ---- LISTA TYPÓW ----
const MILITARY_TYPES: MilitaryType[] = [
  "barracks",
  "naval_base",
  "airfield",
  "training_area",
  "range",
  "bunker",
];

// ---- ETYKIETY (TŁUMACZENIA) ----
const MILITARY_LABELS: Record<MilitaryType, string> = {
  barracks: "Koszary",
  naval_base: "Baza morska",
  airfield: "Lotnisko wojskowe",
  training_area: "Obszar ćwiczeń",
  range: "Poligon",
  bunker: "Bunkier",
};

// ---- KOMPONENT MilitaryOSMLayer ----
export default function MilitaryOSMLayer() {
  const [militaryType, setMilitaryType] = useState<MilitaryType>("barracks");
  const [data, setData] = useState<GeoJSONData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const layerRef = useRef<L.GeoJSON>(null);
  const map = useMap();

  // ---- FUNKCJA POBIERANIA DANYCH ----
  const fetchData = async (type: MilitaryType) => {
    setLoading(true);
    setError(null);
    setData(null);

    // Zapytanie Overpass QL (Pobiera obiekty typu 'military' z obszaru Polski)
    const query = `
      [out:json][timeout:60];
      area["ISO3166-1"="PL"]->.a;
      (
        way["military"="${type}"](area.a);
        relation["military"="${type}"](area.a);
      );
      out geom;
    `;

    const requestUrl = "https://overpass.kumi.systems/api/interpreter?data=" + encodeURIComponent(query);

    try {
      const res = await axios.get(requestUrl);
      // Konwersja formatu OSM JSON na GeoJSON
      const geojson = osmtogeojson(res.data) as GeoJSONData;
      setData(geojson);
    } catch (e) {
      console.error("Błąd Overpass:", e);
      setError("Nie udało się pobrać danych z serwera OSM.");
    } finally {
      setLoading(false);
    }
  };

  // Pobierz dane przy zmianie typu
  useEffect(() => {
    fetchData(militaryType);
  }, [militaryType]);

  // Dopasowanie widoku mapy do pobranych danych
  useEffect(() => {
    if (data && layerRef.current) {
      const bounds = layerRef.current.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { animate: true, padding: [20, 20] });
      }
    }
  }, [data, map]);

  // ---- RENDER ----
  return (
    <>
      {/* PANEL STEROWANIA */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          zIndex: 1000,
          background: "white",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          maxWidth: "250px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Typ obiektu wojskowego:</h4>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {MILITARY_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setMilitaryType(type)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: type === militaryType ? "#c62828" : "#f5f5f5",
                color: type === militaryType ? "#fff" : "#333",
                cursor: "pointer",
                fontSize: "12px",
                transition: "all 0.2s"
              }}
            >
              {MILITARY_LABELS[type]}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ marginTop: "10px", color: "#666", fontSize: "12px" }}>
            ⌛ Ładowanie danych...
          </div>
        )}

        {error && (
          <div style={{ marginTop: "10px", color: "red", fontSize: "12px" }}>
            ❌ {error}
          </div>
        )}
      </div>

      {/* WARSTWA GEOJSON */}
      {data && (
        <GeoJSON
          key={militaryType} // Klucz wymusza przerysowanie warstwy przy zmianie typu
          ref={layerRef}
          data={data}
          style={() => ({
            color: "#ff0000",
            weight: 3,
            opacity: 0.8,
            fillColor: "#ff0000",
            fillOpacity: 0.3,
          })}
        >
          {/* Opcjonalnie: można tu dodać Popup dla każdego obiektu */}
        </GeoJSON>
      )}
    </>
  );
}