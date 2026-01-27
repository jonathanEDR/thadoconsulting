import React, { useState } from 'react';
import RichTextEditorCompact from '../RichTextEditorCompact';
import ManagedImageSelector from '../ManagedImageSelector';
import type { PageData } from '../../types/cms';

interface HeroConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
  updateTextStyle: (section: 'hero' | 'solutions', field: string, mode: 'light' | 'dark', color: string) => void;
}

const HeroConfigSection: React.FC<HeroConfigSectionProps> = ({
  pageData,
  updateContent,
  updateTextStyle
}) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-controls="hero-section-content"
        style={{ cursor: 'pointer' }}
      >
        <span className="flex items-center">
          🚀 Hero Section
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {/* Contenido colapsable */}
      {!collapsed && (
        <div id="hero-section-content">
          {/* Layout principal con 2 columnas: Contenido y Imágenes */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Columna izquierda: Editores de texto (2/3) */}
            <div className="xl:col-span-2 space-y-4">
              
              {/* Título Principal */}
              <div>
                <RichTextEditorCompact
                  label="Título Principal"
                  value={pageData.content.hero.title}
                  onChange={(html: string) => updateContent('hero.title', html)}
                  placeholder="Transformamos tu empresa..."
                  themeColors={{
                    light: pageData.content.hero.styles?.light?.titleColor || '',
                    dark: pageData.content.hero.styles?.dark?.titleColor || ''
                  }}
                  onThemeColorChange={(mode: 'light' | 'dark', color: string) => updateTextStyle('hero', 'titleColor', mode, color)}
                />
              </div>

              {/* Subtítulo */}
              <div>
                <RichTextEditorCompact
                  label="Subtítulo"
                  value={pageData.content.hero.subtitle}
                  onChange={(html: string) => updateContent('hero.subtitle', html)}
                  placeholder="Innovamos para que tu empresa..."
                  themeColors={{
                    light: pageData.content.hero.styles?.light?.subtitleColor || '',
                    dark: pageData.content.hero.styles?.dark?.subtitleColor || ''
                  }}
                  onThemeColorChange={(mode: 'light' | 'dark', color: string) => updateTextStyle('hero', 'subtitleColor', mode, color)}
                />
              </div>

              {/* Descripción */}
              <div>
                <RichTextEditorCompact
                  label="Descripción"
                  value={pageData.content.hero.description}
                  onChange={(html: string) => updateContent('hero.description', html)}
                  placeholder="Transformamos procesos con..."
                  themeColors={{
                    light: pageData.content.hero.styles?.light?.descriptionColor || '',
                    dark: pageData.content.hero.styles?.dark?.descriptionColor || ''
                  }}
                  onThemeColorChange={(mode: 'light' | 'dark', color: string) => updateTextStyle('hero', 'descriptionColor', mode, color)}
                />
              </div>

              {/* Configuración del botón CTA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Texto del Botón
                  </label>
                  <input
                    type="text"
                    value={pageData.content.hero.ctaText}
                    onChange={(e) => updateContent('hero.ctaText', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Conoce nuestros servicios"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Enlace del Botón
                  </label>
                  <input
                    type="text"
                    value={pageData.content.hero.ctaLink}
                    onChange={(e) => updateContent('hero.ctaLink', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="#servicios"
                  />
                </div>
              </div>
            </div>

            {/* Columna derecha: Imágenes de Fondo (1/3) */}
            <div className="xl:col-span-1">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                🖼️ Imágenes de Fondo
              </h4>
              <div className="space-y-4">
                
                {/* Imagen para Tema Claro */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700/50">
                  <div className="flex items-center mb-3">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-2 mr-3 shadow-sm">
                      <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-800 dark:text-gray-200">🌞 Tema Claro</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Apariencia diurna</p>
                    </div>
                  </div>
                  <ManagedImageSelector
                    label="Imagen de Fondo (Claro)"
                    description="Tamaño recomendado: 1920x1080px"
                    currentImage={typeof pageData.content.hero.backgroundImage === 'string' 
                      ? pageData.content.hero.backgroundImage 
                      : pageData.content.hero.backgroundImage?.light}
                    onImageSelect={(url) => updateContent('hero.backgroundImage.light', url)}
                    hideButtonArea={!!(typeof pageData.content.hero.backgroundImage === 'string' 
                      ? pageData.content.hero.backgroundImage 
                      : pageData.content.hero.backgroundImage?.light)}
                  />
                </div>

                {/* Imagen para Tema Oscuro */}
                <div className="bg-gradient-to-br from-slate-900 to-gray-900 dark:from-slate-800/50 dark:to-gray-800/50 p-4 rounded-lg border border-gray-700 dark:border-gray-600">
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-800 dark:bg-gray-700 rounded-full p-2 mr-3 shadow-sm">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white dark:text-gray-200">🌙 Tema Oscuro</h5>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Apariencia nocturna</p>
                    </div>
                  </div>
                  <ManagedImageSelector
                    label="Imagen de Fondo (Oscuro)"
                    description="Tamaño recomendado: 1920x1080px"
                    currentImage={typeof pageData.content.hero.backgroundImage === 'string' 
                      ? pageData.content.hero.backgroundImage 
                      : pageData.content.hero.backgroundImage?.dark}
                    onImageSelect={(url) => updateContent('hero.backgroundImage.dark', url)}
                    darkMode={true}
                    hideButtonArea={!!(typeof pageData.content.hero.backgroundImage === 'string' 
                      ? pageData.content.hero.backgroundImage 
                      : pageData.content.hero.backgroundImage?.dark)}
                  />
                </div>

                {/* 🆕 Control de Opacidad de la Imagen */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700/50">
                  <div className="flex items-center mb-3">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-2 mr-3 shadow-sm">
                      <span className="text-lg">🎚️</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-800 dark:text-gray-200">Opacidad de la Imagen</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {Math.round(((pageData.content.hero as any).backgroundOpacity || 0.8) * 100)}% 
                        <span className="ml-1">
                          {((pageData.content.hero as any).backgroundOpacity || 0.8) >= 0.9 ? '🔥 Ultra HD' : 
                           ((pageData.content.hero as any).backgroundOpacity || 0.8) >= 0.7 ? '✨ Alta calidad' : 
                           ((pageData.content.hero as any).backgroundOpacity || 0.8) >= 0.4 ? '👍 Normal' : '💨 Sutil'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={((pageData.content.hero as any).backgroundOpacity || 0.8) * 100}
                    onChange={(e) => updateContent('hero.backgroundOpacity', parseInt(e.target.value) / 100)}
                    className="w-full h-2 bg-gradient-to-r from-gray-300 via-purple-400 to-purple-600 rounded-lg appearance-none cursor-pointer dark:from-gray-600 dark:via-purple-500 dark:to-purple-400"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>5% (Sutil)</span>
                    <span>100% (HD)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroConfigSection;