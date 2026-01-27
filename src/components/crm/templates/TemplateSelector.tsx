/**
 * 🎯 TEMPLATE SELECTOR - Selector de Plantillas
 * Componente para seleccionar una plantilla de mensaje
 */

import React, { useState, useEffect } from 'react';
import { TemplateCard } from './TemplateCard';
import type { MessageTemplate, TemplateType, TemplateCategory } from '../../../types/message.types';

interface TemplateSelectorProps {
  templates: MessageTemplate[];
  onSelect: (template: MessageTemplate) => void;
  onClose?: () => void;
  tipo?: TemplateType | 'all';
  searchable?: boolean;
  showFavorites?: boolean;
  favorites?: string[];
  onToggleFavorite?: (templateId: string) => void;
  compact?: boolean;
  maxHeight?: string;
}

/**
 * 🎨 Componente TemplateSelector
 */
export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  onSelect,
  onClose,
  tipo = 'all',
  searchable = true,
  showFavorites = false,
  favorites = [],
  onToggleFavorite,
  compact = false,
  maxHeight = '500px',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<TemplateType | 'all'>(tipo);
  const [selectedCategoria, setSelectedCategoria] = useState<TemplateCategory | 'all'>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // ========================================
  // 🔄 EFECTOS
  // ========================================

  useEffect(() => {
    setSelectedTipo(tipo);
  }, [tipo]);

  // ========================================
  // 🔄 HANDLERS
  // ========================================

  const handleSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template._id);
    onSelect(template);
    if (onClose) {
      setTimeout(() => onClose(), 300); // Pequeño delay para feedback visual
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTipo(tipo);
    setSelectedCategoria('all');
    setShowOnlyFavorites(false);
  };

  // ========================================
  // 📊 FILTRADO DE PLANTILLAS
  // ========================================

  const filteredTemplates = templates.filter((template) => {
    // Filtro por activas
    if (!template.esActiva) return false;

    // Filtro por tipo
    if (selectedTipo !== 'all' && template.tipo !== selectedTipo) {
      return false;
    }

    // Filtro por categoría
    if (selectedCategoria !== 'all' && template.categoria !== selectedCategoria) {
      return false;
    }

    // Filtro por favoritos
    if (showOnlyFavorites && !favorites.includes(template._id)) {
      return false;
    }

    // Filtro por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchTitle = template.titulo.toLowerCase().includes(searchLower);
      const matchDescription = template.descripcion?.toLowerCase().includes(searchLower);
      const matchContent = template.contenido.toLowerCase().includes(searchLower);
      const matchTags = template.etiquetas?.some((tag) =>
        tag.toLowerCase().includes(searchLower)
      );
      
      if (!matchTitle && !matchDescription && !matchContent && !matchTags) {
        return false;
      }
    }

    return true;
  });

  // Ordenar por: favoritos primero, luego por uso
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    const aIsFavorite = favorites.includes(a._id);
    const bIsFavorite = favorites.includes(b._id);
    
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    
    return b.vecesUsada - a.vecesUsada;
  });

  // ========================================
  // 📊 ESTADÍSTICAS
  // ========================================

  const getCategorias = (): TemplateCategory[] => {
    const categoriasSet = new Set<TemplateCategory>();
    templates.forEach((t) => {
      if (t.categoria) categoriasSet.add(t.categoria);
    });
    return Array.from(categoriasSet);
  };

  const hasActiveFilters = () => {
    return (
      searchTerm !== '' ||
      selectedTipo !== tipo ||
      selectedCategoria !== 'all' ||
      showOnlyFavorites
    );
  };

  // ========================================
  // 🎨 RENDER
  // ========================================

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📋</span>
            Seleccionar Plantilla
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <span className="text-xl">✖</span>
            </button>
          )}
        </div>

        {/* Búsqueda */}
        {searchable && (
          <div className="relative mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Buscar plantillas..."
              className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
            )}
          </div>
        )}

        {/* Filtros */}
        <div className="space-y-2">
          {/* Filtro por tipo */}
          {tipo === 'all' && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTipo('all')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  selectedTipo === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedTipo('nota_interna')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  selectedTipo === 'nota_interna'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                📝 Notas
              </button>
              <button
                onClick={() => setSelectedTipo('mensaje_cliente')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  selectedTipo === 'mensaje_cliente'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                💬 Mensajes
              </button>
            </div>
          )}

          {/* Filtro por categoría */}
          {getCategorias().length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategoria('all')}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  selectedCategoria === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Todas
              </button>
              {getCategorias().map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoria(cat)}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    selectedCategoria === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Toggle favoritos */}
          {showFavorites && favorites.length > 0 && (
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                showOnlyFavorites
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              ⭐ Solo favoritos ({favorites.length})
            </button>
          )}
        </div>

        {/* Stats y limpiar filtros */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-600 dark:text-gray-400">
          <div>
            {sortedTemplates.length} plantilla{sortedTemplates.length !== 1 ? 's' : ''}{' '}
            {hasActiveFilters() && `de ${templates.length}`}
          </div>
          {hasActiveFilters() && (
            <button
              onClick={handleClearFilters}
              className="text-red-600 dark:text-red-400 hover:underline"
            >
              🗑️ Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Lista de plantillas */}
      <div
        className="overflow-y-auto p-4"
        style={{ maxHeight }}
      >
        {sortedTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay plantillas disponibles
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              {hasActiveFilters()
                ? 'No se encontraron plantillas con los filtros seleccionados'
                : 'No hay plantillas creadas para este tipo de mensaje'}
            </p>
          </div>
        ) : (
          <div className={compact ? 'space-y-2' : 'grid gap-4'}>
            {sortedTemplates.map((template) => (
              <TemplateCard
                key={template._id}
                template={template}
                onSelect={handleSelect}
                onToggleFavorite={onToggleFavorite}
                isSelected={selectedTemplate === template._id}
                isFavorite={favorites.includes(template._id)}
                showActions={false}
                compact={compact}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer con atajos */}
      {!compact && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <div>💡 Tip: Las plantillas más usadas aparecen primero</div>
            {onClose && (
              <div>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">ESC</kbd> para cerrar
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
