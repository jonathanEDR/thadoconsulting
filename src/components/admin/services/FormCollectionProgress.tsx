/**
 * 📋 Form Collection Progress
 * Muestra el progreso de recopilación de datos conversacional
 * 
 * Características:
 * - Barra de progreso visual
 * - Lista de campos completados
 * - Campo actual destacado
 * - Animaciones suaves
 */

import React from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface FormCollectionProgressProps {
  progress: string; // "2/3"
  currentQuestion?: string;
  completedFields?: string[];
  isCollecting: boolean;
}

const FormCollectionProgress: React.FC<FormCollectionProgressProps> = ({
  progress,
  currentQuestion,
  completedFields = [],
  isCollecting
}) => {
  // Parsear progreso
  const [current, total] = progress.split('/').map(Number);
  const percentage = (current / total) * 100;

  return (
    <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4 mb-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isCollecting ? (
            <Loader2 className="h-4 w-4 text-purple-600 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <span className="text-sm font-semibold text-purple-900">
            {isCollecting ? 'Recopilando información' : 'Información completada'}
          </span>
        </div>
        <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
          {progress}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-purple-200 rounded-full h-2 mb-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Current Question */}
      {isCollecting && currentQuestion && (
        <div className="text-xs text-purple-700 mt-2">
          <span className="font-medium">Pregunta actual:</span> {currentQuestion}
        </div>
      )}

      {/* Completed Fields */}
      {completedFields.length > 0 && (
        <div className="mt-3 space-y-1">
          {completedFields.map((field, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-purple-600">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      {isCollecting && (
        <div className="mt-3 pt-3 border-t border-purple-200">
          <p className="text-xs text-purple-600 italic">
            💡 Tip: Responde cada pregunta para que el agente pueda crear tu servicio
          </p>
        </div>
      )}
    </div>
  );
};

export default FormCollectionProgress;
