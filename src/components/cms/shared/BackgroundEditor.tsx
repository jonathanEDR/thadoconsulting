/**
 * 🎨 BackgroundEditor - Editor de fondos reutilizable
 * Permite configurar fondos de tipo: ninguno, color sólido, gradiente o imagen
 * Soporta imágenes diferentes para tema claro y oscuro
 */

import React, { useState } from 'react';
import ImageSelectorModal from '../../ImageSelectorModal';
import type { BackgroundConfig } from '../types/servicioDetailConfig';

interface BackgroundEditorProps {
  background: BackgroundConfig;
  onUpdate: (field: keyof BackgroundConfig, value: any) => void;
  onBatchUpdate?: (updates: Partial<BackgroundConfig>) => void;
  label?: string;
}

export const BackgroundEditor: React.FC<BackgroundEditorProps> = ({ 
  background, 
  onUpdate, 
  onBatchUpdate, 
  label = 'Fondo de sección' 
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalTheme, setImageModalTheme] = useState<'light' | 'dark'>('light');

  const handleImageSelect = (imageUrl: string) => {
    const updates: Partial<BackgroundConfig> = {
      type: 'image' as const
    };
    
    if (imageModalTheme === 'light') {
      updates.imageLight = imageUrl;
    } else {
      updates.imageDark = imageUrl;
    }
    
    if (onBatchUpdate) {
      onBatchUpdate(updates);
    } else {
      if (imageModalTheme === 'light') {
        onUpdate('imageLight', imageUrl);
      } else {
        onUpdate('imageDark', imageUrl);
      }
      if (background.type !== 'image') {
        onUpdate('type', 'image');
      }
    }
  };

  const handleRemoveImage = (theme: 'light' | 'dark') => {
    if (theme === 'light') {
      onUpdate('imageLight', '');
    } else {
      onUpdate('imageDark', '');
    }
    if (!background.imageLight && !background.imageDark) {
      onUpdate('type', 'none');
    }
  };

  return (
    <>
      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
        <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span>🎨</span> {label}
        </h5>

        {/* Tipo de fondo */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo de fondo
          </label>
          <select
            value={background.type}
            onChange={(e) => onUpdate('type', e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500"
          >
            <option value="none">Sin fondo</option>
            <option value="color">Color sólido</option>
            <option value="gradient">Gradiente</option>
            <option value="image">Imagen</option>
          </select>
        </div>

        {/* Color sólido */}
        {background.type === 'color' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color de fondo
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={background.color || '#ffffff'}
                onChange={(e) => onUpdate('color', e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={background.color || '#ffffff'}
                onChange={(e) => onUpdate('color', e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                placeholder="#ffffff"
              />
            </div>
          </div>
        )}

        {/* Gradiente */}
        {background.type === 'gradient' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Color inicial
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={background.gradientFrom || '#f3f4f6'}
                  onChange={(e) => onUpdate('gradientFrom', e.target.value)}
                  className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={background.gradientFrom || '#f3f4f6'}
                  onChange={(e) => onUpdate('gradientFrom', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm"
                  placeholder="#f3f4f6"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Color final
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={background.gradientTo || '#e5e7eb'}
                  onChange={(e) => onUpdate('gradientTo', e.target.value)}
                  className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={background.gradientTo || '#e5e7eb'}
                  onChange={(e) => onUpdate('gradientTo', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm"
                  placeholder="#e5e7eb"
                />
              </div>
            </div>
          </div>
        )}

        {/* Imagen */}
        {background.type === 'image' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              ℹ️ Configura imágenes diferentes para tema claro y oscuro
            </p>

            {/* Imagen para tema CLARO */}
            <div className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>☀️</span> Imagen para tema claro
              </label>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setImageModalTheme('light'); setIsImageModalOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-yellow-300 dark:border-yellow-600 hover:border-yellow-500 dark:hover:border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-all"
                >
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    {background.imageLight ? '📷 Cambiar' : '🖼️ Seleccionar'}
                  </span>
                </button>
                {background.imageLight && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('light')}
                    className="px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {background.imageLight && (
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                  <img src={background.imageLight} alt="Fondo tema claro" className="w-full h-32 object-cover" />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded truncate">
                    {background.imageLight}
                  </div>
                </div>
              )}
            </div>

            {/* Imagen para tema OSCURO */}
            <div className="space-y-3 p-4 bg-gray-900/5 dark:bg-gray-700/50 rounded-lg border-2 border-gray-300 dark:border-gray-500">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>🌙</span> Imagen para tema oscuro
              </label>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setImageModalTheme('dark'); setIsImageModalOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-600 hover:border-purple-500 dark:hover:border-purple-400 bg-purple-50/50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
                >
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    {background.imageDark ? '📷 Cambiar' : '🖼️ Seleccionar'}
                  </span>
                </button>
                {background.imageDark && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('dark')}
                    className="px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {background.imageDark && (
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                  <img src={background.imageDark} alt="Fondo tema oscuro" className="w-full h-32 object-cover" />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded truncate">
                    {background.imageDark}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overlay (para imagen o gradiente) */}
        {(background.type === 'image' || background.type === 'gradient') && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Color del overlay
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={background.overlayColor || '#000000'}
                  onChange={(e) => onUpdate('overlayColor', e.target.value)}
                  className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={background.overlayColor || '#000000'}
                  onChange={(e) => onUpdate('overlayColor', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                  placeholder="#000000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Opacidad del overlay ({background.overlayOpacity || 0}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={background.overlayOpacity || 0}
                onChange={(e) => onUpdate('overlayOpacity', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Transparente (0%)</span>
                <span>Opaco (100%)</span>
              </div>
            </div>
          </>
        )}

        {/* Preview */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Vista previa
          </label>
          <div
            className="h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 relative overflow-hidden"
            style={{
              backgroundColor: background.type === 'color' ? background.color : 'transparent',
              backgroundImage: 
                background.type === 'gradient' 
                  ? `linear-gradient(to right, ${background.gradientFrom}, ${background.gradientTo})`
                  : background.type === 'image' && (background.imageLight || background.imageUrl)
                  ? `url(${background.imageLight || background.imageUrl})`
                  : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {(background.type === 'image' || background.type === 'gradient') && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: background.overlayColor || '#000000',
                  opacity: (background.overlayOpacity || 0) / 100,
                }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-sm font-medium drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                Contenido aquí
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de selección de imágenes */}
      <ImageSelectorModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelect={handleImageSelect}
        currentImage={background.imageUrl}
        title={`Seleccionar imagen para ${label}`}
      />
    </>
  );
};

export default BackgroundEditor;
