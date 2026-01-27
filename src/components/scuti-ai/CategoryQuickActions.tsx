/**
 * CategoryQuickActions Component
 * Muestra acciones rápidas contextuales según la categoría seleccionada
 */

import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { CategoryType } from '../../types/scuti-ai';
import { CATEGORY_CONFIGS } from '../../types/scuti-ai';

interface CategoryQuickActionsProps {
  category: CategoryType;
  onBack: () => void;
  onActionClick: (prompt: string) => void;
  disabled?: boolean;
}

const CategoryQuickActions: React.FC<CategoryQuickActionsProps> = ({
  category,
  onBack,
  onActionClick,
  disabled = false
}) => {
  const config = CATEGORY_CONFIGS[category];

  if (!config) return null;

  return (
    <div className="p-4 space-y-3">
      {/* Header compacto con botón de regreso */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Volver</span>
        </button>
      </div>

      {/* Título de categoría compacto */}
      <div className={`${config.bgColor} rounded-lg p-3`}>
        <div className="flex items-center gap-2">
          <div className="text-xl">{config.emoji}</div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {config.title}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {config.description}
            </p>
          </div>
        </div>
      </div>

      {/* Acciones rápidas contextuales - MÁS COMPACTO */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles size={14} className="text-purple-600" />
          <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Acciones disponibles
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {config.actions.map((action, index) => (
            <button
              key={index}
              onClick={() => onActionClick(action.prompt)}
              disabled={disabled}
              className={`
                ${action.color || 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}
                p-2.5 rounded-lg text-left transition-all
                transform hover:scale-105 hover:shadow-sm
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                border border-transparent hover:border-gray-300 dark:hover:border-gray-600
              `}
            >
              <div className="flex items-start gap-2">
                <div className="text-lg flex-shrink-0">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-xs mb-0.5">
                    {action.label}
                  </h4>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">
                    "{action.prompt}"
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mensaje de ayuda compacto */}
      <div className="mt-3 p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex gap-2">
          <div className="text-sm text-purple-600 dark:text-purple-400">
            💡
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-700 dark:text-gray-300">
              También puedes escribir tu consulta personalizada abajo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryQuickActions;
