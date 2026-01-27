import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ImageMetadataEditorProps {
  image: any;
  onSave: (metadata: any) => void;
  onClose: () => void;
}

const ImageMetadataEditor: React.FC<ImageMetadataEditorProps> = ({
  image,
  onSave,
  onClose
}) => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  
  const [formData, setFormData] = useState({
    title: image.title || image.filename || '',
    description: image.description || '',
    alt: image.alt || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving metadata:', error);
      alert('Error al guardar metadatos');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mostrar información de uso de la imagen
  const getUsageInfo = () => {
    if (!image.usedIn || image.usedIn.length === 0) {
      return (
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border`}>
          <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
            🗑️ <strong>Imagen huérfana</strong> - No se está usando en ningún lugar
          </p>
        </div>
      );
    }

    return (
      <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
        <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
          📍 Se está usando en:
        </p>
        <div className="space-y-1">
          {image.usedIn.map((usage: any, index: number) => (
            <div key={index} className={`text-xs ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              • <strong>{usage.model}</strong> → {usage.field}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-xl border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              ✏️ Editar Metadatos
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

        {/* Preview de imagen */}
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-4">
            <img
              src={`http://localhost:5000${image.url}`}
              alt={image.filename}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {image.filename}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {image.dimensions} • {image.sizeFormatted}
              </p>
            </div>
          </div>
          
          {/* Información de uso */}
          <div className="mt-4">
            {getUsageInfo()}
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            
            {/* Título/Nombre */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                📝 Nombre de la imagen
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ej: Logo principal empresa, Hero imagen fondo, etc."
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                maxLength={200}
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Nombre descriptivo para identificar fácilmente la imagen
              </p>
            </div>

            {/* Descripción */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                📄 Descripción (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción detallada del contenido y contexto de la imagen..."
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none`}
                maxLength={500}
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Información adicional sobre la imagen
              </p>
            </div>

            {/* Texto ALT */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                ♿ Texto alternativo - ALT (accesibilidad)
              </label>
              <input
                type="text"
                value={formData.alt}
                onChange={(e) => handleInputChange('alt', e.target.value)}
                placeholder="Descripción para lectores de pantalla y accesibilidad"
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                maxLength={150}
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Importante para accesibilidad web y SEO
              </p>
            </div>

          </div>

          {/* Footer con botones */}
          <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-600 hover:bg-gray-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                } transition-colors`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2 ${
                  saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageMetadataEditor;