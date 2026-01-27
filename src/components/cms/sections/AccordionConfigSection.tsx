/**
 * 🎛️ AccordionConfigSection - Configuración de la sección Accordion
 * Permite configurar el acordeón de paneles de la página de detalle de servicio
 */

import React, { useState } from 'react';
import { BackgroundEditor } from '../shared/BackgroundEditor';
import { ThemeStylePanel } from '../shared/ThemeStylePanel';
import { CardStylePanel } from '../shared/CardStylePanel';
import * as LucideIcons from 'lucide-react';
import type {
  BackgroundConfig,
  AccordionPanelConfig,
  ServicioDetailConfig,
  AccordionHeaderConfig,
} from '../types/servicioDetailConfig';
import { DEFAULT_BACKGROUND, DEFAULT_CONFIG } from '../types/servicioDetailConfig';

// Lista de iconos disponibles para los paneles del acordeón
const AVAILABLE_ICONS = [
  { name: 'FileText', label: 'Documento' },
  { name: 'Sparkles', label: 'Brillos' },
  { name: 'Target', label: 'Objetivo' },
  { name: 'CheckCircle', label: 'Check' },
  { name: 'Lightbulb', label: 'Bombilla' },
  { name: 'HelpCircle', label: 'Ayuda' },
  { name: 'Video', label: 'Video' },
  { name: 'Star', label: 'Estrella' },
  { name: 'Heart', label: 'Corazón' },
  { name: 'Zap', label: 'Rayo' },
  { name: 'Shield', label: 'Escudo' },
  { name: 'Award', label: 'Premio' },
  { name: 'Gift', label: 'Regalo' },
  { name: 'Clock', label: 'Reloj' },
  { name: 'Calendar', label: 'Calendario' },
  { name: 'Users', label: 'Usuarios' },
  { name: 'MessageCircle', label: 'Mensaje' },
  { name: 'Settings', label: 'Configuración' },
  { name: 'TrendingUp', label: 'Tendencia' },
  { name: 'BarChart', label: 'Gráfico' },
  { name: 'Package', label: 'Paquete' },
  { name: 'Briefcase', label: 'Maletín' },
  { name: 'Layers', label: 'Capas' },
  { name: 'Layout', label: 'Layout' },
  { name: 'Monitor', label: 'Monitor' },
  { name: 'Smartphone', label: 'Teléfono' },
  { name: 'Globe', label: 'Globo' },
  { name: 'Lock', label: 'Candado' },
  { name: 'Eye', label: 'Ojo' },
  { name: 'Search', label: 'Buscar' },
];

// Helper para renderizar iconos de Lucide dinámicamente
const LucideIcon: React.FC<{ name: string; size?: number; className?: string; style?: React.CSSProperties }> = ({ 
  name, 
  size = 24, 
  className = '',
  style = {}
}) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    return <span className={className}>?</span>;
  }
  return <IconComponent size={size} className={className} style={style} />;
};

interface AccordionConfigSectionProps {
  mergedConfig: ServicioDetailConfig;
  isExpanded: boolean;
  onToggle: () => void;
  updateAccordion: (field: keyof NonNullable<ServicioDetailConfig['accordion']>, value: any) => void;
  updateAccordionStyle: (theme: 'light' | 'dark', field: string, value: any) => void;
  updateAccordionTypography: (field: string, value: any) => void;
  updateAccordionContentCards: (theme: 'light' | 'dark', field: string, value: any) => void;
  updateAccordionIconConfig: (theme: 'light' | 'dark', field: string, value: any) => void;
  updateSectionIcons: (section: 'caracteristicas' | 'beneficios' | 'incluye' | 'noIncluye', field: string, value: any) => void;
  updatePanelIcon: (panelId: string, icon: string) => void;
  updateAccordionBackground: (field: keyof BackgroundConfig, value: any) => void;
  batchUpdateAccordionBackground: (updates: Partial<BackgroundConfig>) => void;
  togglePanelEnabled: (panelId: string) => void;
  movePanelUp: (index: number) => void;
  movePanelDown: (index: number) => void;
  // Nuevas props para header
  updateAccordionHeader: (field: keyof AccordionHeaderConfig, value: any) => void;
  updateAccordionHeaderTitle: (field: string, value: any) => void;
  updateAccordionHeaderSubtitle: (field: string, value: any) => void;
}

