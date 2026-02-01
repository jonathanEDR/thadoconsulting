/**
 * 🎛️ AccordionConfigSectionCompact - Versión Compacta
 * Configuración optimizada del acordeón para página de detalle de servicio
 * 
 * MEJORAS:
 * - Sistema de tabs para organizar configuraciones
 * - ColorGrid para comparar temas light/dark lado a lado
 * - Vista previa unificada con toggle de tema
 * - ~65% menos código que la versión original
 */

import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { BackgroundEditor } from '../shared/BackgroundEditor';
import {
  ThemeTabs,
  ColorGridSimple,
  CompactSection,
  CompactToggle,
} from '../shared/CompactStyleEditors';
import type {
  BackgroundConfig,
  ServicioDetailConfig,
  AccordionHeaderConfig,
} from '../types/servicioDetailConfig';
import { DEFAULT_BACKGROUND, DEFAULT_CONFIG } from '../types/servicioDetailConfig';

// Lista de iconos disponibles
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

// Helper para renderizar iconos de Lucide
const LucideIcon: React.FC<{ name: string; size?: number; className?: string; style?: React.CSSProperties }> = ({ 
  name, size = 24, className = '', style = {}
}) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <span className={className}>?</span>;
  return <IconComponent size={size} className={className} style={style} />;
};

interface AccordionConfigSectionCompactProps {
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
  updateAccordionHeader: (field: keyof AccordionHeaderConfig, value: any) => void;
  updateAccordionHeaderTitle: (field: string, value: any) => void;
  updateAccordionHeaderSubtitle: (field: string, value: any) => void;
}

type TabType = 'behavior' | 'header' | 'styles' | 'icons';

