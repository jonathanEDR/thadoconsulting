import React, { useState } from 'react';
import ManagedImageSelector from '../ManagedImageSelector';

interface IconSelectorProps {
  iconType: 'emoji' | 'image';
  iconValue: string;
  onIconTypeChange: (type: 'emoji' | 'image') => void;
  onIconValueChange: (value: string) => void;
  label: string;
  darkMode?: boolean;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  iconType,
  iconValue,
  onIconTypeChange,
  onIconValueChange,
  label,
  darkMode = false
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Emojis comunes para selección rápida
  const commonEmojis = [
    '💡', '🚀', '⚡', '🎯', '🔧', '💻', '📱', '🌟',
    '🎨', '📊', '🔒', '🌐', '📈', '💼', '🏆', '🎓',
    '🔍', '💰', '📝', '🎵', '📷', '🎬', '🏠', '🚗'
  ];

  return (
    <div className="space-y-3">
      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        {label}
      </label>

      {/* Tipo de icono */}
      <div className="flex gap-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            checked={iconType === 'emoji'}
            onChange={() => onIconTypeChange('emoji')}
            className="mr-2"
          />
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Emoji
          </span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            checked={iconType === 'image'}
            onChange={() => onIconTypeChange('image')}
            className="mr-2"
          />
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Imagen personalizada
          </span>
        </label>
      </div>

      {/* Emoji Selector */}
      {iconType === 'emoji' && (
        <div className="space-y-3">
          {/* Input de emoji */}
          <div className="flex gap-2 items-center">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-xl flex items-center justify-center text-4xl border-2 border-gray-200 dark:border-gray-700">
              {iconValue || '💡'}
            </div>
            <input
              type="text"
              value={iconValue}
              onChange={(e) => onIconValueChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-2xl text-center"
              placeholder="💡"
              maxLength={2}
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {showEmojiPicker ? 'Cerrar' : 'Seleccionar'}
            </button>
          </div>

          {/* Selector rápido de emojis */}
          {showEmojiPicker && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <p className={`text-xs font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Selección rápida:
              </p>
              <div className="grid grid-cols-8 gap-2">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onIconValueChange(emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors border border-transparent hover:border-purple-500"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className={`text-xs mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                💡 Tip: También puedes copiar y pegar cualquier emoji en el campo de arriba
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Uploader */}
      {iconType === 'image' && (
        <div className="space-y-3">
          <ManagedImageSelector
            label="Icono de Imagen"
            description="Sube una imagen para usar como icono (PNG, SVG, JPG)"
            currentImage={iconValue}
            onImageSelect={onIconValueChange}
            darkMode={darkMode}
            hideButtonArea={!!iconValue}
          />
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            💡 Recomendado: Imágenes cuadradas de 128x128px o mayores
          </p>
        </div>
      )}

      {/* Preview */}
      {iconValue && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <p className={`text-xs font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Vista previa del icono:
          </p>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-0.5">
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center">
                {iconType === 'emoji' ? (
                  <span className="text-4xl">{iconValue}</span>
                ) : (
                  <img
                    src={iconValue}
                    alt="Icon preview"
                    className="w-12 h-12 object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconSelector;
