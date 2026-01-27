/**
 * 🔍 LEAD FILTERS - Filtros y Búsqueda de Leads
 * Componente colapsable para filtrar leads por diferentes criterios
 */

import React, { useState, useEffect } from 'react';

// Tipos de filtros de leads
interface LeadFilters {
  search?: string;
  estado?: string;
  prioridad?: string;
  origen?: string;
}

interface LeadFiltersProps {
  filters: LeadFilters;
  onFilterChange: (key: string, value: string) => void;
  onSearch: (value: string) => void;
  onRefresh: () => void;
  defaultExpanded?: boolean;
}

// Opciones de estados
const ESTADO_OPTIONS = [
  { value: 'all', label: '📊 Todos los estados', group: null },
  { value: 'nuevo', label: '📝 Nueva', group: 'activos' },
  { value: 'en_revision', label: '👀 En Revisión', group: 'activos' },
  { value: 'contactando', label: '📞 Contactando', group: 'activos' },
  { value: 'cotizacion', label: '💰 Cotización', group: 'activos' },
  { value: 'aprobado', label: '✅ Aprobado', group: 'activos' },
  { value: 'en_desarrollo', label: '🚀 En Desarrollo', group: 'activos' },
  { value: 'completado', label: '✨ Completado', group: 'finales' },
  { value: 'rechazado', label: '❌ Rechazado', group: 'finales' },
  { value: 'cancelado', label: '🚫 Cancelado', group: 'finales' },
];

// Opciones de prioridad
const PRIORIDAD_OPTIONS = [
  { value: 'all', label: '🎯 Todas las prioridades' },
  { value: 'urgente', label: '🔥 Urgente' },
  { value: 'alta', label: '⬆️ Alta' },
  { value: 'media', label: '➡️ Media' },
  { value: 'baja', label: '⬇️ Baja' },
];

// Opciones de origen
const ORIGEN_OPTIONS = [
  { value: 'all', label: '🌐 Todos los orígenes' },
  { value: 'web', label: '🌐 Sitio Web' },
  { value: 'web-authenticated', label: '👤 Web (Registrado)' },
  { value: 'chat', label: '💬 Chat' },
  { value: 'facebook', label: '📘 Facebook' },
  { value: 'instagram', label: '📷 Instagram' },
  { value: 'google', label: '🔍 Google' },
  { value: 'referido', label: '👥 Referido' },
  { value: 'directo', label: '📞 Directo' },
  { value: 'otro', label: '📋 Otro' },
];

/**
 * 🎨 Componente LeadFiltersComponent
 */
export const LeadFiltersComponent: React.FC<LeadFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onRefresh,
  defaultExpanded = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, onSearch]);

  // Contar filtros activos
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.estado && filters.estado !== 'all') count++;
    if (filters.prioridad && filters.prioridad !== 'all') count++;
    if (filters.origen && filters.origen !== 'all') count++;
    return count;
  };

  const hasActiveFilters = () => getActiveFilterCount() > 0;

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    onSearch('');
    onFilterChange('estado', 'all');
    onFilterChange('prioridad', 'all');
    onFilterChange('origen', 'all');
  };

  return (
    <div className="bg-transparent">
      {/* Header colapsable */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <span className="text-purple-600 dark:text-purple-400">🔍</span>
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
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
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
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 pt-2 space-y-4">
          {/* Fila 1: Búsqueda */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Buscar por nombre, email o empresa
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar leads..."
                className="w-full pl-9 pr-8 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500"
              />
              <span className="absolute left-3 top-3 text-gray-400 text-sm">🔍</span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    onSearch('');
                  }}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Fila 2: Selectores en grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Estado */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Estado
              </label>
              <select
                value={filters.estado || 'all'}
                onChange={(e) => onFilterChange('estado', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
              >
                {ESTADO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Prioridad
              </label>
              <select
                value={filters.prioridad || 'all'}
                onChange={(e) => onFilterChange('prioridad', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
              >
                {PRIORIDAD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Origen */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Origen
              </label>
              <select
                value={filters.origen || 'all'}
                onChange={(e) => onFilterChange('origen', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
              >
                {ORIGEN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 3: Filtros rápidos y acciones */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            {/* Filtros rápidos */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Rápidos:
              </span>
              <button
                type="button"
                onClick={() => {
                  onFilterChange('estado', 'all');
                  onFilterChange('prioridad', 'all');
                  onFilterChange('origen', 'all');
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  (!filters.estado || filters.estado === 'all') &&
                  (!filters.prioridad || filters.prioridad === 'all') &&
                  (!filters.origen || filters.origen === 'all')
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                📊 Todos
              </button>
              <button
                type="button"
                onClick={() => onFilterChange('origen', 'web-authenticated')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  filters.origen === 'web-authenticated'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                👤 Registrados
              </button>
              <button
                type="button"
                onClick={() => onFilterChange('estado', 'nuevo')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  filters.estado === 'nuevo'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                🆕 Nuevos
              </button>
              <button
                type="button"
                onClick={() => onFilterChange('prioridad', 'alta')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  filters.prioridad === 'alta'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ⭐ Alta prioridad
              </button>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2">
              {/* Limpiar filtros */}
              {hasActiveFilters() && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Limpiar
                </button>
              )}

              {/* Refrescar */}
              <button
                type="button"
                onClick={onRefresh}
                className="px-3 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refrescar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadFiltersComponent;
