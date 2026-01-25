import { useEffect, useState, useRef } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import axios from "axios";
import osmtogeojson from "osmtogeojson";
import L from "leaflet";

interface Props {
  militaryType: string;
  showAll: boolean;
  layerStyle: {
    color: string;
    weight: number;
    opacity: number;
  };
  onDataCountChange: (count: number) => void;
}

export default function MilitaryOSMLayer({ militaryType, showAll, layerStyle, onDataCountChange }: Props) {
  const [data, setData] = useState<any>(null);
  const layerRef = useRef<L.GeoJSON>(null);
  const map = useMap();

  const fetchData = async () => {
    // Jeśli showAll jest true, pobieramy ogólny tag "military", w przeciwnym razie konkretny typ
    const selector = showAll ? '["military"]' : `["military"="${militaryType}"]`;
    
    const query = `
      [out:json][timeout:60];
      area["ISO3166-1"="PL"]->.a;
      (
        way${selector}(area.a);
        relation${selector}(area.a);
      );
      out geom;
    `;

    try {
      const res = await axios.get("https://overpass.kumi.systems/api/interpreter?data=" + encodeURIComponent(query));
      const geojson = osmtogeojson(res.data);
      setData(geojson);
      onDataCountChange(geojson.features.length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [militaryType, showAll]);

  useEffect(() => {
    if (data && layerRef.current) {
      const bounds = layerRef.current.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [data]);

  return data ? (
    <GeoJSON
      key={`${militaryType}-${showAll}`}
      ref={layerRef}
      data={data}
      style={() => ({
        color: layerStyle.color,
        weight: layerStyle.weight,
        opacity: layerStyle.opacity,
        fillColor: layerStyle.color,
        fillOpacity: layerStyle.opacity * 0.5,
      })}
    />
  ) : null;
}