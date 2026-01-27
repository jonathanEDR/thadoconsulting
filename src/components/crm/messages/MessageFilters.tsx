/**
 * 🔍 MESSAGE FILTERS - Filtros y Búsqueda de Mensajes
 * Componente colapsable para filtrar mensajes por diferentes criterios
 */

import React, { useState, useEffect } from 'react';
import type { MessageFilters as IMessageFilters, MessageType, MessageStats } from '../../../types/message.types';
import { MESSAGE_TYPE_LABELS } from '../../../types/message.types';

interface MessageFiltersProps {
  onFilterChange: (filters: IMessageFilters) => void;
  currentFilters: IMessageFilters;
  stats?: MessageStats;
  showPrivateFilter?: boolean;
  showDateFilter?: boolean;
  compact?: boolean;
  defaultExpanded?: boolean;
}

/**
 * 🎨 Componente MessageFiltersComponent
 */
export const MessageFiltersComponent: React.FC<MessageFiltersProps> = ({
  onFilterChange,
  currentFilters,
  stats: _stats,
  showPrivateFilter = true,
  showDateFilter = false,
  compact: _compact = false,
  defaultExpanded = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // ========================================
  // 🔄 EFECTOS
  // ========================================

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== currentFilters.search) {
        handleFilterChange({ search: searchTerm || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ========================================
  // 🔄 HANDLERS
  // ========================================

  const handleFilterChange = (newFilters: Partial<IMessageFilters>) => {
    onFilterChange({
      ...currentFilters,
      ...newFilters,
      page: 1, // Reset a primera página al filtrar
    });
  };

  const handleTipoChange = (tipo: MessageType | 'all') => {
    handleFilterChange({ tipo });
  };

  const handleLeidoChange = (leido: boolean | undefined) => {
    handleFilterChange({ leido });
  };

  const handlePrivadoChange = (incluirPrivados: boolean) => {
    handleFilterChange({ incluirPrivados });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    onFilterChange({
      page: 1,
      limit: currentFilters.limit || 50,
    });
  };

  // ========================================
  // 📊 HELPERS
  // ========================================

  const hasActiveFilters = () => {
    return !!(
      currentFilters.search ||
      (currentFilters.tipo && currentFilters.tipo !== 'all') ||
      currentFilters.leido !== undefined ||
      currentFilters.incluirPrivados
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.search) count++;
    if (currentFilters.tipo && currentFilters.tipo !== 'all') count++;
    if (currentFilters.leido !== undefined) count++;
    if (currentFilters.incluirPrivados) count++;
    return count;
  };

  // ========================================
  // 🎨 RENDER
  // ========================================

  return (
    <div className="bg-transparent">
      {/* Header colapsable */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <span className="text-blue-600 dark:text-blue-400">🔍</span>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Filtros y Búsqueda
            </h3>
            {!isExpanded && hasActiveFilters() && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getActiveFilterCount()} filtro(s) activo(s)
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Contador de filtros activos */}
          {hasActiveFilters() && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
              {getActiveFilterCount()}
            </span>
          )}

          {/* Icono expandir/colapsar */}
          <div className={`transform transition-transform duration-200 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Contenido expandido */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 pt-2 space-y-4">
          {/* Fila 1: Búsqueda y Estado de lectura */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Búsqueda de texto */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Buscar por texto
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar en asunto o contenido..."
                  className="w-full pl-9 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Estado de lectura */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Estado de lectura
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleLeidoChange(undefined)}
                  className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    currentFilters.leido === undefined
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => handleLeidoChange(false)}
                  className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    currentFilters.leido === false
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  🔔 No leídos
                </button>
                <button
                  type="button"
                  onClick={() => handleLeidoChange(true)}
                  className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    currentFilters.leido === true
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  ✅ Leídos
                </button>
              </div>
            </div>
          </div>

          {/* Fila 2: Tipo de mensaje */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Tipo de mensaje
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleTipoChange('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !currentFilters.tipo || currentFilters.tipo === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                🌐 Todos
              </button>
              {Object.entries(MESSAGE_TYPE_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTipoChange(key as MessageType)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    currentFilters.tipo === key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Fila 3: Opciones adicionales y Acciones */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            {/* Mensajes privados */}
            {showPrivateFilter && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentFilters.incluirPrivados || false}
                  onChange={(e) => handlePrivadoChange(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  🔒 Incluir notas internas
                </span>
              </label>
            )}

            {/* Fechas (opcional) */}
            {showDateFilter && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={currentFilters.desde || ''}
                  onChange={(e) =>
                    handleFilterChange({ desde: e.target.value || undefined })
                  }
                  className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Desde"
                />
                <span className="text-gray-400 text-xs">-</span>
                <input
                  type="date"
                  value={currentFilters.hasta || ''}
                  onChange={(e) =>
                    handleFilterChange({ hasta: e.target.value || undefined })
                  }
                  className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Hasta"
                />
              </div>
            )}

            {/* Limpiar filtros */}
            {hasActiveFilters() && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="ml-auto px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageFiltersComponent;
