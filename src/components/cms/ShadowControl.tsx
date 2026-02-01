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
}) => {
  const parseShadow = (shadowStr: string): { x: number; y: number; blur: number; spread: number; color: string; opacity: number } => {
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const shadow = spread > 0
          ? `${x}px ${y}px ${blur}px ${spread}px rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${opacity.toFixed(2)})`
          : `${x}px ${y}px ${blur}px rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${opacity.toFixed(2)})`;
        onChange(shadow);
      }
    }, 300);
  };

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
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>

      {/* Preview */}
      <div className="relative h-14 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
        <div
          className="w-24 h-10 bg-white dark:bg-gray-700 rounded-lg"
          style={{ boxShadow: value }}
        />
      </div>

      {/* Controles */}
      <div className="grid grid-cols-2 gap-3">
        {/* Desplazamiento X */}
        <div>
          <div className="flex justify-between items-center mb-0.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Horizontal
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
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
          <div className="flex justify-between items-center mb-0.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Vertical
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
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
          <div className="flex justify-between items-center mb-0.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Desenfoque
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
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
          <div className="flex justify-between items-center mb-0.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Tamaño
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
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
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium mb-0.5 text-gray-600 dark:text-gray-300">
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
              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={rgbToHex(color)}
              onChange={(e) => {
                setColor(hexToRgb(e.target.value));
                setTimeout(updateShadow, 0);
              }}
              className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-0.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Opacidad
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-2"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{value}</code>
      </p>
    </div>
  );
};

export default ShadowControl;
