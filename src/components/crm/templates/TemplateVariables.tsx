/**
 * 🔤 TEMPLATE VARIABLES - Panel de Variables
 * Componente para mostrar y gestionar variables disponibles
 */

import React, { useState } from 'react';
import type { TemplateVariable } from '../../../types/message.types';
import { DEFAULT_TEMPLATE_VARIABLES } from '../../../types/message.types';

interface TemplateVariablesProps {
  onInsert?: (variableName: string) => void;
  content?: string;
  compact?: boolean;
  showExamples?: boolean;
  highlightUsed?: boolean;
}

/**
 * 🎨 Componente TemplateVariables
 */
export const TemplateVariables: React.FC<TemplateVariablesProps> = ({
  onInsert,
  content = '',
  compact = false,
  showExamples = true,
  highlightUsed = true,
}) => {
  // ========================================
  // 📊 STATE
  // ========================================

  const [expandedVar, setExpandedVar] = useState<string | null>(null);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  // ========================================
  // 🔄 HANDLERS
  // ========================================

  const handleInsert = (variableName: string) => {
    if (onInsert) {
      onInsert(variableName);
    }
  };

  const handleCopy = async (variable: string) => {
    try {
      await navigator.clipboard.writeText(variable);
      setCopiedVar(variable);
      setTimeout(() => setCopiedVar(null), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  const toggleExpand = (variableName: string) => {
    setExpandedVar(expandedVar === variableName ? null : variableName);
  };

  // ========================================
  // 📊 UTILIDADES
  // ========================================

  const isVariableUsed = (variableName: string): boolean => {
    if (!highlightUsed || !content) return false;
    return content.includes(`{${variableName}}`);
  };

  const getUsageCount = (variableName: string): number => {
    if (!content) return 0;
    const regex = new RegExp(`\\{${variableName}\\}`, 'g');
    const matches = content.match(regex);
    return matches ? matches.length : 0;
  };

  const getVariablesUsadas = (): string[] => {
    if (!content) return [];
    const matches = content.match(/\{([^}]+)\}/g);
    if (!matches) return [];
    return [...new Set(matches.map((m) => m.slice(1, -1)))];
  };

  const getVariablesDisponibles = (): string[] => {
    return DEFAULT_TEMPLATE_VARIABLES.map((v) => v.nombre);
  };

  const getVariablesNoUsadas = (): string[] => {
    const usadas = getVariablesUsadas();
    return getVariablesDisponibles().filter((v) => !usadas.includes(v));
  };

  // ========================================
  // 🎨 RENDER HELPERS
  // ========================================

  const renderVariableCard = (variable: TemplateVariable) => {
    const isUsed = isVariableUsed(variable.nombre);
    const usageCount = getUsageCount(variable.nombre);
    const isExpanded = expandedVar === variable.nombre;
    const isCopied = copiedVar === variable.variable;

    return (
      <div
        key={variable.nombre}
        className={`p-3 rounded-lg border transition-all ${
          isUsed
            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                {variable.variable}
              </code>
              {variable.requerida && (
                <span className="text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
                  Requerida
                </span>
              )}
              {isUsed && (
                <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                  ✓ Usada {usageCount > 1 ? `(${usageCount}x)` : ''}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {variable.descripcion}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {onInsert && (
              <button
                onClick={() => handleInsert(variable.nombre)}
                className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                title="Insertar variable"
              >
                <span className="text-sm">➕</span>
              </button>
            )}
            <button
              onClick={() => handleCopy(variable.variable)}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Copiar variable"
            >
              <span className="text-sm">{isCopied ? '✓' : '📋'}</span>
            </button>
            {showExamples && (
              <button
                onClick={() => toggleExpand(variable.nombre)}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title={isExpanded ? 'Ocultar ejemplo' : 'Ver ejemplo'}
              >
                <span className="text-sm">{isExpanded ? '🔽' : '▶️'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Ejemplo expandido */}
        {isExpanded && showExamples && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Ejemplo:
            </p>
            <code className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded block">
              {variable.ejemplo}
            </code>
          </div>
        )}
      </div>
    );
  };

  // ========================================
  // 🎨 RENDER PRINCIPAL
  // ========================================

  const variablesUsadas = getVariablesUsadas();
  const variablesNoUsadas = getVariablesNoUsadas();

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_TEMPLATE_VARIABLES.map((v) => {
            const isUsed = isVariableUsed(v.nombre);
            return (
              <button
                key={v.nombre}
                onClick={() => onInsert && handleInsert(v.nombre)}
                className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                  isUsed
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                }`}
                title={v.descripcion}
                disabled={!onInsert}
              >
                {v.variable}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🔤</span>
            Variables Disponibles
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Click para insertar en el contenido
          </p>
        </div>
        {content && (
          <div className="text-right">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <span className="text-green-600 dark:text-green-400 font-semibold">
                {variablesUsadas.length}
              </span>{' '}
              usadas
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {variablesNoUsadas.length} disponibles
            </div>
          </div>
        )}
      </div>

      {/* Mensaje de ayuda */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-900 dark:text-blue-300">
          💡 <strong>Tip:</strong> Las variables se reemplazarán automáticamente con los datos reales del lead al enviar el mensaje.
        </p>
      </div>

      {/* Lista de variables */}
      <div className="space-y-2">
        {DEFAULT_TEMPLATE_VARIABLES.map(renderVariableCard)}
      </div>

      {/* Variables inválidas detectadas */}
      {content && (() => {
        const variablesInvalidas = variablesUsadas.filter(
          (v) => !getVariablesDisponibles().includes(v)
        );
        if (variablesInvalidas.length === 0) return null;

        return (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-xs font-semibold text-red-900 dark:text-red-300 mb-2">
              ⚠️ Variables no reconocidas:
            </p>
            <div className="flex flex-wrap gap-2">
              {variablesInvalidas.map((v) => (
                <code
                  key={v}
                  className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded font-mono"
                >
                  {`{${v}}`}
                </code>
              ))}
            </div>
            <p className="text-xs text-red-700 dark:text-red-400 mt-2">
              Estas variables no se reemplazarán al enviar el mensaje.
            </p>
          </div>
        );
      })()}

      {/* Footer con shortcuts */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded"></span>
              <span>Usada</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded"></span>
              <span>Disponible</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>➕ Insertar</span>
            <span>•</span>
            <span>📋 Copiar</span>
            <span>•</span>
            <span>▶️ Ver ejemplo</span>
          </div>
        </div>
      </div>

      {/* Sintaxis de uso */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
          📖 Sintaxis de variables:
        </p>
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-start gap-2">
            <span>✓</span>
            <div>
              <code className="text-green-600 dark:text-green-400">{'{nombre}'}</code>
              <span className="ml-2">- Correcto</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span>✗</span>
            <div>
              <code className="text-red-600 dark:text-red-400">{'{ nombre }'}</code>
              <span className="ml-2">- Incorrecto (con espacios)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span>✗</span>
            <div>
              <code className="text-red-600 dark:text-red-400">{'{{nombre}}'}</code>
              <span className="ml-2">- Incorrecto (dobles llaves)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateVariables;
