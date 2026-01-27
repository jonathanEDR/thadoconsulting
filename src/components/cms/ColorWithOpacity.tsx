import React, { useState, useEffect, useRef } from 'react';

interface ColorWithOpacityProps {
  value: string;
  onChange: (rgba: string) => void;
  label: string;
  darkMode?: boolean;
}

const ColorWithOpacity: React.FC<ColorWithOpacityProps> = ({
  value,
  onChange,
  label,
  darkMode = false
}) => {
  // Parsear RGBA o color hex
  const parseColor = (colorString: string): { r: number; g: number; b: number; a: number; hex: string } => {
    // Si es rgba()
    if (colorString.startsWith('rgba')) {
      const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const a = match[4] ? parseFloat(match[4]) : 1;
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        return { r, g, b, a, hex };
      }
    }

    // Si es rgb()
    if (colorString.startsWith('rgb')) {
      const match = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        return { r, g, b, a: 1, hex };
      }
    }

    // Si es hex
    if (colorString.startsWith('#')) {
      const hex = colorString;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b, a: 1, hex };
    }

    // Default
    return { r: 0, g: 0, b: 0, a: 0.08, hex: '#000000' };
  };

  const parsed = parseColor(value);
  const [color, setColor] = useState(parsed.hex);
  const [opacity, setOpacity] = useState(parsed.a);
  const [isTransparent, setIsTransparent] = useState(value === 'transparent' || parsed.a === 0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const parsed = parseColor(value);
    setColor(parsed.hex);
    setOpacity(parsed.a);
    setIsTransparent(value === 'transparent' || parsed.a === 0);
  }, [value]);

  const updateColor = (newColor?: string, newOpacity?: number, transparent?: boolean) => {
    const c = newColor || color;
    const o = newOpacity !== undefined ? newOpacity : opacity;
    const t = transparent !== undefined ? transparent : isTransparent;

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Esperar 300ms antes de llamar onChange
    timeoutRef.current = window.setTimeout(() => {
      if (t) {
        onChange('transparent');
        return;
      }

      // Convertir hex a rgb
      const r = parseInt(c.slice(1, 3), 16);
      const g = parseInt(c.slice(3, 5), 16);
      const b = parseInt(c.slice(5, 7), 16);

      if (o === 1) {
        onChange(`rgb(${r}, ${g}, ${b})`);
      } else {
        onChange(`rgba(${r}, ${g}, ${b}, ${o.toFixed(2)})`);
      }
    }, 300);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    updateColor(newColor, undefined, undefined);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(e.target.value);
    setOpacity(newOpacity);
    updateColor(undefined, newOpacity, undefined);
  };

  const handleTransparentToggle = () => {
    const newTransparent = !isTransparent;
    setIsTransparent(newTransparent);
    updateColor(undefined, undefined, newTransparent);
  };

  return (
    <div className="space-y-3">
      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        {label}
      </label>

      {/* Toggle transparente */}
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isTransparent}
          onChange={handleTransparentToggle}
          className="mr-2"
        />
        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Fondo transparente
        </span>
      </label>

      {/* Color picker y valor */}
      {!isTransparent && (
        <div className="flex gap-2 items-center w-full min-w-0">
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={handleColorChange}
            className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            placeholder="#000000"
          />
        </div>
      )}

      {/* Slider de opacidad */}
      {!isTransparent && (
        <div>
          <div className="flex justify-between items-center mb-2">
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
            onChange={handleOpacityChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            style={{
              background: `linear-gradient(to right,
                transparent 0%,
                ${color} ${opacity * 100}%,
                #e5e7eb ${opacity * 100}%,
                #e5e7eb 100%)`
            }}
          />
        </div>
      )}

      {/* Preview */}
      <div className="relative h-12 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
        {/* Patrón de tablero de ajedrez para mostrar transparencia */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        />
        {/* Color con opacidad */}
        <div
          className="absolute inset-0"
          style={{
            background: isTransparent ? 'transparent' : `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`
          }}
        />
      </div>

      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Resultado: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{value}</code>
      </p>
    </div>
  );
};

export default ColorWithOpacity;
