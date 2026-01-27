/**
 * ⏱️ Configurador de TTL (Time To Live) del Cache
 * 
 * Permite configurar el tiempo de duración del cache para cada tipo de ruta
 * 
 * @author Web Scuti
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useCacheControl } from '../../hooks/useCacheControl';

interface TTLConfig {
  [key: string]: number;
  'service-list': number;
  'service-detail': number;
  'featured-services': number;
  'service-categories': number;
  'service-packages': number;
  'service-stats': number;
}

interface TTLConfigProps {
  onClose?: () => void;
}

const CACHE_TYPES = {
  'service-list': {
    label: 'Listado de Servicios',
    description: 'Cache para la lista pública de servicios',
    default: 300
  },
  'service-detail': {
    label: 'Detalle de Servicio',
    description: 'Cache para la página de detalle de cada servicio',
    default: 600
  },
  'featured-services': {
    label: 'Servicios Destacados',
    description: 'Cache para los servicios destacados',
    default: 900
  },
  'service-categories': {
    label: 'Categorías de Servicios',
    description: 'Cache para las categorías disponibles',
    default: 1800
  },
  'service-packages': {
    label: 'Paquetes de Servicios',
    description: 'Cache para los paquetes de servicios',
    default: 600
  },
  'service-stats': {
    label: 'Estadísticas',
    description: 'Cache para las estadísticas de servicios',
    default: 1800
  }
};

export const CacheTTLConfig: React.FC<TTLConfigProps> = ({ onClose }) => {
  const { config, loading, error, updateCacheTTL } = useCacheControl();
  const [ttlValues, setTtlValues] = useState<TTLConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

  // Inicializar valores del TTL desde la configuración
  useEffect(() => {
    if (config?.configurations) {
      const newTtlValues: TTLConfig = {
        'service-list': config.configurations['service-list']?.maxAge || CACHE_TYPES['service-list'].default,
        'service-detail': config.configurations['service-detail']?.maxAge || CACHE_TYPES['service-detail'].default,
        'featured-services': config.configurations['featured-services']?.maxAge || CACHE_TYPES['featured-services'].default,
        'service-categories': config.configurations['service-categories']?.maxAge || CACHE_TYPES['service-categories'].default,
        'service-packages': config.configurations['service-packages']?.maxAge || CACHE_TYPES['service-packages'].default,
        'service-stats': config.configurations['service-stats']?.maxAge || CACHE_TYPES['service-stats'].default,
      };
      setTtlValues(newTtlValues);
    }
  }, [config]);

  const handleTTLChange = (type: keyof TTLConfig, value: number) => {
    if (ttlValues) {
      setTtlValues({
        ...ttlValues,
        [type]: Math.max(0, value)
      });
    }
  };

  const handleSave = async () => {
    if (!ttlValues) return;
    
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      const success = await updateCacheTTL(ttlValues as Record<string, number>);
      
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError('Error al guardar la configuración del TTL');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  const toggleExpanded = (type: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedTypes(newExpanded);
  };

  const formatSeconds = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  if (loading || !ttlValues) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando configuración...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>⏱️</span>
          Configurar TTL del Cache
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Ajusta el tiempo de duración (en segundos) para cada tipo de cache
        </p>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          ❌ {error}
        </div>
      )}

      {saveError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          ❌ {saveError}
        </div>
      )}

      {saveSuccess && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
          ✅ Configuración de TTL actualizada exitosamente
        </div>
      )}

      {/* TTL Configurations */}
      <div className="space-y-3 mb-6">
        {(Object.entries(CACHE_TYPES) as Array<[keyof TTLConfig, typeof CACHE_TYPES['service-list']]>).map(([type, info]) => (
          <div
            key={type}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <button
              onClick={() => toggleExpanded(type as string)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-lg">📌</span>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{info.label}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{info.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded">
                  {formatSeconds(ttlValues[type])}
                </span>
                <span className={`transform transition-transform ${expandedTypes.has(type as string) ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </button>

            {/* Content */}
            {expandedTypes.has(type as string) && (
              <div className="px-4 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  {/* Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duración en segundos
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="3600"
                      step="10"
                      value={ttlValues[type]}
                      onChange={(e) => handleTTLChange(type, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>

                  {/* Number Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor exacto (segundos)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="3600"
                      step="10"
                      value={ttlValues[type]}
                      onChange={(e) => handleTTLChange(type, parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Current and Default Info */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      <span className="text-gray-600 dark:text-gray-400">Actual:</span>
                      <span className="font-mono ml-2 text-blue-700 dark:text-blue-300">{formatSeconds(ttlValues[type])}</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      <span className="text-gray-600 dark:text-gray-400">Predeterminado:</span>
                      <span className="font-mono ml-2 text-gray-700 dark:text-gray-300">{formatSeconds(info.default)}</span>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={() => handleTTLChange(type, info.default)}
                    className="w-full py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Restaurar predeterminado
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Información General */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 ¿Qué es el TTL?</h4>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          El TTL (Time To Live) es el tiempo en segundos que un recurso se mantiene en cache antes de que expire y necesite ser recargado del servidor. 
          Un TTL mayor = menos requests al servidor pero datos potencialmente más antiguos.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Guardando...
            </>
          ) : (
            <>
              💾 Guardar Configuración
            </>
          )}
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};

export default CacheTTLConfig;