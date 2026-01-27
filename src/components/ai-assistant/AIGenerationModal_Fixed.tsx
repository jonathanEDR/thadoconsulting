/**
 * 🎨 AIGenerationModal - VERSIÓN CORREGIDA
 * Modal para generar contenido con IA y copiar al portapapeles
 * 
 * FIXES APLICADOS:
 * ✅ Simplificado manejo de eventos de cierre
 * ✅ Removido stopPropagation redundante
 * ✅ Mejorado comportamiento del overlay
 * ✅ Agregado cleanup en unmount
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Sparkles, Copy, Check, RefreshCw, Loader2 } from 'lucide-react';
import { useAIGeneration } from './hooks/useAIGeneration';

interface AIGenerationModalProps {
  fieldName: string;
  fieldLabel: string;
  fieldType: 'title' | 'short_text' | 'long_text' | 'list' | 'faq' | 'promotional';
  currentValue?: string;
  serviceContext?: {
    serviceId?: string;
    titulo?: string;
    descripcionCorta?: string;
    categoria?: string;
  };
  onClose: () => void;
}

const AIGenerationModal: React.FC<AIGenerationModalProps> = ({
  fieldName,
  fieldLabel,
  fieldType,
  currentValue,
  serviceContext,
  onClose
}) => {
  const [selectedStyle, setSelectedStyle] = useState<'formal' | 'casual' | 'technical'>('formal');
  const [generatedContent, setGeneratedContent] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [copied, setCopied] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);

  const { generate, isGenerating, error } = useAIGeneration({
    fieldName,
    fieldType,
    serviceContext
  });

  // Estilos disponibles
  const styles = [
    { id: 'formal' as const, label: 'Formal', description: 'Profesional y corporativo' },
    { id: 'casual' as const, label: 'Casual', description: 'Amigable y cercano' },
    { id: 'technical' as const, label: 'Técnico', description: 'Detallado y específico' }
  ];

  // 🔧 FIX: Mejorado manejo de cierre
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return; // Prevenir múltiples llamadas
    isClosingRef.current = true;
    
    console.log('🔄 [AIGenerationModal] Cerrando modal...');
    
    try {
      onClose?.();
    } catch (error) {
      console.error('❌ [AIGenerationModal] Error al cerrar:', error);
    }
  }, [onClose]);

  // Cargar contenido actual si existe
  useEffect(() => {
    if (currentValue) {
      setGeneratedContent(currentValue);
      setEditedContent(currentValue);
    }
  }, [currentValue]);

  // 🔧 FIX: Manejo de ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClose]);

  // 🔧 FIX: Cleanup en unmount
  useEffect(() => {
    return () => {
      isClosingRef.current = false;
    };
  }, []);

  const handleGenerate = async () => {
    const result = await generate(selectedStyle);
    if (result.success) {
      setGeneratedContent(result.content);
      setEditedContent(result.content);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // 🔧 FIX: Simplificado manejo de click en overlay
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    // Solo cerrar si el click es directamente en el overlay, no en contenido
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // 🔧 FIX: Separado manejo de click en modal content
  const handleModalContentClick = useCallback((e: React.MouseEvent) => {
    // Prevenir que clicks dentro del modal cierren el modal
    e.stopPropagation();
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={handleModalContentClick}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-white" />
            <div>
              <h2 id="modal-title" className="text-xl font-bold text-white">Generar con IA</h2>
              <p className="text-sm text-purple-100">{fieldLabel}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Cerrar modal"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Selector de Estilo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Estilo de Escritura
            </label>
            <div className="grid grid-cols-3 gap-3">
              {styles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  disabled={isGenerating}
                  className={`p-3 rounded-lg border-2 text-center transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    selectedStyle === style.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                  } disabled:opacity-50`}
                >
                  <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    {style.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {style.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Botón Generar/Regenerar */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !serviceContext?.serviceId}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generando...
              </>
            ) : generatedContent ? (
              <>
                <RefreshCw className="h-5 w-5" />
                Regenerar
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generar Contenido
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Preview/Editor */}
          {generatedContent && !isGenerating && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contenido Generado (Editable)
                </label>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={fieldType === 'title' ? 2 : fieldType === 'short_text' ? 4 : 10}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="El contenido generado aparecerá aquí..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Puedes editar el contenido y luego copiarlo manualmente al campo
              </p>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Generando contenido con IA...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGenerationModal;