/**
 * 🎨 Indicador Visual de Contraste
 * 
 * Muestra el nivel de contraste actual y warnings en tiempo real
 */

import React from 'react';
import { validateContrast } from '../../utils/colorValidator';

interface ContrastIndicatorProps {
  textColor: string;
  backgroundColor: string;
  label: string;
}

const ContrastIndicator: React.FC<ContrastIndicatorProps> = ({
  textColor,
  backgroundColor,
  label
}) => {
  const validation = validateContrast(textColor, backgroundColor);
  
  // Colores del indicador según el nivel
  const getLevelColor = () => {
    switch (validation.level) {
      case 'AAA':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300';
      case 'AA':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300';
      case 'A':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300';
      case 'FAIL':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300';
    }
  };
  
  const getIcon = () => {
    switch (validation.level) {
      case 'AAA':
        return '✅';
      case 'AA':
        return '✔️';
      case 'A':
        return '⚠️';
      case 'FAIL':
        return '❌';
      default:
        return '❓';
    }
  };
  
  return (
    <div className="mt-2 space-y-1">
      {/* Indicador principal */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${getLevelColor()}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{getIcon()}</span>
          <div>
            <p className="text-xs font-medium">{label}</p>
            <p className="text-xs opacity-75">
              Contraste: {validation.contrast.toFixed(2)}:1
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold">{validation.level}</span>
        </div>
      </div>
      
      {/* Warning/Sugerencia */}
      {validation.warning && (
        <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-xs text-red-700 dark:text-red-300">
            {validation.warning}
          </p>
        </div>
      )}
      
      {validation.suggestion && (
        <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {validation.suggestion}
          </p>
        </div>
      )}
      
      {/* Vista previa del texto */}
      <div 
        className="px-3 py-2 rounded-lg border-2"
        style={{ 
          backgroundColor,
          borderColor: 'transparent'
        }}
      >
        <p 
          className="text-sm font-medium"
          style={{ color: textColor }}
        >
          Vista previa: {label}
        </p>
      </div>
    </div>
  );
};

export default ContrastIndicator;
