/**
 * ChatbotLogoSelector Component
 * Selector de logos del chatbot con soporte para tema claro y oscuro
 * Integrado con el sistema robusto de gestión de imágenes
 */

import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import ImageSelectorModal from '../ImageSelectorModal';

interface ChatbotLogoSelectorProps {
  logoLight: string;
  logoDark: string;
  onLogoChange: (theme: 'light' | 'dark', url: string) => void;
  logoAlt: string;
}

const ChatbotLogoSelector: React.FC<ChatbotLogoSelectorProps> = ({
  logoLight,
  logoDark,
  onLogoChange,
  logoAlt
}) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');

  const openModalForTheme = (theme: 'light' | 'dark') => {
    setActiveTheme(theme);
    setShowModal(true);
  };

  const handleImageSelect = (imageUrl: string) => {
    onLogoChange(activeTheme, imageUrl);
    setShowModal(false);
  };

  const removeLogo = (theme: 'light' | 'dark') => {
    onLogoChange(theme, '');
  };

  // Helper function para corregir URLs de SVG sin extensión
  const getCorrectImageUrl = (url: string) => {
    if (!url) return url;
    // Si es una URL de Cloudinary de tipo 'raw' sin extensión, probablemente sea SVG
    const pathPart = url.split('/').pop();
    if (url.includes('/raw/upload/') && pathPart && !pathPart.includes('.') && pathPart.length > 10) {
      return `${url}.svg`;
    }
    return url;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logo Tema Claro */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Logo - Tema Claro ☀️
          </label>
          
          {logoLight ? (
            <div className="relative group">
              <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                <img 
                  src={getCorrectImageUrl(logoLight)} 
                  alt={logoAlt}
                  className="max-w-full max-h-full object-contain p-2"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button
                  onClick={() => openModalForTheme('light')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                >
                  <ImageIcon size={14} />
                  Cambiar
                </button>
                <button
                  onClick={() => removeLogo('light')}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                >
                  <X size={14} />
                  Eliminar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => openModalForTheme('light')}
              className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex flex-col items-center justify-center gap-2 text-gray-600 dark:text-gray-400 group"
            >
              <Upload size={24} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              <span className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Seleccionar Logo Claro
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                PNG, SVG o JPG
              </span>
            </button>
          )}
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Logo que se mostrará cuando el sitio esté en tema claro
          </p>
        </div>

        {/* Logo Tema Oscuro */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Logo - Tema Oscuro 🌙
          </label>
          
          {logoDark ? (
            <div className="relative group">
              <div className="w-full h-32 bg-gray-800 dark:bg-gray-900 rounded-lg border-2 border-gray-600 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                <img 
                  src={getCorrectImageUrl(logoDark)} 
                  alt={logoAlt}
                  className="max-w-full max-h-full object-contain p-2"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button
                  onClick={() => openModalForTheme('dark')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                >
                  <ImageIcon size={14} />
                  Cambiar
                </button>
                <button
                  onClick={() => removeLogo('dark')}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                >
                  <X size={14} />
                  Eliminar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => openModalForTheme('dark')}
              className="w-full h-32 border-2 border-dashed border-gray-600 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all flex flex-col items-center justify-center gap-2 text-gray-600 dark:text-gray-400 group"
            >
              <Upload size={24} className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              <span className="text-sm font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Seleccionar Logo Oscuro
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                PNG, SVG o JPG
              </span>
            </button>
          )}
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Logo que se mostrará cuando el sitio esté en tema oscuro
          </p>
        </div>
      </div>

      {/* Vista Previa de Ambos Logos */}
      {(logoLight || logoDark) && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Vista Previa en Contexto
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Preview Light */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">Tema Claro</p>
              <div className="bg-white p-3 rounded-lg border border-gray-300 flex items-center gap-2">
                {logoLight ? (
                  <img src={logoLight} alt={logoAlt} className="w-8 h-8 object-contain" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">
                    AI
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">Asesor de Ventas</p>
                  <p className="text-[10px] text-gray-600">En línea</p>
                </div>
              </div>
            </div>

            {/* Preview Dark */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">Tema Oscuro</p>
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center gap-2">
                {logoDark ? (
                  <img src={getCorrectImageUrl(logoDark)} alt={logoAlt} className="w-8 h-8 object-contain" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">
                    AI
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-white">Asesor de Ventas</p>
                  <p className="text-[10px] text-gray-400">En línea</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información Adicional */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="flex gap-2">
          <span className="text-blue-600 dark:text-blue-400 text-lg">💡</span>
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Recomendaciones:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Usa imágenes cuadradas (1:1) para mejor visualización</li>
              <li>Tamaño recomendado: 128x128px o superior</li>
              <li>Para íconos sin fondo usa SVG (ideal) o PNG con transparencia</li>
              <li>Para tema oscuro, usa logos con colores claros</li>
              <li>Si no subes un logo, se usará el icono por defecto</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de Selección de Imagen */}
      <ImageSelectorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleImageSelect}
        currentImage={activeTheme === 'light' ? logoLight : logoDark}
        title={`Seleccionar Logo - Tema ${activeTheme === 'light' ? 'Claro' : 'Oscuro'}`}
      />
    </div>
  );
};

export default ChatbotLogoSelector;
