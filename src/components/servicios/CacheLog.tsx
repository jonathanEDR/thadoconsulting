/**
 * 📊 Log de Estado de Cache
 * 
 * Muestra información en tiempo real sobre el estado del cache
 * para debugging y monitoreo durante desarrollo
 * 
 * @author Web Scuti
 * @version 1.0.0
 */

import React from 'react';
import { useCacheControl } from '../../hooks/useCacheControl';

interface CacheLogProps {
  className?: string;
}

export const CacheLog: React.FC<CacheLogProps> = ({ className = '' }) => {
  const { config, loading, isEnabled, isTemporaryDisabled, hitRateNumber, efficiencyLevel } = useCacheControl();

  if (!config && !loading) {
    return (
      <div className={`text-xs text-gray-500 font-mono ${className}`}>
        🔍 Cache: No configurado
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`text-xs text-gray-500 font-mono ${className}`}>
        ⏳ Cache: Cargando...
      </div>
    );
  }

  const formatLastModified = () => {
    if (!config?.lastModified) return 'N/A';
    return new Date(config.lastModified).toLocaleTimeString();
  };

  const formatReactivateTime = () => {
    if (!config?.reactivateAt) return null;
    
    const now = new Date();
    const reactivateTime = new Date(config.reactivateAt);
    const diffMs = reactivateTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Reactivando...';
    
    const seconds = Math.floor(diffMs / 1000);
    return `${seconds}s`;
  };

  const getStatusEmoji = () => {
    if (isEnabled) return '✅';
    if (isTemporaryDisabled) return '⏸️';
    return '❌';
  };

  const getEfficiencyEmoji = () => {
    switch (efficiencyLevel) {
      case 'high': return '🚀';
      case 'medium': return '⚡';
      case 'low': return '🐌';
      default: return '❓';
    }
  };

  return (
    <div className={`text-xs font-mono space-y-1 ${className}`}>
      {/* Estado Principal */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className={`
          ${isEnabled ? 'text-green-600' : isTemporaryDisabled ? 'text-orange-600' : 'text-red-600'}
        `}>
          {getStatusEmoji()} Cache: {isEnabled ? 'ACTIVO' : isTemporaryDisabled ? 'TEMPORAL OFF' : 'DESACTIVADO'}
        </span>
        
        {hitRateNumber > 0 && (
          <span className="text-blue-600">
            {getEfficiencyEmoji()} Hit Rate: {hitRateNumber.toFixed(1)}%
          </span>
        )}
        
        <span className="text-gray-500">
          📝 Modificado: {formatLastModified()} por {config?.modifiedBy}
        </span>
      </div>

      {/* Información adicional */}
      <div className="flex items-center gap-4 flex-wrap text-gray-400">
        {config?.statistics && (
          <>
            <span>Hits: {config.statistics.totalHits}</span>
            <span>Misses: {config.statistics.totalMisses}</span>
            <span>Invalidaciones: {config.statistics.totalInvalidations}</span>
          </>
        )}
        
        {isTemporaryDisabled && config?.reactivateAt && (
          <span className="text-orange-500 animate-pulse">
            ⏱️ Reactiva en: {formatReactivateTime()}
          </span>
        )}
        
        {config?.autoInvalidation?.disableDuringMutations && (
          <span className="text-blue-500">
            🤖 Auto-invalidación ON
          </span>
        )}
      </div>

      {/* Configuraciones activas */}
      {config?.configurations && (
        <div className="text-gray-400">
          📊 Tipos activos: {Object.entries(config.configurations)
            .filter(([, config]) => config.enabled)
            .map(([key]) => key.split('-')[1]?.charAt(0).toUpperCase() + key.split('-')[1]?.slice(1) || key)
            .join(', ')
          }
        </div>
      )}
    </div>
  );
};

export default CacheLog;