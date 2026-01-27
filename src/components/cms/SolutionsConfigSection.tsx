import React, { useState } from 'react';
import RichTextEditorCompact from '../RichTextEditorCompact';
import ManagedImageSelector from '../ManagedImageSelector';
import type { PageData } from '../../types/cms';

interface SolutionsConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
  updateTextStyle: (section: 'hero' | 'solutions', field: string, mode: 'light' | 'dark', color: string) => void;
}

const SolutionsConfigSection: React.FC<SolutionsConfigSectionProps> = ({
  pageData,
  updateContent,
  updateTextStyle
}) => {
  // Si no hay solutions, no renderizar nada
  if (!pageData.content.solutions) {
    return null;
  }

  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-controls="solutions-section-content"
        style={{ cursor: 'pointer' }}
      >
        <span className="flex items-center">
          💡 Sección de Soluciones
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {/* Contenido colapsable */}
      {!collapsed && (
        <div id="solutions-section-content">
          {/* Layout principal con 2 columnas: Contenido y Imágenes */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Columna izquierda: Editores de texto (2/3) */}
            <div className="xl:col-span-2 space-y-4">
              
              {/* Título de la Sección */}
              <div>
                <RichTextEditorCompact
                  label="Título de la Sección"
                  value={pageData.content.solutions.title}
                  onChange={(html: string) => {
                    console.log('🔍 [SolutionsConfig] Título cambiado a:', html);
                    updateContent('solutions.title', html);
                  }}
                  placeholder="Nuestras Soluciones"
                  themeColors={{
                    light: pageData.content.solutions.styles?.light?.titleColor || '',
                    dark: pageData.content.solutions.styles?.dark?.titleColor || ''
                  }}
                  onThemeColorChange={(mode: 'light' | 'dark', color: string) => updateTextStyle('solutions', 'titleColor', mode, color)}
                />
              </div>

              {/* Descripción de la Sección */}
              <div>
                <RichTextEditorCompact
                  label="Descripción de la Sección"
                  value={pageData.content.solutions.description}
                  onChange={(html: string) => updateContent('solutions.description', html)}
                  placeholder="Conoce las soluciones que ofrecemos..."
                  themeColors={{
                    light: pageData.content.solutions.styles?.light?.descriptionColor || '',
                    dark: pageData.content.solutions.styles?.dark?.descriptionColor || ''
                  }}
                  onThemeColorChange={(mode: 'light' | 'dark', color: string) => updateTextStyle('solutions', 'descriptionColor', mode, color)}
                />
              </div>
            </div>

            {/* Columna derecha: Imágenes de Fondo (1/3) */}
            <div className="xl:col-span-1">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                🖼️ Imágenes de Fondo
              </h4>
              <div className="space-y-4">
                
                {/* Imagen para Tema Claro */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700/50">
                  <div className="flex items-center mb-3">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-2 mr-3 shadow-sm">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-800 dark:text-gray-200">🌞 Tema Claro</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Fondo para modo día</p>
                    </div>
                  </div>
                  <ManagedImageSelector
                    label="Imagen de Fondo (Claro)"
                    description="Tamaño recomendado: 1920x1080px"
                    currentImage={typeof pageData.content.solutions.backgroundImage === 'string' 
                      ? pageData.content.solutions.backgroundImage 
                      : pageData.content.solutions.backgroundImage?.light}
                    onImageSelect={(url: string) => updateContent('solutions.backgroundImage.light', url)}
                    hideButtonArea={!!(typeof pageData.content.solutions.backgroundImage === 'string' 
                      ? pageData.content.solutions.backgroundImage 
                      : pageData.content.solutions.backgroundImage?.light)}
                  />
                </div>

                {/* Imagen para Tema Oscuro */}
                <div className="bg-gradient-to-br from-slate-900 to-gray-900 dark:from-slate-800/50 dark:to-gray-800/50 p-4 rounded-lg border border-gray-700 dark:border-gray-600">
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-800 dark:bg-gray-700 rounded-full p-2 mr-3 shadow-sm">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white dark:text-gray-200">🌙 Tema Oscuro</h5>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Fondo para modo noche</p>
                    </div>
                  </div>
                  <ManagedImageSelector
                    label="Imagen de Fondo (Oscuro)"
                    description="Tamaño recomendado: 1920x1080px"
                    currentImage={typeof pageData.content.solutions.backgroundImage === 'string' 
                      ? pageData.content.solutions.backgroundImage 
                      : pageData.content.solutions.backgroundImage?.dark}
                    onImageSelect={(url: string) => updateContent('solutions.backgroundImage.dark', url)}
                    darkMode={true}
                    hideButtonArea={!!(typeof pageData.content.solutions.backgroundImage === 'string' 
                      ? pageData.content.solutions.backgroundImage 
                      : pageData.content.solutions.backgroundImage?.dark)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionsConfigSection;