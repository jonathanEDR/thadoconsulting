/**
 * 🎛️ Componente de Control de Cache
 * 
 * Permite a los administradores controlar el cache del módulo de servicios:
 * - Activar/desactivar cache global
 * - Invalidar cache temporalmente
 * - Ver estadísticas en tiempo real
 * 
 * @author Web Scuti
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { useCacheControl } from '../../hooks/useCacheControl';
import { useNotification } from '../../hooks/useNotification';

// ============================================
// ICONOS
// ============================================

const CacheIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const PowerIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 12M6 6l12 12" />
  </svg>
);

const RefreshCwIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ============================================
// PROPS
// ============================================

interface CacheControlProps {
  variant?: 'button' | 'panel' | 'compact';
  className?: string;
  showStats?: boolean;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const CacheControl: React.FC<CacheControlProps> = ({
  variant = 'button',
  className = '',
  showStats = true
}) => {
  const {
    config,
    loading,
    error,
    toggleCache,
    invalidateCache,
    reactivateCache,
    refreshConfig,
    isEnabled,
    isTemporaryDisabled,
    hitRateNumber,
    efficiencyLevel
  } = useCacheControl();

  const { success, error: showError } = useNotification();
  const [showPanel, setShowPanel] = useState(false);

  // ============================================
  // HANDLERS
  // ============================================

  const handleToggleCache = async () => {
    const newState = !isEnabled;
    const result = await toggleCache(newState);
    
    if (result) {
      success(`Cache ${newState ? 'activado' : 'desactivado'} exitosamente`);
    } else {
      showError(error || 'Error al cambiar estado del cache');
    }
  };

  const handleInvalidateCache = async (duration: number = 30) => {
    const result = await invalidateCache(duration);
    
    if (result) {
      success(`Cache invalidado por ${duration} segundos`);
    } else {
      showError(error || 'Error al invalidar cache');
    }
  };

  const handleReactivateCache = async () => {
    const result = await reactivateCache();
    
    if (result) {
      success('Cache reactivado exitosamente');
    } else {
      showError(error || 'Error al reactivar cache');
    }
  };

  const formatTimeRemaining = () => {
    if (!config?.reactivateAt) return null;
    
    const now = new Date();
    const reactivateTime = new Date(config.reactivateAt);
    const diffMs = reactivateTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Reactivando...';
    
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  // ============================================
  // RENDERIZADO CONDICIONAL POR VARIANTE
  // ============================================

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`
          px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5
          ${isEnabled 
            ? 'bg-green-100 text-green-700' 
            : isTemporaryDisabled
            ? 'bg-orange-100 text-orange-700'
            : 'bg-red-100 text-red-700'
          }
        `}>
          <CacheIcon />
          <span>
            {isEnabled ? 'Cache ON' : isTemporaryDisabled ? 'Temporal OFF' : 'Cache OFF'}
          </span>
          {showStats && hitRateNumber > 0 && (
            <span className="text-xs opacity-75">({hitRateNumber.toFixed(0)}%)</span>
          )}
        </div>
        
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          title="Configurar cache"
        >
          <BarChartIcon />
        </button>
        
        {showPanel && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border z-50">
            <CacheControl variant="panel" />
          </div>
        )}
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className={`
            px-3 py-2 rounded-lg border transition-all flex items-center gap-2 relative
            ${isEnabled
              ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
              : isTemporaryDisabled
              ? 'bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100'
              : 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
            }
            ${loading ? 'opacity-50 cursor-wait' : ''}
          `}
          disabled={loading}
          title="Control de Cache"
        >
          <CacheIcon />
          <span className="hidden sm:inline font-medium">
            Cache {isEnabled ? 'ON' : 'OFF'}
          </span>
          <span className="sm:hidden">
            {isEnabled ? '✅' : isTemporaryDisabled ? '⏸️' : '❌'}
          </span>
          
          {showStats && hitRateNumber > 0 && (
            <span className="hidden md:inline text-xs bg-white/50 px-1.5 py-0.5 rounded">
              {hitRateNumber.toFixed(0)}%
            </span>
          )}
          
          {isTemporaryDisabled && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          )}
        </button>

        {/* Panel flotante */}
        {showPanel && (
          <>
            {/* Overlay para cerrar */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowPanel(false)}
            />
            
            {/* Panel */}
            <div className="absolute top-full right-0 mt-2 w-96 bg-white shadow-xl rounded-lg border z-50">
              <CacheControl variant="panel" showStats={showStats} />
            </div>
          </>
        )}
      </div>
    );
  }

  // Variant: 'panel'
  return (
    <div className={`p-4 bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CacheIcon />
          <h3 className="font-semibold text-gray-900">Control de Cache</h3>
        </div>
        <button
          onClick={refreshConfig}
          disabled={loading}
          className="p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
          title="Refrescar"
        >
          <RefreshCwIcon />
        </button>
      </div>

      {/* Estado actual */}
      <div className="mb-4 p-3 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Estado Global</span>
          <div className={`
            px-2 py-1 rounded text-xs font-medium flex items-center gap-1
            ${isEnabled 
              ? 'bg-green-100 text-green-700' 
              : isTemporaryDisabled
              ? 'bg-orange-100 text-orange-700'
              : 'bg-red-100 text-red-700'
            }
          `}>
            {isEnabled ? <CheckCircleIcon /> : <XCircleIcon />}
            {isEnabled ? 'Activado' : isTemporaryDisabled ? 'Desactivado temporalmente' : 'Desactivado'}
          </div>
        </div>

        {isTemporaryDisabled && config?.reactivateAt && (
          <div className="flex items-center gap-2 text-xs text-orange-600">
            <ClockIcon />
            <span>Se reactivará en: {formatTimeRemaining()}</span>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      {showStats && config && (
        <div className="mb-4 p-3 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <BarChartIcon />
            <span className="text-sm font-medium text-gray-700">Estadísticas</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className={`
                text-lg font-bold
                ${efficiencyLevel === 'high' ? 'text-green-600' : 
                  efficiencyLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'}
              `}>
                {hitRateNumber.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Hit Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {config.statistics?.totalHits || 0}
              </div>
              <div className="text-xs text-gray-500">Hits</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-600">
                {config.statistics?.totalMisses || 0}
              </div>
              <div className="text-xs text-gray-500">Misses</div>
            </div>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="space-y-2">
        {/* Toggle principal */}
        <button
          onClick={handleToggleCache}
          disabled={loading}
          className={`
            w-full px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2
            ${isEnabled
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
            }
          `}
        >
          <PowerIcon />
          {isEnabled ? 'Desactivar Cache' : 'Activar Cache'}
        </button>

        {/* Invalidación temporal */}
        {isEnabled && !isTemporaryDisabled && (
          <button
            onClick={() => handleInvalidateCache(30)}
            disabled={loading}
            className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <TrashIcon />
            Invalidar 30s
          </button>
        )}

        {/* Reactivación inmediata */}
        {isTemporaryDisabled && (
          <button
            onClick={handleReactivateCache}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CheckCircleIcon />
            Reactivar Ahora
          </button>
        )}
      </div>

      {/* Información adicional */}
      {config && (
        <div className="mt-4 pt-3 border-t text-xs text-gray-500">
          <div>Última modificación: {config.modifiedBy}</div>
          <div>Fecha: {new Date(config.lastModified).toLocaleString()}</div>
          {config.autoInvalidation?.disableDuringMutations && (
            <div className="flex items-center gap-1 mt-1 text-blue-600">
              <CheckCircleIcon />
              Auto-invalidación habilitada
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CacheControl;