/**
 * 🎴 CONFIGURACIÓN DE SECCIÓN DE SERVICIOS (VERSIÓN COMPACTA)
 * Permite personalizar la sección de servicios destacados y el diseño de tarjetas
 * Optimizado para mejor experiencia de usuario con menos espacio vertical
 */

import React, { useState } from 'react';
import ManagedImageSelector from '../ManagedImageSelector';
import { BorderHoverTabs } from './ServicesGridConfigBorderHoverTabs';
import type { PageData } from '../../types/cms';
import {
  CompactColorPicker,
  ThemeTabs,
  CompactSection,
  ColorGrid,
  CompactToggle
} from './shared/CompactStyleEditors';

interface ServicesGridConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

// Valores por defecto
const DEFAULT_GRID_CONFIG = {
  featuredSection: {
    title: '★ Servicios Destacados',
    icon: '★',
    titleColor: '#1f2937',
    titleColorDark: '#f9fafb',
    iconColor: '#f59e0b',
    iconColorDark: '#fbbf24',
    backgroundImage: { light: '', dark: '' },
    backgroundOpacity: 0.1
  },
  allServicesSection: {
    title: '■ Todos los Servicios',
    icon: '■'
  },
  cardDesign: {
    borderRadius: '1rem',
    imageHeight: '12rem',
    imageObjectFit: 'cover',
    titleColor: '#111827',
    titleColorDark: '#f9fafb',
    titleHoverColor: '#8B5CF6',
    titleHoverColorDark: '#A78BFA',
    priceColor: '#8B5CF6',
    priceColorDark: '#A78BFA',
    descriptionColor: '#4b5563',
    descriptionColorDark: '#d1d5db',
    transparentCards: false,
    // Borde
    borderWidth: '1px',
    borderColor: '#e5e7eb',
    borderColorDark: '#374151',
    borderStyle: 'solid',
    // Hover
    hoverBorderColor: '#8B5CF6',
    hoverBorderColorDark: '#A78BFA',
    hoverShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.04)',
    hoverShadowDark: '0 20px 25px -5px rgba(167, 139, 250, 0.2), 0 10px 10px -5px rgba(167, 139, 250, 0.08)',
    hoverScale: '1.02',
    // Sombra normal
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    shadowDark: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    // Tipografía
    titleFontFamily: 'inherit',
    descriptionFontFamily: 'inherit',
    titleFontWeight: '700',
    descriptionFontWeight: '400',
    // Badge destacado
    featuredBadge: {
      icon: '★',
      text: 'Destacado',
      iconColor: '#fbbf24',
      color1: '#8B5CF6',
      color2: '#EC4899',
      gradient: 'linear-gradient(90deg, #8B5CF6, #EC4899)'
    },
    // Botón
    buttonText: 'Ver detalles',
    buttonIcon: '→',
    buttonIconPosition: 'right',
    buttonGradient: 'linear-gradient(90deg, #8B5CF6, #3B82F6)',
    buttonTextColor: '#ffffff'
  }
};

