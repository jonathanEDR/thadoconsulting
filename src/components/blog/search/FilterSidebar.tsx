/**
 * 🎛️ FilterSidebar Component
 * Sidebar de filtros avanzados para búsqueda
 */

import { useState } from 'react';
import { X, ChevronDown, ChevronUp, Calendar, Tag, Folder } from 'lucide-react';
import type { BlogCategory } from '../../../types/blog';

interface FilterOptions {
  categories?: string[];
  tags?: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
  sortBy?: string;
}

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories?: BlogCategory[];
  popularTags?: Array<{ name: string; count: number }>;
  onClose?: () => void;
  className?: string;
}

export default function FilterSidebar({
  filters,
  onFiltersChange,
  categories = [],
  popularTags = [],
  onClose,
  className = ''
}: FilterSidebarProps) {
  
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    tags: true,
    date: false,
    sort: true
  });

  // Toggle sección
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Manejar cambio de categoría
  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  // Manejar cambio de tag
  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFiltersChange({ ...filters, tags: newTags });
  };

  // Manejar cambio de rango de fechas
  const handleDateChange = (field: 'from' | 'to', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  // Manejar cambio de ordenamiento
  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy });
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    onFiltersChange({
      categories: [],
      tags: [],
      dateRange: {},
      sortBy: 'newest'
    });
  };

  // Contar filtros activos
  const activeFiltersCount = 
    (filters.categories?.length || 0) +
    (filters.tags?.length || 0) +
    (filters.dateRange?.from || filters.dateRange?.to ? 1 : 0);

  return (
    <div className={`filter-sidebar bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
          {activeFiltersCount > 0 && (
            <p className="text-sm text-gray-500">
              {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro activo' : 'filtros activos'}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpiar
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Ordenamiento */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('sort')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">Ordenar por</span>
            {expandedSections.sort ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSections.sort && (
            <div className="px-4 pb-4 space-y-2">
              {[
                { value: 'newest', label: 'Más recientes' },
                { value: 'oldest', label: 'Más antiguos' },
                { value: 'popular', label: 'Más populares' },
                { value: 'trending', label: 'Tendencia' }
              ].map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Categorías */}
        {categories.length > 0 && (
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('categories')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-gray-400" />
                <span className="font-semibold text-gray-900">Categorías</span>
                {filters.categories && filters.categories.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {filters.categories.length}
                  </span>
                )}
              </div>
              {expandedSections.categories ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.categories && (
              <div className="px-4 pb-4 space-y-2 max-h-64 overflow-y-auto">
                {categories.map(category => (
                  <label
                    key={category._id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories?.includes(category._id) || false}
                      onChange={() => handleCategoryToggle(category._id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-gray-700 flex-1">{category.name}</span>
                    {category.postCount && (
                      <span className="text-xs text-gray-400">({category.postCount})</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {popularTags.length > 0 && (
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('tags')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-400" />
                <span className="font-semibold text-gray-900">Tags</span>
                {filters.tags && filters.tags.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {filters.tags.length}
                  </span>
                )}
              </div>
              {expandedSections.tags ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.tags && (
              <div className="px-4 pb-4 space-y-2 max-h-64 overflow-y-auto">
                {popularTags.map((tag, index) => (
                  <label
                    key={`tag-${index}`}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.tags?.includes(tag.name) || false}
                      onChange={() => handleTagToggle(tag.name)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 flex-1">{tag.name}</span>
                    <span className="text-xs text-gray-400">({tag.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rango de fechas */}
        <div>
          <button
            onClick={() => toggleSection('date')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="font-semibold text-gray-900">Fecha de publicación</span>
            </div>
            {expandedSections.date ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSections.date && (
            <div className="px-4 pb-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={filters.dateRange?.from || ''}
                  onChange={(e) => handleDateChange('from', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={filters.dateRange?.to || ''}
                  onChange={(e) => handleDateChange('to', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
