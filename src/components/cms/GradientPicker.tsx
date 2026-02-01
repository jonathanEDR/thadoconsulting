import React, { useState, useRef, useEffect } from 'react';

interface GradientPickerProps {
  value: string;
  onChange: (gradient: string) => void;
  label: string;
  darkMode?: boolean;
}

const GradientPicker: React.FC<GradientPickerProps> = ({
  value,
  onChange,
  label,
}) => {
  const extractColors = (gradient: string): [string, string, string] => {
    const colorRegex = /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgba?\([^)]+\)/g;
    const matches = gradient.match(colorRegex);

    if (matches && matches.length >= 2) {
      return [matches[0], matches[1], '135deg'];
    }

    return ['#8B5CF6', '#06B6D4', '135deg'];
  };

  const extractAngle = (gradient: string): string => {
    const angleMatch = gradient.match(/(\d+)deg/);
    return angleMatch ? angleMatch[1] + 'deg' : '135deg';
  };

  const [color1, setColor1] = useState(extractColors(value)[0]);
  const [color2, setColor2] = useState(extractColors(value)[1]);
  const [angle, setAngle] = useState(extractAngle(value));
  const [isSolid, setIsSolid] = useState(!value.includes('gradient'));
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const newColors = extractColors(value);
    const newAngle = extractAngle(value);
    const newIsSolid = !value.includes('gradient');

    setColor1(newColors[0]);
    setColor2(newColors[1]);
    setAngle(newAngle);
    setIsSolid(newIsSolid);
  }, [value]);

  const updateGradient = (newColor1?: string, newColor2?: string, newAngle?: string, solid?: boolean) => {
    const c1 = newColor1 || color1;
    const c2 = newColor2 || color2;
    const a = newAngle || angle;
    const s = solid !== undefined ? solid : isSolid;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      if (s) {
        onChange(c1);
      } else {
        onChange(`linear-gradient(${a}, ${c1}, ${c2})`);
      }
    }, 300);
  };

  const handleColor1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor1(newColor);
    updateGradient(newColor, undefined, undefined, undefined);
  };

  const handleColor2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor2(newColor);
    updateGradient(undefined, newColor, undefined, undefined);
  };

  const handleAngleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAngle = e.target.value;
    setAngle(newAngle);
    updateGradient(undefined, undefined, newAngle, undefined);
  };

  const handleTypeChange = (solid: boolean) => {
    setIsSolid(solid);
    updateGradient(undefined, undefined, undefined, solid);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>

      {/* Tipo: Sólido o Degradado */}
      <div className="flex gap-3 mb-1">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            checked={isSolid}
            onChange={() => handleTypeChange(true)}
            className="mr-1.5"
          />
          <span className="text-xs text-gray-700 dark:text-gray-300">
            Sólido
          </span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            checked={!isSolid}
            onChange={() => handleTypeChange(false)}
            className="mr-1.5"
          />
          <span className="text-xs text-gray-700 dark:text-gray-300">
            Degradado
          </span>
        </label>
      </div>

      {/* Selectores de color */}
      <div className="flex gap-2 items-center">
        <div className="flex-1 w-full min-w-0">
          <div className="flex gap-2 items-center w-full min-w-0">
            <input
              type="color"
              value={color1}
              onChange={handleColor1Change}
              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={color1}
              onChange={handleColor1Change}
              className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
              placeholder="#8B5CF6"
            />
          </div>
        </div>

        {!isSolid && (
          <>
            <span className="text-sm text-gray-600 dark:text-gray-400">→</span>
            <div className="flex-1 w-full min-w-0">
              <div className="flex gap-2 items-center w-full min-w-0">
                <input
                  type="color"
                  value={color2}
                  onChange={handleColor2Change}
                  className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={color2}
                  onChange={handleColor2Change}
                  className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                  placeholder="#06B6D4"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dirección del degradado */}
      {!isSolid && (
        <select
          value={angle}
          onChange={handleAngleChange}
          className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
        >
          <option value="0deg">↓ Arriba a Abajo (0°)</option>
          <option value="45deg">↘ Diagonal (45°)</option>
          <option value="90deg">→ Izq a Der (90°)</option>
          <option value="135deg">↘ Diagonal (135°)</option>
          <option value="180deg">↑ Abajo a Arriba (180°)</option>
          <option value="225deg">↖ Diagonal (225°)</option>
          <option value="270deg">← Der a Izq (270°)</option>
          <option value="315deg">↗ Diagonal (315°)</option>
        </select>
      )}

      {/* Preview */}
      <div
        className="h-6 rounded-lg border border-gray-300 dark:border-gray-600"
        style={{
          background: isSolid ? color1 : `linear-gradient(${angle}, ${color1}, ${color2})`
        }}
      />
    </div>
  );
};

export default GradientPicker;
