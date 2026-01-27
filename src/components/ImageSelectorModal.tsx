import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useImageLibrary } from '../hooks/cms/useImageLibrary';
import { uploadImage } from '../services/imageService';
import imageCompression from 'browser-image-compression';

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  currentImage?: string;
  title?: string;
}

const ImageSelectorModal: React.FC<ImageSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentImage,
  title = 'Seleccionar Imagen'
}) => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  
  const {
    images,
    loading,
    error,
    refreshImages,
    setFilters,
    filters
  } = useImageLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState(false);

  // Helper function para construir URLs completas de imágenes
  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) {
      // Si es una URL de Cloudinary de tipo 'raw' sin extensión, probablemente sea SVG
      const pathPart = url.split('/').pop();
      if (url.includes('/raw/upload/') && pathPart && !pathPart.includes('.') && pathPart.length > 10) {
        return `${url}.svg`;
      }
      return url;
    }
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}${url}`;
  };

  // Cargar imágenes cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      refreshImages();
    }
  }, [isOpen, refreshImages]);

  const handleSearch = () => {
    setFilters({ ...filters, search: searchQuery, page: 1 });
  };

  const handleImageSelect = (image: any) => {
    const fullUrl = getImageUrl(image.url);
    onSelect(fullUrl);
    onClose();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Comprimir imagen si es muy grande
      let processedFile = file;
      if (file.size > 1024 * 1024) { // Si es mayor a 1MB
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        processedFile = await imageCompression(file, options);
      }

      // Subir imagen
      const result = await uploadImage({
        file: processedFile,
        category: 'other',
        title: processedFile.name
      });

      // La función uploadImage ya retorna los datos directamente
      // Refrescar lista de imágenes
      await refreshImages();
      
      // Seleccionar la imagen recién subida
      const imageUrl = getImageUrl(result.url);
      onSelect(imageUrl);
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Mejor manejo de errores
      let errorMessage = 'Error desconocido al subir imagen';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Mostrar error específico
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        alert('Error de autenticación. Por favor, recarga la página e intenta nuevamente.');
      } else if (errorMessage.includes('413') || errorMessage.includes('too large')) {
        alert('El archivo es demasiado grande. Por favor, selecciona una imagen más pequeña.');
      } else if (errorMessage.includes('415') || errorMessage.includes('format')) {
        alert('Formato de archivo no soportado. Usa JPG, PNG o WebP.');
      } else {
        alert(`Error al subir imagen: ${errorMessage}`);
      }
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-xl border shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🖼️ {title}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors`}
            >
              <span className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>✕</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between gap-4">
            {/* Búsqueda */}
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar imágenes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              />
              <button
                onClick={handleSearch}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                🔍
              </button>
            </div>

            {/* Botón para subir nueva imagen */}
            <button
              onClick={() => setShowUploadSection(!showUploadSection)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2"
            >
              <span>📤</span>
              <span>Subir Nueva</span>
            </button>
          </div>

          {/* Sección de upload */}
          {showUploadSection && (
            <div className={`mt-4 p-4 rounded-lg border-2 border-dashed ${
              darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className={`block w-full text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  } file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium ${
                    darkMode 
                      ? 'file:bg-purple-600 file:text-white hover:file:bg-purple-700' 
                      : 'file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100'
                  }`}
                />
                {uploading && (
                  <div className="mt-2 flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Subiendo imagen...
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Imagen actual */}
        {currentImage && (
          <div className={`px-6 py-3 border-b ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-blue-50'}`}>
            <div className="flex items-center space-x-3">
              <img
                src={currentImage}
                alt="Imagen actual"
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                  Imagen actual seleccionada
                </p>
                <button
                  onClick={() => {
                    onSelect('');
                    onClose();
                  }}
                  className={`text-xs ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'}`}
                >
                  Remover imagen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid de imágenes */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className={`text-center py-20 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              ❌ Error: {error}
            </div>
          ) : images.length === 0 ? (
            <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="text-6xl mb-4">📭</div>
              <p className="text-lg font-medium mb-2">No hay imágenes disponibles</p>
              <p>Sube tu primera imagen usando el botón "Subir Nueva"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((image) => (
                <div
                  key={image._id}
                  onClick={() => handleImageSelect(image)}
                  className={`${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                  } rounded-lg shadow hover:shadow-lg transition-all cursor-pointer overflow-hidden border-2 ${
                    getImageUrl(image.url) === currentImage
                      ? 'border-purple-500 ring-2 ring-purple-200'
                      : 'border-transparent'
                  }`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={getImageUrl(image.url)}
                      alt={image.title || image.filename}
                      className="w-full h-full object-cover transition-transform hover:scale-110"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className={`font-medium text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {image.title || image.filename}
                    </h3>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {image.dimensions}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-600 hover:bg-gray-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              } transition-colors`}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSelectorModal;