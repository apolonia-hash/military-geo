import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css"; // Punkt 4: Import stylów
import MilitaryOSMLayer from "./MilitaryLayer";

const MILITARY_LABELS: any = {
  barracks: "Koszary",
  naval_base: "Baza morska",
  airfield: "Lotnisko wojskowe",
  training_area: "Obszar ćwiczeń",
  range: "Poligon",
  bunker: "Bunkier",
};

export default function App() {
  // Stany dla zadań
  const [type, setType] = useState("barracks");
  const [showAll, setShowAll] = useState(false);
  const [count, setCount] = useState(0);
  
  // Zadanie 2: Stan stylu
  const [style, setStyle] = useState({
    color: "#ff0000",
    weight: 3,
    opacity: 1
  });

  return (
    <div className="map-container">
      <MapContainer center={[52.06, 19.48]} zoom={7} className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <MilitaryOSMLayer 
          militaryType={type} 
          showAll={showAll}
          layerStyle={style}
          onDataCountChange={setCount}
        />

        {/* Zadanie 3: Panel Górny */}
        <div className="ui-panel controls-panel">
          <h4>Typ obiektu:</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {Object.keys(MILITARY_LABELS).map((t) => (
              <button 
                key={t}
                className={`btn-military ${type === t && !showAll ? 'btn-active' : ''}`}
                onClick={() => { setType(t); setShowAll(false); }}
              >
                {MILITARY_LABELS[t]}
              </button>
            ))}
            <button 
              className={`btn-military btn-all ${showAll ? 'btn-active' : ''}`}
              onClick={() => setShowAll(true)}
            >
              Pokaż wszystkie warstwy naraz
            </button>
          </div>
        </div>

        {/* Zadanie 1: Legenda (Lewy dół) */}
        <div className="ui-panel legend-panel">
          <strong>Legenda</strong>
          <div>Typ: {showAll ? "Wszystkie" : MILITARY_LABELS[type]}</div>
          <div>Liczba obiektów: {count}</div>
        </div>

        {/* Zadanie 2: Styl warstwy (Prawy dół) */}
        <div className="ui-panel style-panel">
          <strong>Styl warstwy</strong>
          <label>Kolor: 
            <input type="color" value={style.color} 
              onChange={(e) => setStyle({...style, color: e.target.value})} />
          </label>
          <label>Grubość: {style.weight}
            <input type="range" min="1" max="15" value={style.weight} 
              onChange={(e) => setStyle({...style, weight: parseInt(e.target.value)})} />
          </label>
          <label>Przezroczystość: {style.opacity}
            <input type="range" min="0.1" max="1" step="0.1" value={style.opacity} 
              onChange={(e) => setStyle({...style, opacity: parseFloat(e.target.value)})} />
          </label>
        </div>

      </MapContainer>
    </div>
  );
}