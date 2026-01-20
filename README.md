# military-geo — mapa obiektów wojskowych

Krótki opis
- Aplikacja React + TypeScript uruchamiana przez Vite.
- Pobiera dane z OpenStreetMap (Overpass), konwertuje do GeoJSON i renderuje na mapie przy użyciu Leaflet / react-leaflet.
- Cel: wizualizacja i filtrowanie obiektów wojskowych oraz kontrola stylu warstw.

Główne pliki
- src/main.tsx — punkt startowy React.
- src/App.tsx — główny komponent z mapą, panelem sterowania, legendą i kontrolkami.
- src/MilitaryLayer.tsx — ładowanie danych z Overpass, konwersja osmtogeojson, render GeoJSON.
- src/index.css, src/App.css — style.
- vite.config.ts, package.json, tsconfig*.json, eslint.config.js — konfiguracje narzędzi.

Kluczowe zależności
- react, react-dom, vite, leaflet, react-leaflet, axios, osmtogeojson

Funkcjonalności
- Wybór typu obiektów i przełącznik „pokaż wszystkie”.
- Zmiana koloru, grubości i przezroczystości warstwy.
- Licznik załadowanych obiektów i dopasowanie widoku do danych (fitBounds).
- Obsługa błędów sieciowych i prosty interfejs użytkownika.

Uruchomienie
- npm install
- npm run dev

Licencja i uwagi
- Projekt edukacyjny / studencki — używać zgodnie z licencją zależności i danych OSM.
