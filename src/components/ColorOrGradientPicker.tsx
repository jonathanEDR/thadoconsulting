// Selector que permite elegir entre Color Sólido o Gradiente
import React, { useState, useEffect } from 'react';

interface ColorOrGradientPickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  allowTransparent?: boolean;
}

const GRADIENT_DIRECTIONS = [
  { name: 'Horizontal →', value: '90deg' },
  { name: 'Vertical ↓', value: '180deg' },
  { name: 'Diagonal ↘', value: '135deg' },
  { name: 'Diagonal ↙', value: '45deg' }
];

export const ColorOrGradientPicker: React.FC<ColorOrGradientPickerProps> = ({
  value,
  onChange,
  label,
  allowTransparent = false
}) => {
  // Detectar si es gradiente o color sólido
  const isGradient = value.includes('gradient');
  const [mode, setMode] = useState<'solid' | 'gradient'>(isGradient ? 'gradient' : 'solid');

  // Para color sólido
  const [solidColor, setSolidColor] = useState(isGradient ? '#8B5CF6' : value);

  // Para gradiente
  const [direction, setDirection] = useState('90deg');
  const [color1, setColor1] = useState('#8B5CF6');
  const [color2, setColor2] = useState('#06B6D4');

  // Parsear valor inicial cuando el valor del padre cambia
  useEffect(() => {
    if (!value) return;
    
    if (value.includes('gradient')) {
      const linearMatch = value.match(/linear-gradient\(([^,]+),\s*([^,\)]+),?\s*([^)]*)\)/);
      if (linearMatch) {
        const dir = linearMatch[1].trim();
        const c1 = linearMatch[2].trim();
        const c2 = linearMatch[3]?.trim();

        setDirection(dir);
        if (c1) setColor1(c1);
        if (c2) setColor2(c2);
      }
      setMode('gradient');
    } else if (value !== 'transparent') {
      setSolidColor(value);
      setMode('solid');
    } else if (value === 'transparent') {
      setSolidColor('transparent');
      setMode('solid');
    }
  }, [value]);

  // Actualizar el padre cuando cambian los valores locales
  // OPTIMIZADO: Solo se ejecuta cuando realmente hay cambios intencionados
  const handleColorChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleModeChange = (newMode: 'solid' | 'gradient') => {
    setMode(newMode);
    if (newMode === 'solid') {
      handleColorChange(solidColor);
    } else {
      const gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
      handleColorChange(gradient);
    }
  };

  const handleSolidColorChange = (newColor: string) => {
    setSolidColor(newColor);
    handleColorChange(newColor);
  };

  const handleGradientChange = (newDirection?: string, newColor1?: string, newColor2?: string) => {
    const finalDirection = newDirection || direction;
    const finalColor1 = newColor1 || color1;
    const finalColor2 = newColor2 || color2;
    
    if (newDirection) setDirection(newDirection);
    if (newColor1) setColor1(newColor1);
    if (newColor2) setColor2(newColor2);
    
    const gradient = `linear-gradient(${finalDirection}, ${finalColor1}, ${finalColor2})`;
    handleColorChange(gradient);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
        {label}
      </label>

      {/* Selector de modo */}
      <div className="flex space-x-2 mb-4">
        {allowTransparent && (
          <button
            onClick={() => {
              setSolidColor('transparent');
              setMode('solid');
              handleColorChange('transparent');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              solidColor === 'transparent' && mode === 'solid'
                ? 'bg-gray-600 dark:bg-gray-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            🔲 Transparente
          </button>
        )}
        <button
          onClick={() => handleModeChange('solid')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'solid' && solidColor !== 'transparent'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          🎨 Color Sólido
        </button>
        <button
          onClick={() => handleModeChange('gradient')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'gradient'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          🌈 Gradiente
        </button>
      </div>

      {/* Vista previa */}
      <div
        className="w-full h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600 mb-4"
        style={{
          background: mode === 'solid'
            ? solidColor === 'transparent'
              ? 'repeating-linear-gradient(45deg, #ccc, #ccc 10px, #fff 10px, #fff 20px)'
              : solidColor
            : `linear-gradient(${direction}, ${color1}, ${color2})`
        }}
        title="Vista previa"
      />

      {/* Controles según el modo */}
      {mode === 'solid' && solidColor !== 'transparent' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
              Selecciona el Color
            </label>
            <div className="flex space-x-3">
              <input
                type="color"
                value={solidColor}
                onChange={(e) => handleSolidColorChange(e.target.value)}
                className="w-14 h-14 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                value={solidColor}
                onChange={(e) => handleSolidColorChange(e.target.value)}
                className="flex-1 px-4 py-3 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="#8B5CF6"
              />
            </div>
          </div>
        </div>
      ) : mode === 'gradient' ? (
        <div className="space-y-4">
          {/* Color 1 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
              🎨 Color Inicio
            </label>
            <div className="flex space-x-3">
              <input
                type="color"
                value={color1}
                onChange={(e) => handleGradientChange(undefined, e.target.value, undefined)}
                className="w-14 h-14 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                value={color1}
                onChange={(e) => handleGradientChange(undefined, e.target.value, undefined)}
                className="flex-1 px-4 py-3 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="#8B5CF6"
              />
            </div>
          </div>

          {/* Color 2 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
              🎨 Color Final
            </label>
            <div className="flex space-x-3">
              <input
                type="color"
                value={color2}
                onChange={(e) => handleGradientChange(undefined, undefined, e.target.value)}
                className="w-14 h-14 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                value={color2}
                onChange={(e) => handleGradientChange(undefined, undefined, e.target.value)}
                className="flex-1 px-4 py-3 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="#06B6D4"
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
              ↗️ Dirección del Gradiente
            </label>
            <select
              value={direction}
              onChange={(e) => handleGradientChange(e.target.value, undefined, undefined)}
              className="w-full px-4 py-3 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {GRADIENT_DIRECTIONS.map(dir => (
                <option key={dir.value} value={dir.value}>
                  {dir.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ColorOrGradientPicker;
