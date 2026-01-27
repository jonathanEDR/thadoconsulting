/**
 * 🎨 CtaBackgroundEditor - Editor de fondo simple para CTA
 * Solo permite configurar una imagen de fondo única
 */

import React, { useState } from 'react';
import ImageSelectorModal from '../../ImageSelectorModal';

interface CtaBackgroundEditorProps {
  imageUrl?: string;
  overlay?: number;
  onUpdateImage: (imageUrl: string) => void;
  onUpdateOverlay: (opacity: number) => void;
}

export const CtaBackgroundEditor: React.FC<CtaBackgroundEditorProps> = ({ 
  imageUrl = '',
  overlay = 0.5,
  onUpdateImage,
  onUpdateOverlay,
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleImageSelect = (url: string) => {
    onUpdateImage(url);
    setIsImageModalOpen(false);
  };

  const handleRemoveImage = () => {
    onUpdateImage('');
  };

  return (
    <>
      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
        <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span>🎨</span> Fondo de la sección CTA
        </h5>

        {/* Selector de imagen */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Imagen de fondo
          </label>

          {imageUrl ? (
            <div className="space-y-3">
              {/* Preview de la imagen */}
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                <img 
                  src={imageUrl} 
                  alt="Fondo CTA" 
                  className="w-full h-48 object-cover"
                />
                <div 
                  className="absolute inset-0 bg-black pointer-events-none"
                  style={{ opacity: overlay }}
                />
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsImageModalOpen(true)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  🖼️ Cambiar imagen
                </button>
                <button
                  onClick={handleRemoveImage}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsImageModalOpen(true)}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>📷</span>
              Seleccionar imagen de fondo
            </button>
          )}
        </div>

        {/* Control de overlay (solo visible si hay imagen) */}
        {imageUrl && (
          <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Oscurecer imagen (overlay)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={overlay * 100}
                onChange={(e) => onUpdateOverlay(parseInt(e.target.value) / 100)}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                {Math.round(overlay * 100)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Agrega una capa oscura sobre la imagen para mejorar la legibilidad del texto
            </p>
          </div>
        )}

        {/* Info adicional */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-300">
            💡 <strong>Recomendación:</strong> Usa una imagen de alta resolución (mínimo 1920x1080px) para mejores resultados en pantallas grandes.
          </p>
        </div>
      </div>

      {/* Modal de selección de imagen */}
      <ImageSelectorModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelect={handleImageSelect}
      />
    </>
  );
};

export default CtaBackgroundEditor;