const ServicesGridConfigSectionCompact: React.FC<ServicesGridConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'destacados' | 'tarjetas' | 'borde' | 'hover' | 'badge' | 'boton'>('destacados');

  // Obtener configuración actual con valores por defecto
  const gridConfig = {
    ...DEFAULT_GRID_CONFIG,
    ...(pageData?.content as any)?.servicesGrid,
    featuredSection: {
      ...DEFAULT_GRID_CONFIG.featuredSection,
      ...((pageData?.content as any)?.servicesGrid?.featuredSection || {})
    },
    allServicesSection: {
      ...DEFAULT_GRID_CONFIG.allServicesSection,
      ...((pageData?.content as any)?.servicesGrid?.allServicesSection || {})
    },
    cardDesign: {
      ...DEFAULT_GRID_CONFIG.cardDesign,
      ...((pageData?.content as any)?.servicesGrid?.cardDesign || {}),
      featuredBadge: {
        ...DEFAULT_GRID_CONFIG.cardDesign.featuredBadge,
        ...((pageData?.content as any)?.servicesGrid?.cardDesign?.featuredBadge || {})
      }
    }
  };

  const handleUpdate = (field: string, value: any) => {
    updateContent(`servicesGrid.${field}`, value);
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
          🎴 Configuración de Sección de Servicios
        </span>
        <span className="text-sm text-gray-500">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {!collapsed && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Tabs de navegación */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-x-auto">
            {[
              { id: 'destacados', label: '⭐ Destacados' },
              { id: 'tarjetas', label: '🎨 Tarjetas' },
              { id: 'borde', label: '🔲 Borde' },
              { id: 'hover', label: '✨ Hover' },
              { id: 'badge', label: '🏷️ Badge' },
              { id: 'boton', label: '🔘 Botón' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
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
            {/* ===== TAB: DESTACADOS ===== */}
            {activeTab === 'destacados' && (
              <div className="space-y-4">
                <CompactSection title="Título y Colores" icon="⭐" defaultOpen={true}>
                  <div className="space-y-4">
                    {/* Textos */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Título</label>
                        <input
                          type="text"
                          value={gridConfig.featuredSection?.title || '★ Servicios Destacados'}
                          onChange={(e) => handleUpdate('featuredSection.title', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Icono</label>
                        <input
                          type="text"
                          value={gridConfig.featuredSection?.icon || '★'}
                          onChange={(e) => handleUpdate('featuredSection.icon', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="★ ☆ ✶ ●"
                        />
                      </div>
                    </div>

                    {/* Nota sobre emojis */}
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-[10px] text-amber-600 dark:text-amber-400">
                      💡 Los emojis no cambian de color. Usa símbolos unicode (★ ✦ ●) para colores personalizados.
                    </div>

                    {/* Colores */}
                    <ColorGrid
                      items={[
                        {
                          label: 'Título',
                          lightKey: 'titleColor',
                          darkKey: 'titleColorDark',
                          lightValue: gridConfig.featuredSection?.titleColor || '#1f2937',
                          darkValue: gridConfig.featuredSection?.titleColorDark || '#f9fafb',
                          onLightChange: (v) => handleUpdate('featuredSection.titleColor', v),
                          onDarkChange: (v) => handleUpdate('featuredSection.titleColorDark', v)
                        },
                        {
                          label: 'Icono',
                          lightKey: 'iconColor',
                          darkKey: 'iconColorDark',
                          lightValue: gridConfig.featuredSection?.iconColor || '#f59e0b',
                          darkValue: gridConfig.featuredSection?.iconColorDark || '#fbbf24',
                          onLightChange: (v) => handleUpdate('featuredSection.iconColor', v),
                          onDarkChange: (v) => handleUpdate('featuredSection.iconColorDark', v)
                        }
                      ]}
                    />
                  </div>
                </CompactSection>

                <CompactSection title="Imagen de Fondo" icon="🖼️">
                  <div className="space-y-4">
                    <CompactToggle
                      label="Tarjetas transparentes (ver imagen de fondo)"
                      checked={gridConfig.cardDesign?.transparentCards || false}
                      onChange={(checked) => handleUpdate('cardDesign.transparentCards', checked)}
                    />

                    <ThemeTabs activeTheme={activeTheme} onThemeChange={setActiveTheme} />

                    <div>
                      <label className="block text-xs text-gray-500 mb-2">
                        {activeTheme === 'light' ? '🌞 Imagen (tema claro)' : '🌙 Imagen (tema oscuro)'}
                      </label>
                      <ManagedImageSelector
                        currentImage={activeTheme === 'light' 
                          ? (gridConfig.featuredSection?.backgroundImage?.light || '')
                          : (gridConfig.featuredSection?.backgroundImage?.dark || '')
                        }
                        onImageSelect={(url) => handleUpdate(
                          activeTheme === 'light' 
                            ? 'featuredSection.backgroundImage.light' 
                            : 'featuredSection.backgroundImage.dark', 
                          url
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Opacidad: {Math.round((gridConfig.featuredSection?.backgroundOpacity || 0.1) * 100)}%
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        step="5"
                        value={(gridConfig.featuredSection?.backgroundOpacity || 0.1) * 100}
                        onChange={(e) => handleUpdate('featuredSection.backgroundOpacity', parseInt(e.target.value) / 100)}
                        className="w-full h-2 bg-gradient-to-r from-gray-300 via-purple-400 to-purple-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </CompactSection>

                <CompactSection title="Sección Todos los Servicios" icon="■">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Título</label>
                      <input
                        type="text"
                        value={gridConfig.allServicesSection?.title || '■ Todos los Servicios'}
                        onChange={(e) => handleUpdate('allServicesSection.title', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Icono</label>
                      <input
                        type="text"
                        value={gridConfig.allServicesSection?.icon || '■'}
                        onChange={(e) => handleUpdate('allServicesSection.icon', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </CompactSection>
              </div>
            )}

            {/* ===== TAB: TARJETAS ===== */}
            {activeTab === 'tarjetas' && (
              <div className="space-y-4">
                <CompactSection title="Dimensiones" icon="📐" defaultOpen={true}>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Esquinas</label>
                      <select
                        value={gridConfig.cardDesign?.borderRadius || '1rem'}
                        onChange={(e) => handleUpdate('cardDesign.borderRadius', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="0.5rem">Pequeño</option>
                        <option value="1rem">Normal</option>
                        <option value="1.5rem">Grande</option>
                        <option value="2rem">Extra</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Alt. imagen</label>
                      <select
                        value={gridConfig.cardDesign?.imageHeight || '12rem'}
                        onChange={(e) => handleUpdate('cardDesign.imageHeight', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="10rem">160px</option>
                        <option value="12rem">192px</option>
                        <option value="14rem">224px</option>
                        <option value="16rem">256px</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Ajuste</label>
                      <select
                        value={gridConfig.cardDesign?.imageObjectFit || 'cover'}
                        onChange={(e) => handleUpdate('cardDesign.imageObjectFit', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="cover">Cubrir</option>
                        <option value="contain">Contener</option>
                        <option value="fill">Estirar</option>
                      </select>
                    </div>
                  </div>
                </CompactSection>

                <CompactSection title="Colores" icon="🎨">
                  <ColorGrid
                    items={[
                      {
                        label: 'Título',
                        lightKey: 'titleColor',
                        darkKey: 'titleColorDark',
                        lightValue: gridConfig.cardDesign?.titleColor || '#111827',
                        darkValue: gridConfig.cardDesign?.titleColorDark || '#f9fafb',
                        onLightChange: (v) => handleUpdate('cardDesign.titleColor', v),
                        onDarkChange: (v) => handleUpdate('cardDesign.titleColorDark', v)
                      },
                      {
                        label: 'Título hover',
                        lightKey: 'titleHoverColor',
                        darkKey: 'titleHoverColorDark',
                        lightValue: gridConfig.cardDesign?.titleHoverColor || '#8B5CF6',
                        darkValue: gridConfig.cardDesign?.titleHoverColorDark || '#A78BFA',
                        onLightChange: (v) => handleUpdate('cardDesign.titleHoverColor', v),
                        onDarkChange: (v) => handleUpdate('cardDesign.titleHoverColorDark', v)
                      },
                      {
                        label: 'Descripción',
                        lightKey: 'descriptionColor',
                        darkKey: 'descriptionColorDark',
                        lightValue: gridConfig.cardDesign?.descriptionColor || '#4b5563',
                        darkValue: gridConfig.cardDesign?.descriptionColorDark || '#d1d5db',
                        onLightChange: (v) => handleUpdate('cardDesign.descriptionColor', v),
                        onDarkChange: (v) => handleUpdate('cardDesign.descriptionColorDark', v)
                      },
                      {
                        label: 'Precio',
                        lightKey: 'priceColor',
                        darkKey: 'priceColorDark',
                        lightValue: gridConfig.cardDesign?.priceColor || '#8B5CF6',
                        darkValue: gridConfig.cardDesign?.priceColorDark || '#A78BFA',
                        onLightChange: (v) => handleUpdate('cardDesign.priceColor', v),
                        onDarkChange: (v) => handleUpdate('cardDesign.priceColorDark', v)
                      }
                    ]}
                  />
                </CompactSection>

                <CompactSection title="Tipografía" icon="🔤">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Fuente título</label>
                      <select
                        value={gridConfig.cardDesign?.titleFontFamily || 'inherit'}
                        onChange={(e) => handleUpdate('cardDesign.titleFontFamily', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="inherit">Sistema</option>
                        <option value="'Montserrat', sans-serif">Montserrat</option>
                        <option value="'Poppins', sans-serif">Poppins</option>
                        <option value="'Inter', sans-serif">Inter</option>
                        <option value="'Roboto', sans-serif">Roboto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Peso título</label>
                      <select
                        value={gridConfig.cardDesign?.titleFontWeight || '700'}
                        onChange={(e) => handleUpdate('cardDesign.titleFontWeight', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="400">Normal</option>
                        <option value="500">Medio</option>
                        <option value="600">Semi-Bold</option>
                        <option value="700">Bold</option>
                        <option value="800">Extra Bold</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Fuente descripción</label>
                      <select
                        value={gridConfig.cardDesign?.descriptionFontFamily || 'inherit'}
                        onChange={(e) => handleUpdate('cardDesign.descriptionFontFamily', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="inherit">Sistema</option>
                        <option value="'Montserrat', sans-serif">Montserrat</option>
                        <option value="'Poppins', sans-serif">Poppins</option>
                        <option value="'Inter', sans-serif">Inter</option>
                        <option value="'Roboto', sans-serif">Roboto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Peso descripción</label>
                      <select
                        value={gridConfig.cardDesign?.descriptionFontWeight || '400'}
                        onChange={(e) => handleUpdate('cardDesign.descriptionFontWeight', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="300">Light</option>
                        <option value="400">Normal</option>
                        <option value="500">Medio</option>
                        <option value="600">Semi-Bold</option>
                      </select>
                    </div>
                  </div>

                  {/* Vista previa tipografía */}
                  <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <h4 
                      className="text-base mb-1"
                      style={{ 
                        fontFamily: gridConfig.cardDesign?.titleFontFamily || 'inherit',
                        fontWeight: gridConfig.cardDesign?.titleFontWeight || '700',
                        color: gridConfig.cardDesign?.titleColor || '#111827'
                      }}
                    >
                      Título de Servicio
                    </h4>
                    <p 
                      className="text-xs"
                      style={{ 
                        fontFamily: gridConfig.cardDesign?.descriptionFontFamily || 'inherit',
                        fontWeight: gridConfig.cardDesign?.descriptionFontWeight || '400',
                        color: gridConfig.cardDesign?.descriptionColor || '#4b5563'
                      }}
                    >
                      Descripción del servicio aquí
                    </p>
                  </div>
                </CompactSection>
              </div>
            )}

            {/* ===== PESTAÑAS DE BORDE Y HOVER ===== */}
            <BorderHoverTabs 
              activeTab={activeTab}
              gridConfig={gridConfig}
              handleUpdate={handleUpdate}
            />

            {/* ===== TAB: BADGE ===== */}
            {activeTab === 'badge' && (
              <div className="space-y-4">
                <CompactSection title="Texto e Icono" icon="🏷️" defaultOpen={true}>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Icono</label>
                      <input
                        type="text"
                        value={gridConfig.cardDesign?.featuredBadge?.icon || '★'}
                        onChange={(e) => handleUpdate('cardDesign.featuredBadge.icon', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Texto</label>
                      <input
                        type="text"
                        value={gridConfig.cardDesign?.featuredBadge?.text || 'Destacado'}
                        onChange={(e) => handleUpdate('cardDesign.featuredBadge.text', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color icono</label>
                      <CompactColorPicker
                        value={gridConfig.cardDesign?.featuredBadge?.iconColor || '#fbbf24'}
                        onChange={(v) => handleUpdate('cardDesign.featuredBadge.iconColor', v)}
                      />
                    </div>
                  </div>
                </CompactSection>

                <CompactSection title="Gradiente del Badge" icon="🌈">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Color 1</label>
                        <CompactColorPicker
                          value={gridConfig.cardDesign?.featuredBadge?.color1 || '#8B5CF6'}
                          onChange={(v) => {
                            handleUpdate('cardDesign.featuredBadge.color1', v);
                            const c2 = gridConfig.cardDesign?.featuredBadge?.color2 || '#EC4899';
                            handleUpdate('cardDesign.featuredBadge.gradient', `linear-gradient(90deg, ${v}, ${c2})`);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Color 2</label>
                        <CompactColorPicker
                          value={gridConfig.cardDesign?.featuredBadge?.color2 || '#EC4899'}
                          onChange={(v) => {
                            handleUpdate('cardDesign.featuredBadge.color2', v);
                            const c1 = gridConfig.cardDesign?.featuredBadge?.color1 || '#8B5CF6';
                            handleUpdate('cardDesign.featuredBadge.gradient', `linear-gradient(90deg, ${c1}, ${v})`);
                          }}
                        />
                      </div>
                    </div>

                    {/* Presets */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Presets</label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: 'Morado-Rosa', c1: '#8B5CF6', c2: '#EC4899' },
                          { name: 'Morado-Azul', c1: '#8B5CF6', c2: '#3B82F6' },
                          { name: 'Naranja-Rojo', c1: '#F59E0B', c2: '#EF4444' },
                          { name: 'Verde-Azul', c1: '#10B981', c2: '#3B82F6' },
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              handleUpdate('cardDesign.featuredBadge.color1', preset.c1);
                              handleUpdate('cardDesign.featuredBadge.color2', preset.c2);
                              handleUpdate('cardDesign.featuredBadge.gradient', `linear-gradient(90deg, ${preset.c1}, ${preset.c2})`);
                            }}
                            className="px-2 py-1 text-[10px] font-medium rounded-full text-white hover:scale-105 transition-transform"
                            style={{ background: `linear-gradient(90deg, ${preset.c1}, ${preset.c2})` }}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Vista previa badge */}
                    <div className="flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                      <span 
                        className="text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
                        style={{ background: gridConfig.cardDesign?.featuredBadge?.gradient || `linear-gradient(90deg, ${gridConfig.cardDesign?.featuredBadge?.color1 || '#8B5CF6'}, ${gridConfig.cardDesign?.featuredBadge?.color2 || '#EC4899'})` }}
                      >
                        <span style={{ color: gridConfig.cardDesign?.featuredBadge?.iconColor || '#fbbf24' }}>
                          {gridConfig.cardDesign?.featuredBadge?.icon || '★'}
                        </span>
                        <span>{gridConfig.cardDesign?.featuredBadge?.text || 'Destacado'}</span>
                      </span>
                    </div>
                  </div>
                </CompactSection>
              </div>
            )}

            {/* ===== TAB: BOTÓN ===== */}
            {activeTab === 'boton' && (
              <div className="space-y-4">
                <CompactSection title="Texto e Icono" icon="🔘" defaultOpen={true}>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Texto</label>
                      <input
                        type="text"
                        value={gridConfig.cardDesign?.buttonText || 'Ver detalles'}
                        onChange={(e) => handleUpdate('cardDesign.buttonText', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Icono</label>
                      <input
                        type="text"
                        value={gridConfig.cardDesign?.buttonIcon || '→'}
                        onChange={(e) => handleUpdate('cardDesign.buttonIcon', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="→ ▶ ➔"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Posición</label>
                      <select
                        value={gridConfig.cardDesign?.buttonIconPosition || 'right'}
                        onChange={(e) => handleUpdate('cardDesign.buttonIconPosition', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="left">← Izquierda</option>
                        <option value="right">Derecha →</option>
                        <option value="none">Sin icono</option>
                      </select>
                    </div>
                  </div>
                </CompactSection>

                <CompactSection title="Colores del Botón" icon="🎨">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Color 1</label>
                        <CompactColorPicker
                          value={gridConfig.cardDesign?.buttonColor1 || '#8B5CF6'}
                          onChange={(v) => {
                            handleUpdate('cardDesign.buttonColor1', v);
                            const c2 = gridConfig.cardDesign?.buttonColor2 || '#3B82F6';
                            handleUpdate('cardDesign.buttonGradient', `linear-gradient(90deg, ${v}, ${c2})`);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Color 2</label>
                        <CompactColorPicker
                          value={gridConfig.cardDesign?.buttonColor2 || '#3B82F6'}
                          onChange={(v) => {
                            handleUpdate('cardDesign.buttonColor2', v);
                            const c1 = gridConfig.cardDesign?.buttonColor1 || '#8B5CF6';
                            handleUpdate('cardDesign.buttonGradient', `linear-gradient(90deg, ${c1}, ${v})`);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color de texto</label>
                      <CompactColorPicker
                        value={gridConfig.cardDesign?.buttonTextColor || '#ffffff'}
                        onChange={(v) => handleUpdate('cardDesign.buttonTextColor', v)}
                      />
                    </div>

                    {/* Vista previa botón */}
                    <div className="flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                        style={{ 
                          background: gridConfig.cardDesign?.buttonGradient || 'linear-gradient(90deg, #8B5CF6, #3B82F6)',
                          color: gridConfig.cardDesign?.buttonTextColor || '#ffffff'
                        }}
                      >
                        {gridConfig.cardDesign?.buttonIconPosition === 'left' && (
                          <span>{gridConfig.cardDesign?.buttonIcon || '→'}</span>
                        )}
                        <span>{gridConfig.cardDesign?.buttonText || 'Ver detalles'}</span>
                        {gridConfig.cardDesign?.buttonIconPosition === 'right' && (
                          <span>{gridConfig.cardDesign?.buttonIcon || '→'}</span>
                        )}
                      </button>
                    </div>
                  </div>
                </CompactSection>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesGridConfigSectionCompact;
