// Componente simplificado para crear gradientes de 2 colores
import React, { useState, useEffect } from 'react';

interface GradientSelectorProps {
  value: string;
  onChange: (gradient: string) => void;
  label: string;
  className?: string;
}

const GRADIENT_DIRECTIONS = [
  { name: 'Horizontal →', value: '90deg' },
  { name: 'Vertical ↓', value: '180deg' },
  { name: 'Diagonal ↘', value: '135deg' },
  { name: 'Diagonal ↙', value: '45deg' }
];

export const GradientSelector: React.FC<GradientSelectorProps> = ({
  value,
  onChange,
  label,
  className = ''
}) => {
  const [direction, setDirection] = useState('90deg');
  const [color1, setColor1] = useState('#8B5CF6');
  const [color2, setColor2] = useState('#06B6D4');

  // Parsear el gradient actual para extraer colores y dirección
  useEffect(() => {
    if (value && value.includes('gradient')) {
      const linearMatch = value.match(/linear-gradient\(([^,]+),\s*([^,\)]+),?\s*([^)]*)\)/);
      if (linearMatch) {
        const dir = linearMatch[1].trim();
        const c1 = linearMatch[2].trim();
        const c2 = linearMatch[3]?.trim();

        setDirection(dir);
        if (c1) setColor1(c1);
        if (c2) setColor2(c2);
      }
    } else if (value) {
      // Si es un color sólido, usarlo como color1
      setColor1(value);
    }
  }, []);

  // Generar y actualizar gradiente cuando cambian los valores
  useEffect(() => {
    const gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
    onChange(gradient);
  }, [color1, color2, direction]);

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>

      {/* Vista previa del gradiente */}
      <div
        className="w-full h-16 rounded-lg border-2 border-gray-300 mb-4"
        style={{ background: `linear-gradient(${direction}, ${color1}, ${color2})` }}
        title="Vista previa del gradiente"
      />

      {/* Selector de 2 colores - SIMPLE */}
      <div className="space-y-4">
        {/* Color 1 */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            🎨 Color Inicio
          </label>
          <div className="flex space-x-3">
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="w-14 h-14 rounded-lg cursor-pointer border-2 border-gray-300"
            />
            <input
              type="text"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="flex-1 px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="#8B5CF6"
            />
          </div>
        </div>

        {/* Color 2 */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            🎨 Color Final
          </label>
          <div className="flex space-x-3">
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="w-14 h-14 rounded-lg cursor-pointer border-2 border-gray-300"
            />
            <input
              type="text"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="flex-1 px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="#06B6D4"
            />
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            ↗️ Dirección del Gradiente
          </label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          >
            {GRADIENT_DIRECTIONS.map(dir => (
              <option key={dir.value} value={dir.value}>
                {dir.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default GradientSelector;