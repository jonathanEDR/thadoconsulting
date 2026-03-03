import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { clientesContablesApi } from '../../services/contabilidadService';
import { Card } from '../UI';
import type { ClienteContable, ZonaIGV } from '../../types/contabilidad';
import { REGIMEN_LABELS, ZONA_IGV_LABELS } from '../../types/contabilidad';

// ============================================
// 🗺️ ICONOS DE MARCADORES POR ZONA IGV
// ============================================

const createColoredIcon = (color: string) =>
  L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px; height: 24px;
        background: ${color};
        border: 2.5px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14]
  });

const MARKER_ICONS: Record<ZonaIGV, L.DivIcon> = {
  GRAVADA: createColoredIcon('#2563eb'),
  EXONERADA: createColoredIcon('#16a34a'),
  INAFECTA: createColoredIcon('#d97706')
};

const MARKER_COLORS: Record<ZonaIGV, string> = {
  GRAVADA: 'text-blue-600',
  EXONERADA: 'text-green-600',
  INAFECTA: 'text-amber-600'
};

// Límites de Perú para restringir el mapa
const PERU_BOUNDS: L.LatLngBoundsExpression = [
  [-18.35, -81.35], // SW corner
  [0.04, -68.65]    // NE corner
];

// Componente para ajustar el zoom a los marcadores
const FitBoundsToMarkers: React.FC<{ markers: Array<{ lat: number; lng: number }> }> = ({ markers }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) {
      map.fitBounds(PERU_BOUNDS, { padding: [20, 20] });
      return;
    }
    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 12);
      return;
    }
    const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [markers, map]);
  return null;
};

// ============================================
// 🗺️ COMPONENTE COMPACTO DE MAPA
// ============================================

interface ClientesMapViewProps {
  onViewCliente?: (cliente: ClienteContable) => void;
}

const ClientesMapView: React.FC<ClientesMapViewProps> = ({ onViewCliente }) => {
  const [clientes, setClientes] = useState<ClienteContable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [filtroZona, setFiltroZona] = useState<ZonaIGV | 'TODOS'>('TODOS');

  useEffect(() => {
    const loadMapData = async () => {
      setLoading(true);
      try {
        const response = await clientesContablesApi.getClientesMapa();
        if (response.success) setClientes(response.data);
      } catch (err) {
        console.error('[ClientesMapView] Error:', err);
        setError('Error al cargar mapa');
      } finally {
        setLoading(false);
      }
    };
    loadMapData();
  }, []);

  const clientesConUbicacion = useMemo(() => {
    return clientes.filter((c) => {
      const hasCoords = c.ubicacion?.coordenadas?.lat != null && c.ubicacion?.coordenadas?.lng != null;
      if (!hasCoords) return false;
      if (filtroZona !== 'TODOS' && c.zonaIGV !== filtroZona) return false;
      return true;
    });
  }, [clientes, filtroZona]);

  const sinUbicacionCount = useMemo(() => {
    return clientes.filter(
      (c) => !c.ubicacion?.coordenadas?.lat || !c.ubicacion?.coordenadas?.lng
    ).length;
  }, [clientes]);

  const zonaCounts = useMemo(() => {
    const counts = { GRAVADA: 0, EXONERADA: 0, INAFECTA: 0 };
    clientes.forEach((c) => {
      if (c.ubicacion?.coordenadas?.lat != null) {
        const z = c.zonaIGV || 'GRAVADA';
        if (z in counts) counts[z as ZonaIGV]++;
      }
    });
    return counts;
  }, [clientes]);

  const center: [number, number] = [-9.19, -75.0152];

  const markerPositions = useMemo(() => 
    clientesConUbicacion.map(c => ({
      lat: c.ubicacion!.coordenadas.lat!,
      lng: c.ubicacion!.coordenadas.lng!
    })),
    [clientesConUbicacion]
  );

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          <span>🗺️</span> Cargando mapa de clientes...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-3">
        <div className="text-sm text-red-500">⚠️ {error}</div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Barra de encabezado compacta */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span className={`transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}>▼</span>
            🗺️ Mapa de Clientes
          </button>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {clientesConUbicacion.length} ubicados
            {sinUbicacionCount > 0 && ` · ${sinUbicacionCount} sin ubicación`}
          </span>
        </div>
        {!collapsed && (
          <div className="flex items-center gap-3">
            {/* Leyenda inline */}
            <div className="hidden md:flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                Gravada ({zonaCounts.GRAVADA})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block"></span>
                Exonerada ({zonaCounts.EXONERADA})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
                Inafecta ({zonaCounts.INAFECTA})
              </span>
            </div>
            {/* Filtro zona */}
            <select
              value={filtroZona}
              onChange={(e) => setFiltroZona(e.target.value as ZonaIGV | 'TODOS')}
              className="px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
            >
              <option value="TODOS">Todas las zonas</option>
              <option value="GRAVADA">Gravada</option>
              <option value="EXONERADA">Exonerada</option>
              <option value="INAFECTA">Inafecta</option>
            </select>
          </div>
        )}
      </div>

      {/* Mapa colapsable */}
      {!collapsed && (
        <div style={{ height: '320px', width: '100%' }}>
          <MapContainer
            center={center}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            attributionControl={false}
            maxBounds={PERU_BOUNDS}
            maxBoundsViscosity={1.0}
            minZoom={5}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBoundsToMarkers markers={markerPositions} />
            {clientesConUbicacion.map((cliente) => (
              <Marker
                key={cliente._id}
                position={[
                  cliente.ubicacion!.coordenadas.lat!,
                  cliente.ubicacion!.coordenadas.lng!
                ]}
                icon={MARKER_ICONS[cliente.zonaIGV || 'GRAVADA']}
              >
                <Popup maxWidth={260} minWidth={200}>
                  <div className="text-sm">
                    <div className="font-bold text-gray-900 mb-0.5">
                      {cliente.razonSocial}
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <div><span className="text-gray-500">RUC:</span> <span className="font-mono">{cliente.ruc}</span></div>
                      <div><span className="text-gray-500">Régimen:</span> {REGIMEN_LABELS[cliente.regimenTributario]}</div>
                      <div>
                        <span className="text-gray-500">Zona:</span>{' '}
                        <span className={MARKER_COLORS[cliente.zonaIGV || 'GRAVADA']}>
                          {ZONA_IGV_LABELS[cliente.zonaIGV || 'GRAVADA']}
                        </span>
                      </div>
                      {cliente.ubicacion?.departamento && (
                        <div>
                          📍 {[cliente.ubicacion.distrito, cliente.ubicacion.provincia, cliente.ubicacion.departamento].filter(Boolean).join(', ')}
                        </div>
                      )}
                      {cliente.honorarioMensual != null && cliente.honorarioMensual > 0 && (
                        <div><span className="text-gray-500">Honorario:</span> S/ {cliente.honorarioMensual.toLocaleString('es-PE')}</div>
                      )}
                    </div>
                    {onViewCliente && (
                      <button
                        onClick={() => onViewCliente(cliente)}
                        className="mt-2 w-full px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        Ver detalle →
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </Card>
  );
};

export default ClientesMapView;
