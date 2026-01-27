/**
 * 🎨 BlockEditor
 * Editor principal para gestionar bloques de contenido
 * Soporta: agregar, editar, eliminar, reordenar, generar con IA
 */

import React, { useState } from 'react';
import { Plus, Sparkles, List, MessageSquare, FileText } from 'lucide-react';
import BlockItem from './BlockItem';
import type { Block, BlockType, BlockEditorConfig } from './types';

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  config: BlockEditorConfig;
  serviceContext?: {
    serviceId?: string;
    titulo?: string;
    descripcionCorta?: string;
    categoria?: string;
  };
  onGenerateWithAI?: () => void;
  isGenerating?: boolean;
}

const BlockEditor: React.FC<BlockEditorProps> = ({
  blocks,
  onChange,
  config,
  serviceContext,
  onGenerateWithAI,
  isGenerating = false
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Generar ID único
  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Agregar nuevo bloque
  const handleAddBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      order: blocks.length,
      ...(type === 'faq-item'
        ? { question: '', answer: '' }
        : { content: '', ...(type === 'list-item' ? { icon: '✓' } : {}) })
    } as Block;

    onChange([...blocks, newBlock]);
    setShowAddMenu(false);
  };

  // Actualizar bloque
  const handleUpdateBlock = (id: string, updates: Partial<Block>) => {
    onChange(
      blocks.map((block) =>
        block.id === id ? { ...block, ...updates } as Block : block
      )
    );
  };

  // Eliminar bloque
  const handleDeleteBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id));
  };

  // Iconos por tipo de bloque
  const blockTypeIcons = {
    text: <FileText className="h-4 w-4" />,
    'list-item': <List className="h-4 w-4" />,
    'faq-item': <MessageSquare className="h-4 w-4" />
  };

  const blockTypeLabels = {
    text: 'Párrafo',
    'list-item': 'Item de Lista',
    'faq-item': 'Pregunta FAQ'
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{config.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {blocks.length} {blocks.length === 1 ? 'bloque' : 'bloques'}
            {config.maxBlocks && ` (máx. ${config.maxBlocks})`}
          </p>
        </div>
        
        <div className="flex gap-2">
          {onGenerateWithAI && serviceContext?.serviceId && (
            <button
              onClick={onGenerateWithAI}
              disabled={isGenerating}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generando...' : 'Generar con IA'}
            </button>
          )}
        </div>
      </div>

      {/* Lista de Bloques */}
      {blocks.length > 0 && (
        <div className="space-y-2">
          {blocks
            .sort((a, b) => a.order - b.order)
            .map((block, index) => (
              <BlockItem
                key={block.id}
                block={block}
                index={index}
                onUpdate={handleUpdateBlock}
                onDelete={handleDeleteBlock}
              />
            ))}
        </div>
      )}

      {/* Empty State */}
      {blocks.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <List className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">No hay bloques todavía</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {config.placeholder || 'Agrega un bloque para comenzar'}
          </p>
        </div>
      )}

      {/* Botón Agregar Bloque */}
      {(!config.maxBlocks || blocks.length < config.maxBlocks) && (
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-full py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Agregar Bloque
          </button>

          {/* Menú de Tipos de Bloques */}
          {showAddMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowAddMenu(false)}
              />
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden">
                {config.allowedTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddBlock(type)}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="text-purple-600 dark:text-purple-400">{blockTypeIcons[type]}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {blockTypeLabels[type]}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {type === 'text' && 'Bloque de texto libre'}
                        {type === 'list-item' && 'Elemento de lista con icono'}
                        {type === 'faq-item' && 'Pregunta con respuesta'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Tips */}
      {blocks.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            💡 <strong>Tips:</strong> Arrastra los bloques para reordenar, 
            haz hover para ver las opciones de edición y eliminación.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlockEditor;
