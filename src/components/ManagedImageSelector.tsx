import React, { useState } from 'react';
import ImageSelectorModal from './ImageSelectorModal';

interface ManagedImageSelectorProps {
  currentImage?: string;
  onImageSelect: (imageUrl: string) => void;
  label?: string;
  description?: string;
  darkMode?: boolean;
  hideButtonArea?: boolean;
}

const ManagedImageSelector: React.FC<ManagedImageSelectorProps> = ({
  currentImage,
  onImageSelect,
  label = 'Imagen',
  description,
  darkMode = false,
  hideButtonArea = false
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full">
      {/* Preview actual */}
      {currentImage && (
        <div className="mb-4">
          <div className="relative group">
            <img
              src={currentImage}
              alt={label}
              className="w-full max-w-xs h-48 object-cover rounded-lg border"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  📷 Cambiar
                </button>
                <button
                  onClick={() => onImageSelect('')}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón para seleccionar/cambiar imagen */}
      {!hideButtonArea && (
        <div>
          <button
            onClick={() => setShowModal(true)}
            className={`w-full px-4 py-3 border-2 border-dashed rounded-lg transition-all ${
              darkMode
                ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-700'
            } ${currentImage ? '' : 'min-h-[120px]'} flex flex-col items-center justify-center space-y-2`}
          >
            <div className="text-3xl">
              {currentImage ? '🖼️' : '📁'}
            </div>
            <div className="text-center">
              <p className="font-medium">
                {currentImage ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
              </p>
              {description && (
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {description}
                </p>
              )}
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Haz clic para abrir la galería de imágenes
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Modal de selección */}
      <ImageSelectorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={onImageSelect}
        currentImage={currentImage}
        title={`Seleccionar ${label}`}
      />
    </div>
  );
};

export default ManagedImageSelector;