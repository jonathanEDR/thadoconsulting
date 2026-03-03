import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue with bundlers
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

// ============================================
// TYPES
// ============================================

export interface LocationData {
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  coordenadas: {
    lat: number | null;
    lng: number | null;
  };
}

interface MapLocationPickerProps {
  value: LocationData;
  onChange: (location: LocationData) => void;
  height?: string;
  zoom?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// ============================================
// PERU DEPARTMENTS → IGV ZONE AUTO-DETECT
// ============================================

/**
 * Departamentos de Perú exonerados de IGV (Ley 27037 - Ley de Promoción de la Amazonia)
 * Incluye departamentos parcial o totalmente dentro de la zona de selva/Amazonía
 */
export const DEPARTAMENTOS_EXONERADOS_IGV = [
  'LORETO',
  'UCAYALI',
  'SAN MARTÍN',
  'SAN MARTIN',
  'AMAZONAS',
  'MADRE DE DIOS'
];

/**
 * Departamentos con provincias parcialmente exoneradas
 * El usuario deberá confirmar manualmente para estos
 */
export const DEPARTAMENTOS_PARCIAL_EXONERADOS = [
  'HUÁNUCO',
  'HUANUCO',
  'JUNÍN',
  'JUNIN',
  'PASCO',
  'CUSCO',
  'CAJAMARCA',
  'PIURA',
  'PUNO',
  'AYACUCHO'
];

export const DEPARTAMENTOS_PERU = [
  'AMAZONAS', 'ÁNCASH', 'APURÍMAC', 'AREQUIPA', 'AYACUCHO',
  'CAJAMARCA', 'CALLAO', 'CUSCO', 'HUANCAVELICA', 'HUÁNUCO',
  'ICA', 'JUNÍN', 'LA LIBERTAD', 'LAMBAYEQUE', 'LIMA',
  'LORETO', 'MADRE DE DIOS', 'MOQUEGUA', 'PASCO', 'PIURA',
  'PUNO', 'SAN MARTÍN', 'TACNA', 'TUMBES', 'UCAYALI'
];

/**
 * Detectar zona IGV sugerida según departamento
 */
export const detectarZonaIGV = (departamento: string): 'GRAVADA' | 'EXONERADA' | 'PARCIAL' => {
  const dep = departamento.toUpperCase().trim();
  if (DEPARTAMENTOS_EXONERADOS_IGV.includes(dep)) return 'EXONERADA';
  if (DEPARTAMENTOS_PARCIAL_EXONERADOS.includes(dep)) return 'PARCIAL';
  return 'GRAVADA';
};

// ============================================
// SUB-COMPONENTS
// ============================================

/** Click handler for placing marker on map */
const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

/** Fly to location on mount and when coords change */
const MapFlyTo: React.FC<{ lat: number; lng: number; zoom?: number }> = ({ lat, lng, zoom = 16 }) => {
  const map = useMap();
  const hasFlyRef = useRef(false);

  useEffect(() => {
    if (lat && lng) {
      if (!hasFlyRef.current) {
        // First time: instant jump (no animation delay on modal open)
        map.setView([lat, lng], zoom);
        hasFlyRef.current = true;
      } else {
        // Subsequent updates: animate
        map.flyTo([lat, lng], zoom, { duration: 1.2 });
      }
    }
  }, [lat, lng, zoom, map]);
  return null;
};

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * 🗺️ MapLocationPicker - Componente reutilizable de selección de ubicación
 * 
 * Features:
 * - Mapa interactivo Leaflet con click para seleccionar ubicación
 * - Geocodificación inversa automática (coordenadas → dirección)
 * - Búsqueda por texto (dirección → coordenadas)
 * - Selección de departamento con lista de Perú
 * - Inputs manuales para distrito/provincia
 * - Auto-detección de zona IGV por departamento
 * 
 * @example
 * <MapLocationPicker
 *   value={ubicacion}
 *   onChange={(loc) => setUbicacion(loc)}
 *   height="300px"
 * />
 */
const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  value,
  onChange,
  height = '300px',
  zoom = 6,
  placeholder = 'Buscar dirección...',
  className = '',
  disabled = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Center of Peru — always start here
  const peruCenter: [number, number] = [-9.19, -75.0152];
  const peruBounds: L.LatLngBoundsExpression = [
    [-18.35, -81.35],
    [0.04, -68.65]
  ];
  const markerPosition: [number, number] | null = 
    value.coordenadas.lat && value.coordenadas.lng
      ? [value.coordenadas.lat, value.coordenadas.lng]
      : null;

