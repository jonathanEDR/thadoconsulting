/**
 * 🖼️ HeroConfigSection - Configuración de la sección Hero
 * Permite configurar el encabezado de la página de detalle de servicio
 */

import React from 'react';
import { BackgroundEditor } from '../shared/BackgroundEditor';
import type {
  BackgroundConfig,
  HeroContentConfig,
  ButtonConfig,
  ServicioDetailConfig,
} from '../types/servicioDetailConfig';
import { DEFAULT_BACKGROUND } from '../types/servicioDetailConfig';

interface HeroConfigSectionProps {
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

export const HeroConfigSection: React.FC<HeroConfigSectionProps> = ({
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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🖼️</span>
          <div className="text-left">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Hero Section</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configuración del encabezado de la página</p>
          </div>
        </div>
        <span className={`text-xl transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* 📝 Estilos del Contenido Hero */}
          <ContentStylesSection
            mergedConfig={mergedConfig}
            updateHeroContent={updateHeroContent}
          />

          {/* 💳 Configuración de Tarjetas de Precio/Duración */}
          <CardStylesSection
            mergedConfig={mergedConfig}
            updateHeroCards={updateHeroCards}
          />

          {/* 🔘 Configuración de Botones */}
          <ButtonsSection
            mergedConfig={mergedConfig}
            updateHeroButton={updateHeroButton}
            updateHeroButtonTheme={updateHeroButtonTheme}
          />

          {/* Configuración del fondo */}
          <BackgroundEditor
            background={mergedConfig.hero?.background || DEFAULT_BACKGROUND}
            onUpdate={updateHeroBackground}
            onBatchUpdate={batchUpdateHeroBackground}
            label="Fondo de la sección Hero"
          />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Sub-componentes internos
// ============================================================================

interface ContentStylesSectionProps {
  mergedConfig: ServicioDetailConfig;
  updateHeroContent: (field: keyof HeroContentConfig, value: any) => void;
}

const ContentStylesSection: React.FC<ContentStylesSectionProps> = ({
  mergedConfig,
  updateHeroContent,
}) => {
  // Extraer valores actuales con defaults
  const titleConfig = mergedConfig.hero?.content?.title || {};
  const subtitleConfig = mergedConfig.hero?.content?.subtitle || {};

  // Funciones helper para actualizar campos específicos
  const updateTitleField = (field: string, value: string) => {
    updateHeroContent('title', { ...titleConfig, [field]: value });
  };

  const updateSubtitleField = (field: string, value: string) => {
    updateHeroContent('subtitle', { ...subtitleConfig, [field]: value });
  };

  return (
  <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-lg border border-purple-200 dark:border-purple-700">
    <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
      <span>📝</span> Estilos del Contenido Hero
      <span className="text-xs text-gray-500 ml-2">(El contenido viene del servicio)</span>
    </h5>

    {/* Gradiente del título */}
    <div className="space-y-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={mergedConfig.hero?.content?.titleGradient?.enabled ?? false}
          onChange={(e) => updateHeroContent('titleGradient', {
            ...mergedConfig.hero?.content?.titleGradient,
            enabled: e.target.checked
          })}
          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Aplicar gradiente al título del servicio
        </span>
      </label>

      {mergedConfig.hero?.content?.titleGradient?.enabled && (
        <div className="space-y-4 pl-6">
          {/* Tema Claro */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">☀️ Tema Claro</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Color Inicio
                </label>
                <input
                  type="color"
                  value={mergedConfig.hero?.content?.titleGradient?.light?.from ?? '#8b5cf6'}
                  onChange={(e) => updateHeroContent('titleGradient', {
                    ...mergedConfig.hero?.content?.titleGradient,
                    light: { ...mergedConfig.hero?.content?.titleGradient?.light!, from: e.target.value }
                  })}
                  className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Color Final
                </label>
                <input
                  type="color"
                  value={mergedConfig.hero?.content?.titleGradient?.light?.to ?? '#06b6d4'}
                  onChange={(e) => updateHeroContent('titleGradient', {
                    ...mergedConfig.hero?.content?.titleGradient,
                    light: { ...mergedConfig.hero?.content?.titleGradient?.light!, to: e.target.value }
                  })}
                  className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
              </div>
              <div className="col-span-2 p-3 rounded bg-white border border-gray-200">
                <p
                  className="text-2xl font-bold text-center"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${mergedConfig.hero?.content?.titleGradient?.light?.from ?? '#8b5cf6'}, ${mergedConfig.hero?.content?.titleGradient?.light?.to ?? '#06b6d4'})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Ejemplo Claro
                </p>
              </div>
            </div>
          </div>

          {/* Tema Oscuro */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">🌙 Tema Oscuro</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Color Inicio
                </label>
                <input
                  type="color"
                  value={mergedConfig.hero?.content?.titleGradient?.dark?.from ?? '#a78bfa'}
                  onChange={(e) => updateHeroContent('titleGradient', {
                    ...mergedConfig.hero?.content?.titleGradient,
                    dark: { ...mergedConfig.hero?.content?.titleGradient?.dark!, from: e.target.value }
                  })}
                  className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Color Final
                </label>
                <input
                  type="color"
                  value={mergedConfig.hero?.content?.titleGradient?.dark?.to ?? '#22d3ee'}
                  onChange={(e) => updateHeroContent('titleGradient', {
                    ...mergedConfig.hero?.content?.titleGradient,
                    dark: { ...mergedConfig.hero?.content?.titleGradient?.dark!, to: e.target.value }
                  })}
                  className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
              </div>
              <div className="col-span-2 p-3 rounded bg-gray-900">
                <p
                  className="text-2xl font-bold text-center"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${mergedConfig.hero?.content?.titleGradient?.dark?.from ?? '#a78bfa'}, ${mergedConfig.hero?.content?.titleGradient?.dark?.to ?? '#22d3ee'})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Ejemplo Oscuro
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Opciones de visualización */}
    <div className="grid grid-cols-2 gap-3">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={mergedConfig.hero?.content?.showCategoryTag ?? true}
          onChange={(e) => updateHeroContent('showCategoryTag', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <span className="text-gray-700 dark:text-gray-300">Mostrar categoría</span>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={mergedConfig.hero?.content?.showPrice ?? true}
          onChange={(e) => updateHeroContent('showPrice', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <span className="text-gray-700 dark:text-gray-300">Mostrar precio</span>
      </label>
    </div>

    {/* Configuración de Tipografía del Título */}
    <div className="space-y-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-purple-200 dark:border-purple-700">
      <h6 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <span>✏️</span> Tipografía del Título
      </h6>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Familia de fuente
          </label>
          <select
            value={titleConfig.fontFamily || 'Montserrat'}
            onChange={(e) => updateTitleField('fontFamily', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="Montserrat">Montserrat (Recomendado)</option>
            <option value="Inter">Inter</option>
            <option value="Poppins">Poppins</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="system-ui">Sistema</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tamaño de fuente
          </label>
          <select
            value={titleConfig.fontSize || 'text-5xl'}
            onChange={(e) => updateTitleField('fontSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="text-3xl">3XL</option>
            <option value="text-4xl">4XL</option>
            <option value="text-5xl">5XL (Recomendado)</option>
            <option value="text-6xl">6XL</option>
            <option value="text-7xl">7XL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Peso de fuente
          </label>
          <select
            value={titleConfig.fontWeight || 'font-bold'}
            onChange={(e) => updateTitleField('fontWeight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="font-normal">Normal</option>
            <option value="font-medium">Medium</option>
            <option value="font-semibold">Semibold</option>
            <option value="font-bold">Bold (Recomendado)</option>
            <option value="font-extrabold">Extra Bold</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Altura de línea
          </label>
          <select
            value={titleConfig.lineHeight || 'leading-tight'}
            onChange={(e) => updateTitleField('lineHeight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
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

    {/* Configuración de Tipografía del Subtítulo */}
    <div className="space-y-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-purple-200 dark:border-purple-700">
      <h6 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <span>📝</span> Tipografía del Subtítulo/Descripción
      </h6>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Familia de fuente
          </label>
          <select
            value={subtitleConfig.fontFamily || 'Montserrat'}
            onChange={(e) => updateSubtitleField('fontFamily', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="Montserrat">Montserrat (Recomendado)</option>
            <option value="Inter">Inter</option>
            <option value="Poppins">Poppins</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="system-ui">Sistema</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tamaño de fuente
          </label>
          <select
            value={subtitleConfig.fontSize || 'text-xl'}
            onChange={(e) => updateSubtitleField('fontSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="text-base">Base</option>
            <option value="text-lg">LG</option>
            <option value="text-xl">XL (Recomendado)</option>
            <option value="text-2xl">2XL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Peso de fuente
          </label>
          <select
            value={subtitleConfig.fontWeight || 'font-normal'}
            onChange={(e) => updateSubtitleField('fontWeight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="font-light">Light</option>
            <option value="font-normal">Normal (Recomendado)</option>
            <option value="font-medium">Medium</option>
            <option value="font-semibold">Semibold</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Altura de línea
          </label>
          <select
            value={subtitleConfig.lineHeight || 'leading-relaxed'}
            onChange={(e) => updateSubtitleField('lineHeight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="leading-tight">Tight</option>
            <option value="leading-snug">Snug</option>
            <option value="leading-normal">Normal</option>
            <option value="leading-relaxed">Relaxed (Recomendado)</option>
            <option value="leading-loose">Loose</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color del texto
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={subtitleConfig.color || '#6B7280'}
              onChange={(e) => updateSubtitleField('color', e.target.value)}
              className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={subtitleConfig.color || '#6B7280'}
              onChange={(e) => updateSubtitleField('color', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 font-mono text-sm"
              placeholder="#6B7280"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

interface CardStylesSectionProps {
  mergedConfig: ServicioDetailConfig;
  updateHeroCards: (theme: 'light' | 'dark', field: string, value: any) => void;
}

const CardStylesSection: React.FC<CardStylesSectionProps> = ({
  mergedConfig,
  updateHeroCards,
}) => (
  <div className="space-y-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-lg border border-green-200 dark:border-green-700">
    <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
      <span>💳</span> Estilos de Tarjetas (Precio/Duración)
    </h5>

    {/* Tema Claro */}
    <ThemeCardEditor
      theme="light"
      themeLabel="☀️ Tema Claro"
      config={mergedConfig.hero?.cards?.light}
      updateHeroCards={updateHeroCards}
      previewBg="bg-white"
    />

    {/* Tema Oscuro */}
    <ThemeCardEditor
      theme="dark"
      themeLabel="🌙 Tema Oscuro"
      config={mergedConfig.hero?.cards?.dark}
      updateHeroCards={updateHeroCards}
      previewBg="bg-gray-800"
    />
  </div>
);

interface ThemeCardEditorProps {
  theme: 'light' | 'dark';
  themeLabel: string;
  config: any;
  updateHeroCards: (theme: 'light' | 'dark', field: string, value: any) => void;
  previewBg: string;
}

const ThemeCardEditor: React.FC<ThemeCardEditorProps> = ({
  theme,
  themeLabel,
  config,
  updateHeroCards,
  previewBg,
}) => (
  <div className="space-y-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-600">
    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
      {themeLabel}
    </p>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Color de fondo
        </label>
        <input
          type="text"
          value={config?.background ?? (theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(31, 41, 55, 0.5)')}
          onChange={(e) => updateHeroCards(theme, 'background', e.target.value)}
          placeholder={theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(31, 41, 55, 0.5)'}
          className="w-full px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Color de borde
        </label>
        <input
          type="color"
          value={config?.borderColor ?? (theme === 'light' ? '#d1d5db' : '#374151')}
          onChange={(e) => updateHeroCards(theme, 'borderColor', e.target.value)}
          className="w-full h-9 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Color de texto
        </label>
        <input
          type="color"
          value={config?.textColor ?? (theme === 'light' ? '#111827' : '#ffffff')}
          onChange={(e) => updateHeroCards(theme, 'textColor', e.target.value)}
          className="w-full h-9 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Color de etiqueta
        </label>
        <input
          type="color"
          value={config?.labelColor ?? (theme === 'light' ? '#6b7280' : '#9ca3af')}
          onChange={(e) => updateHeroCards(theme, 'labelColor', e.target.value)}
          className="w-full h-9 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
        />
      </div>
    </div>
    {/* Vista previa */}
    <div className="pt-2">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
      <div
        className={`rounded-lg px-4 py-3 border ${previewBg}`}
        style={{
          background: config?.background,
          borderColor: config?.borderColor,
        }}
      >
        <div className="text-xs mb-1" style={{ color: config?.labelColor }}>
          Precio
        </div>
        <div className="text-lg font-bold" style={{ color: config?.textColor }}>
          $99 USD
        </div>
      </div>
    </div>
  </div>
);

interface ButtonsSectionProps {
  mergedConfig: ServicioDetailConfig;
  updateHeroButton: (buttonType: 'primary' | 'secondary', field: keyof ButtonConfig, value: any) => void;
  updateHeroButtonTheme: (buttonType: 'primary' | 'secondary', theme: 'light' | 'dark', field: string, value: any) => void;
}

const ButtonsSection: React.FC<ButtonsSectionProps> = ({
  mergedConfig,
  updateHeroButton,
  updateHeroButtonTheme,
}) => (
  <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-lg border border-blue-200 dark:border-blue-700">
    <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
      <span>🔘</span> Botones de Acción
    </h5>

    {/* Botón Primario */}
    <ButtonEditor
      buttonType="primary"
      label="Botón Primario"
      config={mergedConfig.hero?.buttons?.primary}
      updateHeroButton={updateHeroButton}
      updateHeroButtonTheme={updateHeroButtonTheme}
    />

    {/* Botón Secundario */}
    <ButtonEditor
      buttonType="secondary"
      label="Botón Secundario"
      config={mergedConfig.hero?.buttons?.secondary}
      updateHeroButton={updateHeroButton}
      updateHeroButtonTheme={updateHeroButtonTheme}
    />
  </div>
);

interface ButtonEditorProps {
  buttonType: 'primary' | 'secondary';
  label: string;
  config: any;
  updateHeroButton: (buttonType: 'primary' | 'secondary', field: keyof ButtonConfig, value: any) => void;
  updateHeroButtonTheme: (buttonType: 'primary' | 'secondary', theme: 'light' | 'dark', field: string, value: any) => void;
}

const ButtonEditor: React.FC<ButtonEditorProps> = ({
  buttonType,
  label,
  config,
  updateHeroButton,
  updateHeroButtonTheme,
}) => (
  <div className="space-y-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-600">
    <div className="flex items-center justify-between">
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={config?.enabled ?? true}
          onChange={(e) => updateHeroButton(buttonType, 'enabled', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">Activado</span>
      </label>
    </div>

    {config?.enabled && (
      <div className="space-y-4 pl-4 border-l-2 border-purple-300 dark:border-purple-600">
        {/* Texto y Estilo */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Texto del botón
          </label>
          <input
            type="text"
            value={config?.text ?? ''}
            onChange={(e) => updateHeroButton(buttonType, 'text', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Estilo
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['solid', 'outline', 'gradient'] as const).map((style) => (
              <button
                key={style}
                onClick={() => updateHeroButton(buttonType, 'style', style)}
                className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                  config?.style === style
                    ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {style === 'solid' ? 'Sólido' : style === 'outline' ? 'Borde' : 'Gradiente'}
              </button>
            ))}
          </div>
        </div>

        {/* Tema Claro */}
        <ButtonThemeEditor
          buttonType={buttonType}
          theme="light"
          themeLabel="☀️ Tema Claro"
          config={config}
          updateHeroButtonTheme={updateHeroButtonTheme}
        />

        {/* Tema Oscuro */}
        <ButtonThemeEditor
          buttonType={buttonType}
          theme="dark"
          themeLabel="🌙 Tema Oscuro"
          config={config}
          updateHeroButtonTheme={updateHeroButtonTheme}
        />
      </div>
    )}
  </div>
);

interface ButtonThemeEditorProps {
  buttonType: 'primary' | 'secondary';
  theme: 'light' | 'dark';
  themeLabel: string;
  config: any;
  updateHeroButtonTheme: (buttonType: 'primary' | 'secondary', theme: 'light' | 'dark', field: string, value: any) => void;
}

const ButtonThemeEditor: React.FC<ButtonThemeEditorProps> = ({
  buttonType,
  theme,
  themeLabel,
  config,
  updateHeroButtonTheme,
}) => {
  const themeConfig = config?.[theme];
  const style = config?.style;

  const getButtonStyle = () => {
    if (style === 'gradient') {
      return {
        background: `linear-gradient(to right, ${themeConfig?.gradient?.from ?? '#8b5cf6'}, ${themeConfig?.gradient?.to ?? '#06b6d4'})`,
        color: themeConfig?.textColor ?? '#ffffff',
        border: 'none',
      };
    } else if (style === 'outline') {
      return {
        background: 'transparent',
        color: themeConfig?.textColor ?? '#8b5cf6',
        border: `2px solid ${themeConfig?.borderColor ?? '#8b5cf6'}`,
      };
    } else {
      return {
        background: themeConfig?.solidColor ?? '#8b5cf6',
        color: themeConfig?.textColor ?? '#ffffff',
        border: 'none',
      };
    }
  };

  return (
    <div className="space-y-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-600">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {themeLabel}
      </p>

      {style === 'gradient' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Gradiente Inicio
            </label>
            <input
              type="color"
              value={themeConfig?.gradient?.from ?? '#8b5cf6'}
              onChange={(e) => updateHeroButtonTheme(buttonType, theme, 'gradient', {
                ...themeConfig?.gradient,
                from: e.target.value
              })}
              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Gradiente Final
            </label>
            <input
              type="color"
              value={themeConfig?.gradient?.to ?? '#06b6d4'}
              onChange={(e) => updateHeroButtonTheme(buttonType, theme, 'gradient', {
                ...themeConfig?.gradient,
                to: e.target.value
              })}
              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
          </div>
        </div>
      )}

      {style === 'solid' && (
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Color de fondo
          </label>
          <input
            type="color"
            value={themeConfig?.solidColor ?? '#8b5cf6'}
            onChange={(e) => updateHeroButtonTheme(buttonType, theme, 'solidColor', e.target.value)}
            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Color de texto
          </label>
          <input
            type="color"
            value={themeConfig?.textColor ?? '#ffffff'}
            onChange={(e) => updateHeroButtonTheme(buttonType, theme, 'textColor', e.target.value)}
            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
          />
        </div>
        {style === 'outline' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Color de borde
            </label>
            <input
              type="color"
              value={themeConfig?.borderColor ?? '#8b5cf6'}
              onChange={(e) => updateHeroButtonTheme(buttonType, theme, 'borderColor', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Vista previa */}
      <div className="pt-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
        <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <button
            className="px-4 py-2 rounded-lg font-medium transition-all"
            style={getButtonStyle()}
          >
            {config?.text || 'Botón'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroConfigSection;