export const AccordionConfigSection: React.FC<AccordionConfigSectionProps> = ({
  mergedConfig,
  isExpanded,
  onToggle,
  updateAccordion,
  updateAccordionStyle,
  updateAccordionTypography,
  updateAccordionContentCards,
  updateAccordionIconConfig,
  updateSectionIcons,
  updatePanelIcon,
  updateAccordionBackground,
  batchUpdateAccordionBackground,
  togglePanelEnabled,
  movePanelUp,
  movePanelDown,
  updateAccordionHeader,
  updateAccordionHeaderTitle,
  updateAccordionHeaderSubtitle,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎛️</span>
          <div className="text-left">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Acordeón de Paneles</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configura el comportamiento y orden de los paneles</p>
          </div>
        </div>
        <span className={`text-xl transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
          
          {/* ========== SECCIÓN: TÍTULO Y DESCRIPCIÓN ========== */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
            <h5 className="font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
              📝 Título y Descripción de la Sección
            </h5>
            
            {/* Mostrar/Ocultar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={mergedConfig.accordion?.header?.showTitle ?? true}
                  onChange={(e) => updateAccordionHeader('showTitle', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Mostrar Título</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Título principal de la sección</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={mergedConfig.accordion?.header?.showSubtitle ?? true}
                  onChange={(e) => updateAccordionHeader('showSubtitle', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Mostrar Descripción</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Texto descriptivo debajo del título</p>
                </div>
              </label>
            </div>

            {/* Título */}
            <div className="space-y-4">
              {/* Tipo de Icono */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  🎨 Tipo de Icono
                </label>
                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => updateAccordionHeader('iconType', 'emoji')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      (mergedConfig.accordion?.header?.iconType ?? 'emoji') === 'emoji'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <span className="text-2xl">😀</span>
                    <span className="font-medium">Emoji</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAccordionHeader('iconType', 'lucide')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      mergedConfig.accordion?.header?.iconType === 'lucide'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <LucideIcon name="Sparkles" size={24} />
                    <span className="font-medium">Lucide Icon</span>
                  </button>
                </div>

                {/* Selector de Emoji */}
                {(mergedConfig.accordion?.header?.iconType ?? 'emoji') === 'emoji' && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-xl flex items-center justify-center text-4xl border-2 border-gray-200 dark:border-gray-700">
                        {mergedConfig.accordion?.header?.title?.icon || '📚'}
                      </div>
                      <div className="flex-1 grid grid-cols-8 gap-2">
                        {['📚', '📖', '📋', '📝', '✨', '🎯', '💡', '⚡', '🚀', '🔍', '📊', '🎨', '💼', '🏆', '⭐', '🌟'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => updateAccordionHeaderTitle('icon', emoji)}
                            className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all ${
                              mergedConfig.accordion?.header?.title?.icon === emoji
                                ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={mergedConfig.accordion?.header?.title?.icon ?? '📚'}
                      onChange={(e) => updateAccordionHeaderTitle('icon', e.target.value)}
                      className="mt-3 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-center text-2xl"
                      placeholder="📚"
                      maxLength={4}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      Selecciona un emoji o pega uno personalizado
                    </p>
                  </>
                )}

                {/* Selector de Icono Lucide */}
                {mergedConfig.accordion?.header?.iconType === 'lucide' && (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <div 
                        className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-xl flex items-center justify-center border-2 border-gray-200 dark:border-gray-700"
                      >
                        <LucideIcon 
                          name={mergedConfig.accordion?.header?.iconName || 'BookOpen'} 
                          size={32} 
                          style={{ 
                            color: mergedConfig.accordion?.header?.iconColor || '#7c3aed'
                          }} 
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                        {AVAILABLE_ICONS.map((icon) => (
                          <button
                            key={icon.name}
                            type="button"
                            onClick={() => updateAccordionHeader('iconName', icon.name)}
                            title={icon.label}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                              mergedConfig.accordion?.header?.iconName === icon.name
                                ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <LucideIcon name={icon.name} size={20} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colores del Icono por Tema */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        🎨 Colores del Icono por Tema
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tema Claro */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">☀️</span>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tema Claro</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={mergedConfig.accordion?.header?.iconColor || '#7c3aed'}
                              onChange={(e) => updateAccordionHeader('iconColor', e.target.value)}
                              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={mergedConfig.accordion?.header?.iconColor || '#7c3aed'}
                              onChange={(e) => updateAccordionHeader('iconColor', e.target.value)}
                              className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm"
                              placeholder="#7c3aed"
                            />
                          </div>
                        </div>
                        {/* Tema Oscuro */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🌙</span>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tema Oscuro</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={mergedConfig.accordion?.header?.iconColorDark || '#a78bfa'}
                              onChange={(e) => updateAccordionHeader('iconColorDark', e.target.value)}
                              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={mergedConfig.accordion?.header?.iconColorDark || '#a78bfa'}
                              onChange={(e) => updateAccordionHeader('iconColorDark', e.target.value)}
                              className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm"
                              placeholder="#a78bfa"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Texto del título */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Texto del Título
                </label>
                <input
                  type="text"
                  value={mergedConfig.accordion?.header?.title?.text ?? 'Información Completa'}
                  onChange={(e) => updateAccordionHeaderTitle('text', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500"
                  placeholder="Información Completa"
                />
              </div>

              {/* Colores del Título por Tema */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  🎨 Colores del Título por Tema
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tema Claro */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">☀️</span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tema Claro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={mergedConfig.accordion?.header?.title?.color || '#111827'}
                        onChange={(e) => updateAccordionHeaderTitle('color', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={mergedConfig.accordion?.header?.title?.color || '#111827'}
                        onChange={(e) => updateAccordionHeaderTitle('color', e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="#111827"
                      />
                    </div>
                  </div>
                  {/* Tema Oscuro */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌙</span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tema Oscuro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={mergedConfig.accordion?.header?.title?.colorDark || '#FFFFFF'}
                        onChange={(e) => updateAccordionHeaderTitle('colorDark', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={mergedConfig.accordion?.header?.title?.colorDark || '#FFFFFF'}
                        onChange={(e) => updateAccordionHeaderTitle('colorDark', e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tipografía del Título */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  ✏️ Tipografía del Título
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Familia de fuente */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Familia de fuente
                    </label>
                    <select
                      value={mergedConfig.accordion?.header?.title?.fontFamily || 'Montserrat'}
                      onChange={(e) => updateAccordionHeaderTitle('fontFamily', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    >
                      <option value="Montserrat">Montserrat (Recomendado)</option>
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="system-ui">Sistema</option>
                    </select>
                  </div>
                  {/* Tamaño de fuente */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Tamaño de fuente
                    </label>
                    <select
                      value={mergedConfig.accordion?.header?.title?.fontSize || 'text-3xl md:text-4xl'}
                      onChange={(e) => updateAccordionHeaderTitle('fontSize', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    >
                      <option value="text-2xl md:text-3xl">3XL (Mediano)</option>
                      <option value="text-3xl md:text-4xl">4XL (Recomendado)</option>
                      <option value="text-4xl md:text-5xl">5XL (Grande)</option>
                      <option value="text-5xl md:text-6xl">6XL (Extra Grande)</option>
                    </select>
                  </div>
                  {/* Peso de fuente */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Peso de fuente
                    </label>
                    <select
                      value={mergedConfig.accordion?.header?.title?.fontWeight || 'font-bold'}
                      onChange={(e) => updateAccordionHeaderTitle('fontWeight', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    >
                      <option value="font-normal">Normal</option>
                      <option value="font-medium">Medium</option>
                      <option value="font-semibold">Semibold</option>
                      <option value="font-bold">Bold (Recomendado)</option>
                      <option value="font-extrabold">Extra Bold</option>
                    </select>
                  </div>
                  {/* Altura de línea */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Altura de línea
                    </label>
                    <select
                      value={mergedConfig.accordion?.header?.title?.lineHeight || 'leading-tight'}
                      onChange={(e) => updateAccordionHeaderTitle('lineHeight', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    >
                      <option value="leading-none">None</option>
                      <option value="leading-tight">Tight (Recomendado)</option>
                      <option value="leading-snug">Snug</option>
                      <option value="leading-normal">Normal</option>
                      <option value="leading-relaxed">Relaxed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Descripción/Subtítulo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descripción
                </label>
                <input
                  type="text"
                  value={mergedConfig.accordion?.header?.subtitle?.text ?? 'Haz clic en cada sección para ver más detalles'}
                  onChange={(e) => updateAccordionHeaderSubtitle('text', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500"
                  placeholder="Haz clic en cada sección para ver más detalles"
                />
              </div>

              {/* Colores de la Descripción por Tema */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  🎨 Colores de la Descripción por Tema
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tema Claro */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">☀️</span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tema Claro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={mergedConfig.accordion?.header?.subtitle?.color || '#4B5563'}
                        onChange={(e) => updateAccordionHeaderSubtitle('color', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={mergedConfig.accordion?.header?.subtitle?.color || '#4B5563'}
                        onChange={(e) => updateAccordionHeaderSubtitle('color', e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="#4B5563"
                      />
                    </div>
                  </div>
                  {/* Tema Oscuro */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌙</span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tema Oscuro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={mergedConfig.accordion?.header?.subtitle?.colorDark || '#9CA3AF'}
                        onChange={(e) => updateAccordionHeaderSubtitle('colorDark', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={mergedConfig.accordion?.header?.subtitle?.colorDark || '#9CA3AF'}
                        onChange={(e) => updateAccordionHeaderSubtitle('colorDark', e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="#9CA3AF"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tipografía de la Descripción */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  ✏️ Tipografía de la Descripción
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Familia de fuente */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Familia de fuente
                    </label>
                    <select
                      value={mergedConfig.accordion?.header?.subtitle?.fontFamily || 'Montserrat'}
                      onChange={(e) => updateAccordionHeaderSubtitle('fontFamily', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    >
                      <option value="Montserrat">Montserrat (Recomendado)</option>
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="system-ui">Sistema</option>
                    </select>
                  </div>
                  {/* Tamaño de fuente */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Tamaño de fuente
                    </label>
                    <select
                      value={mergedConfig.accordion?.header?.subtitle?.fontSize || 'text-lg'}
                      onChange={(e) => updateAccordionHeaderSubtitle('fontSize', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    >
                      <option value="text-sm">SM (Pequeño)</option>
                      <option value="text-base">Base (Normal)</option>
                      <option value="text-lg">LG (Recomendado)</option>
                      <option value="text-xl">XL (Grande)</option>
                    </select>
                  </div>
                  {/* Peso de fuente */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Peso de fuente
                    </label>
                    <select
                      value={mergedConfig.accordion?.header?.subtitle?.fontWeight || 'font-normal'}
                      onChange={(e) => updateAccordionHeaderSubtitle('fontWeight', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    >
                      <option value="font-light">Light</option>
                      <option value="font-normal">Normal (Recomendado)</option>
                      <option value="font-medium">Medium</option>
                      <option value="font-semibold">Semibold</option>
                    </select>
                  </div>
                  {/* Altura de línea */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Altura de línea
                    </label>
                    <select
                      value={mergedConfig.accordion?.header?.subtitle?.lineHeight || 'leading-relaxed'}
                      onChange={(e) => updateAccordionHeaderSubtitle('lineHeight', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    >
                      <option value="leading-tight">Tight</option>
                      <option value="leading-snug">Snug</option>
                      <option value="leading-normal">Normal</option>
                      <option value="leading-relaxed">Relaxed (Recomendado)</option>
                      <option value="leading-loose">Loose</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Alineación */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alineación
                </label>
                <div className="flex gap-2">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => updateAccordionHeader('alignment', align)}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                        mergedConfig.accordion?.header?.alignment === align
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {align === 'left' ? '⬅️ Izquierda' : align === 'center' ? '↔️ Centro' : '➡️ Derecha'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vista Previa */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 text-center">Vista Previa</p>
                <div className={`${
                  mergedConfig.accordion?.header?.alignment === 'left' ? 'text-left' :
                  mergedConfig.accordion?.header?.alignment === 'right' ? 'text-right' : 'text-center'
                }`}>
                  <h3 
                    className={`text-2xl font-bold mb-2 flex items-center gap-2 ${
                      mergedConfig.accordion?.header?.alignment === 'left' ? 'justify-start' :
                      mergedConfig.accordion?.header?.alignment === 'right' ? 'justify-end' : 'justify-center'
                    }`}
                    style={{ color: mergedConfig.accordion?.header?.title?.color || '#111827' }}
                  >
                    <span>{mergedConfig.accordion?.header?.title?.icon || '📚'}</span>
                    {mergedConfig.accordion?.header?.title?.text || 'Información Completa'}
                  </h3>
                  <p style={{ color: mergedConfig.accordion?.header?.subtitle?.color || '#4B5563' }}>
                    {mergedConfig.accordion?.header?.subtitle?.text || 'Haz clic en cada sección para ver más detalles'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Panel abierto por defecto
              </label>
              <select
                value={mergedConfig.accordion?.defaultOpenPanel ?? 'descripcion'}
                onChange={(e) => updateAccordion('defaultOpenPanel', e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Ninguno (todos cerrados)</option>
                {mergedConfig.accordion?.panels
                  .filter(p => p.enabled)
                  .map(panel => (
                    <option key={panel.id} value={panel.id}>
                      {panel.icon} {panel.label}
                    </option>
                  ))}
              </select>
            </div>

            <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 h-fit">
              <input
                type="checkbox"
                checked={mergedConfig.accordion?.expandMultiple ?? false}
                onChange={(e) => updateAccordion('expandMultiple', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-200">Expandir múltiples</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Permitir varios paneles abiertos</p>
              </div>
            </label>
          </div>

          {/* Panels List */}
          <PanelsList
            panels={mergedConfig.accordion?.panels || []}
            togglePanelEnabled={togglePanelEnabled}
            movePanelUp={movePanelUp}
            movePanelDown={movePanelDown}
            updatePanelIcon={updatePanelIcon}
          />

          {/* 🎨 Configuración de Estilos de Paneles */}
          <div className="space-y-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-lg border border-indigo-200 dark:border-indigo-700">
            <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <span>🎨</span> Estilos de Paneles del Acordeón
            </h5>

            {/* Tema Claro */}
            <ThemeStylePanel
              theme="light"
              themeLabel="Tema Claro"
              themeIcon="☀️"
              styles={mergedConfig.accordion?.styles?.light || DEFAULT_CONFIG.accordion!.styles!.light}
              onStyleChange={(field, value) => updateAccordionStyle('light', field, value)}
            />

            {/* Tema Oscuro */}
            <ThemeStylePanel
              theme="dark"
              themeLabel="Tema Oscuro"
              themeIcon="🌙"
              styles={mergedConfig.accordion?.styles?.dark || DEFAULT_CONFIG.accordion!.styles!.dark}
              onStyleChange={(field, value) => updateAccordionStyle('dark', field, value)}
            />

            {/* 🔤 Configuración de Tipografía */}
            <TypographySection
              typography={mergedConfig.accordion?.styles?.typography}
              updateAccordionTypography={updateAccordionTypography}
            />
          </div>

          {/* 💳 Estilos de Tarjetas de Contenido */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
              <span>💳</span> Estilos de Tarjetas de Contenido
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Personaliza el aspecto de las tarjetas de beneficios, características, FAQ, etc.
            </p>

            {/* Tema Claro */}
            <CardStylePanel
              theme="light"
              themeLabel="Tema Claro"
              themeIcon="☀️"
              styles={mergedConfig.accordion?.styles?.contentCards?.light}
              onStyleChange={(field: string, value: string) => updateAccordionContentCards('light', field, value)}
            />

            {/* Tema Oscuro */}
            <CardStylePanel
              theme="dark"
              themeLabel="Tema Oscuro"
              themeIcon="🌙"
              styles={mergedConfig.accordion?.styles?.contentCards?.dark}
              onStyleChange={(field: string, value: string) => updateAccordionContentCards('dark', field, value)}
            />
          </div>

          {/* 🎯 Configuración de Iconos del Header */}
          <IconConfigSection
            iconConfig={mergedConfig.accordion?.styles?.iconConfig}
            updateAccordionIconConfig={updateAccordionIconConfig}
          />

          {/* 🏷️ Configuración de Iconos de Tarjetas de Contenido */}
          <SectionIconsConfigPanel
            sectionIcons={mergedConfig.accordion?.styles?.sectionIcons}
            updateSectionIcons={updateSectionIcons}
          />

          {/* Configuración del fondo */}
          <BackgroundEditor
            background={mergedConfig.accordion?.background || DEFAULT_BACKGROUND}
            onUpdate={updateAccordionBackground}
            onBatchUpdate={batchUpdateAccordionBackground}
            label="Fondo de la sección de Acordeón"
          />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Sub-componentes internos
// ============================================================================

interface PanelsListProps {
  panels: AccordionPanelConfig[];
  togglePanelEnabled: (panelId: string) => void;
  movePanelUp: (index: number) => void;
  movePanelDown: (index: number) => void;
  updatePanelIcon: (panelId: string, icon: string) => void;
}

const PanelsList: React.FC<PanelsListProps> = ({
  panels,
  togglePanelEnabled,
  movePanelUp,
  movePanelDown,
  updatePanelIcon,
}) => {
  const [editingIconPanel, setEditingIconPanel] = useState<string | null>(null);
  
  return (
    <div className="space-y-3">
      <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <span>📋</span> Paneles disponibles
        <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
          Click en icono para cambiar
        </span>
      </h5>
      <div className="space-y-2">
        {panels.map((panel, index) => (
          <div
            key={panel.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              panel.enabled
                ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60'
            }`}
          >
            {/* Move buttons */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => movePanelUp(index)}
                disabled={index === 0}
                className={`p-1 rounded text-xs ${
                  index === 0
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ▲
              </button>
              <button
                onClick={() => movePanelDown(index)}
                disabled={index === panels.length - 1}
                className={`p-1 rounded text-xs ${
                  index === panels.length - 1
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ▼
              </button>
            </div>

            {/* Panel icon - clickable to change */}
            <div className="relative">
              <button
                onClick={() => setEditingIconPanel(editingIconPanel === panel.id ? null : panel.id)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                title="Click para cambiar icono"
              >
                <LucideIcon name={panel.icon} size={20} />
              </button>
              
              {/* Icon selector dropdown */}
              {editingIconPanel === panel.id && (
                <div className="absolute z-50 top-full left-0 mt-2 w-72 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Selecciona un icono:</p>
                  <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
                    {AVAILABLE_ICONS.map((icon) => (
                      <button
                        key={icon.name}
                        onClick={() => {
                          updatePanelIcon(panel.id, icon.name);
                          setEditingIconPanel(null);
                        }}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                          panel.icon === icon.name
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                        }`}
                        title={icon.label}
                      >
                        <LucideIcon name={icon.name} size={18} />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setEditingIconPanel(null)}
                    className="mt-2 w-full py-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>

            {/* Panel info */}
            <div className="flex-1">
              <p className="font-medium text-gray-700 dark:text-gray-200">{panel.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{panel.description}</p>
            </div>

            {/* Toggle */}
            <button
              onClick={() => togglePanelEnabled(panel.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                panel.enabled
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {panel.enabled ? '✓ Visible' : '○ Oculto'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TypographySectionProps {
  typography: any;
  updateAccordionTypography: (field: string, value: any) => void;
}

const TypographySection: React.FC<TypographySectionProps> = ({
  typography,
  updateAccordionTypography,
}) => (
  <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-lg border border-blue-200 dark:border-blue-700">
    <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
      <span>🔤</span> Tipografía del Acordeón
    </h5>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Familia de Fuente */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Familia de Fuente
        </label>
        <select
          value={typography?.fontFamily ?? 'Montserrat, sans-serif'}
          onChange={(e) => updateAccordionTypography('fontFamily', e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
        >
          <option value="Montserrat, sans-serif">Montserrat</option>
          <option value="Inter, sans-serif">Inter</option>
          <option value="Roboto, sans-serif">Roboto</option>
          <option value="Open Sans, sans-serif">Open Sans</option>
          <option value="Poppins, sans-serif">Poppins</option>
          <option value="Lato, sans-serif">Lato</option>
          <option value="Raleway, sans-serif">Raleway</option>
          <option value="Nunito, sans-serif">Nunito</option>
          <option value="system-ui, sans-serif">System UI</option>
          <option value="Georgia, serif">Georgia (Serif)</option>
          <option value="ui-monospace, monospace">Monospace</option>
        </select>
      </div>

      {/* Peso de Fuente del Header */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Peso del Título
        </label>
        <select
          value={typography?.headerFontWeight ?? '600'}
          onChange={(e) => updateAccordionTypography('headerFontWeight', e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
        >
          <option value="300">Light (300)</option>
          <option value="400">Regular (400)</option>
          <option value="500">Medium (500)</option>
          <option value="600">Semibold (600)</option>
          <option value="700">Bold (700)</option>
          <option value="800">Extrabold (800)</option>
        </select>
      </div>

      {/* Tamaño de Fuente del Header */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Tamaño del Título
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={typography?.headerFontSize ?? '1.125rem'}
            onChange={(e) => updateAccordionTypography('headerFontSize', e.target.value)}
            placeholder="1.125rem"
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
          />
          <select
            value={typography?.headerFontSize ?? '1.125rem'}
            onChange={(e) => updateAccordionTypography('headerFontSize', e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
          >
            <option value="0.875rem">14px</option>
            <option value="1rem">16px</option>
            <option value="1.125rem">18px</option>
            <option value="1.25rem">20px</option>
            <option value="1.5rem">24px</option>
          </select>
        </div>
      </div>

      {/* Tamaño de Fuente del Contenido */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Tamaño del Contenido
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={typography?.contentFontSize ?? '1rem'}
            onChange={(e) => updateAccordionTypography('contentFontSize', e.target.value)}
            placeholder="1rem"
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
          />
          <select
            value={typography?.contentFontSize ?? '1rem'}
            onChange={(e) => updateAccordionTypography('contentFontSize', e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
          >
            <option value="0.75rem">12px</option>
            <option value="0.875rem">14px</option>
            <option value="1rem">16px</option>
            <option value="1.125rem">18px</option>
          </select>
        </div>
      </div>

      {/* Altura de Línea del Contenido */}
      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Altura de Línea
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min="1"
            max="2.5"
            step="0.05"
            value={parseFloat(typography?.contentLineHeight ?? '1.75')}
            onChange={(e) => updateAccordionTypography('contentLineHeight', e.target.value)}
            className="flex-1"
          />
          <input
            type="text"
            value={typography?.contentLineHeight ?? '1.75'}
            onChange={(e) => updateAccordionTypography('contentLineHeight', e.target.value)}
            className="w-20 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-center"
          />
        </div>
      </div>
    </div>

    {/* Vista previa de tipografía */}
    <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
      <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg space-y-3">
        <h3 
          style={{
            fontFamily: typography?.fontFamily,
            fontSize: typography?.headerFontSize,
            fontWeight: typography?.headerFontWeight,
          }}
          className="text-gray-900 dark:text-white"
        >
          Título del Panel de Ejemplo
        </h3>
        <p 
          style={{
            fontFamily: typography?.fontFamily,
            fontSize: typography?.contentFontSize,
            lineHeight: typography?.contentLineHeight,
          }}
          className="text-gray-600 dark:text-gray-300"
        >
          Este es un ejemplo de cómo se verá el contenido del panel con la tipografía configurada. Puedes ajustar la familia de fuente, tamaños y altura de línea para que se adapte perfectamente al diseño de tu sitio.
        </p>
      </div>
    </div>
  </div>
);

// ============================================================================
// IconConfigSection - Configuración de iconos del header del acordeón
// ============================================================================

interface IconConfigSectionProps {
  iconConfig: any;
  updateAccordionIconConfig: (theme: 'light' | 'dark', field: string, value: any) => void;
}

const IconConfigSection: React.FC<IconConfigSectionProps> = ({
  iconConfig,
  updateAccordionIconConfig,
}) => {
  const lightConfig = iconConfig?.light || { showBackground: false, iconColor: '#8b5cf6', iconActiveColor: '#7c3aed' };
  const darkConfig = iconConfig?.dark || { showBackground: false, iconColor: '#a78bfa', iconActiveColor: '#c4b5fd' };

  return (
    <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-xl p-6 border border-violet-200 dark:border-violet-800">
      <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
        <span>🎯</span> Iconos del Header del Acordeón
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Configura cómo se muestran los iconos en los títulos de cada panel. Por defecto sin fondo para un look más limpio.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tema Claro */}
        <div className="space-y-4 p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span>☀️</span> Tema Claro
          </h5>

          {/* Toggle mostrar fondo */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={lightConfig.showBackground}
              onChange={(e) => updateAccordionIconConfig('light', 'showBackground', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <div>
              <p className="font-medium text-sm text-gray-700 dark:text-gray-200">Mostrar fondo</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Agrega un fondo al icono</p>
            </div>
          </label>

          {/* Color del icono */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Color del icono
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={lightConfig.iconColor}
                  onChange={(e) => updateAccordionIconConfig('light', 'iconColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={lightConfig.iconColor}
                  onChange={(e) => updateAccordionIconConfig('light', 'iconColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Color activo
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={lightConfig.iconActiveColor}
                  onChange={(e) => updateAccordionIconConfig('light', 'iconActiveColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={lightConfig.iconActiveColor}
                  onChange={(e) => updateAccordionIconConfig('light', 'iconActiveColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
            </div>
          </div>

          {/* Colores de fondo (solo si showBackground está activo) */}
          {lightConfig.showBackground && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-600">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Fondo normal
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={lightConfig.backgroundColor || '#f3f4f6'}
                    onChange={(e) => updateAccordionIconConfig('light', 'backgroundColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={lightConfig.backgroundColor || '#f3f4f6'}
                    onChange={(e) => updateAccordionIconConfig('light', 'backgroundColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Fondo activo
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={lightConfig.backgroundActiveColor || '#8b5cf6'}
                    onChange={(e) => updateAccordionIconConfig('light', 'backgroundActiveColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={lightConfig.backgroundActiveColor || '#8b5cf6'}
                    onChange={(e) => updateAccordionIconConfig('light', 'backgroundActiveColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Vista previa */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div 
                className={`w-10 h-10 flex items-center justify-center transition-all ${lightConfig.showBackground ? 'rounded-xl shadow-md' : ''}`}
                style={{
                  backgroundColor: lightConfig.showBackground ? lightConfig.backgroundColor : 'transparent',
                  color: lightConfig.iconColor,
                }}
              >
                <LucideIcon name="FileText" size={22} />
              </div>
              <span className="text-sm text-gray-600">Normal</span>
              
              <div 
                className={`w-10 h-10 flex items-center justify-center transition-all ${lightConfig.showBackground ? 'rounded-xl shadow-md' : ''}`}
                style={{
                  backgroundColor: lightConfig.showBackground ? lightConfig.backgroundActiveColor : 'transparent',
                  color: lightConfig.showBackground ? '#ffffff' : lightConfig.iconActiveColor,
                }}
              >
                <LucideIcon name="FileText" size={22} />
              </div>
              <span className="text-sm text-gray-600">Activo</span>
            </div>
          </div>
        </div>

        {/* Tema Oscuro */}
        <div className="space-y-4 p-4 bg-gray-800/50 dark:bg-gray-900/50 rounded-lg border border-gray-600 dark:border-gray-600">
          <h5 className="font-medium text-gray-200 flex items-center gap-2">
            <span>🌙</span> Tema Oscuro
          </h5>

          {/* Toggle mostrar fondo */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={darkConfig.showBackground}
              onChange={(e) => updateAccordionIconConfig('dark', 'showBackground', e.target.checked)}
              className="w-5 h-5 rounded border-gray-500 text-purple-600 focus:ring-purple-500"
            />
            <div>
              <p className="font-medium text-sm text-gray-200">Mostrar fondo</p>
              <p className="text-xs text-gray-400">Agrega un fondo al icono</p>
            </div>
          </label>

          {/* Color del icono */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Color del icono
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={darkConfig.iconColor}
                  onChange={(e) => updateAccordionIconConfig('dark', 'iconColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={darkConfig.iconColor}
                  onChange={(e) => updateAccordionIconConfig('dark', 'iconColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Color activo
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={darkConfig.iconActiveColor}
                  onChange={(e) => updateAccordionIconConfig('dark', 'iconActiveColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={darkConfig.iconActiveColor}
                  onChange={(e) => updateAccordionIconConfig('dark', 'iconActiveColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Colores de fondo (solo si showBackground está activo) */}
          {darkConfig.showBackground && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-600">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Fondo normal
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={darkConfig.backgroundColor || '#374151'}
                    onChange={(e) => updateAccordionIconConfig('dark', 'backgroundColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={darkConfig.backgroundColor || '#374151'}
                    onChange={(e) => updateAccordionIconConfig('dark', 'backgroundColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Fondo activo
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={darkConfig.backgroundActiveColor || '#a78bfa'}
                    onChange={(e) => updateAccordionIconConfig('dark', 'backgroundActiveColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={darkConfig.backgroundActiveColor || '#a78bfa'}
                    onChange={(e) => updateAccordionIconConfig('dark', 'backgroundActiveColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Vista previa */}
          <div className="pt-3 border-t border-gray-600">
            <p className="text-xs text-gray-400 mb-2">Vista previa:</p>
            <div className="flex items-center gap-4 p-3 bg-gray-900 rounded-lg">
              <div 
                className={`w-10 h-10 flex items-center justify-center transition-all ${darkConfig.showBackground ? 'rounded-xl shadow-md' : ''}`}
                style={{
                  backgroundColor: darkConfig.showBackground ? darkConfig.backgroundColor : 'transparent',
                  color: darkConfig.iconColor,
                }}
              >
                <LucideIcon name="FileText" size={22} />
              </div>
              <span className="text-sm text-gray-400">Normal</span>
              
              <div 
                className={`w-10 h-10 flex items-center justify-center transition-all ${darkConfig.showBackground ? 'rounded-xl shadow-md' : ''}`}
                style={{
                  backgroundColor: darkConfig.showBackground ? darkConfig.backgroundActiveColor : 'transparent',
                  color: darkConfig.showBackground ? '#111827' : darkConfig.iconActiveColor,
                }}
              >
                <LucideIcon name="FileText" size={22} />
              </div>
              <span className="text-sm text-gray-400">Activo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SectionIconsConfigPanel - Configuración de iconos por sección
// ============================================================================

interface SectionIconsConfigPanelProps {
  sectionIcons: any;
  updateSectionIcons: (section: 'caracteristicas' | 'beneficios' | 'incluye' | 'noIncluye', field: string, value: any) => void;
}

const SECTION_CONFIGS = [
  { 
    id: 'caracteristicas' as const, 
    label: 'Características', 
    description: 'Iconos en la lista de características del servicio',
    defaultIcon: 'Hash',
    supportsNumber: true,
  },
  { 
    id: 'beneficios' as const, 
    label: 'Beneficios', 
    description: 'Iconos en la lista de beneficios',
    defaultIcon: 'Star',
    supportsNumber: false,
  },
  { 
    id: 'incluye' as const, 
    label: 'Qué Incluye', 
    description: 'Iconos en la lista de lo que incluye el servicio',
    defaultIcon: 'Check',
    supportsNumber: false,
  },
  { 
    id: 'noIncluye' as const, 
    label: 'No Incluye', 
    description: 'Iconos en la lista de lo que no incluye',
    defaultIcon: 'X',
    supportsNumber: false,
  },
];

const SectionIconsConfigPanel: React.FC<SectionIconsConfigPanelProps> = ({
  sectionIcons,
  updateSectionIcons,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editingIconSection, setEditingIconSection] = useState<string | null>(null);

  const getIconConfig = (sectionId: string) => {
    return sectionIcons?.[sectionId] || { type: 'icon', icon: 'Star', showBackground: true };
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
      <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
        <span>🏷️</span> Iconos de Tarjetas de Contenido
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Personaliza los iconos que aparecen en las tarjetas de características, beneficios, qué incluye, etc.
      </p>

      <div className="space-y-3">
        {SECTION_CONFIGS.map((section) => {
          const config = getIconConfig(section.id);
          const isExpanded = expandedSection === section.id;
          
          return (
            <div 
              key={section.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Preview del icono */}
                  <div 
                    className={`w-8 h-8 flex items-center justify-center ${config.showBackground ? 'rounded-lg' : ''}`}
                    style={{
                      background: config.showBackground 
                        ? 'linear-gradient(to bottom right, #8b5cf6, #06b6d4)' 
                        : 'transparent',
                      color: config.showBackground ? '#ffffff' : '#8b5cf6',
                    }}
                  >
                    {config.type === 'number' ? (
                      <span className="text-sm font-bold">1</span>
                    ) : config.type === 'none' ? (
                      <span className="text-xs">—</span>
                    ) : (
                      <LucideIcon name={config.icon || section.defaultIcon} size={16} />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-700 dark:text-gray-200">{section.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{section.description}</p>
                  </div>
                </div>
                <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {/* Contenido expandible */}
              {isExpanded && (
                <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  {/* Tipo de icono */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Tipo de indicador
                    </label>
                    <div className="flex gap-2">
                      {section.supportsNumber && (
                        <button
                          onClick={() => updateSectionIcons(section.id, 'type', 'number')}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            config.type === 'number'
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          123 Número
                        </button>
                      )}
                      <button
                        onClick={() => updateSectionIcons(section.id, 'type', 'icon')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                          config.type === 'icon'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        <LucideIcon name="Star" size={14} /> Icono
                      </button>
                      <button
                        onClick={() => updateSectionIcons(section.id, 'type', 'none')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          config.type === 'none'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        Sin icono
                      </button>
                    </div>
                  </div>

                  {/* Selector de icono (solo si type es 'icon') */}
                  {config.type === 'icon' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Seleccionar icono
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setEditingIconSection(editingIconSection === section.id ? null : section.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <LucideIcon name={config.icon || section.defaultIcon} size={18} />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{config.icon || section.defaultIcon}</span>
                          <span className="text-xs text-gray-400">▼</span>
                        </button>

                        {/* Dropdown de iconos */}
                        {editingIconSection === section.id && (
                          <div className="absolute z-50 top-full left-0 mt-2 w-80 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Selecciona un icono:</p>
                            <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                              {AVAILABLE_ICONS.map((icon) => (
                                <button
                                  key={icon.name}
                                  onClick={() => {
                                    updateSectionIcons(section.id, 'icon', icon.name);
                                    setEditingIconSection(null);
                                  }}
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                                    config.icon === icon.name
                                      ? 'bg-purple-500 text-white'
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                                  }`}
                                  title={icon.label}
                                >
                                  <LucideIcon name={icon.name} size={16} />
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => setEditingIconSection(null)}
                              className="mt-2 w-full py-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                              Cerrar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Toggle fondo del icono */}
                  {config.type !== 'none' && (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showBackground}
                        onChange={(e) => updateSectionIcons(section.id, 'showBackground', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Mostrar fondo del icono
                      </span>
                    </label>
                  )}

                  {/* Vista previa */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div 
                        className={`flex-shrink-0 flex items-center justify-center ${
                          config.showBackground && config.type !== 'none' 
                            ? 'w-10 h-10 rounded-lg' 
                            : 'w-6 h-6'
                        }`}
                        style={{
                          background: config.showBackground && config.type !== 'none'
                            ? 'linear-gradient(to bottom right, #8b5cf6, #06b6d4)' 
                            : 'transparent',
                          color: config.showBackground && config.type !== 'none' ? '#ffffff' : '#8b5cf6',
                        }}
                      >
                        {config.type === 'number' ? (
                          <span className="text-sm font-bold">1</span>
                        ) : config.type === 'none' ? null : (
                          <LucideIcon name={config.icon || section.defaultIcon} size={config.showBackground ? 20 : 16} />
                        )}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Ejemplo de elemento de {section.label.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccordionConfigSection;
