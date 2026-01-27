/**
 * 🔍 PANEL DE FILTROS AVANZADOS
 * Componente lateral para filtrar servicios con múltiples criterios
 */

import { useState, useEffect } from 'react';
import type { ServicioFilters } from '../../types/filters';
import { 
  TIPO_PRECIO_OPTIONS, 
  ESTADO_OPTIONS 
} from '../../types/filters';
import { categoriasApi, type Categoria } from '../../services/categoriasApi';

// ============================================
// TIPOS
// ============================================

interface FiltersPanelProps {
  filters: ServicioFilters;
  onFiltersChange: (filters: ServicioFilters) => void;
  onClose?: () => void;
  isOpen?: boolean;
  resultCount?: number;
}

// ============================================
// ICONOS
// ============================================

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const ResetIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const FiltersPanel = ({
  filters,
  onFiltersChange,
  onClose,
  isOpen = true,
  resultCount = 0
}: FiltersPanelProps) => {
  const [localFilters, setLocalFilters] = useState<ServicioFilters>(filters);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Prevenir scroll del body cuando el panel esté abierto en móvil
  useEffect(() => {
    if (isOpen && onClose && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  // Cargar categorías dinámicas
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const response = await categoriasApi.getAll({ activas: true });
        setCategorias(response.data);
      } catch (error) {
        // Error cargando categorías
      }
    };
    loadCategorias();
  }, []);

  // Contar filtros activos
  useEffect(() => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.categorias?.length) count++;
    if (localFilters.precioMin !== undefined || localFilters.precioMax !== undefined) count++;
    if (localFilters.tipoPrecio?.length) count++;
    if (localFilters.estado?.length) count++;
    if (localFilters.destacado !== undefined) count++;
    if (localFilters.activo !== undefined) count++;
    if (localFilters.visibleEnWeb !== undefined) count++;
    if (localFilters.conPaquetes !== undefined) count++;
    if (localFilters.conImagenes !== undefined) count++;
    setActiveFiltersCount(count);
  }, [localFilters]);

  const handleFilterChange = (key: keyof ServicioFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryToggle = (category: string) => {
    const current = localFilters.categorias || [];
    const newCategories = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    handleFilterChange('categorias', newCategories.length ? newCategories : undefined);
  };

  const handleTipoPrecioToggle = (tipo: 'fijo' | 'desde' | 'personalizado') => {
    const current = localFilters.tipoPrecio || [];
    const newTipos = current.includes(tipo)
      ? current.filter(t => t !== tipo)
      : [...current, tipo];
    handleFilterChange('tipoPrecio', newTipos.length ? newTipos : undefined);
  };

  const handleEstadoToggle = (estado: 'activo' | 'inactivo' | 'borrador') => {
    const current = localFilters.estado || [];
    const newEstados = current.includes(estado)
      ? current.filter(e => e !== estado)
      : [...current, estado];
    handleFilterChange('estado', newEstados.length ? newEstados : undefined);
  };

  const handleResetFilters = () => {
    const emptyFilters: ServicioFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    // En móvil, cerrar el panel después de limpiar filtros
    if (onClose && window.innerWidth < 1024) {
      setTimeout(() => onClose(), 300);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay para móvil */}
      {onClose && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          role="button"
          aria-label="Cerrar panel de filtros"
        />
      )}

      {/* Panel lateral */}
      <div
        className={`
          fixed lg:relative lg:sticky top-0 left-0 
          h-screen lg:h-auto max-h-screen lg:max-h-none
          w-80 max-w-[80vw] lg:max-w-none
          bg-white dark:bg-gray-800 
          shadow-xl lg:shadow-lg lg:border lg:border-gray-200 lg:dark:border-gray-700 lg:rounded-lg
          z-50 lg:z-0
          overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FilterIcon />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filtros
              </h2>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Cerrar filtros"
                aria-label="Cerrar panel de filtros"
              >
                <CloseIcon />
              </button>
            )}
          </div>

          {/* Contador de resultados */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
          </p>

          {/* Botón reset */}
          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            >
              <ResetIcon />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="p-4 space-y-6">
          
          {/* CATEGORÍAS */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Categorías
            </h3>
            <div className="space-y-2">
              {categorias.map(categoria => (
                <label
                  key={categoria._id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.categorias?.includes(categoria.slug) || false}
                    onChange={() => handleCategoryToggle(categoria.slug)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span
                    className="w-3 h-3 rounded-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: categoria.color }}
                  >
                    {categoria.icono}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    {categoria.nombre}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    ({categoria.totalServicios})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* RANGO DE PRECIO */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Rango de Precio (USD)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Mínimo
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={localFilters.precioMin || ''}
                  onChange={e => handleFilterChange('precioMin', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Máximo
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="∞"
                  value={localFilters.precioMax || ''}
                  onChange={e => handleFilterChange('precioMax', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* TIPO DE PRECIO */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Tipo de Precio
            </h3>
            <div className="space-y-2">
              {TIPO_PRECIO_OPTIONS.map(tipo => (
                <label
                  key={tipo.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.tipoPrecio?.includes(tipo.value as any) || false}
                    onChange={() => handleTipoPrecioToggle(tipo.value as any)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span>{tipo.icon}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    {tipo.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ESTADO */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Estado
            </h3>
            <div className="space-y-2">
              {ESTADO_OPTIONS.map(estado => (
                <label
                  key={estado.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.estado?.includes(estado.value as any) || false}
                    onChange={() => handleEstadoToggle(estado.value as any)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className={`
                    px-2 py-0.5 text-xs font-medium rounded-full
                    ${estado.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}
                    ${estado.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : ''}
                    ${estado.color === 'gray' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : ''}
                  `}>
                    {estado.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* OPCIONES ADICIONALES */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Opciones
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.destacado === true}
                  onChange={e => handleFilterChange('destacado', e.target.checked ? true : undefined)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  ★ Solo destacados
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.activo === true}
                  onChange={e => handleFilterChange('activo', e.target.checked ? true : undefined)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  ✅ Solo activos
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.visibleEnWeb === true}
                  onChange={e => handleFilterChange('visibleEnWeb', e.target.checked ? true : undefined)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  🌐 Visible en web
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.conPaquetes === true}
                  onChange={e => handleFilterChange('conPaquetes', e.target.checked ? true : undefined)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  📦 Con paquetes
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.conImagenes === true}
                  onChange={e => handleFilterChange('conImagenes', e.target.checked ? true : undefined)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  🖼️ Con imágenes
                </span>
              </label>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default FiltersPanel;
