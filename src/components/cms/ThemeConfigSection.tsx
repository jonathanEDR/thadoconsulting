import React from 'react';
import { SimpleButtonConfig } from '../SimpleButtonConfig';
import type { PageData, ThemeColors, ButtonStyle } from '../../types/cms';

interface ThemeConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
  updateSimpleButtonStyle: (mode: 'lightMode' | 'darkMode', buttonType: 'ctaPrimary' | 'contact' | 'dashboard' | 'viewMore' | 'featuredBlogCta', style: ButtonStyle) => void;
}

const ThemeConfigSection: React.FC<ThemeConfigSectionProps> = ({
  pageData,
  updateContent,
  updateSimpleButtonStyle
}) => {
  const updateThemeColor = (mode: 'lightMode' | 'darkMode', field: keyof ThemeColors, value: string) => {
    updateContent(`theme.${mode}.${field}`, value);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        🎨 Configuración de Temas
      </h2>

  {/* Grid responsivo para las tarjetas de tema */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 w-full">
  {/* Configuración de Tema Claro */}
  <div className="flex-1 min-w-0 w-full bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center mb-6">
            <div className="bg-white rounded-full p-3 mr-3 shadow-sm">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">🌞 Tema Claro</h3>
              <p className="text-sm text-gray-600">Configuración de colores para modo día</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ...inputs de color y texto... */}
            <div className="min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Principal
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={pageData.theme?.lightMode?.primary || '#8B5CF6'}
                  onChange={(e) => updateThemeColor('lightMode', 'primary', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData.theme?.lightMode?.primary || '#8B5CF6'}
                  onChange={(e) => updateThemeColor('lightMode', 'primary', e.target.value)}
                  className="w-full min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                  placeholder="#8B5CF6"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Secundario
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={pageData.theme?.lightMode?.secondary || '#06B6D4'}
                  onChange={(e) => updateThemeColor('lightMode', 'secondary', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                  <input
                    type="text"
                    value={pageData.theme?.lightMode?.secondary || '#06B6D4'}
                    onChange={(e) => updateThemeColor('lightMode', 'secondary', e.target.value)}
                    className="w-full min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                    placeholder="#06B6D4"
                  />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Fondo
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={pageData.theme?.lightMode?.background || '#FFFFFF'}
                  onChange={(e) => updateThemeColor('lightMode', 'background', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                  <input
                    type="text"
                    value={pageData.theme?.lightMode?.background || '#FFFFFF'}
                    onChange={(e) => updateThemeColor('lightMode', 'background', e.target.value)}
                    className="w-full min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                    placeholder="#FFFFFF"
                  />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Texto
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={pageData.theme?.lightMode?.text || '#1F2937'}
                  onChange={(e) => updateThemeColor('lightMode', 'text', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                  <input
                    type="text"
                    value={pageData.theme?.lightMode?.text || '#1F2937'}
                    onChange={(e) => updateThemeColor('lightMode', 'text', e.target.value)}
                    className="w-full min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                    placeholder="#1F2937"
                  />
              </div>
            </div>
          </div>
        </div>

  {/* Configuración de Tema Oscuro */}
  <div className="flex-1 min-w-0 w-full bg-gradient-to-br from-slate-900 to-gray-900 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="bg-gray-800 rounded-full p-3 mr-3 shadow-sm">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-white">🌙 Tema Oscuro</h3>
              <p className="text-sm text-gray-400">Configuración de colores para modo noche</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ...inputs de color y texto... */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Color Principal
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={pageData.theme?.darkMode?.primary || '#A78BFA'}
                  onChange={(e) => updateThemeColor('darkMode', 'primary', e.target.value)}
                  className="w-12 h-10 border border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData.theme?.darkMode?.primary || '#A78BFA'}
                  onChange={(e) => updateThemeColor('darkMode', 'primary', e.target.value)}
                  className="w-full min-w-0 flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white text-sm"
                  placeholder="#A78BFA"
                />
              </div>
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Color Secundario
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={pageData.theme?.darkMode?.secondary || '#22D3EE'}
                  onChange={(e) => updateThemeColor('darkMode', 'secondary', e.target.value)}
                  className="w-12 h-10 border border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData.theme?.darkMode?.secondary || '#22D3EE'}
                  onChange={(e) => updateThemeColor('darkMode', 'secondary', e.target.value)}
                  className="w-full min-w-0 flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white text-sm"
                  placeholder="#22D3EE"
                />
              </div>
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Color de Fondo
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={pageData.theme?.darkMode?.background || '#111827'}
                  onChange={(e) => updateThemeColor('darkMode', 'background', e.target.value)}
                  className="w-12 h-10 border border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData.theme?.darkMode?.background || '#111827'}
                  onChange={(e) => updateThemeColor('darkMode', 'background', e.target.value)}
                  className="w-full min-w-0 flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white text-sm"
                  placeholder="#111827"
                />
              </div>
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Color de Texto
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={pageData.theme?.darkMode?.text || '#F9FAFB'}
                  onChange={(e) => updateThemeColor('darkMode', 'text', e.target.value)}
                  className="w-12 h-10 border border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData.theme?.darkMode?.text || '#F9FAFB'}
                  onChange={(e) => updateThemeColor('darkMode', 'text', e.target.value)}
                  className="w-full min-w-0 flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white text-sm"
                  placeholder="#F9FAFB"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Configuración de Botones - Tema Claro y Oscuro en fila */}
  {/* Grid responsivo para las tarjetas de botones */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 mt-8 w-full">
          {/* Tema Claro */}
          <div className="flex-1 min-w-0 w-full bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200 min-w-0">
            <div className="flex items-center mb-6">
              <div className="bg-white rounded-full p-3 mr-3 shadow-sm min-w-0">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 min-w-0">🔘 Botones (Tema Claro)</h3>
                <p className="text-sm text-gray-600 min-w-0">Configuración de estilos de botones para modo día</p>
              </div>
            </div>
            <div className="space-y-4">
              <SimpleButtonConfig
                title="🎯 Botón Principal CTA"
                icon="🎯"
                value={pageData.theme?.lightMode?.buttons?.ctaPrimary || { text: 'Conoce nuestros servicios', background: '#8B5CF6', textColor: '#FFFFFF', borderColor: 'transparent' }}
                onChange={(style) => updateSimpleButtonStyle('lightMode', 'ctaPrimary', style)}
              />
              <SimpleButtonConfig
                title="📞 Botón Contacto"
                icon="📞"
                value={pageData.theme?.lightMode?.buttons?.contact || { text: 'CONTÁCTANOS', background: 'transparent', textColor: '#8B5CF6', borderColor: '#8B5CF6' }}
                onChange={(style) => updateSimpleButtonStyle('lightMode', 'contact', style)}
              />
              <SimpleButtonConfig
                title="📊 Botón Dashboard"
                icon="📊"
                value={pageData.theme?.lightMode?.buttons?.dashboard || { text: 'Ir al Dashboard', background: '#8B5CF6', textColor: '#FFFFFF', borderColor: 'transparent' }}
                onChange={(style) => updateSimpleButtonStyle('lightMode', 'dashboard', style)}
              />
              <SimpleButtonConfig
                title="👁️ Botón Ver más..."
                icon="👁️"
                value={pageData.theme?.lightMode?.buttons?.viewMore || { text: 'Ver más...', background: 'linear-gradient(135deg, #01c2cc 0%, #7528ee 100%)', textColor: '#FFFFFF', borderColor: 'transparent' }}
                onChange={(style) => updateSimpleButtonStyle('lightMode', 'viewMore', style)}
              />
              <SimpleButtonConfig
                title="📰 Botón Blog (Ver todos)"
                icon="📰"
                value={pageData.theme?.lightMode?.buttons?.featuredBlogCta || { text: 'Ver todos los artículos', background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', textColor: '#FFFFFF', borderColor: 'transparent' }}
                onChange={(style) => updateSimpleButtonStyle('lightMode', 'featuredBlogCta', style)}
              />
            </div>
          </div>
          {/* Tema Oscuro */}
          <div className="flex-1 min-w-0 w-full bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 min-w-0">
            <div className="flex items-center mb-6">
              <div className="bg-gray-700 rounded-full p-3 mr-3 shadow-sm min-w-0">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-100 min-w-0">🔘 Botones (Tema Oscuro)</h3>
                <p className="text-sm text-gray-300 min-w-0">Configuración de estilos de botones para modo noche</p>
              </div>
            </div>
            <div className="space-y-4">
              <SimpleButtonConfig
                title="🎯 Botón Principal CTA"
                icon="🎯"
                value={pageData.theme?.darkMode?.buttons?.ctaPrimary || { text: 'Conoce nuestros servicios', background: '#8B5CF6', textColor: '#FFFFFF', borderColor: 'transparent' }}
                onChange={(style) => updateSimpleButtonStyle('darkMode', 'ctaPrimary', style)}
              />
              <SimpleButtonConfig
                title="📞 Botón Contacto"
                icon="📞"
                value={pageData.theme?.darkMode?.buttons?.contact || { text: 'CONTÁCTANOS', background: 'transparent', textColor: '#A78BFA', borderColor: '#A78BFA' }}
                onChange={(style) => updateSimpleButtonStyle('darkMode', 'contact', style)}
              />
              <SimpleButtonConfig
                title="📊 Botón Dashboard"
                icon="📊"
                value={pageData.theme?.darkMode?.buttons?.dashboard || { text: 'Ir al Dashboard', background: '#8B5CF6', textColor: '#FFFFFF', borderColor: 'transparent' }}
                onChange={(style) => updateSimpleButtonStyle('darkMode', 'dashboard', style)}
              />
              <SimpleButtonConfig
                title="👁️ Botón Ver más..."
                icon="👁️"
                value={pageData.theme?.darkMode?.buttons?.viewMore || { text: 'Ver más...', background: 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%)', textColor: '#111827', borderColor: 'transparent' }}
                onChange={(style) => updateSimpleButtonStyle('darkMode', 'viewMore', style)}
              />
              <SimpleButtonConfig
                title="📰 Botón Blog (Ver todos)"
                icon="📰"
                value={pageData.theme?.darkMode?.buttons?.featuredBlogCta || { text: 'Ver todos los artículos', background: 'linear-gradient(135deg, #A78BFA, #22D3EE)', textColor: '#111827', borderColor: 'transparent' }}
                onChange={(style) => updateSimpleButtonStyle('darkMode', 'featuredBlogCta', style)}
              />
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                💡 Sobre los temas
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Los cambios de color se aplicarán automáticamente a toda la aplicación. Puedes previsualizar los cambios guardando y visitando la página pública.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ThemeConfigSection;