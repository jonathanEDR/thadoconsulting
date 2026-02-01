/**
 * 🖼️ HeroConfigSectionCompact - Versión Compacta
 * Configuración optimizada del Hero para página de detalle de servicio
 * 
 * MEJORAS:
 * - Sistema de sub-tabs para organizar configuraciones
 * - ColorGridSimple para comparar temas light/dark lado a lado
 * - Vista previa unificada con toggle de tema
 * - Tipografía en grid compacto
 * - ~50% menos código que la versión original
 */

import React, { useState } from 'react';
import { BackgroundEditor } from '../shared/BackgroundEditor';
import {
  ThemeTabs,
  ColorGridSimple,
  CompactSection,
  CompactToggle,
} from '../shared/CompactStyleEditors';
import type {
  BackgroundConfig,
  HeroContentConfig,
  ButtonConfig,
  ServicioDetailConfig,
} from '../types/servicioDetailConfig';
import { DEFAULT_BACKGROUND } from '../types/servicioDetailConfig';

interface HeroConfigSectionCompactProps {
  mergedConfig: ServicioDetailConfig;
  isExpanded: boolean;
  onToggle: () => void;
  updateHero: (field: keyof NonNullable<ServicioDetailConfig['hero']>, value: any) => void;
  updateHeroContent: (field: keyof HeroContentConfig, value: any) => void;
  updateHeroButton: (buttonType: 'primary' | 'secondary', field: keyof ButtonConfig, value: any) => void;
  updateHeroButtonTheme: (buttonType: 'primary' | 'secondary', theme: 'light' | 'dark', field: string, value: any) => void;
  updateHeroCards: (theme: 'light' | 'dark', field: string, value: any) => void;
  updateHeroBackground: (field: keyof BackgroundConfig, value: any) => void;
  batchUpdateHeroBackground: (updates: Partial<BackgroundConfig>) => void;
}

type HeroTabType = 'content' | 'cards' | 'buttons' | 'background';

export const HeroConfigSectionCompact: React.FC<HeroConfigSectionCompactProps> = ({
  mergedConfig,
  isExpanded,
  onToggle,
  updateHeroContent,
  updateHeroButton,
  updateHeroButtonTheme,
  updateHeroCards,
  updateHeroBackground,
  batchUpdateHeroBackground,
}) => {
  const [activeTab, setActiveTab] = useState<HeroTabType>('content');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  const tabs: { id: HeroTabType; label: string; icon: string }[] = [
    { id: 'content', label: 'Contenido', icon: '📝' },
    { id: 'cards', label: 'Tarjetas', icon: '💳' },
    { id: 'buttons', label: 'Botones', icon: '🔘' },
    { id: 'background', label: 'Fondo', icon: '🖼️' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🖼️</span>
          <div className="text-left">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Hero Section</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configuración del encabezado de la página</p>
          </div>
        </div>
        <span className={`text-xl transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Sub-Tabs */}
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
            {activeTab === 'content' && (
              <ContentTab
                mergedConfig={mergedConfig}
                previewTheme={previewTheme}
                setPreviewTheme={setPreviewTheme}
                updateHeroContent={updateHeroContent}
              />
            )}

            {activeTab === 'cards' && (
              <CardsTab
                mergedConfig={mergedConfig}
                previewTheme={previewTheme}
                setPreviewTheme={setPreviewTheme}
                updateHeroCards={updateHeroCards}
              />
            )}

            {activeTab === 'buttons' && (
              <ButtonsTab
                mergedConfig={mergedConfig}
                previewTheme={previewTheme}
                setPreviewTheme={setPreviewTheme}
                updateHeroButton={updateHeroButton}
                updateHeroButtonTheme={updateHeroButtonTheme}
              />
            )}

            {activeTab === 'background' && (
              <BackgroundEditor
                background={mergedConfig.hero?.background || DEFAULT_BACKGROUND}
                onUpdate={updateHeroBackground}
                onBatchUpdate={batchUpdateHeroBackground}
                label="Fondo de la sección Hero"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// TAB: Contenido
// =============================================================================
interface ContentTabProps {
  mergedConfig: ServicioDetailConfig;
  previewTheme: 'light' | 'dark';
  setPreviewTheme: (theme: 'light' | 'dark') => void;
  updateHeroContent: (field: keyof HeroContentConfig, value: any) => void;
}

const ContentTab: React.FC<ContentTabProps> = ({
  mergedConfig,
  previewTheme,
  setPreviewTheme,
  updateHeroContent,
}) => {
  const titleConfig = mergedConfig.hero?.content?.title || {};
  const subtitleConfig = mergedConfig.hero?.content?.subtitle || {};
  const titleGradient = mergedConfig.hero?.content?.titleGradient;

  const updateTitleField = (field: string, value: string) => {
    updateHeroContent('title', { ...titleConfig, [field]: value });
  };

  const updateSubtitleField = (field: string, value: string) => {
    updateHeroContent('subtitle', { ...subtitleConfig, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Vista Previa del Título */}
      <div className={`rounded-lg p-4 border ${previewTheme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-900 border-gray-700'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500">Vista Previa</span>
          <ThemeTabs activeTheme={previewTheme} onChange={setPreviewTheme} />
        </div>
        <div className="text-center">
          <h2 
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: titleConfig.fontFamily || 'Montserrat',
              ...(titleGradient?.enabled ? {
                backgroundImage: `linear-gradient(to right, ${
                  previewTheme === 'light' 
                    ? `${titleGradient.light?.from || '#8b5cf6'}, ${titleGradient.light?.to || '#06b6d4'}`
                    : `${titleGradient.dark?.from || '#a78bfa'}, ${titleGradient.dark?.to || '#22d3ee'}`
                })`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              } : {
                color: previewTheme === 'light' 
                  ? (titleConfig.color || '#111827')
                  : (titleConfig.colorDark || '#ffffff')
              })
            }}
          >
            Título del Servicio
          </h2>
          <p 
            className="text-base"
            style={{ 
              color: previewTheme === 'light' 
                ? (subtitleConfig.color || '#374151')
                : (subtitleConfig.colorDark || '#d1d5db'),
              fontFamily: subtitleConfig.fontFamily || 'Montserrat',
            }}
          >
            Descripción del servicio aquí
          </p>
        </div>
      </div>

      {/* Opciones de visualización */}
      <div className="grid grid-cols-2 gap-2">
        <CompactToggle
          label="Mostrar categoría"
          checked={mergedConfig.hero?.content?.showCategoryTag ?? true}
          onChange={(checked) => updateHeroContent('showCategoryTag', checked)}
        />
        <CompactToggle
          label="Mostrar precio"
          checked={mergedConfig.hero?.content?.showPrice ?? true}
          onChange={(checked) => updateHeroContent('showPrice', checked)}
        />
      </div>

      {/* Gradiente del Título */}
      <CompactSection title="Gradiente del Título" icon="🌈" defaultOpen={titleGradient?.enabled}>
        <div className="space-y-3">
          <CompactToggle
            label="Aplicar gradiente al título"
            checked={titleGradient?.enabled ?? false}
            onChange={(checked) => updateHeroContent('titleGradient', { ...titleGradient, enabled: checked })}
          />

          {titleGradient?.enabled && (
            <div className="space-y-2 pt-2">
              <ColorGridSimple
                label="Color Inicio"
                lightValue={titleGradient.light?.from || '#8b5cf6'}
                darkValue={titleGradient.dark?.from || '#a78bfa'}
                onLightChange={(v: string) => updateHeroContent('titleGradient', {
                  ...titleGradient,
                  light: { ...titleGradient.light, from: v }
                })}
                onDarkChange={(v: string) => updateHeroContent('titleGradient', {
                  ...titleGradient,
                  dark: { ...titleGradient.dark, from: v }
                })}
              />
              <ColorGridSimple
                label="Color Final"
                lightValue={titleGradient.light?.to || '#06b6d4'}
                darkValue={titleGradient.dark?.to || '#22d3ee'}
                onLightChange={(v: string) => updateHeroContent('titleGradient', {
                  ...titleGradient,
                  light: { ...titleGradient.light, to: v }
                })}
                onDarkChange={(v: string) => updateHeroContent('titleGradient', {
                  ...titleGradient,
                  dark: { ...titleGradient.dark, to: v }
                })}
              />
            </div>
          )}

          {/* Colores del título cuando NO hay gradiente */}
          {!titleGradient?.enabled && (
            <div className="space-y-2 pt-2">
              <ColorGridSimple
                label="Color del Título"
                lightValue={titleConfig.color || '#111827'}
                darkValue={titleConfig.colorDark || '#ffffff'}
                onLightChange={(v: string) => updateTitleField('color', v)}
                onDarkChange={(v: string) => updateTitleField('colorDark', v)}
              />
            </div>
          )}
        </div>
      </CompactSection>

      {/* Tipografía del Título */}
      <CompactSection title="Tipografía del Título" icon="✏️" defaultOpen>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Fuente</label>
            <select
              value={titleConfig.fontFamily || 'Montserrat'}
              onChange={(e) => updateTitleField('fontFamily', e.target.value)}
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
              value={titleConfig.fontSize || 'text-5xl'}
              onChange={(e) => updateTitleField('fontSize', e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
            >
              <option value="text-3xl">3XL</option>
              <option value="text-4xl">4XL</option>
              <option value="text-5xl">5XL</option>
              <option value="text-6xl">6XL</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Peso</label>
            <select
              value={titleConfig.fontWeight || 'font-bold'}
              onChange={(e) => updateTitleField('fontWeight', e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
            >
              <option value="font-medium">Medium</option>
              <option value="font-semibold">Semibold</option>
              <option value="font-bold">Bold</option>
              <option value="font-extrabold">Extra Bold</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Línea</label>
            <select
              value={titleConfig.lineHeight || 'leading-tight'}
              onChange={(e) => updateTitleField('lineHeight', e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
            >
              <option value="leading-none">None</option>
              <option value="leading-tight">Tight</option>
              <option value="leading-snug">Snug</option>
              <option value="leading-normal">Normal</option>
            </select>
          </div>
        </div>
      </CompactSection>

      {/* Tipografía del Subtítulo */}
      <CompactSection title="Tipografía del Subtítulo" icon="📄" defaultOpen>
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fuente</label>
              <select
                value={subtitleConfig.fontFamily || 'Montserrat'}
                onChange={(e) => updateSubtitleField('fontFamily', e.target.value)}
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
                value={subtitleConfig.fontSize || 'text-xl'}
                onChange={(e) => updateSubtitleField('fontSize', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
              >
                <option value="text-base">Base</option>
                <option value="text-lg">LG</option>
                <option value="text-xl">XL</option>
                <option value="text-2xl">2XL</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Peso</label>
              <select
                value={subtitleConfig.fontWeight || 'font-normal'}
                onChange={(e) => updateSubtitleField('fontWeight', e.target.value)}
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
                value={subtitleConfig.lineHeight || 'leading-relaxed'}
                onChange={(e) => updateSubtitleField('lineHeight', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
              >
                <option value="leading-snug">Snug</option>
                <option value="leading-normal">Normal</option>
                <option value="leading-relaxed">Relaxed</option>
              </select>
            </div>
          </div>

          {/* Color del subtítulo - Light y Dark */}
          <ColorGridSimple
            label="Color del Subtítulo"
            lightValue={subtitleConfig.color || '#374151'}
            darkValue={subtitleConfig.colorDark || '#d1d5db'}
            onLightChange={(v: string) => updateSubtitleField('color', v)}
            onDarkChange={(v: string) => updateSubtitleField('colorDark', v)}
          />
        </div>
      </CompactSection>
    </div>
  );
};

// =============================================================================
// TAB: Tarjetas (Precio/Duración)
// =============================================================================
interface CardsTabProps {
  mergedConfig: ServicioDetailConfig;
  previewTheme: 'light' | 'dark';
  setPreviewTheme: (theme: 'light' | 'dark') => void;
  updateHeroCards: (theme: 'light' | 'dark', field: string, value: any) => void;
}

// Tipo para las propiedades de tarjetas de tema
interface CardThemeStyle {
  background?: string;
  borderColor?: string;
  textColor?: string;
  labelColor?: string;
}

const CardsTab: React.FC<CardsTabProps> = ({
  mergedConfig,
  previewTheme,
  setPreviewTheme,
  updateHeroCards,
}) => {
  const defaultLight: CardThemeStyle = { background: 'rgba(255, 255, 255, 0.8)', borderColor: '#d1d5db', textColor: '#111827', labelColor: '#6b7280' };
  const defaultDark: CardThemeStyle = { background: 'rgba(31, 41, 55, 0.5)', borderColor: '#374151', textColor: '#ffffff', labelColor: '#9ca3af' };
  
  const lightCards: CardThemeStyle = mergedConfig.hero?.cards?.light || defaultLight;
  const darkCards: CardThemeStyle = mergedConfig.hero?.cards?.dark || defaultDark;
  const currentCards = previewTheme === 'light' ? lightCards : darkCards;

  return (
    <div className="space-y-4">
      {/* Vista Previa Unificada */}
      <div className={`rounded-lg p-4 border ${previewTheme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-900 border-gray-700'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500">Vista Previa Tarjeta</span>
          <ThemeTabs activeTheme={previewTheme} onChange={setPreviewTheme} />
        </div>
        <div className="flex justify-center">
          <div
            className="rounded-lg px-6 py-4 border min-w-[140px]"
            style={{
              background: currentCards.background || (previewTheme === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(31,41,55,0.5)'),
              borderColor: currentCards.borderColor || (previewTheme === 'light' ? '#d1d5db' : '#374151'),
            }}
          >
            <div className="text-xs mb-1" style={{ color: currentCards.labelColor || (previewTheme === 'light' ? '#6b7280' : '#9ca3af') }}>
              Precio
            </div>
            <div className="text-xl font-bold" style={{ color: currentCards.textColor || (previewTheme === 'light' ? '#111827' : '#ffffff') }}>
              $99 USD
            </div>
          </div>
        </div>
      </div>

      {/* Estilos de Tarjetas */}
      <CompactSection title="Colores de Tarjetas" icon="🎨" defaultOpen>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Fondo (soporta rgba)</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-gray-400">☀️ Light</span>
                <input
                  type="text"
                  value={lightCards.background || 'rgba(255, 255, 255, 0.8)'}
                  onChange={(e) => updateHeroCards('light', 'background', e.target.value)}
                  className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
                  placeholder="rgba(255, 255, 255, 0.8)"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-400">🌙 Dark</span>
                <input
                  type="text"
                  value={darkCards.background || 'rgba(31, 41, 55, 0.5)'}
                  onChange={(e) => updateHeroCards('dark', 'background', e.target.value)}
                  className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
                  placeholder="rgba(31, 41, 55, 0.5)"
                />
              </div>
            </div>
          </div>

          <ColorGridSimple
            label="Color de Borde"
            lightValue={lightCards.borderColor || '#d1d5db'}
            darkValue={darkCards.borderColor || '#374151'}
            onLightChange={(v: string) => updateHeroCards('light', 'borderColor', v)}
            onDarkChange={(v: string) => updateHeroCards('dark', 'borderColor', v)}
          />

          <ColorGridSimple
            label="Color de Texto"
            lightValue={lightCards.textColor || '#111827'}
            darkValue={darkCards.textColor || '#ffffff'}
            onLightChange={(v: string) => updateHeroCards('light', 'textColor', v)}
            onDarkChange={(v: string) => updateHeroCards('dark', 'textColor', v)}
          />

          <ColorGridSimple
            label="Color de Etiqueta"
            lightValue={lightCards.labelColor || '#6b7280'}
            darkValue={darkCards.labelColor || '#9ca3af'}
            onLightChange={(v: string) => updateHeroCards('light', 'labelColor', v)}
            onDarkChange={(v: string) => updateHeroCards('dark', 'labelColor', v)}
          />
        </div>
      </CompactSection>
    </div>
  );
};

// =============================================================================
// TAB: Botones
// =============================================================================
interface ButtonsTabProps {
  mergedConfig: ServicioDetailConfig;
  previewTheme: 'light' | 'dark';
  setPreviewTheme: (theme: 'light' | 'dark') => void;
  updateHeroButton: (buttonType: 'primary' | 'secondary', field: keyof ButtonConfig, value: any) => void;
  updateHeroButtonTheme: (buttonType: 'primary' | 'secondary', theme: 'light' | 'dark', field: string, value: any) => void;
}

const ButtonsTab: React.FC<ButtonsTabProps> = ({
  mergedConfig,
  previewTheme,
  setPreviewTheme,
  updateHeroButton,
  updateHeroButtonTheme,
}) => {
  const primaryConfig = mergedConfig.hero?.buttons?.primary;
  const secondaryConfig = mergedConfig.hero?.buttons?.secondary;

  return (
    <div className="space-y-4">
      {/* Vista Previa de Botones */}
      <div className={`rounded-lg p-4 border ${previewTheme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-900 border-gray-700'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500">Vista Previa</span>
          <ThemeTabs activeTheme={previewTheme} onChange={setPreviewTheme} />
        </div>
        <div className="flex items-center justify-center gap-3">
          {primaryConfig?.enabled && (
            <ButtonPreview 
              config={primaryConfig} 
              theme={previewTheme} 
              label={primaryConfig.text || 'Solicitar'}
            />
          )}
          {secondaryConfig?.enabled && (
            <ButtonPreview 
              config={secondaryConfig} 
              theme={previewTheme}
              label={secondaryConfig.text || 'Más Info'}
            />
          )}
        </div>
      </div>

      {/* Botón Primario */}
      <CompactButtonEditor
        buttonType="primary"
        label="Botón Primario"
        config={primaryConfig}
        updateHeroButton={updateHeroButton}
        updateHeroButtonTheme={updateHeroButtonTheme}
      />

      {/* Botón Secundario */}
      <CompactButtonEditor
        buttonType="secondary"
        label="Botón Secundario"
        config={secondaryConfig}
        updateHeroButton={updateHeroButton}
        updateHeroButtonTheme={updateHeroButtonTheme}
      />
    </div>
  );
};

// Helper: Vista previa de botón
interface ButtonPreviewProps {
  config: any;
  theme: 'light' | 'dark';
  label: string;
}

const ButtonPreview: React.FC<ButtonPreviewProps> = ({ config, theme, label }) => {
  const themeConfig = theme === 'light' ? config?.lightTheme : config?.darkTheme;
  const style = config?.style || 'solid';

  const getButtonStyle = () => {
    if (style === 'gradient') {
      return {
        background: `linear-gradient(to right, ${themeConfig?.gradientFrom || '#8b5cf6'}, ${themeConfig?.gradientTo || '#06b6d4'})`,
        color: themeConfig?.textColor || '#ffffff',
        border: 'none',
      };
    } else if (style === 'outline') {
      return {
        background: 'transparent',
        color: themeConfig?.textColor || (theme === 'light' ? '#8b5cf6' : '#a78bfa'),
        border: `2px solid ${themeConfig?.borderColor || (theme === 'light' ? '#8b5cf6' : '#a78bfa')}`,
      };
    } else {
      return {
        background: themeConfig?.background || (theme === 'light' ? '#8b5cf6' : '#a78bfa'),
        color: themeConfig?.textColor || '#ffffff',
        border: 'none',
      };
    }
  };

  return (
    <button
      className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
      style={getButtonStyle()}
    >
      {label}
    </button>
  );
};

// Helper: Editor compacto de botón
interface CompactButtonEditorProps {
  buttonType: 'primary' | 'secondary';
  label: string;
  config: any;
  updateHeroButton: (buttonType: 'primary' | 'secondary', field: keyof ButtonConfig, value: any) => void;
  updateHeroButtonTheme: (buttonType: 'primary' | 'secondary', theme: 'light' | 'dark', field: string, value: any) => void;
}

const CompactButtonEditor: React.FC<CompactButtonEditorProps> = ({
  buttonType,
  label,
  config,
  updateHeroButton,
  updateHeroButtonTheme,
}) => {
  const lightTheme = config?.lightTheme || {};
  const darkTheme = config?.darkTheme || {};

  return (
    <CompactSection 
      title={label} 
      icon={buttonType === 'primary' ? '🔵' : '⚪'} 
      defaultOpen={config?.enabled}
      headerRight={
        <CompactToggle
          label="Activado"
          checked={config?.enabled ?? true}
          onChange={(checked) => updateHeroButton(buttonType, 'enabled', checked)}
        />
      }
    >
      {config?.enabled && (
        <div className="space-y-3">
          {/* Texto y Estilo */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Texto</label>
              <input
                type="text"
                value={config?.text || ''}
                onChange={(e) => updateHeroButton(buttonType, 'text', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Estilo</label>
              <select
                value={config?.style || 'solid'}
                onChange={(e) => updateHeroButton(buttonType, 'style', e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
              >
                <option value="solid">Sólido</option>
                <option value="outline">Borde</option>
                <option value="gradient">Gradiente</option>
              </select>
            </div>
          </div>

          {/* Colores según estilo */}
          {config?.style === 'gradient' ? (
            <div className="space-y-2">
              <ColorGridSimple
                label="Gradiente Inicio"
                lightValue={lightTheme.gradientFrom || '#8b5cf6'}
                darkValue={darkTheme.gradientFrom || '#a78bfa'}
                onLightChange={(v: string) => updateHeroButtonTheme(buttonType, 'light', 'gradientFrom', v)}
                onDarkChange={(v: string) => updateHeroButtonTheme(buttonType, 'dark', 'gradientFrom', v)}
              />
              <ColorGridSimple
                label="Gradiente Final"
                lightValue={lightTheme.gradientTo || '#06b6d4'}
                darkValue={darkTheme.gradientTo || '#22d3ee'}
                onLightChange={(v: string) => updateHeroButtonTheme(buttonType, 'light', 'gradientTo', v)}
                onDarkChange={(v: string) => updateHeroButtonTheme(buttonType, 'dark', 'gradientTo', v)}
              />
              <ColorGridSimple
                label="Color de Texto"
                lightValue={lightTheme.textColor || '#ffffff'}
                darkValue={darkTheme.textColor || '#ffffff'}
                onLightChange={(v: string) => updateHeroButtonTheme(buttonType, 'light', 'textColor', v)}
                onDarkChange={(v: string) => updateHeroButtonTheme(buttonType, 'dark', 'textColor', v)}
              />
            </div>
          ) : config?.style === 'outline' ? (
            <div className="space-y-2">
              <ColorGridSimple
                label="Color del Borde"
                lightValue={lightTheme.borderColor || '#8b5cf6'}
                darkValue={darkTheme.borderColor || '#a78bfa'}
                onLightChange={(v: string) => updateHeroButtonTheme(buttonType, 'light', 'borderColor', v)}
                onDarkChange={(v: string) => updateHeroButtonTheme(buttonType, 'dark', 'borderColor', v)}
              />
              <ColorGridSimple
                label="Color de Texto"
                lightValue={lightTheme.textColor || '#8b5cf6'}
                darkValue={darkTheme.textColor || '#a78bfa'}
                onLightChange={(v: string) => updateHeroButtonTheme(buttonType, 'light', 'textColor', v)}
                onDarkChange={(v: string) => updateHeroButtonTheme(buttonType, 'dark', 'textColor', v)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <ColorGridSimple
                label="Color de Fondo"
                lightValue={lightTheme.background || '#8b5cf6'}
                darkValue={darkTheme.background || '#a78bfa'}
                onLightChange={(v: string) => updateHeroButtonTheme(buttonType, 'light', 'background', v)}
                onDarkChange={(v: string) => updateHeroButtonTheme(buttonType, 'dark', 'background', v)}
              />
              <ColorGridSimple
                label="Color de Texto"
                lightValue={lightTheme.textColor || '#ffffff'}
                darkValue={darkTheme.textColor || '#ffffff'}
                onLightChange={(v: string) => updateHeroButtonTheme(buttonType, 'light', 'textColor', v)}
                onDarkChange={(v: string) => updateHeroButtonTheme(buttonType, 'dark', 'textColor', v)}
              />
            </div>
          )}
        </div>
      )}
    </CompactSection>
  );
};

export default HeroConfigSectionCompact;
