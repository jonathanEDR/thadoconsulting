/**
 * 🚀 Quick Action Button
 * Botón interactivo para ejecutar acciones rápidas sugeridas por el agente
 * 
 * Características:
 * - Diseño atractivo con iconos contextuales
 * - Estados de carga y confirmación
 * - Tooltips explicativos
 * - Animaciones suaves
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Edit3, 
  BarChart3, 
  DollarSign, 
  Briefcase,
  Check,
  Loader2
} from 'lucide-react';

export interface QuickAction {
  action: string;
  label: string;
  description?: string;
  data?: any;
  variant?: 'primary' | 'secondary' | 'success' | 'info';
  requiresConfirmation?: boolean;
}

interface QuickActionButtonProps {
  quickAction: QuickAction;
  onExecute: (action: string, data?: any) => Promise<void>;
  disabled?: boolean;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  quickAction,
  onExecute,
  disabled = false
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Obtener icono según el tipo de acción
  const getIcon = () => {
    const iconClass = "h-4 w-4";
    
    switch (quickAction.action) {
      case 'create_service':
        return <Plus className={iconClass} />;
      case 'edit_service':
        return <Edit3 className={iconClass} />;
      case 'analyze_service':
        return <BarChart3 className={iconClass} />;
      case 'suggest_pricing':
        return <DollarSign className={iconClass} />;
      case 'analyze_portfolio':
        return <Briefcase className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  // Obtener colores según variante
  const getVariantClasses = () => {
    if (isCompleted) {
      return 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100';
    }

    switch (quickAction.variant) {
      case 'primary':
        return 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-blue-100 hover:border-purple-400';
      case 'secondary':
        return 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400';
      case 'success':
        return 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400';
      case 'info':
        return 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400';
      default:
        return 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400';
    }
  };

  const handleClick = async () => {
    if (disabled || isExecuting) return;

    // Si requiere confirmación y no se ha confirmado aún
    if (quickAction.requiresConfirmation && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setIsExecuting(true);
    setShowConfirmation(false);

    try {
      await onExecute(quickAction.action, quickAction.data);
      
      // Mostrar estado completado
      setIsCompleted(true);
      setTimeout(() => {
        setIsCompleted(false);
      }, 3000);
    } catch (error) {
      console.error('Error executing quick action:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        disabled={disabled || isExecuting}
        className={`
          w-full flex items-center justify-between gap-3 p-3 rounded-lg border-2 
          transition-all duration-200 shadow-sm hover:shadow-md
          disabled:opacity-50 disabled:cursor-not-allowed
          ${getVariantClasses()}
        `}
        title={quickAction.description}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {isExecuting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isCompleted ? (
              <Check className="h-4 w-4" />
            ) : (
              getIcon()
            )}
          </div>
          
          <div className="flex-1 text-left min-w-0">
            <span className="font-medium text-sm block truncate">
              {isCompleted ? '✓ Completado' : quickAction.label}
            </span>
            {quickAction.description && !isCompleted && (
              <span className="text-xs opacity-75 block truncate">
                {quickAction.description}
              </span>
            )}
          </div>
        </div>

        {/* Indicador de acción */}
        {!isExecuting && !isCompleted && (
          <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
            <Sparkles className="h-3 w-3" />
          </div>
        )}
      </button>

      {/* Modal de confirmación */}
      {showConfirmation && (
        <div className="absolute inset-0 z-10 bg-white rounded-lg border-2 border-purple-400 shadow-lg p-3 animate-fadeIn">
          <p className="text-sm text-gray-700 mb-3 font-medium">
            ¿Confirmas esta acción?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleClick}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md text-xs font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Sí, ejecutar
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-300 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionButton;