export const AccordionConfigSectionCompact: React.FC<AccordionConfigSectionCompactProps> = ({
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
  const [activeTab, setActiveTab] = useState<TabType>('behavior');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'behavior', label: 'Comportamiento', icon: '⚙️' },
    { id: 'header', label: 'Header', icon: '📝' },
    { id: 'styles', label: 'Estilos', icon: '🎨' },
    { id: 'icons', label: 'Iconos', icon: '🎯' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎛️</span>
          <div className="text-left">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Acordeón de Paneles</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Comportamiento, estilos e iconos</p>
          </div>
        </div>
        <span className={`text-xl transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-white dark:bg-gray-800'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4">
            {/* TAB: Comportamiento */}
            {activeTab === 'behavior' && (
              <BehaviorTab
                mergedConfig={mergedConfig}
                updateAccordion={updateAccordion}
                togglePanelEnabled={togglePanelEnabled}
                movePanelUp={movePanelUp}
                movePanelDown={movePanelDown}
                updatePanelIcon={updatePanelIcon}
                updateAccordionBackground={updateAccordionBackground}
                batchUpdateAccordionBackground={batchUpdateAccordionBackground}
              />
            )}

            {/* TAB: Header */}
            {activeTab === 'header' && (
              <HeaderTab
                mergedConfig={mergedConfig}
                previewTheme={previewTheme}
                setPreviewTheme={setPreviewTheme}
                updateAccordionHeader={updateAccordionHeader}
                updateAccordionHeaderTitle={updateAccordionHeaderTitle}
                updateAccordionHeaderSubtitle={updateAccordionHeaderSubtitle}
              />
            )}

            {/* TAB: Estilos */}
            {activeTab === 'styles' && (
              <StylesTab
                mergedConfig={mergedConfig}
                previewTheme={previewTheme}
                setPreviewTheme={setPreviewTheme}
                updateAccordionStyle={updateAccordionStyle}
                updateAccordionTypography={updateAccordionTypography}
                updateAccordionContentCards={updateAccordionContentCards}
              />
            )}

            {/* TAB: Iconos */}
            {activeTab === 'icons' && (
              <IconsTab
                mergedConfig={mergedConfig}
                previewTheme={previewTheme}
                setPreviewTheme={setPreviewTheme}
                updateAccordionIconConfig={updateAccordionIconConfig}
                updateSectionIcons={updateSectionIcons}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// TAB: Comportamiento
// =============================================================================
interface BehaviorTabProps {
  mergedConfig: ServicioDetailConfig;
  updateAccordion: (field: keyof NonNullable<ServicioDetailConfig['accordion']>, value: any) => void;
  togglePanelEnabled: (panelId: string) => void;
  movePanelUp: (index: number) => void;
  movePanelDown: (index: number) => void;
  updatePanelIcon: (panelId: string, icon: string) => void;
  updateAccordionBackground: (field: keyof BackgroundConfig, value: any) => void;
  batchUpdateAccordionBackground: (updates: Partial<BackgroundConfig>) => void;
}

const BehaviorTab: React.FC<BehaviorTabProps> = ({
  mergedConfig,
  updateAccordion,
  togglePanelEnabled,
  movePanelUp,
  movePanelDown,
  updatePanelIcon,
  updateAccordionBackground,
  batchUpdateAccordionBackground,
}) => {
  const [editingIconPanel, setEditingIconPanel] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Opciones Generales */}
      <CompactSection title="Opciones Generales" icon="⚙️" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Panel abierto por defecto
            </label>
            <select
              value={mergedConfig.accordion?.defaultOpenPanel ?? 'descripcion'}
              onChange={(e) => updateAccordion('defaultOpenPanel', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
            >
              <option value="">Ninguno (todos cerrados)</option>
              {mergedConfig.accordion?.panels
                .filter(p => p.enabled)
                .map(panel => (
                  <option key={panel.id} value={panel.id}>
                    {panel.label}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center">
            <CompactToggle
              label="Expandir múltiples"
              description="Varios paneles abiertos"
              checked={mergedConfig.accordion?.expandMultiple ?? false}
              onChange={(checked) => updateAccordion('expandMultiple', checked)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Duración animación (ms)
            </label>
            <input
              type="number"
              min="100"
              max="1000"
              step="50"
              value={mergedConfig.accordion?.animationDuration ?? 300}
              onChange={(e) => updateAccordion('animationDuration', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
            />
          </div>

          <div className="flex items-center">
            <CompactToggle
              label="Mostrar descripción"
              description="En cada panel"
              checked={mergedConfig.accordion?.showPanelDescription ?? true}
              onChange={(checked) => updateAccordion('showPanelDescription', checked)}
            />
          </div>
        </div>
      </CompactSection>

      {/* Lista de Paneles */}
      <CompactSection title="Paneles Disponibles" icon="📋" defaultOpen>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {mergedConfig.accordion?.panels.map((panel, index) => (
            <div
              key={panel.id}
              className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                panel.enabled
                  ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60'
              }`}
            >
              {/* Move buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => movePanelUp(index)}
                  disabled={index === 0}
                  className={`p-0.5 rounded text-xs ${
                    index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >▲</button>
                <button
                  onClick={() => movePanelDown(index)}
                  disabled={index === mergedConfig.accordion!.panels.length - 1}
                  className={`p-0.5 rounded text-xs ${
                    index === mergedConfig.accordion!.panels.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >▼</button>
              </div>

              {/* Icon selector */}
              <div className="relative">
                <button
                  onClick={() => setEditingIconPanel(editingIconPanel === panel.id ? null : panel.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 hover:bg-purple-200 transition-colors"
                  title="Cambiar icono"
                >
                  <LucideIcon name={panel.icon} size={16} />
                </button>
                
                {editingIconPanel === panel.id && (
                  <div className="absolute z-50 top-full left-0 mt-1 w-64 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
                      {AVAILABLE_ICONS.map((icon) => (
                        <button
                          key={icon.name}
                          onClick={() => {
                            updatePanelIcon(panel.id, icon.name);
                            setEditingIconPanel(null);
                          }}
                          className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                            panel.icon === icon.name
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-purple-100'
                          }`}
                          title={icon.label}
                        >
                          <LucideIcon name={icon.name} size={14} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Panel info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-700 dark:text-gray-200 truncate">{panel.label}</p>
              </div>

              {/* Toggle */}
              <button
                onClick={() => togglePanelEnabled(panel.id)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  panel.enabled
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                }`}
              >
                {panel.enabled ? '✓' : '○'}
              </button>
            </div>
          ))}
        </div>
      </CompactSection>

      {/* Fondo de la Sección */}
      <CompactSection title="Fondo de la Sección" icon="🖼️">
        <BackgroundEditor
          background={mergedConfig.accordion?.background || DEFAULT_BACKGROUND}
          onUpdate={updateAccordionBackground}
          onBatchUpdate={batchUpdateAccordionBackground}
          label=""
        />
      </CompactSection>
    </div>
  );
};

// =============================================================================
// TAB: Header
// =============================================================================
interface HeaderTabProps {
  mergedConfig: ServicioDetailConfig;
  previewTheme: 'light' | 'dark';
  setPreviewTheme: (theme: 'light' | 'dark') => void;
  updateAccordionHeader: (field: keyof AccordionHeaderConfig, value: any) => void;
  updateAccordionHeaderTitle: (field: string, value: any) => void;
  updateAccordionHeaderSubtitle: (field: string, value: any) => void;
}

const HeaderTab: React.FC<HeaderTabProps> = ({
  mergedConfig,
  previewTheme,
  setPreviewTheme,
  updateAccordionHeader,
  updateAccordionHeaderTitle,
  updateAccordionHeaderSubtitle,
}) => {
  return (
    <div className="space-y-4">
      {/* Vista Previa Unificada */}
      <div className={`rounded-lg p-4 border ${previewTheme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-900 border-gray-700'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500">Vista Previa</span>
          <ThemeTabs activeTheme={previewTheme} onChange={setPreviewTheme} />
        </div>
        <div className={`${
          mergedConfig.accordion?.header?.alignment === 'left' ? 'text-left' :
          mergedConfig.accordion?.header?.alignment === 'right' ? 'text-right' : 'text-center'
        }`}>
          <h3 
            className={`text-xl font-bold mb-1 flex items-center gap-2 ${
              mergedConfig.accordion?.header?.alignment === 'left' ? 'justify-start' :
              mergedConfig.accordion?.header?.alignment === 'right' ? 'justify-end' : 'justify-center'
            }`}
            style={{ 
              color: previewTheme === 'light' 
                ? (mergedConfig.accordion?.header?.title?.color || '#111827')
                : (mergedConfig.accordion?.header?.title?.colorDark || '#FFFFFF')
            }}
          >
            <span>{mergedConfig.accordion?.header?.title?.icon || '📚'}</span>
            {mergedConfig.accordion?.header?.title?.text || 'Información Completa'}
          </h3>
          <p style={{ 
            color: previewTheme === 'light'
              ? (mergedConfig.accordion?.header?.subtitle?.color || '#4B5563')
              : (mergedConfig.accordion?.header?.subtitle?.colorDark || '#9CA3AF')
          }}>
            {mergedConfig.accordion?.header?.subtitle?.text || 'Haz clic en cada sección para ver más detalles'}
          </p>
        </div>
      </div>

      {/* Mostrar/Ocultar */}
      <div className="grid grid-cols-2 gap-2">
        <CompactToggle
          label="Mostrar Título"
          checked={mergedConfig.accordion?.header?.showTitle ?? true}
          onChange={(checked) => updateAccordionHeader('showTitle', checked)}
        />
        <CompactToggle
          label="Mostrar Descripción"
          checked={mergedConfig.accordion?.header?.showSubtitle ?? true}
          onChange={(checked) => updateAccordionHeader('showSubtitle', checked)}
        />
      </div>

      {/* Título */}
      <CompactSection title="Título" icon="✏️" defaultOpen>
        <div className="space-y-3">
          {/* Icono y Texto */}
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Icono</label>
              <input
                type="text"
                value={mergedConfig.accordion?.header?.title?.icon ?? '📚'}
                onChange={(e) => updateAccordionHeaderTitle('icon', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-lg"
                maxLength={4}
              />
            </div>
            <div className="col-span-3">
              <label className="block text-xs text-gray-500 mb-1">Texto</label>
              <input
                type="text"
                value={mergedConfig.accordion?.header?.title?.text ?? 'Información Completa'}
                onChange={(e) => updateAccordionHeaderTitle('text', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
              />
            </div>
          </div>

          {/* Colores - Grid compacto */}
          <ColorGridSimple
            label="Colores del Título"
            lightValue={mergedConfig.accordion?.header?.title?.color || '#111827'}
            darkValue={mergedConfig.accordion?.header?.title?.colorDark || '#FFFFFF'}
            onLightChange={(value: string) => updateAccordionHeaderTitle('color', value)}
            onDarkChange={(value: string) => updateAccordionHeaderTitle('colorDark', value)}
          />

          {/* Tipografía compacta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fuente</label>
              <select
                value={mergedConfig.accordion?.header?.title?.fontFamily || 'Montserrat'}
                onChange={(e) => updateAccordionHeaderTitle('fontFamily', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
              >
                <option value="Montserrat">Montserrat</option>
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tamaño</label>
              <select
                value={mergedConfig.accordion?.header?.title?.fontSize || 'text-3xl md:text-4xl'}
                onChange={(e) => updateAccordionHeaderTitle('fontSize', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
              >
                <option value="text-2xl md:text-3xl">3XL</option>
                <option value="text-3xl md:text-4xl">4XL</option>
                <option value="text-4xl md:text-5xl">5XL</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Peso</label>
              <select
                value={mergedConfig.accordion?.header?.title?.fontWeight || 'font-bold'}
                onChange={(e) => updateAccordionHeaderTitle('fontWeight', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
              >
                <option value="font-medium">Medium</option>
                <option value="font-semibold">Semibold</option>
                <option value="font-bold">Bold</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Línea</label>
              <select
                value={mergedConfig.accordion?.header?.title?.lineHeight || 'leading-tight'}
                onChange={(e) => updateAccordionHeaderTitle('lineHeight', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
              >
                <option value="leading-tight">Tight</option>
                <option value="leading-snug">Snug</option>
                <option value="leading-normal">Normal</option>
              </select>
            </div>
          </div>
        </div>
      </CompactSection>

      {/* Descripción */}
      <CompactSection title="Descripción" icon="📄" defaultOpen>
        <div className="space-y-3">
          <input
            type="text"
            value={mergedConfig.accordion?.header?.subtitle?.text ?? 'Haz clic en cada sección para ver más detalles'}
            onChange={(e) => updateAccordionHeaderSubtitle('text', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
            placeholder="Descripción..."
          />

          <ColorGridSimple
            label="Colores de Descripción"
            lightValue={mergedConfig.accordion?.header?.subtitle?.color || '#4B5563'}
            darkValue={mergedConfig.accordion?.header?.subtitle?.colorDark || '#9CA3AF'}
            onLightChange={(value: string) => updateAccordionHeaderSubtitle('color', value)}
            onDarkChange={(value: string) => updateAccordionHeaderSubtitle('colorDark', value)}
          />

          {/* Tipografía compacta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fuente</label>
              <select
                value={mergedConfig.accordion?.header?.subtitle?.fontFamily || 'Montserrat'}
                onChange={(e) => updateAccordionHeaderSubtitle('fontFamily', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
              >
                <option value="Montserrat">Montserrat</option>
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tamaño</label>
              <select
                value={mergedConfig.accordion?.header?.subtitle?.fontSize || 'text-lg'}
                onChange={(e) => updateAccordionHeaderSubtitle('fontSize', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
              >
                <option value="text-sm">SM</option>
                <option value="text-base">Base</option>
                <option value="text-lg">LG</option>
                <option value="text-xl">XL</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Peso</label>
              <select
                value={mergedConfig.accordion?.header?.subtitle?.fontWeight || 'font-normal'}
                onChange={(e) => updateAccordionHeaderSubtitle('fontWeight', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
              >
                <option value="font-light">Light</option>
                <option value="font-normal">Normal</option>
                <option value="font-medium">Medium</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Línea</label>
              <select
                value={mergedConfig.accordion?.header?.subtitle?.lineHeight || 'leading-relaxed'}
                onChange={(e) => updateAccordionHeaderSubtitle('lineHeight', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
              >
                <option value="leading-snug">Snug</option>
                <option value="leading-normal">Normal</option>
                <option value="leading-relaxed">Relaxed</option>
              </select>
            </div>
          </div>
        </div>
      </CompactSection>

      {/* Alineación */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Alineación</label>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              onClick={() => updateAccordionHeader('alignment', align)}
              className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                mergedConfig.accordion?.header?.alignment === align
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {align === 'left' ? '⬅️' : align === 'center' ? '↔️' : '➡️'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// TAB: Estilos
// =============================================================================
interface StylesTabProps {
  mergedConfig: ServicioDetailConfig;
  previewTheme: 'light' | 'dark';
  setPreviewTheme: (theme: 'light' | 'dark') => void;
  updateAccordionStyle: (theme: 'light' | 'dark', field: string, value: any) => void;
  updateAccordionTypography: (field: string, value: any) => void;
  updateAccordionContentCards: (theme: 'light' | 'dark', field: string, value: any) => void;
}

const StylesTab: React.FC<StylesTabProps> = ({
  mergedConfig,
  previewTheme,
  setPreviewTheme,
  updateAccordionStyle,
  updateAccordionTypography,
  updateAccordionContentCards,
}) => {
  const lightStyles = mergedConfig.accordion?.styles?.light || DEFAULT_CONFIG.accordion!.styles!.light;
  const darkStyles = mergedConfig.accordion?.styles?.dark || DEFAULT_CONFIG.accordion!.styles!.dark;
  const typography = mergedConfig.accordion?.styles?.typography;

  return (
    <div className="space-y-4">
      {/* Vista Previa de Panel */}
      <div className={`rounded-lg p-4 border ${previewTheme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500">Vista Previa Panel</span>
          <ThemeTabs activeTheme={previewTheme} onChange={setPreviewTheme} />
        </div>
        <div 
          className="rounded-lg p-3 border"
          style={{
            backgroundColor: previewTheme === 'light' ? lightStyles.headerBackground : darkStyles.headerBackground,
            borderColor: previewTheme === 'light' ? lightStyles.panelBorder : darkStyles.panelBorder,
          }}
        >
          <div className="flex items-center gap-2">
            <LucideIcon name="FileText" size={18} style={{ color: previewTheme === 'light' ? lightStyles.headerIcon : darkStyles.headerIcon }} />
            <span 
              className="font-medium"
              style={{ 
                color: previewTheme === 'light' ? lightStyles.headerText : darkStyles.headerText,
                fontFamily: typography?.fontFamily,
              }}
            >
              Ejemplo de Panel
            </span>
          </div>
        </div>
      </div>

      {/* Estilos de Paneles */}
      <CompactSection title="Estilos de Paneles" icon="🎨" defaultOpen>
        <div className="space-y-3">
          <ColorGridSimple
            label="Fondo del Header"
            lightValue={lightStyles.headerBackground || '#f9fafb'}
            darkValue={darkStyles.headerBackground || '#1f2937'}
            onLightChange={(v: string) => updateAccordionStyle('light', 'headerBackground', v)}
            onDarkChange={(v: string) => updateAccordionStyle('dark', 'headerBackground', v)}
          />
          <ColorGridSimple
            label="Texto del Header"
            lightValue={lightStyles.headerText || '#111827'}
            darkValue={darkStyles.headerText || '#f9fafb'}
            onLightChange={(v: string) => updateAccordionStyle('light', 'headerText', v)}
            onDarkChange={(v: string) => updateAccordionStyle('dark', 'headerText', v)}
          />
          <ColorGridSimple
            label="Fondo del Contenido"
            lightValue={lightStyles.contentBackground || '#ffffff'}
            darkValue={darkStyles.contentBackground || '#111827'}
            onLightChange={(v: string) => updateAccordionStyle('light', 'contentBackground', v)}
            onDarkChange={(v: string) => updateAccordionStyle('dark', 'contentBackground', v)}
          />
          <ColorGridSimple
            label="Borde"
            lightValue={lightStyles.panelBorder || '#e5e7eb'}
            darkValue={darkStyles.panelBorder || '#374151'}
            onLightChange={(v: string) => updateAccordionStyle('light', 'panelBorder', v)}
            onDarkChange={(v: string) => updateAccordionStyle('dark', 'panelBorder', v)}
          />
          <ColorGridSimple
            label="Color del Icono"
            lightValue={lightStyles.headerIcon || '#8b5cf6'}
            darkValue={darkStyles.headerIcon || '#a78bfa'}
            onLightChange={(v: string) => updateAccordionStyle('light', 'headerIcon', v)}
            onDarkChange={(v: string) => updateAccordionStyle('dark', 'headerIcon', v)}
          />
        </div>
      </CompactSection>

      {/* Tipografía */}
      <CompactSection title="Tipografía del Acordeón" icon="🔤">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Familia</label>
            <select
              value={typography?.fontFamily ?? 'Montserrat, sans-serif'}
              onChange={(e) => updateAccordionTypography('fontFamily', e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
            >
              <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Inter, sans-serif">Inter</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="system-ui, sans-serif">System UI</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Peso Header</label>
            <select
              value={typography?.headerFontWeight ?? '600'}
              onChange={(e) => updateAccordionTypography('headerFontWeight', e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
            >
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tamaño Header</label>
            <select
              value={typography?.headerFontSize ?? '1.125rem'}
              onChange={(e) => updateAccordionTypography('headerFontSize', e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
            >
              <option value="1rem">16px</option>
              <option value="1.125rem">18px</option>
              <option value="1.25rem">20px</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tamaño Contenido</label>
            <select
              value={typography?.contentFontSize ?? '1rem'}
              onChange={(e) => updateAccordionTypography('contentFontSize', e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
            >
              <option value="0.875rem">14px</option>
              <option value="1rem">16px</option>
              <option value="1.125rem">18px</option>
            </select>
          </div>
        </div>
      </CompactSection>

      {/* Estilos de Tarjetas de Contenido */}
      <CompactSection title="Tarjetas de Contenido" icon="💳">
        <div className="space-y-3">
          <ColorGridSimple
            label="Fondo de Tarjeta"
            lightValue={mergedConfig.accordion?.styles?.contentCards?.light?.background || '#f9fafb'}
            darkValue={mergedConfig.accordion?.styles?.contentCards?.dark?.background || '#1f2937'}
            onLightChange={(v: string) => updateAccordionContentCards('light', 'background', v)}
            onDarkChange={(v: string) => updateAccordionContentCards('dark', 'background', v)}
          />
          <ColorGridSimple
            label="Borde de Tarjeta"
            lightValue={mergedConfig.accordion?.styles?.contentCards?.light?.borderColor || '#e5e7eb'}
            darkValue={mergedConfig.accordion?.styles?.contentCards?.dark?.borderColor || '#374151'}
            onLightChange={(v: string) => updateAccordionContentCards('light', 'borderColor', v)}
            onDarkChange={(v: string) => updateAccordionContentCards('dark', 'borderColor', v)}
          />
          <ColorGridSimple
            label="Texto de Tarjeta"
            lightValue={mergedConfig.accordion?.styles?.contentCards?.light?.textColor || '#374151'}
            darkValue={mergedConfig.accordion?.styles?.contentCards?.dark?.textColor || '#e5e7eb'}
            onLightChange={(v: string) => updateAccordionContentCards('light', 'textColor', v)}
            onDarkChange={(v: string) => updateAccordionContentCards('dark', 'textColor', v)}
          />
        </div>
      </CompactSection>
    </div>
  );
};

// =============================================================================
// TAB: Iconos
// =============================================================================
interface IconsTabProps {
  mergedConfig: ServicioDetailConfig;
  previewTheme: 'light' | 'dark';
  setPreviewTheme: (theme: 'light' | 'dark') => void;
  updateAccordionIconConfig: (theme: 'light' | 'dark', field: string, value: any) => void;
  updateSectionIcons: (section: 'caracteristicas' | 'beneficios' | 'incluye' | 'noIncluye', field: string, value: any) => void;
}

const SECTION_CONFIGS = [
  { id: 'caracteristicas' as const, label: 'Características', defaultIcon: 'Hash', supportsNumber: true },
  { id: 'beneficios' as const, label: 'Beneficios', defaultIcon: 'Star', supportsNumber: false },
  { id: 'incluye' as const, label: 'Qué Incluye', defaultIcon: 'Check', supportsNumber: false },
  { id: 'noIncluye' as const, label: 'No Incluye', defaultIcon: 'X', supportsNumber: false },
];

const IconsTab: React.FC<IconsTabProps> = ({
  mergedConfig,
  previewTheme,
  setPreviewTheme,
  updateAccordionIconConfig,
  updateSectionIcons,
}) => {
  const [editingIconSection, setEditingIconSection] = useState<string | null>(null);
  
  const lightIconConfig = mergedConfig.accordion?.styles?.iconConfig?.light || { showBackground: false, iconColor: '#8b5cf6', iconActiveColor: '#7c3aed' };
  const darkIconConfig = mergedConfig.accordion?.styles?.iconConfig?.dark || { showBackground: false, iconColor: '#a78bfa', iconActiveColor: '#c4b5fd' };
  const currentConfig = previewTheme === 'light' ? lightIconConfig : darkIconConfig;

  const getIconConfig = (sectionId: string) => {
    return mergedConfig.accordion?.styles?.sectionIcons?.[sectionId as keyof typeof mergedConfig.accordion.styles.sectionIcons] || { type: 'icon', icon: 'Star', showBackground: true };
  };

  return (
    <div className="space-y-4">
      {/* Vista Previa de Iconos Header */}
      <div className={`rounded-lg p-4 border ${previewTheme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-900 border-gray-700'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500">Vista Previa Iconos</span>
          <ThemeTabs activeTheme={previewTheme} onChange={setPreviewTheme} />
        </div>
        <div className="flex items-center gap-4">
          <div 
            className={`w-10 h-10 flex items-center justify-center transition-all ${currentConfig.showBackground ? 'rounded-xl shadow-md' : ''}`}
            style={{
              backgroundColor: currentConfig.showBackground ? currentConfig.backgroundColor : 'transparent',
              color: currentConfig.iconColor,
            }}
          >
            <LucideIcon name="FileText" size={22} />
          </div>
          <span className={`text-sm ${previewTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Normal</span>
          
          <div 
            className={`w-10 h-10 flex items-center justify-center transition-all ${currentConfig.showBackground ? 'rounded-xl shadow-md' : ''}`}
            style={{
              backgroundColor: currentConfig.showBackground ? currentConfig.backgroundActiveColor : 'transparent',
              color: currentConfig.showBackground ? '#ffffff' : currentConfig.iconActiveColor,
            }}
          >
            <LucideIcon name="FileText" size={22} />
          </div>
          <span className={`text-sm ${previewTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Activo</span>
        </div>
      </div>

      {/* Iconos del Header del Acordeón */}
      <CompactSection title="Iconos del Header" icon="🎯" defaultOpen>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <CompactToggle
              label="Fondo (Claro)"
              checked={lightIconConfig.showBackground}
              onChange={(checked) => updateAccordionIconConfig('light', 'showBackground', checked)}
            />
            <CompactToggle
              label="Fondo (Oscuro)"
              checked={darkIconConfig.showBackground}
              onChange={(checked) => updateAccordionIconConfig('dark', 'showBackground', checked)}
            />
          </div>

          <ColorGridSimple
            label="Color del Icono"
            lightValue={lightIconConfig.iconColor}
            darkValue={darkIconConfig.iconColor}
            onLightChange={(v: string) => updateAccordionIconConfig('light', 'iconColor', v)}
            onDarkChange={(v: string) => updateAccordionIconConfig('dark', 'iconColor', v)}
          />
          <ColorGridSimple
            label="Color Activo"
            lightValue={lightIconConfig.iconActiveColor}
            darkValue={darkIconConfig.iconActiveColor}
            onLightChange={(v: string) => updateAccordionIconConfig('light', 'iconActiveColor', v)}
            onDarkChange={(v: string) => updateAccordionIconConfig('dark', 'iconActiveColor', v)}
          />

          {(lightIconConfig.showBackground || darkIconConfig.showBackground) && (
            <>
              <ColorGridSimple
                label="Fondo Normal"
                lightValue={lightIconConfig.backgroundColor || '#f3f4f6'}
                darkValue={darkIconConfig.backgroundColor || '#374151'}
                onLightChange={(v: string) => updateAccordionIconConfig('light', 'backgroundColor', v)}
                onDarkChange={(v: string) => updateAccordionIconConfig('dark', 'backgroundColor', v)}
              />
              <ColorGridSimple
                label="Fondo Activo"
                lightValue={lightIconConfig.backgroundActiveColor || '#8b5cf6'}
                darkValue={darkIconConfig.backgroundActiveColor || '#a78bfa'}
                onLightChange={(v: string) => updateAccordionIconConfig('light', 'backgroundActiveColor', v)}
                onDarkChange={(v: string) => updateAccordionIconConfig('dark', 'backgroundActiveColor', v)}
              />
            </>
          )}
        </div>
      </CompactSection>

      {/* Iconos de Tarjetas de Contenido */}
      <CompactSection title="Iconos de Tarjetas" icon="🏷️">
        <div className="space-y-2">
          {SECTION_CONFIGS.map((section) => {
            const config = getIconConfig(section.id);
            
            return (
              <div 
                key={section.id}
                className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
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

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{section.label}</p>
                </div>

                {/* Tipo */}
                <div className="flex gap-1">
                  {section.supportsNumber && (
                    <button
                      onClick={() => updateSectionIcons(section.id, 'type', 'number')}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        config.type === 'number'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}
                    >123</button>
                  )}
                  <button
                    onClick={() => updateSectionIcons(section.id, 'type', 'icon')}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      config.type === 'icon'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >★</button>
                  <button
                    onClick={() => updateSectionIcons(section.id, 'type', 'none')}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      config.type === 'none'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >—</button>
                </div>

                {/* Selector de icono */}
                {config.type === 'icon' && (
                  <div className="relative">
                    <button
                      onClick={() => setEditingIconSection(editingIconSection === section.id ? null : section.id)}
                      className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 transition-colors"
                    >
                      <LucideIcon name={config.icon || section.defaultIcon} size={14} />
                    </button>
                    
                    {editingIconSection === section.id && (
                      <div className="absolute z-50 right-0 top-full mt-1 w-56 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
                          {AVAILABLE_ICONS.slice(0, 24).map((icon) => (
                            <button
                              key={icon.name}
                              onClick={() => {
                                updateSectionIcons(section.id, 'icon', icon.name);
                                setEditingIconSection(null);
                              }}
                              className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                                config.icon === icon.name
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-purple-100'
                              }`}
                            >
                              <LucideIcon name={icon.name} size={12} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CompactSection>
    </div>
  );
};

export default AccordionConfigSectionCompact;
