/**
 * 🔍 CONFIGURACIÓN DE FILTROS DE SERVICIOS (VERSIÓN COMPACTA)
 * Permite personalizar la sección de filtros en la página de servicios
 * Optimizado para mejor experiencia de usuario con menos espacio vertical
 */

import React, { useState } from 'react';
import type { PageData } from '../../types/cms';
import {
  CompactColorPicker,
  ThemeTabs,
  DualThemeColorPicker,
  StyleTypeSelect,
  CompactGradientPicker,
  CompactSection,
  ColorGrid,
  CompactToggle
} from './shared/CompactStyleEditors';

interface ServicesFilterConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

// Valores por defecto
const DEFAULT_FILTER_CONFIG = {
  searchTitle: 'BUSCAR',
  searchDescription: 'Escribe aquí para encontrar el servicio que necesitas...',
  searchPlaceholder: 'Busca un servicio...',
  categoriesTitle: 'CATEGORÍAS',
  showAllCategoriesText: 'Todas las categorías',
  sortTitle: 'ORDENAR',
  resultsText: 'Resultados:',
  styles: {
    borderStyle: 'gradient',
    borderGradientFrom: '#8B5CF6',
    borderGradientTo: '#06B6D4',
    borderGradientDirection: '135deg',
    borderStyleDark: 'gradient',
    borderGradientFromDark: '#A78BFA',
    borderGradientToDark: '#22D3EE',
    borderGradientDirectionDark: '135deg',
    borderWidth: '2px',
    borderRadius: '1rem',
    backgroundColor: '#ffffff',
    bgTransparent: false,
    backgroundColorDark: '#1e293b',
    bgTransparentDark: false,
    searchInputBg: '#ffffff',
    searchInputBgTransparent: false,
    searchInputBorder: '#e5e7eb',
    searchInputText: '#111827',
    searchInputPlaceholder: '#9ca3af',
    searchInputBgDark: '#1f2937',
    searchInputBgTransparentDark: false,
    searchInputBorderDark: '#374151',
    searchInputTextDark: '#f9fafb',
    searchInputPlaceholderDark: '#6b7280',
    sectionTitleColor: '#8B5CF6',
    sectionTitleColorDark: '#A78BFA',
    panelWidth: '20rem',
    panelPadding: '1.5rem',
    sectionGap: '1.5rem',
    shadow: 'none',
    activeCategoryBg: 'rgba(139, 92, 246, 0.1)',
    activeCategoryText: '#8B5CF6',
    activeCategoryBorder: '#8B5CF6',
    activeCategoryBgDark: 'rgba(139, 92, 246, 0.2)',
    activeCategoryTextDark: '#A78BFA',
    activeCategoryBorderDark: '#A78BFA',
  }
};

