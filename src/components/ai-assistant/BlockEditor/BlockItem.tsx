/**
 * 📄 BlockItem
 * Componente individual para cada bloque (text, list-item, faq-item)
 * Editable, draggable, eliminable
 */

import React, { useState } from 'react';
import { GripVertical, Trash2, Edit2, Check, X, Save } from 'lucide-react';
import type { Block } from './types';

interface BlockItemProps {
  block: Block;
  index: number;
  onUpdate: (id: string, updates: Partial<Block>) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

const BlockItem: React.FC<BlockItemProps> = ({
  block,
  index,
  onUpdate,
  onDelete,
  isDragging = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<any>({});

  const handleStartEdit = () => {
    setIsEditing(true);
    if (block.type === 'faq-item') {
      setEditValue({
        question: block.question,
        answer: block.answer
      });
    } else {
      setEditValue({ content: block.content });
    }
  };

  const handleSaveEdit = () => {
    onUpdate(block.id, editValue);
  };

  const handleSaveAndClose = () => {
    onUpdate(block.id, editValue);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue({});
  };

  // Render según tipo de bloque
  const renderContent = () => {
    if (isEditing) {
      if (block.type === 'faq-item') {
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Pregunta</label>
              <input
                type="text"
                value={editValue.question || ''}
                onChange={(e) => setEditValue({ ...editValue, question: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="¿Pregunta frecuente?"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Respuesta</label>
              <textarea
                value={editValue.answer || ''}
                onChange={(e) => setEditValue({ ...editValue, answer: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Respuesta clara y concisa..."
              />
            </div>
          </div>
        );
      } else {
        return (
          <textarea
            value={editValue.content || ''}
            onChange={(e) => setEditValue({ ...editValue, content: e.target.value })}
            rows={block.type === 'text' ? 3 : 2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder={block.type === 'list-item' ? 'Elemento de lista...' : 'Texto descriptivo...'}
          />
        );
      }
    }

    // Modo vista
    if (block.type === 'faq-item') {
      return (
        <div className="space-y-2">
          <p className="font-medium text-gray-900 dark:text-white text-sm">❓ {block.question}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm pl-5">{block.answer}</p>
        </div>
      );
    } else if (block.type === 'list-item') {
      return (
        <p className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2">
          <span className="text-purple-600 dark:text-purple-400 flex-shrink-0">{block.icon || '•'}</span>
          <span>{block.content}</span>
        </p>
      );
    } else {
      return <p className="text-gray-700 dark:text-gray-300 text-sm">{block.content}</p>;
    }
  };

  return (
    <div
      className={`
        group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all
        ${isDragging ? 'opacity-50 scale-95' : 'hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md dark:hover:shadow-lg'}
      `}
    >
      {/* Drag Handle */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Contenido */}
      <div className="ml-6 mr-20">
        {renderContent()}
      </div>

      {/* Acciones */}
      <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-opacity ${
        isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
              title="Guardar (mantener editando)"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              title="Guardar y cerrar editor"
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Cancelar cambios"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleStartEdit}
              className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              title="Editar"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(block.id)}
              className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Número de orden */}
      <div className="absolute left-2 top-2 w-5 h-5 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 font-medium">
        {index + 1}
      </div>
    </div>
  );
};

export default BlockItem;
