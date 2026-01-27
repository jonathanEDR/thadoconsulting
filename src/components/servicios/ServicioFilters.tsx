/**
 * 🔍 FILTROS DE SERVICIOS - ServicioFiltersPanel
 * Componente para filtrar servicios con múltiples opciones
 */

import React, { useState } from 'react';
import type { ServicioFilters } from '../../types/servicios';

// ============================================
// TIPOS
// ============================================

interface ServicioFiltersPanelProps {
  filters: ServicioFilters;
  onChange: (filters: ServicioFilters) => void;
  onReset: () => void;
  showAdvanced?: boolean;
  className?: string;
}

// ============================================
// COMPONENTE
// ============================================

/**
 * Panel de filtros avanzados para servicios
 * 
 * @example
 * ```tsx
 * const [filters, setFilters] = useState<ServicioFilters>({});
 * 
 * <ServicioFiltersPanel
 *   filters={filters}
 *   onChange={setFilters}
 *   onReset={() => setFilters({})}
 *   showAdvanced
 * />
 * ```
 */
export const ServicioFiltersPanel: React.FC<ServicioFiltersPanelProps> = ({
  filters,
  onChange,
  onReset,
  showAdvanced = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // ============================================
  // FUNCIONES
  // ============================================

  /**
   * Actualizar un filtro específico
   */
  const updateFilter = (key: keyof ServicioFilters, value: any) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  /**
   * Contar filtros activos
   */
  const countActiveFilters = (): number => {
    return Object.values(filters).filter(v => v !== undefined && v !== '').length;
  };

  const activeFiltersCount = countActiveFilters();

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">🔍 Filtros</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/50 text-xs px-2 py-1 rounded-full font-semibold">
                {activeFiltersCount} activos
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={onReset}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Limpiar todo
              </button>
            )}
            {showAdvanced && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
              >
                {isExpanded ? '▲' : '▼'} {isExpanded ? 'Ocultar' : 'Más filtros'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros básicos */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Buscar por título, descripción..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoría
            </label>
            <select
              value={filters.categoria || ''}
              onChange={(e) => updateFilter('categoria', e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todas</option>
              <option value="desarrollo">💻 Desarrollo</option>
              <option value="diseño">🎨 Diseño</option>
              <option value="marketing">📊 Marketing</option>
              <option value="consultoría">💼 Consultoría</option>
              <option value="mantenimiento">🔧 Mantenimiento</option>
              <option value="otro">📦 Otro</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={filters.estado || ''}
              onChange={(e) => updateFilter('estado', e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="activo">✓ Activo</option>
              <option value="desarrollo">⚙️ En desarrollo</option>
              <option value="pausado">⏸️ Pausado</option>
              <option value="descontinuado">❌ Descontinuado</option>
              <option value="agotado">🚫 Agotado</option>
            </select>
          </div>
        </div>

        {/* Filtros avanzados (expandibles) */}
        {isExpanded && showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Precio mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio mínimo
                </label>
                <input
                  type="number"
                  value={filters.precioMin || ''}
                  onChange={(e) => updateFilter('precioMin', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="0"
                  min="0"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Precio máximo */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio máximo
                </label>
                <input
                  type="number"
                  value={filters.precioMax || ''}
                  onChange={(e) => updateFilter('precioMax', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="10000"
                  min="0"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Tipo de precio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de precio
                </label>
                <select
                  value={filters.tipoPrecio || ''}
                  onChange={(e) => updateFilter('tipoPrecio', e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="fijo">Fijo</option>
                  <option value="rango">Rango</option>
                  <option value="paquetes">Paquetes</option>
                  <option value="personalizado">Personalizado</option>
                  <option value="suscripcion">Suscripción</option>
                </select>
              </div>

              {/* Departamento */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Departamento
                </label>
                <select
                  value={filters.departamento || ''}
                  onChange={(e) => updateFilter('departamento', e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="ventas">Ventas</option>
                  <option value="desarrollo">Desarrollo</option>
                  <option value="marketing">Marketing</option>
                  <option value="diseño">Diseño</option>
                  <option value="soporte">Soporte</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Switches/Checkboxes */}
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.destacado || false}
                onChange={(e) => updateFilter('destacado', e.target.checked || undefined)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                ★ Solo destacados
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.activo || false}
                onChange={(e) => updateFilter('activo', e.target.checked || undefined)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                ✓ Solo activos
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.visibleEnWeb || false}
                onChange={(e) => updateFilter('visibleEnWeb', e.target.checked || undefined)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                👁️ Visibles en web
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.includeDeleted || false}
                onChange={(e) => updateFilter('includeDeleted', e.target.checked || undefined)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                🗑️ Incluir eliminados
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicioFiltersPanel;