const ServicesFilterConfigSectionCompact: React.FC<ServicesFilterConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'contenido' | 'estilos' | 'panel'>('contenido');

  // Obtener configuración actual con valores por defecto
  const filterConfig = {
    ...DEFAULT_FILTER_CONFIG,
    ...(pageData?.content as any)?.servicesFilter,
    styles: {
      ...DEFAULT_FILTER_CONFIG.styles,
      ...((pageData?.content as any)?.servicesFilter?.styles || {})
    }
  };

  const handleUpdateFilter = (field: string, value: any) => {
    updateContent(`servicesFilter.${field}`, value);
  };

  const handleUpdateStyle = (field: string, value: string | boolean) => {
    updateContent(`servicesFilter.styles.${field}`, value);
  };

  // Helper para establecer valor según tema activo
  const setThemedValue = (lightKey: string, darkKey: string, value: any) => {
    handleUpdateStyle(activeTheme === 'light' ? lightKey : darkKey, value);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700/50 overflow-hidden">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
      >
        <span className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-100">
          🔍 Configuración de Filtros de Servicios
        </span>
        <span className="text-sm text-gray-500">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {!collapsed && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Tabs de navegación */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            {[
              { id: 'contenido', label: '📝 Contenido', icon: '📝' },
              { id: 'estilos', label: '🎨 Estilos', icon: '🎨' },
              { id: 'panel', label: '📐 Panel', icon: '📐' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500 bg-white dark:bg-gray-800'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* ===== TAB: CONTENIDO ===== */}
            {activeTab === 'contenido' && (
              <div className="space-y-4">
                {/* Sección de Búsqueda - Compacta */}
                <CompactSection title="Sección de Búsqueda" icon="🔎" defaultOpen={true}>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Título</label>
                      <input
                        type="text"
                        value={filterConfig.searchTitle}
                        onChange={(e) => handleUpdateFilter('searchTitle', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="BUSCAR"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Placeholder</label>
                      <input
                        type="text"
                        value={filterConfig.searchPlaceholder}
                        onChange={(e) => handleUpdateFilter('searchPlaceholder', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Busca..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Descripción</label>
                      <input
                        type="text"
                        value={filterConfig.searchDescription}
                        onChange={(e) => handleUpdateFilter('searchDescription', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Escribe aquí..."
                      />
                    </div>
                  </div>
                </CompactSection>

                {/* Sección de Categorías - Compacta */}
                <CompactSection title="Sección de Categorías" icon="📂">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Título</label>
                      <input
                        type="text"
                        value={filterConfig.categoriesTitle}
                        onChange={(e) => handleUpdateFilter('categoriesTitle', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Texto "Todas"</label>
                      <input
                        type="text"
                        value={filterConfig.showAllCategoriesText}
                        onChange={(e) => handleUpdateFilter('showAllCategoriesText', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </CompactSection>

                {/* Sección de Ordenamiento - Compacta */}
                <CompactSection title="Ordenamiento y Resultados" icon="↕️">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Título ordenar</label>
                      <input
                        type="text"
                        value={filterConfig.sortTitle}
                        onChange={(e) => handleUpdateFilter('sortTitle', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Texto resultados</label>
                      <input
                        type="text"
                        value={filterConfig.resultsText}
                        onChange={(e) => handleUpdateFilter('resultsText', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </CompactSection>
              </div>
            )}

            {/* ===== TAB: ESTILOS ===== */}
            {activeTab === 'estilos' && (
              <div className="space-y-4">
                {/* Selector de tema */}
                <ThemeTabs activeTheme={activeTheme} onThemeChange={setActiveTheme} />

                {/* Estilos del Input de Búsqueda */}
                <CompactSection title="Input de Búsqueda" icon="🔍" defaultOpen={true}>
                  <div className="space-y-3">
                    <CompactToggle
                      label="Fondo transparente"
                      checked={activeTheme === 'light' 
                        ? (filterConfig.styles?.searchInputBgTransparent === true || filterConfig.styles?.searchInputBgTransparent === 'true')
                        : (filterConfig.styles?.searchInputBgTransparentDark === true || filterConfig.styles?.searchInputBgTransparentDark === 'true')
                      }
                      onChange={(checked) => setThemedValue('searchInputBgTransparent', 'searchInputBgTransparentDark', checked)}
                    />
                    
                    <ColorGrid
                      items={[
                        {
                          label: 'Fondo',
                          lightKey: 'searchInputBg',
                          darkKey: 'searchInputBgDark',
                          lightValue: filterConfig.styles?.searchInputBg || '#ffffff',
                          darkValue: filterConfig.styles?.searchInputBgDark || '#1f2937',
                          onLightChange: (v) => handleUpdateStyle('searchInputBg', v),
                          onDarkChange: (v) => handleUpdateStyle('searchInputBgDark', v)
                        },
                        {
                          label: 'Borde',
                          lightKey: 'searchInputBorder',
                          darkKey: 'searchInputBorderDark',
                          lightValue: filterConfig.styles?.searchInputBorder || '#e5e7eb',
                          darkValue: filterConfig.styles?.searchInputBorderDark || '#374151',
                          onLightChange: (v) => handleUpdateStyle('searchInputBorder', v),
                          onDarkChange: (v) => handleUpdateStyle('searchInputBorderDark', v)
                        },
                        {
                          label: 'Texto',
                          lightKey: 'searchInputText',
                          darkKey: 'searchInputTextDark',
                          lightValue: filterConfig.styles?.searchInputText || '#111827',
                          darkValue: filterConfig.styles?.searchInputTextDark || '#f9fafb',
                          onLightChange: (v) => handleUpdateStyle('searchInputText', v),
                          onDarkChange: (v) => handleUpdateStyle('searchInputTextDark', v)
                        },
                        {
                          label: 'Placeholder',
                          lightKey: 'searchInputPlaceholder',
                          darkKey: 'searchInputPlaceholderDark',
                          lightValue: filterConfig.styles?.searchInputPlaceholder || '#9ca3af',
                          darkValue: filterConfig.styles?.searchInputPlaceholderDark || '#6b7280',
                          onLightChange: (v) => handleUpdateStyle('searchInputPlaceholder', v),
                          onDarkChange: (v) => handleUpdateStyle('searchInputPlaceholderDark', v)
                        }
                      ]}
                    />
                  </div>
                </CompactSection>

                {/* Estilos de Categoría Seleccionada */}
                <CompactSection title="Categoría Seleccionada" icon="✨">
                  <ColorGrid
                    items={[
                      {
                        label: 'Fondo',
                        lightKey: 'activeCategoryBg',
                        darkKey: 'activeCategoryBgDark',
                        lightValue: filterConfig.styles?.activeCategoryBg || '#8B5CF6',
                        darkValue: filterConfig.styles?.activeCategoryBgDark || '#A78BFA',
                        onLightChange: (v) => handleUpdateStyle('activeCategoryBg', v),
                        onDarkChange: (v) => handleUpdateStyle('activeCategoryBgDark', v)
                      },
                      {
                        label: 'Texto',
                        lightKey: 'activeCategoryText',
                        darkKey: 'activeCategoryTextDark',
                        lightValue: filterConfig.styles?.activeCategoryText || '#8B5CF6',
                        darkValue: filterConfig.styles?.activeCategoryTextDark || '#A78BFA',
                        onLightChange: (v) => handleUpdateStyle('activeCategoryText', v),
                        onDarkChange: (v) => handleUpdateStyle('activeCategoryTextDark', v)
                      },
                      {
                        label: 'Borde',
                        lightKey: 'activeCategoryBorder',
                        darkKey: 'activeCategoryBorderDark',
                        lightValue: filterConfig.styles?.activeCategoryBorder || '#8B5CF6',
                        darkValue: filterConfig.styles?.activeCategoryBorderDark || '#A78BFA',
                        onLightChange: (v) => handleUpdateStyle('activeCategoryBorder', v),
                        onDarkChange: (v) => handleUpdateStyle('activeCategoryBorderDark', v)
                      }
                    ]}
                  />
                </CompactSection>

                {/* Títulos de Sección */}
                <CompactSection title="Títulos de Sección" icon="🏷️">
                  <DualThemeColorPicker
                    label="Color del título"
                    lightValue={filterConfig.styles?.sectionTitleColor || '#8B5CF6'}
                    darkValue={filterConfig.styles?.sectionTitleColorDark || '#A78BFA'}
                    onLightChange={(v) => handleUpdateStyle('sectionTitleColor', v)}
                    onDarkChange={(v) => handleUpdateStyle('sectionTitleColorDark', v)}
                  />
                </CompactSection>
              </div>
            )}

            {/* ===== TAB: PANEL ===== */}
            {activeTab === 'panel' && (
              <div className="space-y-4">
                {/* Selector de tema */}
                <ThemeTabs activeTheme={activeTheme} onThemeChange={setActiveTheme} />

                {/* Borde del Panel */}
                <CompactSection title="Borde del Panel" icon="🔲" defaultOpen={true}>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <StyleTypeSelect
                        label="Tipo"
                        value={activeTheme === 'light' 
                          ? (filterConfig.styles?.borderStyle || 'gradient')
                          : (filterConfig.styles?.borderStyleDark || 'gradient')
                        }
                        onChange={(v) => setThemedValue('borderStyle', 'borderStyleDark', v)}
                        options={[
                          { value: 'gradient', label: '✨ Gradiente' },
                          { value: 'solid', label: '▬ Sólido' },
                          { value: 'none', label: '○ Sin borde' }
                        ]}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Ancho</span>
                        <select
                          value={filterConfig.styles?.borderWidth || '2px'}
                          onChange={(e) => handleUpdateStyle('borderWidth', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="1px">1px</option>
                          <option value="2px">2px</option>
                          <option value="3px">3px</option>
                          <option value="4px">4px</option>
                        </select>
                      </div>
                    </div>

                    {/* Gradiente */}
                    {(activeTheme === 'light' ? filterConfig.styles?.borderStyle : filterConfig.styles?.borderStyleDark) === 'gradient' && (
                      <CompactGradientPicker
                        fromColor={activeTheme === 'light' 
                          ? (filterConfig.styles?.borderGradientFrom || '#8B5CF6')
                          : (filterConfig.styles?.borderGradientFromDark || '#A78BFA')
                        }
                        toColor={activeTheme === 'light'
                          ? (filterConfig.styles?.borderGradientTo || '#06B6D4')
                          : (filterConfig.styles?.borderGradientToDark || '#22D3EE')
                        }
                        direction={activeTheme === 'light'
                          ? (filterConfig.styles?.borderGradientDirection || '135deg')
                          : (filterConfig.styles?.borderGradientDirectionDark || '135deg')
                        }
                        onFromChange={(v) => setThemedValue('borderGradientFrom', 'borderGradientFromDark', v)}
                        onToChange={(v) => setThemedValue('borderGradientTo', 'borderGradientToDark', v)}
                        onDirectionChange={(v) => setThemedValue('borderGradientDirection', 'borderGradientDirectionDark', v)}
                      />
                    )}

                    {/* Color sólido */}
                    {(activeTheme === 'light' ? filterConfig.styles?.borderStyle : filterConfig.styles?.borderStyleDark) === 'solid' && (
                      <CompactColorPicker
                        label="Color"
                        value={activeTheme === 'light'
                          ? (filterConfig.styles?.borderColor || '#8B5CF6')
                          : (filterConfig.styles?.borderColorDark || '#A78BFA')
                        }
                        onChange={(v) => setThemedValue('borderColor', 'borderColorDark', v)}
                      />
                    )}
                  </div>
                </CompactSection>

                {/* Fondo del Panel */}
                <CompactSection title="Fondo del Panel" icon="🎨">
                  <div className="space-y-3">
                    <CompactToggle
                      label="Fondo transparente"
                      checked={activeTheme === 'light'
                        ? (filterConfig.styles?.bgTransparent === true || filterConfig.styles?.bgTransparent === 'true')
                        : (filterConfig.styles?.bgTransparentDark === true || filterConfig.styles?.bgTransparentDark === 'true')
                      }
                      onChange={(checked) => setThemedValue('bgTransparent', 'bgTransparentDark', checked ? 'true' : 'false')}
                    />
                    
                    {!(activeTheme === 'light' 
                      ? (filterConfig.styles?.bgTransparent === true || filterConfig.styles?.bgTransparent === 'true')
                      : (filterConfig.styles?.bgTransparentDark === true || filterConfig.styles?.bgTransparentDark === 'true')
                    ) && (
                      <CompactColorPicker
                        label="Color"
                        value={activeTheme === 'light'
                          ? (filterConfig.styles?.backgroundColor || '#ffffff')
                          : (filterConfig.styles?.backgroundColorDark || '#1e293b')
                        }
                        onChange={(v) => setThemedValue('backgroundColor', 'backgroundColorDark', v)}
                      />
                    )}
                  </div>
                </CompactSection>

                {/* Dimensiones */}
                <CompactSection title="Dimensiones" icon="📐">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Ancho</label>
                      <select
                        value={filterConfig.styles?.panelWidth || '20rem'}
                        onChange={(e) => handleUpdateStyle('panelWidth', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="16rem">Compacto (256px)</option>
                        <option value="18rem">Pequeño (288px)</option>
                        <option value="20rem">Normal (320px)</option>
                        <option value="22rem">Grande (352px)</option>
                        <option value="24rem">Extra grande (384px)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Padding</label>
                      <select
                        value={filterConfig.styles?.panelPadding || '1.5rem'}
                        onChange={(e) => handleUpdateStyle('panelPadding', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="1rem">Pequeño (16px)</option>
                        <option value="1.5rem">Normal (24px)</option>
                        <option value="2rem">Grande (32px)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Radio borde</label>
                      <select
                        value={filterConfig.styles?.borderRadius || '1rem'}
                        onChange={(e) => handleUpdateStyle('borderRadius', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="0">Sin redondeo</option>
                        <option value="0.5rem">Pequeño</option>
                        <option value="1rem">Normal</option>
                        <option value="1.5rem">Grande</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Sombra</label>
                      <select
                        value={filterConfig.styles?.shadow || 'none'}
                        onChange={(e) => handleUpdateStyle('shadow', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="none">Sin sombra</option>
                        <option value="sm">Sutil</option>
                        <option value="md">Normal</option>
                        <option value="lg">Grande</option>
                      </select>
                    </div>
                  </div>
                </CompactSection>
              </div>
            )}

            {/* ===== VISTA PREVIA UNIFICADA ===== */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  👁️ Vista Previa
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveTheme('light')}
                    className={`px-2 py-1 text-xs rounded ${activeTheme === 'light' ? 'bg-gray-200 dark:bg-gray-600' : 'bg-gray-100 dark:bg-gray-700'}`}
                  >
                    ☀️
                  </button>
                  <button
                    onClick={() => setActiveTheme('dark')}
                    className={`px-2 py-1 text-xs rounded ${activeTheme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                  >
                    🌙
                  </button>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${activeTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <div 
                  className="overflow-hidden mx-auto"
                  style={{
                    width: filterConfig.styles?.panelWidth || '20rem',
                    maxWidth: '100%',
                    padding: filterConfig.styles?.panelPadding || '1.5rem',
                    borderRadius: filterConfig.styles?.borderRadius || '1rem',
                    backgroundColor: activeTheme === 'light'
                      ? (filterConfig.styles?.bgTransparent === true || filterConfig.styles?.bgTransparent === 'true' ? 'transparent' : filterConfig.styles?.backgroundColor || '#ffffff')
                      : (filterConfig.styles?.bgTransparentDark === true || filterConfig.styles?.bgTransparentDark === 'true' ? 'transparent' : filterConfig.styles?.backgroundColorDark || '#1e293b'),
                    border: (activeTheme === 'light' ? filterConfig.styles?.borderStyle : filterConfig.styles?.borderStyleDark) === 'none'
                      ? 'none'
                      : `${filterConfig.styles?.borderWidth || '2px'} solid ${
                          (activeTheme === 'light' ? filterConfig.styles?.borderStyle : filterConfig.styles?.borderStyleDark) === 'gradient'
                            ? 'transparent'
                            : (activeTheme === 'light' ? filterConfig.styles?.borderColor : filterConfig.styles?.borderColorDark) || '#8B5CF6'
                        }`,
                    backgroundImage: (activeTheme === 'light' ? filterConfig.styles?.borderStyle : filterConfig.styles?.borderStyleDark) === 'gradient'
                      ? `linear-gradient(${activeTheme === 'light' ? filterConfig.styles?.backgroundColor || '#ffffff' : filterConfig.styles?.backgroundColorDark || '#1e293b'}, ${activeTheme === 'light' ? filterConfig.styles?.backgroundColor || '#ffffff' : filterConfig.styles?.backgroundColorDark || '#1e293b'}), linear-gradient(${activeTheme === 'light' ? filterConfig.styles?.borderGradientDirection : filterConfig.styles?.borderGradientDirectionDark || '135deg'}, ${activeTheme === 'light' ? filterConfig.styles?.borderGradientFrom : filterConfig.styles?.borderGradientFromDark || '#8B5CF6'}, ${activeTheme === 'light' ? filterConfig.styles?.borderGradientTo : filterConfig.styles?.borderGradientToDark || '#06B6D4'})`
                      : undefined,
                    backgroundOrigin: 'border-box',
                    backgroundClip: (activeTheme === 'light' ? filterConfig.styles?.borderStyle : filterConfig.styles?.borderStyleDark) === 'gradient' ? 'padding-box, border-box' : undefined,
                    boxShadow: filterConfig.styles?.shadow === 'none' ? 'none' :
                               filterConfig.styles?.shadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.05)' :
                               filterConfig.styles?.shadow === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' :
                               filterConfig.styles?.shadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {/* Sección Buscar */}
                  <div style={{ marginBottom: filterConfig.styles?.sectionGap || '1.5rem' }}>
                    <p 
                      className="text-sm font-bold uppercase tracking-wide mb-1"
                      style={{ color: activeTheme === 'light' ? filterConfig.styles?.sectionTitleColor : filterConfig.styles?.sectionTitleColorDark || '#8B5CF6' }}
                    >
                      {filterConfig.searchTitle || 'BUSCAR'}
                    </p>
                    <p className={`text-xs mb-2 ${activeTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {filterConfig.searchDescription || 'Escribe aquí...'}
                    </p>
                    <div 
                      className="rounded-lg px-3 py-2 text-sm"
                      style={{
                        backgroundColor: activeTheme === 'light' 
                          ? (filterConfig.styles?.searchInputBg || '#f3f4f6')
                          : (filterConfig.styles?.searchInputBgDark || '#374151'),
                        border: `1px solid ${activeTheme === 'light' ? filterConfig.styles?.searchInputBorder : filterConfig.styles?.searchInputBorderDark || '#e5e7eb'}`,
                        color: activeTheme === 'light' ? filterConfig.styles?.searchInputPlaceholder : filterConfig.styles?.searchInputPlaceholderDark || '#9ca3af'
                      }}
                    >
                      🔍 {filterConfig.searchPlaceholder || 'Busca un servicio...'}
                    </div>
                  </div>

                  {/* Sección Categorías */}
                  <div style={{ marginBottom: filterConfig.styles?.sectionGap || '1.5rem' }}>
                    <p 
                      className="text-sm font-bold uppercase tracking-wide mb-2"
                      style={{ color: activeTheme === 'light' ? filterConfig.styles?.sectionTitleColor : filterConfig.styles?.sectionTitleColorDark || '#8B5CF6' }}
                    >
                      {filterConfig.categoriesTitle || 'CATEGORÍAS'}
                    </p>
                    <div className="space-y-1">
                      <div 
                        className="px-3 py-1.5 rounded-lg text-sm border-l-2"
                        style={{
                          backgroundColor: activeTheme === 'light' ? filterConfig.styles?.activeCategoryBg : filterConfig.styles?.activeCategoryBgDark || 'rgba(139, 92, 246, 0.1)',
                          color: activeTheme === 'light' ? filterConfig.styles?.activeCategoryText : filterConfig.styles?.activeCategoryTextDark || '#8B5CF6',
                          borderColor: activeTheme === 'light' ? filterConfig.styles?.activeCategoryBorder : filterConfig.styles?.activeCategoryBorderDark || '#8B5CF6'
                        }}
                      >
                        {filterConfig.showAllCategoriesText || 'Todas las categorías'}
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg text-sm ${activeTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Desarrollo Web
                      </div>
                    </div>
                  </div>

                  {/* Sección Ordenar */}
                  <div>
                    <p 
                      className="text-sm font-bold uppercase tracking-wide mb-2"
                      style={{ color: activeTheme === 'light' ? filterConfig.styles?.sectionTitleColor : filterConfig.styles?.sectionTitleColorDark || '#8B5CF6' }}
                    >
                      {filterConfig.sortTitle || 'ORDENAR'}
                    </p>
                    <div className={`rounded-lg px-3 py-2 text-sm flex justify-between ${activeTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      <span>★ Destacados</span>
                      <span>▼</span>
                    </div>
                  </div>

                  {/* Resultados */}
                  <div className={`mt-4 pt-3 border-t flex justify-between text-sm ${activeTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <span className={activeTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{filterConfig.resultsText || 'Resultados:'}</span>
                    <span className={`font-bold ${activeTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>10 de 10</span>
                  </div>
                </div>
              </div>
              
              {/* Info del tamaño */}
              <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-gray-400">
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                  📏 {filterConfig.styles?.panelWidth || '20rem'}
                </span>
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                  📦 {filterConfig.styles?.panelPadding || '1.5rem'}
                </span>
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                  🔲 {filterConfig.styles?.borderRadius || '1rem'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesFilterConfigSectionCompact;
