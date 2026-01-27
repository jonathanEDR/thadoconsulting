/**
 * 📋 TEMPLATE CARD - Tarjeta de Plantilla
 * Componente para mostrar una plantilla de mensaje
 */

import React, { useState } from 'react';
import type { MessageTemplate } from '../../../types/message.types';
import { formatRelativeTime } from '../../../services/messageService';

interface TemplateCardProps {
  template: MessageTemplate;
  onSelect?: (template: MessageTemplate) => void;
  onEdit?: (template: MessageTemplate) => void;
  onDelete?: (templateId: string) => void;
  onToggleFavorite?: (templateId: string) => void;
  onDuplicate?: (template: MessageTemplate) => void;
  isSelected?: boolean;
  isFavorite?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  showActions?: boolean;
  compact?: boolean;
}

/**
 * 🎨 Componente TemplateCard
 */
export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite,
  onDuplicate,
  isSelected = false,
  isFavorite = false,
  canEdit = false,
  canDelete = false,
  showActions = true,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ========================================
  // 🔄 HANDLERS
  // ========================================

  const handleSelect = () => {
    if (onSelect) {
      onSelect(template);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(template);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm && onDelete) {
      await onDelete(template._id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(template._id);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDuplicate) {
      onDuplicate(template);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  // ========================================
  // 🎨 HELPERS DE ESTILO
  // ========================================

  const getTipoColor = () => {
    switch (template.tipo) {
      case 'nota_interna':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'mensaje_cliente':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'email':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'sms':
        return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getCategoriaLabel = () => {
    const labels: Record<string, string> = {
      bienvenida: '👋 Bienvenida',
      seguimiento: '📞 Seguimiento',
      cierre: '✅ Cierre',
      soporte: '🛠️ Soporte',
      general: '📋 General',
    };
    return labels[template.categoria] || template.categoria;
  };

  const getTipoLabel = () => {
    const labels: Record<string, string> = {
      nota_interna: '📝 Nota Interna',
      mensaje_cliente: '💬 Mensaje Cliente',
      email: '📧 Email',
      sms: '📱 SMS',
    };
    return labels[template.tipo] || template.tipo;
  };

  // Preview del contenido
  const contentPreview =
    template.contenido.length > 150
      ? template.contenido.substring(0, 150) + '...'
      : template.contenido;

  // ========================================
  // 🎨 RENDER COMPACT
  // ========================================

  if (compact) {
    return (
      <button
        onClick={handleSelect}
        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
              {template.titulo}
            </div>
            {template.descripcion && (
              <div className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">
                {template.descripcion}
              </div>
            )}
          </div>
          {isFavorite && <span className="text-yellow-500">⭐</span>}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className={`px-2 py-0.5 rounded ${getTipoColor()}`}>
            {getTipoLabel()}
          </span>
          <span>•</span>
          <span>{template.vecesUsada} usos</span>
        </div>
      </button>
    );
  }

  // ========================================
  // 🎨 RENDER FULL
  // ========================================

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-blue-500 shadow-lg'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      } ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={onSelect ? handleSelect : undefined}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {template.titulo}
              </h3>
              {isFavorite && (
                <span className="text-yellow-500 flex-shrink-0" title="Favorito">
                  ⭐
                </span>
              )}
              {template.esPrivada && (
                <span
                  className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded flex-shrink-0"
                  title="Plantilla privada"
                >
                  🔒
                </span>
              )}
              {!template.esActiva && (
                <span
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 text-xs rounded flex-shrink-0"
                  title="Plantilla desactivada"
                >
                  ⏸️ Inactiva
                </span>
              )}
            </div>

            {template.descripcion && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {template.descripcion}
              </p>
            )}
          </div>

          {/* Acciones rápidas */}
          {showActions && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {onToggleFavorite && (
                <button
                  onClick={handleToggleFavorite}
                  className="p-2 text-gray-400 hover:text-yellow-500 rounded transition-colors"
                  title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <span className="text-xl">{isFavorite ? '⭐' : '☆'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getTipoColor()}`}>
            {getTipoLabel()}
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
            {getCategoriaLabel()}
          </span>
          {template.etiquetas && template.etiquetas.length > 0 && (
            <>
              {template.etiquetas.slice(0, 3).map((etiqueta, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded"
                >
                  #{etiqueta}
                </span>
              ))}
              {template.etiquetas.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                  +{template.etiquetas.length - 3} más
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content Preview */}
      <div className="p-4">
        {template.asunto && (
          <div className="mb-2 text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Asunto:</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">{template.asunto}</span>
          </div>
        )}

        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {isExpanded ? template.contenido : contentPreview}
        </div>

        {template.contenido.length > 150 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isExpanded ? '▲ Ver menos' : '▼ Ver más'}
          </button>
        )}

        {/* Variables */}
        {template.variablesDisponibles && template.variablesDisponibles.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Variables disponibles:
            </div>
            <div className="flex flex-wrap gap-1">
              {template.variablesDisponibles.map((v, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded font-mono"
                  title={v.descripcion}
                >
                  {v.variable}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span>📊</span>
            <span>{template.vecesUsada} usos</span>
          </div>
          {template.ultimoUso && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span>🕒</span>
                <span>Usado {formatRelativeTime(template.ultimoUso)}</span>
              </div>
            </>
          )}
          <span>•</span>
          <div className="flex items-center gap-1">
            <span>👤</span>
            <span>{template.creadoPor.nombre}</span>
          </div>
        </div>

        {/* Acciones */}
        {showActions && (canEdit || canDelete || onDuplicate) && (
          <div className="flex items-center gap-1">
            {onDuplicate && (
              <button
                onClick={handleDuplicate}
                className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Duplicar plantilla"
              >
                📋 Duplicar
              </button>
            )}

            {canEdit && onEdit && (
              <button
                onClick={handleEdit}
                className="px-3 py-1.5 text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              >
                ✏️ Editar
              </button>
            )}

            {canDelete && onDelete && (
              <>
                {!showDeleteConfirm ? (
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 text-xs text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    🗑️ Eliminar
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleDelete}
                      className="px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                    >
                      ✓ Confirmar
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      ✖ Cancelar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
