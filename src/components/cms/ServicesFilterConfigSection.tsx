/**
 * 🔍 CONFIGURACIÓN DE FILTROS DE SERVICIOS
 * Permite personalizar la sección de filtros en la página de servicios
 */

import React, { useState } from 'react';
import type { PageData } from '../../types/cms';

interface ServicesFilterConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const ServicesFilterConfigSection: React.FC<ServicesFilterConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [collapsed, setCollapsed] = useState(true);

  // Obtener configuración actual o usar valores por defecto
  const filterConfig = (pageData?.content as any)?.servicesFilter || {
    // Sección de búsqueda
    searchTitle: 'BUSCAR',
    searchDescription: 'Escribe aquí para encontrar el servicio que necesitas...',
    searchPlaceholder: 'Busca un servicio...',
    
    // Sección de categorías
    categoriesTitle: 'CATEGORÍAS',
    showAllCategoriesText: 'Todas las categorías',
    
    // Sección de ordenamiento
    sortTitle: 'ORDENAR',
    sortOptions: [
      { value: 'destacado', label: '★ Destacados', icon: '★' },
      { value: 'nuevo', label: '● Recientes', icon: '●' },
      { value: 'titulo', label: '◆ A-Z', icon: '◆' },
      { value: 'precio-asc', label: '▼ Menor precio', icon: '▼' },
      { value: 'precio-desc', label: '▲ Mayor precio', icon: '▲' }
    ],
    
    // Resultados
    resultsText: 'Resultados:',
    
    // Estilos
    styles: {
      // Borde del contenedor - Modo Claro
      borderStyle: 'gradient', // 'solid', 'gradient', 'none'
      borderGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      borderColor: '#8B5CF6',
      borderGradientFrom: '#8B5CF6',
      borderGradientTo: '#06B6D4',
      borderGradientDirection: '135deg',
      // Borde del contenedor - Modo Oscuro
      borderStyleDark: 'gradient',
      borderGradientDark: 'linear-gradient(135deg, #A78BFA, #22D3EE)',
      borderColorDark: '#A78BFA',
      borderGradientFromDark: '#A78BFA',
      borderGradientToDark: '#22D3EE',
      borderGradientDirectionDark: '135deg',
      // Configuración general del borde
      borderWidth: '2px',
      borderRadius: '1rem',
      
      // Fondo - Modo Claro
      backgroundColor: '#ffffff',
      bgTransparent: false,
      // Fondo - Modo Oscuro
      backgroundColorDark: '#1e293b',
      bgTransparentDark: false,
      
      // Fondo del Input de Búsqueda - Modo Claro
      searchInputBg: '#ffffff',
      searchInputBgTransparent: false,
      searchInputBorder: '#e5e7eb',
      searchInputText: '#111827',
      searchInputPlaceholder: '#9ca3af',
      // Fondo del Input de Búsqueda - Modo Oscuro
      searchInputBgDark: '#1f2937',
      searchInputBgTransparentDark: false,
      searchInputBorderDark: '#374151',
      searchInputTextDark: '#f9fafb',
      searchInputPlaceholderDark: '#6b7280',
      
      // Fondo del Select de Ordenamiento - Modo Claro
      sortSelectBg: '#ffffff',
      sortSelectBgTransparent: false,
      sortSelectBorder: '#e5e7eb',
      sortSelectText: '#111827',
      // Fondo del Select de Ordenamiento - Modo Oscuro
      sortSelectBgDark: '#1f2937',
      sortSelectBgTransparentDark: false,
      sortSelectBorderDark: '#374151',
      sortSelectTextDark: '#f9fafb',
      
      // Iconos del Panel - Modo Claro
      iconSearchColor: '#9ca3af',
      iconDropdownColor: '#6b7280',
      iconClearColor: '#9ca3af',
      // Iconos del Panel - Modo Oscuro
      iconSearchColorDark: '#6b7280',
      iconDropdownColorDark: '#9ca3af',
      iconClearColorDark: '#6b7280',
      
      // Títulos de sección
      sectionTitleColor: '#8B5CF6',
      sectionTitleColorDark: '#A78BFA',
      
      // Texto
      textColor: '#374151',
      textColorDark: '#D1D5DB',
      
      // Categoría activa - Modo Claro
      activeCategoryBg: 'rgba(139, 92, 246, 0.1)',
      activeCategoryBgStyle: 'solid', // 'solid', 'gradient', 'transparent'
      activeCategoryBgGradientFrom: '#8B5CF6',
      activeCategoryBgGradientTo: '#06B6D4',
      activeCategoryBgGradientDirection: '135deg',
      activeCategoryText: '#8B5CF6',
      activeCategoryTextStyle: 'solid', // 'solid', 'gradient'
      activeCategoryTextGradientFrom: '#8B5CF6',
      activeCategoryTextGradientTo: '#06B6D4',
      activeCategoryTextGradientDirection: '90deg',
      activeCategoryBorder: '#8B5CF6',
      activeCategoryBorderStyle: 'solid', // 'solid', 'gradient', 'none'
      activeCategoryBorderGradientFrom: '#8B5CF6',
      activeCategoryBorderGradientTo: '#06B6D4',
      activeCategoryBorderGradientDirection: '90deg',
      // Categoría activa - Modo Oscuro
      activeCategoryBgDark: 'rgba(139, 92, 246, 0.2)',
      activeCategoryBgStyleDark: 'solid',
      activeCategoryBgGradientFromDark: '#A78BFA',
      activeCategoryBgGradientToDark: '#22D3EE',
      activeCategoryBgGradientDirectionDark: '135deg',
      activeCategoryTextDark: '#A78BFA',
      activeCategoryTextStyleDark: 'solid',
      activeCategoryTextGradientFromDark: '#A78BFA',
      activeCategoryTextGradientToDark: '#22D3EE',
      activeCategoryTextGradientDirectionDark: '90deg',
      activeCategoryBorderDark: '#A78BFA',
      activeCategoryBorderStyleDark: 'solid',
      activeCategoryBorderGradientFromDark: '#A78BFA',
      activeCategoryBorderGradientToDark: '#22D3EE',
      activeCategoryBorderGradientDirectionDark: '90deg'
    }
  };

  const handleUpdateFilter = (field: string, value: any) => {
    updateContent(`servicesFilter.${field}`, value);
  };

  const handleUpdateStyle = (field: string, value: string | boolean) => {
    updateContent(`servicesFilter.styles.${field}`, value);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
      >
        <span className="flex items-center gap-2">
          🔍 Configuración de Filtros de Servicios
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {!collapsed && (
        <div className="space-y-8">
          
          {/* ===== SECCIÓN DE BÚSQUEDA ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              🔎 Sección de Búsqueda
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Título de la sección
                </label>
                <input
                  type="text"
                  value={filterConfig.searchTitle}
                  onChange={(e) => handleUpdateFilter('searchTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="BUSCAR"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Placeholder del input
                </label>
                <input
                  type="text"
                  value={filterConfig.searchPlaceholder}
                  onChange={(e) => handleUpdateFilter('searchPlaceholder', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Busca un servicio..."
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Descripción debajo del título
                </label>
                <input
                  type="text"
                  value={filterConfig.searchDescription}
                  onChange={(e) => handleUpdateFilter('searchDescription', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Escribe aquí para encontrar el servicio..."
                />
              </div>
            </div>
            
            {/* Estilos del Input de Búsqueda */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                🎨 Estilos del Input de Búsqueda
              </h4>
              
              {/* Modo Claro */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                  ☀️ Modo Claro
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Fondo transparente */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="searchInputBgTransparent"
                      checked={filterConfig.styles?.searchInputBgTransparent === true || filterConfig.styles?.searchInputBgTransparent === 'true'}
                      onChange={(e) => handleUpdateStyle('searchInputBgTransparent', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="searchInputBgTransparent" className="text-sm text-gray-600 dark:text-gray-400">
                      Fondo Transparente
                    </label>
                  </div>
                  
                  {/* Color de fondo */}
                  {!(filterConfig.styles?.searchInputBgTransparent === true || filterConfig.styles?.searchInputBgTransparent === 'true') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Color de Fondo
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={filterConfig.styles?.searchInputBg || '#ffffff'}
                          onChange={(e) => handleUpdateStyle('searchInputBg', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={filterConfig.styles?.searchInputBg || '#ffffff'}
                          onChange={(e) => handleUpdateStyle('searchInputBg', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Color del borde */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Color del Borde
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.searchInputBorder || '#e5e7eb'}
                        onChange={(e) => handleUpdateStyle('searchInputBorder', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.searchInputBorder || '#e5e7eb'}
                        onChange={(e) => handleUpdateStyle('searchInputBorder', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="#e5e7eb"
                      />
                    </div>
                  </div>
                  
                  {/* Color del texto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Color del Texto
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.searchInputText || '#111827'}
                        onChange={(e) => handleUpdateStyle('searchInputText', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.searchInputText || '#111827'}
                        onChange={(e) => handleUpdateStyle('searchInputText', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="#111827"
                      />
                    </div>
                  </div>
                  
                  {/* Color del placeholder */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Color del Placeholder
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.searchInputPlaceholder || '#9ca3af'}
                        onChange={(e) => handleUpdateStyle('searchInputPlaceholder', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.searchInputPlaceholder || '#9ca3af'}
                        onChange={(e) => handleUpdateStyle('searchInputPlaceholder', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="#9ca3af"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modo Oscuro */}
              <div className="p-4 bg-gray-800 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  🌙 Modo Oscuro
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Fondo transparente */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="searchInputBgTransparentDark"
                      checked={filterConfig.styles?.searchInputBgTransparentDark === true || filterConfig.styles?.searchInputBgTransparentDark === 'true'}
                      onChange={(e) => handleUpdateStyle('searchInputBgTransparentDark', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="searchInputBgTransparentDark" className="text-sm text-gray-300">
                      Fondo Transparente
                    </label>
                  </div>
                  
                  {/* Color de fondo */}
                  {!(filterConfig.styles?.searchInputBgTransparentDark === true || filterConfig.styles?.searchInputBgTransparentDark === 'true') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Color de Fondo
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={filterConfig.styles?.searchInputBgDark || '#1f2937'}
                          onChange={(e) => handleUpdateStyle('searchInputBgDark', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                        />
                        <input
                          type="text"
                          value={filterConfig.styles?.searchInputBgDark || '#1f2937'}
                          onChange={(e) => handleUpdateStyle('searchInputBgDark', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm"
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Color del borde */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Color del Borde
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.searchInputBorderDark || '#374151'}
                        onChange={(e) => handleUpdateStyle('searchInputBorderDark', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.searchInputBorderDark || '#374151'}
                        onChange={(e) => handleUpdateStyle('searchInputBorderDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm"
                        placeholder="#374151"
                      />
                    </div>
                  </div>
                  
                  {/* Color del texto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Color del Texto
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.searchInputTextDark || '#f9fafb'}
                        onChange={(e) => handleUpdateStyle('searchInputTextDark', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.searchInputTextDark || '#f9fafb'}
                        onChange={(e) => handleUpdateStyle('searchInputTextDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm"
                        placeholder="#f9fafb"
                      />
                    </div>
                  </div>
                  
                  {/* Color del placeholder */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Color del Placeholder
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.searchInputPlaceholderDark || '#6b7280'}
                        onChange={(e) => handleUpdateStyle('searchInputPlaceholderDark', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.searchInputPlaceholderDark || '#6b7280'}
                        onChange={(e) => handleUpdateStyle('searchInputPlaceholderDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm"
                        placeholder="#6b7280"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== SECCIÓN DE CATEGORÍAS ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              📂 Sección de Categorías
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Título de la sección
                </label>
                <input
                  type="text"
                  value={filterConfig.categoriesTitle}
                  onChange={(e) => handleUpdateFilter('categoriesTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="CATEGORÍAS"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Texto "Todas las categorías"
                </label>
                <input
                  type="text"
                  value={filterConfig.showAllCategoriesText}
                  onChange={(e) => handleUpdateFilter('showAllCategoriesText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Todas las categorías"
                />
              </div>
            </div>
            
            {/* Estilos de Categoría Activa/Seleccionada */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                ✨ Estilos de Categoría Seleccionada
              </h4>
              
              {/* Modo Claro */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
                  ☀️ Modo Claro
                </h5>
                
                {/* FONDO */}
                <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h6 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">🎨 Fondo</h6>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Tipo</label>
                      <select
                        value={filterConfig.styles?.activeCategoryBgStyle || 'solid'}
                        onChange={(e) => handleUpdateStyle('activeCategoryBgStyle', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="solid">Sólido</option>
                        <option value="gradient">Gradiente</option>
                        <option value="transparent">Transparente</option>
                      </select>
                    </div>
                    
                    {filterConfig.styles?.activeCategoryBgStyle === 'solid' && (
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color</label>
                        <div className="flex gap-1">
                          <input
                            type="color"
                            value={filterConfig.styles?.activeCategoryBg || '#8B5CF6'}
                            onChange={(e) => handleUpdateStyle('activeCategoryBg', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={filterConfig.styles?.activeCategoryBg || 'rgba(139, 92, 246, 0.1)'}
                            onChange={(e) => handleUpdateStyle('activeCategoryBg', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                    
                    {filterConfig.styles?.activeCategoryBgStyle === 'gradient' && (
                      <>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Desde</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.activeCategoryBgGradientFrom || '#8B5CF6'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBgGradientFrom', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.activeCategoryBgGradientFrom || '#8B5CF6'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBgGradientFrom', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Hasta</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.activeCategoryBgGradientTo || '#06B6D4'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBgGradientTo', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.activeCategoryBgGradientTo || '#06B6D4'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBgGradientTo', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Dirección</label>
                          <select
                            value={filterConfig.styles?.activeCategoryBgGradientDirection || '135deg'}
                            onChange={(e) => handleUpdateStyle('activeCategoryBgGradientDirection', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="0deg">↑ Arriba</option>
                            <option value="45deg">↗ Diagonal</option>
                            <option value="90deg">→ Derecha</option>
                            <option value="135deg">↘ Diagonal</option>
                            <option value="180deg">↓ Abajo</option>
                            <option value="225deg">↙ Diagonal</option>
                            <option value="270deg">← Izquierda</option>
                            <option value="315deg">↖ Diagonal</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* TEXTO */}
                <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h6 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">📝 Texto</h6>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Tipo</label>
                      <select
                        value={filterConfig.styles?.activeCategoryTextStyle || 'solid'}
                        onChange={(e) => handleUpdateStyle('activeCategoryTextStyle', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="solid">Sólido</option>
                        <option value="gradient">Gradiente</option>
                      </select>
                    </div>
                    
                    {filterConfig.styles?.activeCategoryTextStyle !== 'gradient' && (
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color</label>
                        <div className="flex gap-1">
                          <input
                            type="color"
                            value={filterConfig.styles?.activeCategoryText || '#8B5CF6'}
                            onChange={(e) => handleUpdateStyle('activeCategoryText', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={filterConfig.styles?.activeCategoryText || '#8B5CF6'}
                            onChange={(e) => handleUpdateStyle('activeCategoryText', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                    
                    {filterConfig.styles?.activeCategoryTextStyle === 'gradient' && (
                      <>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Desde</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.activeCategoryTextGradientFrom || '#8B5CF6'}
                              onChange={(e) => handleUpdateStyle('activeCategoryTextGradientFrom', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.activeCategoryTextGradientFrom || '#8B5CF6'}
                              onChange={(e) => handleUpdateStyle('activeCategoryTextGradientFrom', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Hasta</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.activeCategoryTextGradientTo || '#06B6D4'}
                              onChange={(e) => handleUpdateStyle('activeCategoryTextGradientTo', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.activeCategoryTextGradientTo || '#06B6D4'}
                              onChange={(e) => handleUpdateStyle('activeCategoryTextGradientTo', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Dirección</label>
                          <select
                            value={filterConfig.styles?.activeCategoryTextGradientDirection || '90deg'}
                            onChange={(e) => handleUpdateStyle('activeCategoryTextGradientDirection', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="0deg">↑ Arriba</option>
                            <option value="45deg">↗ Diagonal</option>
                            <option value="90deg">→ Derecha</option>
                            <option value="135deg">↘ Diagonal</option>
                            <option value="180deg">↓ Abajo</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* BORDE */}
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h6 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">🔲 Borde Izquierdo</h6>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Tipo</label>
                      <select
                        value={filterConfig.styles?.activeCategoryBorderStyle || 'solid'}
                        onChange={(e) => handleUpdateStyle('activeCategoryBorderStyle', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="solid">Sólido</option>
                        <option value="gradient">Gradiente</option>
                        <option value="none">Sin borde</option>
                      </select>
                    </div>
                    
                    {filterConfig.styles?.activeCategoryBorderStyle !== 'gradient' && filterConfig.styles?.activeCategoryBorderStyle !== 'none' && (
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color</label>
                        <div className="flex gap-1">
                          <input
                            type="color"
                            value={filterConfig.styles?.activeCategoryBorder || '#8B5CF6'}
                            onChange={(e) => handleUpdateStyle('activeCategoryBorder', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={filterConfig.styles?.activeCategoryBorder || '#8B5CF6'}
                            onChange={(e) => handleUpdateStyle('activeCategoryBorder', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                    
                    {filterConfig.styles?.activeCategoryBorderStyle === 'gradient' && (
                      <>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Desde</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.activeCategoryBorderGradientFrom || '#8B5CF6'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBorderGradientFrom', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.activeCategoryBorderGradientFrom || '#8B5CF6'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBorderGradientFrom', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Hasta</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.activeCategoryBorderGradientTo || '#06B6D4'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBorderGradientTo', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.activeCategoryBorderGradientTo || '#06B6D4'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBorderGradientTo', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Modo Oscuro */}
              <div className="p-4 bg-gray-800 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  🌙 Modo Oscuro
                </h5>
                
                {/* FONDO DARK */}
                <div className="mb-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
                  <h6 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">🎨 Fondo</h6>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Tipo</label>
                      <select
                        value={filterConfig.styles?.activeCategoryBgStyleDark || 'solid'}
                        onChange={(e) => handleUpdateStyle('activeCategoryBgStyleDark', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-600 rounded bg-gray-800 text-white"
                      >
                        <option value="solid">Sólido</option>
                        <option value="gradient">Gradiente</option>
                        <option value="transparent">Transparente</option>
                      </select>
                    </div>
                    
                    {filterConfig.styles?.activeCategoryBgStyleDark === 'solid' && (
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Color</label>
                        <div className="flex gap-1">
                          <input
                            type="color"
                            value={filterConfig.styles?.activeCategoryBgDark || '#A78BFA'}
                            onChange={(e) => handleUpdateStyle('activeCategoryBgDark', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={filterConfig.styles?.activeCategoryBgDark || 'rgba(139, 92, 246, 0.2)'}
                            onChange={(e) => handleUpdateStyle('activeCategoryBgDark', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-800 text-white"
                          />
                        </div>
                      </div>
                    )}
                    
                    {filterConfig.styles?.activeCategoryBgStyleDark === 'gradient' && (
                      <>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Desde</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.activeCategoryBgGradientFromDark || '#A78BFA'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBgGradientFromDark', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.activeCategoryBgGradientFromDark || '#A78BFA'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBgGradientFromDark', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-800 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Hasta</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.activeCategoryBgGradientToDark || '#22D3EE'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBgGradientToDark', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.activeCategoryBgGradientToDark || '#22D3EE'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBgGradientToDark', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-800 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Dirección</label>
                          <select
                            value={filterConfig.styles?.activeCategoryBgGradientDirectionDark || '135deg'}
                            onChange={(e) => handleUpdateStyle('activeCategoryBgGradientDirectionDark', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-gray-600 rounded bg-gray-800 text-white"
                          >
                            <option value="0deg">↑ Arriba</option>
                            <option value="45deg">↗ Diagonal</option>
                            <option value="90deg">→ Derecha</option>
                            <option value="135deg">↘ Diagonal</option>
                            <option value="180deg">↓ Abajo</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* TEXTO DARK */}
                <div className="mb-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
                  <h6 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">📝 Texto</h6>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Tipo</label>
                      <select
                        value={filterConfig.styles?.activeCategoryTextStyleDark || 'solid'}
                        onChange={(e) => handleUpdateStyle('activeCategoryTextStyleDark', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-600 rounded bg-gray-800 text-white"
                      >
                        <option value="solid">Sólido</option>
                        <option value="gradient">Gradiente</option>
                      </select>
                    </div>
                    
                    {filterConfig.styles?.activeCategoryTextStyleDark !== 'gradient' && (
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Color</label>
                        <div className="flex gap-1">
                          <input
                            type="color"
                            value={filterConfig.styles?.activeCategoryTextDark || '#A78BFA'}
                            onChange={(e) => handleUpdateStyle('activeCategoryTextDark', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={filterConfig.styles?.activeCategoryTextDark || '#A78BFA'}
                            onChange={(e) => handleUpdateStyle('activeCategoryTextDark', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-800 text-white"
                          />
                        </div>
                      </div>
                    )}
                    
                    {filterConfig.styles?.activeCategoryTextStyleDark === 'gradient' && (
                      <>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Desde</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.activeCategoryTextGradientFromDark || '#A78BFA'}
                              onChange={(e) => handleUpdateStyle('activeCategoryTextGradientFromDark', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.activeCategoryTextGradientFromDark || '#A78BFA'}
                              onChange={(e) => handleUpdateStyle('activeCategoryTextGradientFromDark', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-800 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Hasta</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.activeCategoryTextGradientToDark || '#22D3EE'}
                              onChange={(e) => handleUpdateStyle('activeCategoryTextGradientToDark', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.activeCategoryTextGradientToDark || '#22D3EE'}
                              onChange={(e) => handleUpdateStyle('activeCategoryTextGradientToDark', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-800 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Dirección</label>
                          <select
                            value={filterConfig.styles?.activeCategoryTextGradientDirectionDark || '90deg'}
                            onChange={(e) => handleUpdateStyle('activeCategoryTextGradientDirectionDark', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-gray-600 rounded bg-gray-800 text-white"
                          >
                            <option value="0deg">↑ Arriba</option>
                            <option value="45deg">↗ Diagonal</option>
                            <option value="90deg">→ Derecha</option>
                            <option value="135deg">↘ Diagonal</option>
                            <option value="180deg">↓ Abajo</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* BORDE DARK */}
                <div className="p-3 bg-gray-700 rounded-lg border border-gray-600">
                  <h6 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">🔲 Borde Izquierdo</h6>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Tipo</label>
                      <select
                        value={filterConfig.styles?.activeCategoryBorderStyleDark || 'solid'}
                        onChange={(e) => handleUpdateStyle('activeCategoryBorderStyleDark', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-600 rounded bg-gray-800 text-white"
                      >
                        <option value="solid">Sólido</option>
                        <option value="gradient">Gradiente</option>
                        <option value="none">Sin borde</option>
                      </select>
                    </div>
                    
                    {filterConfig.styles?.activeCategoryBorderStyleDark !== 'gradient' && filterConfig.styles?.activeCategoryBorderStyleDark !== 'none' && (
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Color</label>
                        <div className="flex gap-1">
                          <input
                            type="color"
                            value={filterConfig.styles?.activeCategoryBorderDark || '#A78BFA'}
                            onChange={(e) => handleUpdateStyle('activeCategoryBorderDark', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={filterConfig.styles?.activeCategoryBorderDark || '#A78BFA'}
                            onChange={(e) => handleUpdateStyle('activeCategoryBorderDark', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-800 text-white"
                          />
                        </div>
                      </div>
                    )}
                    
                    {filterConfig.styles?.activeCategoryBorderStyleDark === 'gradient' && (
                      <>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Desde</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.activeCategoryBorderGradientFromDark || '#A78BFA'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBorderGradientFromDark', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.activeCategoryBorderGradientFromDark || '#A78BFA'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBorderGradientFromDark', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-800 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Hasta</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.activeCategoryBorderGradientToDark || '#22D3EE'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBorderGradientToDark', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.activeCategoryBorderGradientToDark || '#22D3EE'}
                              onChange={(e) => handleUpdateStyle('activeCategoryBorderGradientToDark', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-800 text-white"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== SECCIÓN DE ORDENAMIENTO ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              📊 Sección de Ordenamiento
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Título de la sección
                </label>
                <input
                  type="text"
                  value={filterConfig.sortTitle}
                  onChange={(e) => handleUpdateFilter('sortTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="ORDENAR"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Texto de resultados
                </label>
                <input
                  type="text"
                  value={filterConfig.resultsText}
                  onChange={(e) => handleUpdateFilter('resultsText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Resultados:"
                />
              </div>
            </div>
            
            {/* Estilos del Select de Ordenamiento */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                🎨 Estilos del Select de Ordenamiento
              </h4>
              
              {/* Modo Claro */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                  ☀️ Modo Claro
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Fondo transparente */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="sortSelectBgTransparent"
                      checked={filterConfig.styles?.sortSelectBgTransparent === true || filterConfig.styles?.sortSelectBgTransparent === 'true'}
                      onChange={(e) => handleUpdateStyle('sortSelectBgTransparent', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="sortSelectBgTransparent" className="text-sm text-gray-600 dark:text-gray-400">
                      Fondo Transparente
                    </label>
                  </div>
                  
                  {/* Color de fondo */}
                  {!(filterConfig.styles?.sortSelectBgTransparent === true || filterConfig.styles?.sortSelectBgTransparent === 'true') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Color de Fondo
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={filterConfig.styles?.sortSelectBg || '#ffffff'}
                          onChange={(e) => handleUpdateStyle('sortSelectBg', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={filterConfig.styles?.sortSelectBg || '#ffffff'}
                          onChange={(e) => handleUpdateStyle('sortSelectBg', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Color del borde */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Color del Borde
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.sortSelectBorder || '#e5e7eb'}
                        onChange={(e) => handleUpdateStyle('sortSelectBorder', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.sortSelectBorder || '#e5e7eb'}
                        onChange={(e) => handleUpdateStyle('sortSelectBorder', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="#e5e7eb"
                      />
                    </div>
                  </div>
                  
                  {/* Color del texto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Color del Texto
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.sortSelectText || '#111827'}
                        onChange={(e) => handleUpdateStyle('sortSelectText', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.sortSelectText || '#111827'}
                        onChange={(e) => handleUpdateStyle('sortSelectText', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="#111827"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modo Oscuro */}
              <div className="p-4 bg-gray-800 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  🌙 Modo Oscuro
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Fondo transparente */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="sortSelectBgTransparentDark"
                      checked={filterConfig.styles?.sortSelectBgTransparentDark === true || filterConfig.styles?.sortSelectBgTransparentDark === 'true'}
                      onChange={(e) => handleUpdateStyle('sortSelectBgTransparentDark', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="sortSelectBgTransparentDark" className="text-sm text-gray-300">
                      Fondo Transparente
                    </label>
                  </div>
                  
                  {/* Color de fondo */}
                  {!(filterConfig.styles?.sortSelectBgTransparentDark === true || filterConfig.styles?.sortSelectBgTransparentDark === 'true') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Color de Fondo
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={filterConfig.styles?.sortSelectBgDark || '#1f2937'}
                          onChange={(e) => handleUpdateStyle('sortSelectBgDark', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                        />
                        <input
                          type="text"
                          value={filterConfig.styles?.sortSelectBgDark || '#1f2937'}
                          onChange={(e) => handleUpdateStyle('sortSelectBgDark', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm"
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Color del borde */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Color del Borde
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.sortSelectBorderDark || '#374151'}
                        onChange={(e) => handleUpdateStyle('sortSelectBorderDark', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.sortSelectBorderDark || '#374151'}
                        onChange={(e) => handleUpdateStyle('sortSelectBorderDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm"
                        placeholder="#374151"
                      />
                    </div>
                  </div>
                  
                  {/* Color del texto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Color del Texto
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.sortSelectTextDark || '#f9fafb'}
                        onChange={(e) => handleUpdateStyle('sortSelectTextDark', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.sortSelectTextDark || '#f9fafb'}
                        onChange={(e) => handleUpdateStyle('sortSelectTextDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm"
                        placeholder="#f9fafb"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== COLORES DE ICONOS ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              🎯 Colores de Iconos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Modo Claro */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                  ☀️ Modo Claro
                </h5>
                <div className="space-y-3">
                  {/* Icono de búsqueda */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      🔍 Icono de Búsqueda
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.iconSearchColor || '#9ca3af'}
                        onChange={(e) => handleUpdateStyle('iconSearchColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.iconSearchColor || '#9ca3af'}
                        onChange={(e) => handleUpdateStyle('iconSearchColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="#9ca3af"
                      />
                    </div>
                  </div>
                  
                  {/* Icono de dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      ▼ Icono Dropdown (Ordenar)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.iconDropdownColor || '#6b7280'}
                        onChange={(e) => handleUpdateStyle('iconDropdownColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.iconDropdownColor || '#6b7280'}
                        onChange={(e) => handleUpdateStyle('iconDropdownColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="#6b7280"
                      />
                    </div>
                  </div>
                  
                  {/* Icono de limpiar */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      ✕ Icono Limpiar Búsqueda
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.iconClearColor || '#9ca3af'}
                        onChange={(e) => handleUpdateStyle('iconClearColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.iconClearColor || '#9ca3af'}
                        onChange={(e) => handleUpdateStyle('iconClearColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="#9ca3af"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modo Oscuro */}
              <div className="p-4 bg-gray-800 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  🌙 Modo Oscuro
                </h5>
                <div className="space-y-3">
                  {/* Icono de búsqueda */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      🔍 Icono de Búsqueda
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.iconSearchColorDark || '#6b7280'}
                        onChange={(e) => handleUpdateStyle('iconSearchColorDark', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.iconSearchColorDark || '#6b7280'}
                        onChange={(e) => handleUpdateStyle('iconSearchColorDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm"
                        placeholder="#6b7280"
                      />
                    </div>
                  </div>
                  
                  {/* Icono de dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      ▼ Icono Dropdown (Ordenar)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.iconDropdownColorDark || '#9ca3af'}
                        onChange={(e) => handleUpdateStyle('iconDropdownColorDark', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.iconDropdownColorDark || '#9ca3af'}
                        onChange={(e) => handleUpdateStyle('iconDropdownColorDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm"
                        placeholder="#9ca3af"
                      />
                    </div>
                  </div>
                  
                  {/* Icono de limpiar */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      ✕ Icono Limpiar Búsqueda
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filterConfig.styles?.iconClearColorDark || '#6b7280'}
                        onChange={(e) => handleUpdateStyle('iconClearColorDark', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={filterConfig.styles?.iconClearColorDark || '#6b7280'}
                        onChange={(e) => handleUpdateStyle('iconClearColorDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm"
                        placeholder="#6b7280"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== ESTILOS VISUALES ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              🎨 Estilos del Panel de Filtros
            </h3>
            
            {/* Configuración del borde por tema */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Modo Claro */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  ☀️ Borde - Modo Claro
                </h4>
                
                <div className="space-y-3">
                  {/* Tipo de borde */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Tipo de borde
                    </label>
                    <select
                      value={filterConfig.styles?.borderStyle || 'gradient'}
                      onChange={(e) => handleUpdateStyle('borderStyle', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="gradient">✨ Gradiente</option>
                      <option value="solid">▬ Sólido</option>
                      <option value="none">○ Sin borde</option>
                    </select>
                  </div>
                  
                  {filterConfig.styles?.borderStyle === 'gradient' ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Color Inicio</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.borderGradientFrom || '#8B5CF6'}
                              onChange={(e) => handleUpdateStyle('borderGradientFrom', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.borderGradientFrom || '#8B5CF6'}
                              onChange={(e) => handleUpdateStyle('borderGradientFrom', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Color Fin</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.borderGradientTo || '#06B6D4'}
                              onChange={(e) => handleUpdateStyle('borderGradientTo', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.borderGradientTo || '#06B6D4'}
                              onChange={(e) => handleUpdateStyle('borderGradientTo', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                        <select
                          value={filterConfig.styles?.borderGradientDirection || '135deg'}
                          onChange={(e) => handleUpdateStyle('borderGradientDirection', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="90deg">Horizontal →</option>
                          <option value="180deg">Vertical ↓</option>
                          <option value="135deg">Diagonal ↘</option>
                          <option value="45deg">Diagonal ↗</option>
                          <option value="270deg">Vertical ↑</option>
                          <option value="0deg">Horizontal ←</option>
                        </select>
                      </div>
                      {/* Vista previa */}
                      <div 
                        className="h-3 rounded-full"
                        style={{
                          background: `linear-gradient(${filterConfig.styles?.borderGradientDirection || '135deg'}, ${filterConfig.styles?.borderGradientFrom || '#8B5CF6'}, ${filterConfig.styles?.borderGradientTo || '#06B6D4'})`
                        }}
                      />
                    </div>
                  ) : filterConfig.styles?.borderStyle === 'solid' ? (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color del borde</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={filterConfig.styles?.borderColor || '#8B5CF6'}
                          onChange={(e) => handleUpdateStyle('borderColor', e.target.value)}
                          className="w-10 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={filterConfig.styles?.borderColor || '#8B5CF6'}
                          onChange={(e) => handleUpdateStyle('borderColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              
              {/* Modo Oscuro */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  🌙 Borde - Modo Oscuro
                </h4>
                
                <div className="space-y-3">
                  {/* Tipo de borde */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Tipo de borde
                    </label>
                    <select
                      value={filterConfig.styles?.borderStyleDark || 'gradient'}
                      onChange={(e) => handleUpdateStyle('borderStyleDark', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="gradient">✨ Gradiente</option>
                      <option value="solid">▬ Sólido</option>
                      <option value="none">○ Sin borde</option>
                    </select>
                  </div>
                  
                  {filterConfig.styles?.borderStyleDark === 'gradient' || (filterConfig.styles?.borderStyleDark === undefined && filterConfig.styles?.borderStyle === 'gradient') ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Color Inicio</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.borderGradientFromDark || '#A78BFA'}
                              onChange={(e) => handleUpdateStyle('borderGradientFromDark', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.borderGradientFromDark || '#A78BFA'}
                              onChange={(e) => handleUpdateStyle('borderGradientFromDark', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Color Fin</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.borderGradientToDark || '#22D3EE'}
                              onChange={(e) => handleUpdateStyle('borderGradientToDark', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.borderGradientToDark || '#22D3EE'}
                              onChange={(e) => handleUpdateStyle('borderGradientToDark', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                        <select
                          value={filterConfig.styles?.borderGradientDirectionDark || '135deg'}
                          onChange={(e) => handleUpdateStyle('borderGradientDirectionDark', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="90deg">Horizontal →</option>
                          <option value="180deg">Vertical ↓</option>
                          <option value="135deg">Diagonal ↘</option>
                          <option value="45deg">Diagonal ↗</option>
                          <option value="270deg">Vertical ↑</option>
                          <option value="0deg">Horizontal ←</option>
                        </select>
                      </div>
                      {/* Vista previa */}
                      <div 
                        className="h-3 rounded-full"
                        style={{
                          background: `linear-gradient(${filterConfig.styles?.borderGradientDirectionDark || '135deg'}, ${filterConfig.styles?.borderGradientFromDark || '#A78BFA'}, ${filterConfig.styles?.borderGradientToDark || '#22D3EE'})`
                        }}
                      />
                    </div>
                  ) : filterConfig.styles?.borderStyleDark === 'solid' ? (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color del borde</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={filterConfig.styles?.borderColorDark || '#A78BFA'}
                          onChange={(e) => handleUpdateStyle('borderColorDark', e.target.value)}
                          className="w-10 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={filterConfig.styles?.borderColorDark || '#A78BFA'}
                          onChange={(e) => handleUpdateStyle('borderColorDark', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            
            {/* Configuración general del borde */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Ancho del borde */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Ancho del borde
                </label>
                <select
                  value={filterConfig.styles?.borderWidth || '2px'}
                  onChange={(e) => handleUpdateStyle('borderWidth', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="1px">1px - Fino</option>
                  <option value="2px">2px - Normal</option>
                  <option value="3px">3px - Grueso</option>
                  <option value="4px">4px - Extra grueso</option>
                </select>
              </div>
              
              {/* Radio del borde */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Radio del borde
                </label>
                <select
                  value={filterConfig.styles?.borderRadius || '1rem'}
                  onChange={(e) => handleUpdateStyle('borderRadius', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="0">Sin redondeo</option>
                  <option value="0.5rem">Pequeño</option>
                  <option value="1rem">Normal</option>
                  <option value="1.5rem">Grande</option>
                  <option value="2rem">Extra grande</option>
                </select>
              </div>
            </div>
            
            {/* ===== CONFIGURACIÓN DEL FONDO ===== */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                🎨 Fondo del Panel
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Modo Claro */}
                <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
                    ☀️ Modo Claro
                  </h5>
                  
                  {/* Toggle transparente */}
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="bgTransparent"
                      checked={filterConfig.styles?.bgTransparent || false}
                      onChange={(e) => handleUpdateStyle('bgTransparent', e.target.checked ? 'true' : 'false')}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="bgTransparent" className="text-xs text-gray-600 dark:text-gray-400">
                      Fondo transparente
                    </label>
                  </div>
                  
                  {filterConfig.styles?.bgTransparent !== true && filterConfig.styles?.bgTransparent !== 'true' && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color de fondo</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={filterConfig.styles?.backgroundColor || '#ffffff'}
                          onChange={(e) => handleUpdateStyle('backgroundColor', e.target.value)}
                          className="w-10 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={filterConfig.styles?.backgroundColor || '#ffffff'}
                          onChange={(e) => handleUpdateStyle('backgroundColor', e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Vista previa */}
                  <div 
                    className="mt-3 h-8 rounded border border-gray-300 dark:border-gray-500 flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: filterConfig.styles?.bgTransparent === true || filterConfig.styles?.bgTransparent === 'true'
                        ? 'transparent'
                        : (filterConfig.styles?.backgroundColor || '#ffffff'),
                      backgroundImage: filterConfig.styles?.bgTransparent === true || filterConfig.styles?.bgTransparent === 'true'
                        ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                        : 'none',
                      backgroundSize: '10px 10px',
                      backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                    }}
                  >
                    <span style={{ 
                      color: filterConfig.styles?.bgTransparent === true || filterConfig.styles?.bgTransparent === 'true' 
                        ? '#666' 
                        : '#374151',
                      textShadow: filterConfig.styles?.bgTransparent === true || filterConfig.styles?.bgTransparent === 'true'
                        ? '0 0 2px white'
                        : 'none'
                    }}>
                      {filterConfig.styles?.bgTransparent === true || filterConfig.styles?.bgTransparent === 'true' ? '🔲 Transparente' : 'Vista previa'}
                    </span>
                  </div>
                </div>
                
                {/* Modo Oscuro */}
                <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
                    🌙 Modo Oscuro
                  </h5>
                  
                  {/* Toggle transparente */}
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="bgTransparentDark"
                      checked={filterConfig.styles?.bgTransparentDark || false}
                      onChange={(e) => handleUpdateStyle('bgTransparentDark', e.target.checked ? 'true' : 'false')}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="bgTransparentDark" className="text-xs text-gray-600 dark:text-gray-400">
                      Fondo transparente
                    </label>
                  </div>
                  
                  {filterConfig.styles?.bgTransparentDark !== true && filterConfig.styles?.bgTransparentDark !== 'true' && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color de fondo</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={filterConfig.styles?.backgroundColorDark || '#1e293b'}
                          onChange={(e) => handleUpdateStyle('backgroundColorDark', e.target.value)}
                          className="w-10 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={filterConfig.styles?.backgroundColorDark || '#1e293b'}
                          onChange={(e) => handleUpdateStyle('backgroundColorDark', e.target.value)}
                          placeholder="#1e293b"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Vista previa */}
                  <div 
                    className="mt-3 h-8 rounded border border-gray-500 flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: filterConfig.styles?.bgTransparentDark === true || filterConfig.styles?.bgTransparentDark === 'true'
                        ? 'transparent'
                        : (filterConfig.styles?.backgroundColorDark || '#1e293b'),
                      backgroundImage: filterConfig.styles?.bgTransparentDark === true || filterConfig.styles?.bgTransparentDark === 'true'
                        ? 'linear-gradient(45deg, #444 25%, transparent 25%), linear-gradient(-45deg, #444 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #444 75%), linear-gradient(-45deg, transparent 75%, #444 75%)'
                        : 'none',
                      backgroundSize: '10px 10px',
                      backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                    }}
                  >
                    <span style={{ 
                      color: filterConfig.styles?.bgTransparentDark === true || filterConfig.styles?.bgTransparentDark === 'true' 
                        ? '#aaa' 
                        : '#D1D5DB'
                    }}>
                      {filterConfig.styles?.bgTransparentDark === true || filterConfig.styles?.bgTransparentDark === 'true' ? '🔲 Transparente' : 'Vista previa'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

              {/* Color de título de sección */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Color de títulos (claro)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={filterConfig.styles?.sectionTitleColor || '#8B5CF6'}
                    onChange={(e) => handleUpdateStyle('sectionTitleColor', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={filterConfig.styles?.sectionTitleColor || '#8B5CF6'}
                    onChange={(e) => handleUpdateStyle('sectionTitleColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Color de título de sección (oscuro) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Color de títulos (oscuro)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={filterConfig.styles?.sectionTitleColorDark || '#A78BFA'}
                    onChange={(e) => handleUpdateStyle('sectionTitleColorDark', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={filterConfig.styles?.sectionTitleColorDark || '#A78BFA'}
                    onChange={(e) => handleUpdateStyle('sectionTitleColorDark', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Radio del borde */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Redondeo del borde
                </label>
                <select
                  value={filterConfig.styles?.borderRadius || '1rem'}
                  onChange={(e) => handleUpdateStyle('borderRadius', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="0.5rem">Pequeño</option>
                  <option value="1rem">Normal</option>
                  <option value="1.5rem">Grande</option>
                  <option value="2rem">Extra grande</option>
                </select>
              </div>
            </div>
          </div>

          {/* ===== TIPOGRAFÍA DEL PANEL ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              🔤 Tipografía del Panel de Filtros
            </h3>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                💡 <strong>Consejo:</strong> Selecciona la fuente que mejor represente tu marca. 
                Montserrat es moderna y profesional, Playfair Display es elegante.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Fuente para títulos */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Fuente de títulos
                </label>
                <select
                  value={filterConfig.styles?.titleFontFamily || 'inherit'}
                  onChange={(e) => handleUpdateStyle('titleFontFamily', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  style={{ fontFamily: filterConfig.styles?.titleFontFamily || 'inherit' }}
                >
                  <option value="inherit" style={{ fontFamily: 'inherit' }}>Por defecto (Sistema)</option>
                  <option value="'Montserrat', sans-serif" style={{ fontFamily: 'Montserrat, sans-serif' }}>Montserrat</option>
                  <option value="'Poppins', sans-serif" style={{ fontFamily: 'Poppins, sans-serif' }}>Poppins</option>
                  <option value="'Inter', sans-serif" style={{ fontFamily: 'Inter, sans-serif' }}>Inter</option>
                  <option value="'Roboto', sans-serif" style={{ fontFamily: 'Roboto, sans-serif' }}>Roboto</option>
                  <option value="'Open Sans', sans-serif" style={{ fontFamily: 'Open Sans, sans-serif' }}>Open Sans</option>
                  <option value="'Lato', sans-serif" style={{ fontFamily: 'Lato, sans-serif' }}>Lato</option>
                  <option value="'Raleway', sans-serif" style={{ fontFamily: 'Raleway, sans-serif' }}>Raleway</option>
                  <option value="'Nunito', sans-serif" style={{ fontFamily: 'Nunito, sans-serif' }}>Nunito</option>
                  <option value="'Playfair Display', serif" style={{ fontFamily: 'Playfair Display, serif' }}>Playfair Display</option>
                </select>
              </div>

              {/* Fuente para contenido */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Fuente de contenido
                </label>
                <select
                  value={filterConfig.styles?.contentFontFamily || 'inherit'}
                  onChange={(e) => handleUpdateStyle('contentFontFamily', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  style={{ fontFamily: filterConfig.styles?.contentFontFamily || 'inherit' }}
                >
                  <option value="inherit" style={{ fontFamily: 'inherit' }}>Por defecto (Sistema)</option>
                  <option value="'Montserrat', sans-serif" style={{ fontFamily: 'Montserrat, sans-serif' }}>Montserrat</option>
                  <option value="'Poppins', sans-serif" style={{ fontFamily: 'Poppins, sans-serif' }}>Poppins</option>
                  <option value="'Inter', sans-serif" style={{ fontFamily: 'Inter, sans-serif' }}>Inter</option>
                  <option value="'Roboto', sans-serif" style={{ fontFamily: 'Roboto, sans-serif' }}>Roboto</option>
                  <option value="'Open Sans', sans-serif" style={{ fontFamily: 'Open Sans, sans-serif' }}>Open Sans</option>
                  <option value="'Lato', sans-serif" style={{ fontFamily: 'Lato, sans-serif' }}>Lato</option>
                  <option value="'Raleway', sans-serif" style={{ fontFamily: 'Raleway, sans-serif' }}>Raleway</option>
                  <option value="'Nunito', sans-serif" style={{ fontFamily: 'Nunito, sans-serif' }}>Nunito</option>
                  <option value="'Playfair Display', serif" style={{ fontFamily: 'Playfair Display, serif' }}>Playfair Display</option>
                </select>
              </div>

              {/* Vista previa */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Vista previa
                </label>
                <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                  <p 
                    className="text-sm font-bold uppercase tracking-wide mb-1"
                    style={{ 
                      fontFamily: filterConfig.styles?.titleFontFamily || 'inherit',
                      color: filterConfig.styles?.sectionTitleColor || '#8B5CF6'
                    }}
                  >
                    BUSCAR
                  </p>
                  <p 
                    className="text-xs text-gray-600 dark:text-gray-400"
                    style={{ fontFamily: filterConfig.styles?.contentFontFamily || 'inherit' }}
                  >
                    Texto de ejemplo para contenido
                  </p>
                </div>
              </div>
            </div>

            {/* Peso de fuente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Peso de títulos
                </label>
                <select
                  value={filterConfig.styles?.titleFontWeight || '700'}
                  onChange={(e) => handleUpdateStyle('titleFontWeight', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="400">Normal (400)</option>
                  <option value="500">Medio (500)</option>
                  <option value="600">Semi-Bold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Peso de contenido
                </label>
                <select
                  value={filterConfig.styles?.contentFontWeight || '400'}
                  onChange={(e) => handleUpdateStyle('contentFontWeight', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Normal (400)</option>
                  <option value="500">Medio (500)</option>
                  <option value="600">Semi-Bold (600)</option>
                  <option value="700">Bold (700)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ===== TAMAÑO DEL PANEL ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              📐 Tamaño del Panel de Filtros
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Ancho del panel */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Ancho del panel
                </label>
                <select
                  value={filterConfig.styles?.panelWidth || '20rem'}
                  onChange={(e) => handleUpdateStyle('panelWidth', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="16rem">Compacto (256px)</option>
                  <option value="18rem">Pequeño (288px)</option>
                  <option value="20rem">Normal (320px)</option>
                  <option value="22rem">Grande (352px)</option>
                  <option value="24rem">Extra grande (384px)</option>
                </select>
              </div>

              {/* Padding interno */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Padding interno
                </label>
                <select
                  value={filterConfig.styles?.panelPadding || '1.5rem'}
                  onChange={(e) => handleUpdateStyle('panelPadding', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="1rem">Compacto (16px)</option>
                  <option value="1.25rem">Pequeño (20px)</option>
                  <option value="1.5rem">Normal (24px)</option>
                  <option value="2rem">Grande (32px)</option>
                  <option value="2.5rem">Extra grande (40px)</option>
                </select>
              </div>

              {/* Espaciado entre secciones */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Espaciado entre secciones
                </label>
                <select
                  value={filterConfig.styles?.sectionGap || '1.5rem'}
                  onChange={(e) => handleUpdateStyle('sectionGap', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="1rem">Compacto (16px)</option>
                  <option value="1.5rem">Normal (24px)</option>
                  <option value="2rem">Amplio (32px)</option>
                  <option value="2.5rem">Extra amplio (40px)</option>
                </select>
              </div>

              {/* Altura mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Altura mínima
                </label>
                <select
                  value={filterConfig.styles?.minHeight || 'auto'}
                  onChange={(e) => handleUpdateStyle('minHeight', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="auto">Automática</option>
                  <option value="400px">Pequeña (400px)</option>
                  <option value="500px">Normal (500px)</option>
                  <option value="600px">Grande (600px)</option>
                  <option value="700px">Extra grande (700px)</option>
                  <option value="100%">Altura completa</option>
                </select>
              </div>
            </div>

            {/* Configuración adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Posición sticky */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Posición fija (sticky)
                </label>
                <select
                  value={filterConfig.styles?.stickyTop || '6rem'}
                  onChange={(e) => handleUpdateStyle('stickyTop', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="4rem">Muy arriba (64px)</option>
                  <option value="5rem">Arriba (80px)</option>
                  <option value="6rem">Normal (96px)</option>
                  <option value="7rem">Abajo (112px)</option>
                  <option value="8rem">Muy abajo (128px)</option>
                </select>
              </div>

              {/* Sombra */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Sombra
                </label>
                <select
                  value={filterConfig.styles?.shadow || 'none'}
                  onChange={(e) => handleUpdateStyle('shadow', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="none">Sin sombra</option>
                  <option value="sm">Sutil</option>
                  <option value="md">Normal</option>
                  <option value="lg">Grande</option>
                  <option value="xl">Extra grande</option>
                </select>
              </div>
            </div>
          </div>

          {/* ===== VISTA PREVIA ===== */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              👁️ Vista Previa del Panel
            </h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Vista previa del panel de filtros con la configuración actual:
              </p>
              <div 
                className="bg-white dark:bg-gray-800 overflow-hidden"
                style={{
                  width: filterConfig.styles?.panelWidth || '20rem',
                  maxWidth: '100%',
                  minHeight: filterConfig.styles?.minHeight === 'auto' ? undefined : filterConfig.styles?.minHeight,
                  padding: filterConfig.styles?.panelPadding || '1.5rem',
                  borderRadius: filterConfig.styles?.borderRadius || '1rem',
                  border: filterConfig.styles?.borderStyle === 'none' 
                    ? 'none' 
                    : filterConfig.styles?.borderStyle === 'gradient'
                      ? `${filterConfig.styles?.borderWidth || '2px'} solid transparent`
                      : `${filterConfig.styles?.borderWidth || '2px'} solid ${filterConfig.styles?.borderColor || '#8B5CF6'}`,
                  backgroundImage: filterConfig.styles?.borderStyle === 'gradient'
                    ? `linear-gradient(white, white), ${filterConfig.styles?.borderGradient || 'linear-gradient(135deg, #8B5CF6, #06B6D4)'}`
                    : undefined,
                  backgroundOrigin: 'border-box',
                  backgroundClip: filterConfig.styles?.borderStyle === 'gradient' ? 'padding-box, border-box' : undefined,
                  boxShadow: filterConfig.styles?.shadow === 'none' ? 'none' :
                             filterConfig.styles?.shadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.05)' :
                             filterConfig.styles?.shadow === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' :
                             filterConfig.styles?.shadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' :
                             filterConfig.styles?.shadow === 'xl' ? '0 20px 25px rgba(0,0,0,0.15)' : 'none'
                }}
              >
                {/* Sección Buscar */}
                <div style={{ marginBottom: filterConfig.styles?.sectionGap || '1.5rem' }}>
                  <p 
                    className="text-sm font-bold uppercase tracking-wide mb-1"
                    style={{ color: filterConfig.styles?.sectionTitleColor || '#8B5CF6' }}
                  >
                    {filterConfig.searchTitle || 'BUSCAR'}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {filterConfig.searchDescription || 'Escribe aquí para encontrar...'}
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400">
                    🔍 {filterConfig.searchPlaceholder || 'Busca un servicio...'}
                  </div>
                </div>

                {/* Sección Categorías */}
                <div style={{ marginBottom: filterConfig.styles?.sectionGap || '1.5rem' }}>
                  <p 
                    className="text-sm font-bold uppercase tracking-wide mb-2"
                    style={{ color: filterConfig.styles?.sectionTitleColor || '#8B5CF6' }}
                  >
                    {filterConfig.categoriesTitle || 'CATEGORÍAS'}
                  </p>
                  <div className="space-y-1">
                    <div className="px-3 py-1.5 rounded-lg text-sm text-purple-600 bg-purple-50">
                      {filterConfig.showAllCategoriesText || 'Todas las categorías'}
                    </div>
                    <div className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                      Desarrollo
                    </div>
                    <div className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                      Diseño
                    </div>
                  </div>
                </div>

                {/* Sección Ordenar */}
                <div>
                  <p 
                    className="text-sm font-bold uppercase tracking-wide mb-2"
                    style={{ color: filterConfig.styles?.sectionTitleColor || '#8B5CF6' }}
                  >
                    {filterConfig.sortTitle || 'ORDENAR'}
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-600 flex justify-between">
                    <span>★ Destacados</span>
                    <span>▼</span>
                  </div>
                </div>

                {/* Resultados */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
                  <span className="text-gray-500">{filterConfig.resultsText || 'Resultados:'}</span>
                  <span className="font-bold text-gray-900">10 de 10</span>
                </div>
              </div>
              
              {/* Información del tamaño */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  📏 Ancho: {filterConfig.styles?.panelWidth || '20rem'}
                </span>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  📦 Padding: {filterConfig.styles?.panelPadding || '1.5rem'}
                </span>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  ↕️ Gap: {filterConfig.styles?.sectionGap || '1.5rem'}
                </span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ServicesFilterConfigSection;
