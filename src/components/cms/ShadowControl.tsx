import React, { useState, useEffect, useRef } from 'react';

interface ShadowControlProps {
  value: string;
  onChange: (shadow: string) => void;
  label: string;
  darkMode?: boolean;
}

const ShadowControl: React.FC<ShadowControlProps> = ({
  value,
  onChange,
  label,
  darkMode = false
}) => {
  // Parsear el valor de sombra CSS
  const parseShadow = (shadowStr: string): { x: number; y: number; blur: number; spread: number; color: string; opacity: number } => {
    // Formato: "0 8px 32px rgba(0, 0, 0, 0.1)" o "0 8px 32px 0px rgba(0, 0, 0, 0.1)"
    const match = shadowStr.match(/([-\d]+)px\s+([-\d]+)px\s+([-\d]+)px(?:\s+([-\d]+)px)?\s+rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);

    if (match) {
      return {
        x: parseInt(match[1]),
        y: parseInt(match[2]),
        blur: parseInt(match[3]),
        spread: match[4] ? parseInt(match[4]) : 0,
        color: `rgb(${match[5]}, ${match[6]}, ${match[7]})`,
        opacity: match[8] ? parseFloat(match[8]) : 1
      };
    }

    // Valores por defecto
    return { x: 0, y: 8, blur: 32, spread: 0, color: 'rgb(0, 0, 0)', opacity: 0.1 };
  };

  const parsed = parseShadow(value);
  const [x, setX] = useState(parsed.x);
  const [y, setY] = useState(parsed.y);
  const [blur, setBlur] = useState(parsed.blur);
  const [spread, setSpread] = useState(parsed.spread);
  const [color, setColor] = useState(parsed.color);
  const [opacity, setOpacity] = useState(parsed.opacity);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const parsed = parseShadow(value);
    setX(parsed.x);
    setY(parsed.y);
    setBlur(parsed.blur);
    setSpread(parsed.spread);
    setColor(parsed.color);
    setOpacity(parsed.opacity);
  }, [value]);

  const updateShadow = () => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Esperar 300ms antes de llamar onChange
    timeoutRef.current = window.setTimeout(() => {
      // Extraer RGB del color
      const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const shadow = spread > 0
          ? `${x}px ${y}px ${blur}px ${spread}px rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${opacity.toFixed(2)})`
          : `${x}px ${y}px ${blur}px rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${opacity.toFixed(2)})`;
        onChange(shadow);
      }
    }, 300);
  };

  // Convertir RGB a hex para el color picker
  const rgbToHex = (rgb: string): string => {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    return '#000000';
  };

  const hexToRgb = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="space-y-4">
      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        {label}
      </label>

      {/* Preview */}
      <div className="relative h-24 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
        <div
          className="w-32 h-16 bg-white dark:bg-gray-700 rounded-lg"
          style={{ boxShadow: value }}
        />
      </div>

      {/* Controles */}
      <div className="grid grid-cols-2 gap-4">
        {/* Desplazamiento X */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Horizontal
            </label>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {x}px
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={x}
            onChange={(e) => {
              setX(parseInt(e.target.value));
              setTimeout(updateShadow, 0);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        {/* Desplazamiento Y */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Vertical
            </label>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {y}px
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={y}
            onChange={(e) => {
              setY(parseInt(e.target.value));
              setTimeout(updateShadow, 0);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        {/* Desenfoque */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Desenfoque
            </label>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {blur}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={blur}
            onChange={(e) => {
              setBlur(parseInt(e.target.value));
              setTimeout(updateShadow, 0);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        {/* Extensión */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Tamaño
            </label>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {spread}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={spread}
            onChange={(e) => {
              setSpread(parseInt(e.target.value));
              setTimeout(updateShadow, 0);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Color y Opacidad */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={rgbToHex(color)}
              onChange={(e) => {
                setColor(hexToRgb(e.target.value));
                setTimeout(updateShadow, 0);
              }}
              className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={rgbToHex(color)}
              onChange={(e) => {
                setColor(hexToRgb(e.target.value));
                setTimeout(updateShadow, 0);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <label className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Opacidad
            </label>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {Math.round(opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => {
              setOpacity(parseFloat(e.target.value));
              setTimeout(updateShadow, 0);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-3"
          />
        </div>
      </div>

      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Resultado: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{value}</code>
      </p>
    </div>
  );
};

export default ShadowControl;