  /**
   * Reverse geocode: coordinates → address details
   * Uses Nominatim (OpenStreetMap) free API
   */
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`,
        { headers: { 'User-Agent': 'ThadoConsulting/1.0' } }
      );
      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        const direccion = data.display_name?.split(',').slice(0, 3).join(',').trim() || '';
        const distrito = addr.city_district || addr.suburb || addr.town || addr.village || '';
        const provincia = addr.city || addr.county || '';
        
        // Map Nominatim state/region to Peru department
        let departamento = addr.state || addr.region || '';
        // Try matching to known departments
        const depUpper = departamento.toUpperCase();
        const matched = DEPARTAMENTOS_PERU.find(d => 
          depUpper.includes(d) || d.includes(depUpper)
        );
        if (matched) departamento = matched;

        onChange({
          direccion,
          distrito,
          provincia,
          departamento,
          coordenadas: { lat, lng }
        });
      } else {
        // No address found, just set coordinates
        onChange({
          ...value,
          coordenadas: { lat, lng }
        });
      }
    } catch {
      // On error, still set coordinates
      onChange({
        ...value,
        coordenadas: { lat, lng }
      });
    }
  }, [onChange, value]);

  /**
   * Forward geocode: text search → coordinates
   */
  const searchAddress = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchError(null);

    try {
      // Add "Peru" to improve search accuracy
      const searchText = query.toLowerCase().includes('peru') ? query : `${query}, Perú`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=1&addressdetails=1&accept-language=es`,
        { headers: { 'User-Agent': 'ThadoConsulting/1.0' } }
      );
      const results = await response.json();

      if (results && results.length > 0) {
        const result = results[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        await reverseGeocode(lat, lng);
      } else {
        setSearchError('No se encontró la dirección. Intente con más detalles.');
      }
    } catch {
      setSearchError('Error al buscar dirección. Verifique su conexión.');
    } finally {
      setSearching(false);
    }
  }, [reverseGeocode]);

  /** Handle map click to set marker */
  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (disabled) return;
    reverseGeocode(lat, lng);
  }, [disabled, reverseGeocode]);

  /** Handle search input on Enter */
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchAddress(searchQuery);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search bar */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full px-3 py-2 pl-9 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <button
            type="button"
            onClick={() => searchAddress(searchQuery)}
            disabled={disabled || searching || !searchQuery.trim()}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {searching ? '⏳' : 'Buscar'}
          </button>
        </div>
        {searchError && (
          <p className="text-xs text-red-500 mt-1">{searchError}</p>
        )}
      </div>

      {/* Leaflet Map */}
      <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm" style={{ height }}>
        <MapContainer
          center={peruCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={!disabled}
          dragging={!disabled}
          attributionControl={false}
          maxBounds={peruBounds}
          maxBoundsViscosity={1.0}
          minZoom={5}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {!disabled && <MapClickHandler onLocationSelect={handleMapClick} />}
          {markerPosition && (
            <>
              <Marker position={markerPosition} />
              <MapFlyTo lat={markerPosition[0]} lng={markerPosition[1]} zoom={16} />
            </>
          )}
        </MapContainer>
      </div>

      {/* Coordinates + address description */}
      {markerPosition && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>📍</span>
            <span className="font-mono">Lat: {markerPosition[0].toFixed(6)}, Lng: {markerPosition[1].toFixed(6)}</span>
          </div>
          {(value.direccion || value.distrito || value.provincia || value.departamento) && (
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {[value.direccion, value.distrito, value.provincia, value.departamento].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      )}

      {/* Help text */}
      <p className="text-xs text-gray-400 dark:text-gray-500">
        💡 Haz clic en el mapa para seleccionar ubicación, o busca una dirección.
      </p>
    </div>
  );
};

export default MapLocationPicker;
