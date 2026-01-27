/**
 * CanvasEditor Component
 * Panel lateral para visualizar contenido generado por SCUTI AI
 * 
 * Modos:
 * - preview: Muestra contenido individual (blog/servicio)
 * - list: Muestra lista de items encontrados
 * - empty: Estado inicial sin contenido
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Maximize2, 
  FileText,
  List,
  Eye,
  MessageCircle,
  Columns,
  PanelLeftClose,
  PanelRightClose,
  GripVertical
} from 'lucide-react';
import type { CanvasContent, CanvasMode } from '../../types/scutiAI.types';

// ============================================
// TIPOS DE TAMAÑO DEL CANVAS
// ============================================

export type CanvasSize = 'small' | 'medium' | 'large' | 'full';

// ============================================
// PROPS
// ============================================

interface CanvasEditorProps {
  isVisible: boolean;
  isExpanded: boolean;
  mode: CanvasMode;
  content: CanvasContent | null;
  onClose: () => void;
  onToggleExpand: () => void;
  onItemClick?: (itemId: string, itemTitle?: string) => void;
  onEditClick?: (itemId: string) => void;
  // 🆕 Props para control de tamaño flexible
  canvasSize?: CanvasSize;
  onSizeChange?: (size: CanvasSize) => void;
  customWidth?: number; // Porcentaje personalizado (0-100)
  onWidthChange?: (width: number) => void;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  isVisible,
  isExpanded,
  mode,
  content,
  onClose,
  onToggleExpand: _onToggleExpand,
  onItemClick,
  onEditClick,
  canvasSize = 'medium',
  onSizeChange,
  customWidth,
  onWidthChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartWidth, setDragStartWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Efecto para manejar el arrastre - DEBE estar antes del early return
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current?.parentElement) return;
      
      const parentWidth = containerRef.current.parentElement.clientWidth;
      const deltaX = dragStartX - e.clientX;
      const deltaPercent = (deltaX / parentWidth) * 100;
      let newWidth = dragStartWidth + deltaPercent;
      
      // Limitar entre 20% y 80%
      newWidth = Math.max(20, Math.min(80, newWidth));
      
      if (onWidthChange) {
        onWidthChange(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartX, dragStartWidth, onWidthChange]);

  // 🔒 Early return DESPUÉS de todos los hooks
  if (!isVisible) return null;

  // Calcular ancho basado en el tamaño o ancho personalizado
  const getCanvasWidth = () => {
    if (customWidth !== undefined) {
      return `${customWidth}%`;
    }
    switch (canvasSize) {
      case 'small': return '25%';
      case 'medium': return '33.333%';
      case 'large': return '50%';
      case 'full': return '66.666%';
      default: return isExpanded ? '66.666%' : '33.333%';
    }
  };

  // Manejador de inicio de arrastre
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStartX(e.clientX);
    const parentWidth = containerRef.current?.parentElement?.clientWidth || window.innerWidth;
    const currentWidth = containerRef.current?.clientWidth || 0;
    setDragStartWidth((currentWidth / parentWidth) * 100);
  };

  // Cambiar a un tamaño preset
  const handleSizePreset = (size: CanvasSize) => {
    if (onSizeChange) {
      onSizeChange(size);
    }
    // También actualizar el ancho personalizado según el preset
    if (onWidthChange) {
      switch (size) {
        case 'small': onWidthChange(25); break;
        case 'medium': onWidthChange(33.333); break;
        case 'large': onWidthChange(50); break;
        case 'full': onWidthChange(66.666); break;
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{ width: getCanvasWidth() }}
      className={`relative border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col transition-all ${isDragging ? 'duration-0' : 'duration-300'}`}
    >
      {/* 🆕 Handle de resize draggable */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize group hover:bg-purple-500/50 transition-colors z-10 ${isDragging ? 'bg-purple-500' : ''}`}
      >
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 rounded bg-gray-200 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity ${isDragging ? 'opacity-100 bg-purple-500' : ''}`}>
          <GripVertical size={12} className="text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            {mode === 'preview' ? (
              <Eye size={18} className="text-white" />
            ) : mode === 'list' ? (
              <List size={18} className="text-white" />
            ) : mode === 'conversation' ? (
              <MessageCircle size={18} className="text-white" />
            ) : (
              <FileText size={18} className="text-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Canvas Editor
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {content?.title || 'Vista previa de contenido'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* 🆕 Botones de tamaño preset */}
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mr-2">
            <button
              onClick={() => handleSizePreset('small')}
              className={`p-1.5 transition-colors ${canvasSize === 'small' || (customWidth && customWidth <= 27) ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
              title="Pequeño (25%)"
            >
              <PanelRightClose size={14} />
            </button>
            <button
              onClick={() => handleSizePreset('medium')}
              className={`p-1.5 transition-colors border-l border-r border-gray-200 dark:border-gray-700 ${canvasSize === 'medium' || (customWidth && customWidth > 27 && customWidth <= 40) ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
              title="Mediano (33%)"
            >
              <Columns size={14} />
            </button>
            <button
              onClick={() => handleSizePreset('large')}
              className={`p-1.5 transition-colors border-r border-gray-200 dark:border-gray-700 ${canvasSize === 'large' || (customWidth && customWidth > 40 && customWidth <= 55) ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
              title="Grande (50%)"
            >
              <Maximize2 size={14} />
            </button>
            <button
              onClick={() => handleSizePreset('full')}
              className={`p-1.5 transition-colors ${canvasSize === 'full' || (customWidth && customWidth > 55) ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
              title="Máximo (66%)"
            >
              <PanelLeftClose size={14} />
            </button>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Cerrar"
          >
            <X size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-6">
        {mode === 'empty' || !content ? (
          <EmptyState />
        ) : mode === 'preview' ? (
          <PreviewMode content={content} onEditClick={onEditClick} onItemClick={onItemClick} />
        ) : mode === 'conversation' ? (
          <PreviewMode content={content} onEditClick={onEditClick} onItemClick={onItemClick} />
        ) : mode === 'suggestions' ? (
          <PreviewMode content={content} onEditClick={onEditClick} onItemClick={onItemClick} />
        ) : mode === 'list' ? (
          <ListMode content={content} onItemClick={onItemClick} />
        ) : (
          <PreviewMode content={content} onEditClick={onEditClick} onItemClick={onItemClick} />
        )}
      </div>

      {/* Footer con metadata */}
      {content?.metadata && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              {content.metadata.agentUsed && (
                <span>
                  <span className="font-medium">Agente:</span> {content.metadata.agentUsed}
                </span>
              )}
              {content.metadata.action && (
                <span>
                  <span className="font-medium">Acción:</span> {content.metadata.action}
                </span>
              )}
            </div>
            {content.metadata.timestamp && (
              <span>
                {new Date(content.metadata.timestamp).toLocaleString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: 'short'
                })}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// ESTADO VACÍO
// ============================================

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl flex items-center justify-center mb-4">
      <FileText size={32} className="text-purple-600 dark:text-purple-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      Canvas Editor
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
      Aquí aparecerá el contenido cuando SCUTI AI genere o encuentre blogs, servicios u otro contenido estructurado.
    </p>
  </div>
);

// ============================================
// MODO PREVIEW
// ============================================

const PreviewMode: React.FC<{ content: CanvasContent; onEditClick?: (itemId: string) => void; onItemClick?: (itemId: string, itemTitle?: string) => void }> = ({ content, onEditClick, onItemClick }) => {

  if (content.type === 'blog') {
    return <BlogPreview data={content.data} blogId={content.metadata?.blogId} onEditClick={onEditClick} />;
  }

  if (content.type === 'blog_creation') {
    return <BlogCreationConversation data={content.data} />;
  }

  if (content.type === 'blog_list') {
    return <BlogList data={content.data} onEditClick={onEditClick} />;
  }

  if (content.type === 'event_list') {
    return <EventListView data={content.data} onItemClick={onItemClick} />;
  }

  if (content.type === 'service_list') {
    return <ServiceListView data={content.data} onItemClick={onItemClick} />;
  }

  if (content.type === 'seo_analysis') {
    return <SEOAnalysisView data={content.data} />;
  }

  // 🆕 Vista de sugerencias de mejora para blogs
  if (content.type === 'blog_improvements') {
    return <BlogImprovementsView data={content.data} />;
  }

  // 🆕 Vista de estadísticas de blog individual
  if (content.type === 'blog_statistics') {
    return <BlogStatisticsView data={content.data} />;
  }

  // 🆕 Vista de estadísticas generales del blog
  if (content.type === 'blog_statistics_general') {
    return <BlogStatisticsGeneralView data={content.data} />;
  }

  if (content.type === 'service_analysis') {
    return <ServiceAnalysisView data={content.data} onItemClick={onItemClick} />;
  }

  // 🆕 Vista de detalles de sesión/conversación
  if (content.type === 'session_details') {
    return <SessionDetailsView data={content.data} />;
  }

  if (content.type === 'service') {
    return <ServicePreview data={content.data} />;
  }

  if (content.type === 'html') {
    return (
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content.data }}
      />
    );
  }

  if (content.type === 'markdown') {
    return (
      <div className="prose dark:prose-invert max-w-none">
        {/* Aquí puedes integrar un renderizador de markdown */}
        <pre className="whitespace-pre-wrap">{content.data}</pre>
      </div>
    );
  }

  return (
    <div className="text-gray-500 dark:text-gray-400">
      Tipo de contenido no soportado: {content.type}
    </div>
  );
};

// ============================================
// BLOG CREATION CONVERSATION
// ============================================

const BlogCreationConversation: React.FC<{ data: any }> = ({ data }) => {
  const { sessionId, stage, progress, conversationHistory, blogPreview, currentQuestion, questions, actions } = data;

  // 🔍 LOG: Debug data recibida
  console.log('🔍 [BlogCreationConversation] Data recibida:', {
    sessionId,
    stage,
    progress,
    hasConversationHistory: !!conversationHistory,
    conversationHistoryLength: conversationHistory?.length || 0,
    hasBlogPreview: !!blogPreview,
    hasCurrentQuestion: !!currentQuestion,
    hasQuestions: !!questions,
    hasActions: !!actions,
    actionsCount: actions?.length || 0,
    blogPreview: blogPreview ? {
      hasTitle: !!blogPreview.title,
      hasContent: !!blogPreview.content,
      contentLength: blogPreview.content?.length || 0
    } : null
  });

  // Mapeo de stages a descripciones legibles
  const stageNames: Record<string, string> = {
    initialized: 'Iniciando...',
    topic_discovery: 'Descubriendo tema',
    type_selection: 'Seleccionando tipo',
    details_collection: 'Recopilando detalles',
    category_selection: 'Eligiendo categoría',
    review_and_confirm: 'Revisión final',
    final_confirmation: 'Confirmando',
    generating: 'Generando contenido...',
    generation_completed: '¡Completado!',
    draft_saved: 'Borrador guardado'
  };

  // Handler para cuando el usuario hace clic en una opción
  const handleOptionClick = (optionValue: string) => {
    // Disparar evento personalizado para que el componente padre envíe el mensaje
    const event = new CustomEvent('scuti-ai-option-selected', {
      detail: { value: optionValue }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {stageNames[stage] || stage}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Historial de conversación */}
      {conversationHistory && conversationHistory.length > 0 && (
        <div className="space-y-3">
          {conversationHistory.map((msg: any, index: number) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                msg.role === 'agent'
                  ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                  : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'agent'
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {msg.role === 'agent' ? '🤖' : '👤'}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {msg.message}
                  </p>
                  {msg.timestamp && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Opciones interactivas si existen */}
      {currentQuestion && currentQuestion.options && currentQuestion.options.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentQuestion.question}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {currentQuestion.options.map((option: any, index: number) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option.value)}
                className="p-3 text-left rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{option.label.split(' ')[0]}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {option.label.substring(option.label.indexOf(' ') + 1)}
                    </div>
                    {option.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {option.description}
                      </div>
                    )}
                  </div>
                  <svg 
                    className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Botones de acción para confirmación final */}
      {actions && actions.length > 0 && !blogPreview && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {actions.map((action: any, index: number) => {
              const isPrimary = action.type === 'primary';
              const isDanger = action.type === 'danger';
              
              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(action.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isPrimary 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                      : isDanger
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{action.label.split(' ')[0]}</span>
                    <div className="flex-1">
                      <div className={`font-semibold ${
                        isPrimary 
                          ? 'text-green-700 dark:text-green-300'
                          : isDanger
                          ? 'text-red-700 dark:text-red-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {action.label.substring(action.label.indexOf(' ') + 1)}
                      </div>
                      {action.description && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {action.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview del blog generado */}
      {blogPreview && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vista Previa del Blog
            </h3>
            {blogPreview.postId && (
              <a
                href={`/admin/blog/posts/edit/${blogPreview.postId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar en Dashboard
              </a>
            )}
          </div>
          <BlogPreview data={blogPreview} />
        </div>
      )}

      {/* Session Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p>Sesión: {sessionId}</p>
        <p>Etapa: {stage}</p>
      </div>
    </div>
  );
};

// ============================================
// BLOG PREVIEW
// ============================================

const BlogPreview: React.FC<{ data: any; blogId?: string; onEditClick?: (itemId: string) => void }> = ({ data, blogId, onEditClick }) => {
  // Función simple para convertir Markdown básico a HTML
  const renderMarkdownContent = (content: string) => {
    if (!content) return '';
    
    // Si el contenido parece HTML (tiene tags), devolverlo tal cual
    if (content.includes('<p>') || content.includes('<div>')) {
      return content;
    }
    
    // Convertir Markdown básico a HTML
    let html = content
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-5">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">$1</code>')
      // Lists
      .replace(/^\d+\.\s(.+)$/gim, '<li class="ml-4">$1</li>')
      .replace(/^[-*]\s(.+)$/gim, '<li class="ml-4">$1</li>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      // Paragraphs (líneas con contenido seguidas de línea vacía)
      .split('\n\n')
      .map(para => {
        para = para.trim();
        if (!para) return '';
        if (para.startsWith('<')) return para; // Ya es HTML
        if (para.includes('<li')) return `<ul class="list-disc pl-6 my-3">${para}</ul>`; // Lista
        return `<p class="my-4">${para}</p>`; // Párrafo normal
      })
      .join('\n');
    
    return html;
  };

  return (
    <div className="space-y-6">
      {/* Botones de acción flotante */}
      {blogId && (
        <div className="flex justify-end gap-2">
          {onEditClick && (
            <button
              onClick={() => onEditClick(blogId)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Blog
            </button>
          )}
          <button
            onClick={() => {
              // Usar título del blog en lugar del ID para un comando más natural
              const blogTitle = data.title || 'este blog';
              const event = new CustomEvent('scuti-ai-option-selected', {
                detail: { value: `analizar seo de: ${blogTitle}` }
              });
              window.dispatchEvent(event);
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analizar SEO
          </button>
        </div>
      )}

      {/* Imagen destacada */}
      {data.imageUrl && (
        <div className="rounded-xl overflow-hidden">
          <img 
            src={data.imageUrl} 
            alt={data.title}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {data.title}
        </h1>
        {data.excerpt && (
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {data.excerpt}
          </p>
        )}
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-2">
        {data.categories?.map((cat: string, idx: number) => (
          <span 
            key={idx}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
          >
            {cat}
          </span>
        ))}
        {data.tags?.map((tag: string, idx: number) => (
          <span 
            key={idx}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Contenido - Renderizar Markdown o HTML */}
      <div 
        className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
        dangerouslySetInnerHTML={{ __html: renderMarkdownContent(data.content || '') }}
      />

      {/* Metadata adicional si existe */}
      {data.metadata && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            {data.metadata.wordCount && (
              <span>📝 {data.metadata.wordCount} palabras</span>
            )}
            {data.metadata.readingTime && (
              <span>⏱️ {data.metadata.readingTime} min de lectura</span>
            )}
            {data.metadata.template && (
              <span>📄 Tipo: {data.metadata.template}</span>
            )}
          </div>
        </div>
      )}

      {/* SEO Info (colapsable) */}
      {data.seo && (
        <details className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Información SEO {data.seo.score && <span className="text-green-600">({data.seo.score}/100)</span>}
          </summary>
          <div className="mt-3 space-y-2 text-sm">
            {data.seo.metaTitle && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Título SEO:</span>
                <p className="text-gray-600 dark:text-gray-400">{data.seo.metaTitle}</p>
              </div>
            )}
            {data.seo.metaDescription && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Meta Description:</span>
                <p className="text-gray-600 dark:text-gray-400">{data.seo.metaDescription}</p>
              </div>
            )}
            {data.seo.focusKeywords && data.seo.focusKeywords.length > 0 && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Focus Keywords:</span>
                <p className="text-gray-600 dark:text-gray-400">{data.seo.focusKeywords.join(', ')}</p>
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  );
};

// ============================================
// BLOG LIST
// ============================================

const BlogList: React.FC<{ data: any; onEditClick?: (itemId: string) => void }> = ({ data, onEditClick }) => {
  const { posts, total } = data;

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No hay blogs publicados
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Aún no se han publicado artículos en el blog.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Blogs Publicados
        </h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {total} {total === 1 ? 'artículo' : 'artículos'}
        </span>
      </div>

      <div className="grid gap-4">
        {posts.map((post: any) => (
          <div
            key={post.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  {post.category && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {post.category}
                    </span>
                  )}
                  {post.publishedAt && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                  {post.views !== undefined && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {post.views}
                    </span>
                  )}
                </div>
              </div>
              
              {onEditClick && (
                <button
                  onClick={() => onEditClick(post.id)}
                  className="flex-shrink-0 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  title="Ver blog"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SEO ANALYSIS VIEW
// ============================================

const SEOAnalysisView: React.FC<{ data: any }> = ({ data }) => {
  const { postTitle, analysis, currentSEO, stats } = data;
  const seoScore = analysis?.seo_score || 0;
  
  // Determinar color del score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="space-y-6">
      {/* Header con Score */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Análisis SEO
        </h2>
        <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          {postTitle}
        </h3>
        
        <div className="flex items-center gap-4">
          <div className={`${getScoreBgColor(seoScore)} rounded-full w-24 h-24 flex items-center justify-center`}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(seoScore)}`}>
                {seoScore}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Score SEO</div>
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-3 gap-4">
            {stats && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.wordCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Palabras</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.readingTime || 0}m
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Lectura</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.tags?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tags</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Análisis de Keywords */}
      {analysis?.keyword_analysis && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Análisis de Keywords
          </h4>
          
          {analysis.keyword_analysis.primary_keywords && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keywords Principales:
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.keyword_analysis.primary_keywords.map((keyword: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Densidad de Keywords</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {analysis.keyword_analysis.keyword_density || 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Distribución</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {analysis.keyword_analysis.keyword_distribution || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Análisis de Meta Tags */}
      {analysis?.meta_analysis && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Meta Tags
          </h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Meta Title</p>
                <span className={`text-sm font-semibold ${getScoreColor(analysis.meta_analysis.title_score || 0)}`}>
                  {analysis.meta_analysis.title_score || 0}/100
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded">
                {currentSEO?.metaTitle || 'No definido'}
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Meta Description</p>
                <span className={`text-sm font-semibold ${getScoreColor(analysis.meta_analysis.description_score || 0)}`}>
                  {analysis.meta_analysis.description_score || 0}/100
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded">
                {currentSEO?.metaDescription || 'No definido'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legibilidad */}
      {analysis?.readability && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Legibilidad
          </h4>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analysis.readability.score || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                Nivel: {analysis.readability.level || 'N/A'}
              </p>
            </div>
            <div className={`${getScoreBgColor(analysis.readability.score || 0)} px-6 py-3 rounded-lg`}>
              <p className={`text-sm font-semibold ${getScoreColor(analysis.readability.score || 0)}`}>
                {analysis.readability.score >= 80 ? 'Excelente' : 
                 analysis.readability.score >= 60 ? 'Bueno' : 'Mejorable'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {analysis?.recommendations && analysis.recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Recomendaciones
          </h4>
          
          <ul className="space-y-2">
            {analysis.recommendations.map((recommendation: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keywords Sugeridas */}
      {analysis?.suggested_keywords && analysis.suggested_keywords.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Keywords Sugeridas
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {analysis.suggested_keywords.map((keyword: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm border border-blue-200 dark:border-blue-800">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// BLOG IMPROVEMENTS VIEW
// ============================================

const BlogImprovementsView: React.FC<{ data: any }> = ({ data }) => {
  const { post, improvements } = data || {};
  
  // Helper para obtener color del score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  // Helper para renderizar sugerencias como lista
  const renderSuggestionList = (suggestions: any[], title: string, icon: string, color: string) => {
    if (!suggestions || suggestions.length === 0) return null;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className={`text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2`}>
          <span>{icon}</span>
          <span>{title}</span>
          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${color}`}>
            {suggestions.length}
          </span>
        </h4>
        <ul className="space-y-2">
          {suggestions.map((item: any, idx: number) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>
                {typeof item === 'string' ? item : item.suggestion || item.tag || item.keyword || item.message || JSON.stringify(item)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const score = improvements?.score?.total || post?.currentScore || 0;

  return (
    <div className="space-y-4">
      {/* Header con información del post */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          💡 Sugerencias de Mejora
        </h2>
        <h3 className="text-md text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
          {post?.title || 'Blog sin título'}
        </h3>
        
        <div className="flex items-center gap-4">
          {/* Score total */}
          <div className={`${getScoreBgColor(score)} rounded-full w-20 h-20 flex items-center justify-center`}>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Score</div>
            </div>
          </div>
          
          {/* Stats del post */}
          <div className="flex-1 grid grid-cols-2 gap-3 text-center">
            {post?.wordCount && (
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {post.wordCount}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Palabras</div>
              </div>
            )}
            {post?.readingTime && (
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {post.readingTime}m
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Lectura</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score detallado */}
      {improvements?.score && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            📊 Puntuación Detallada
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(improvements.score).filter(([key]) => key !== 'total').map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key}</span>
                <span className={`text-sm font-semibold ${getScoreColor(Number(value) || 0)}`}>
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mejoras SEO */}
      {improvements?.seo?.suggestions && renderSuggestionList(
        improvements.seo.suggestions,
        'Mejoras SEO',
        '🔍',
        'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
      )}

      {/* Legibilidad */}
      {improvements?.readability?.suggestions && renderSuggestionList(
        improvements.readability.suggestions,
        'Legibilidad',
        '📖',
        'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
      )}

      {/* Estructura */}
      {improvements?.structure?.suggestions && renderSuggestionList(
        improvements.structure.suggestions,
        'Estructura',
        '🏗️',
        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
      )}

      {/* Engagement */}
      {improvements?.engagement?.suggestions && renderSuggestionList(
        improvements.engagement.suggestions,
        'Engagement',
        '💬',
        'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
      )}

      {/* Tags sugeridos */}
      {improvements?.tags?.suggestions && improvements.tags.suggestions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            🏷️ Tags Sugeridos
          </h4>
          <div className="flex flex-wrap gap-2">
            {improvements.tags.suggestions.map((tag: any, idx: number) => (
              <span 
                key={idx} 
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {typeof tag === 'string' ? tag : tag.tag || tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keywords sugeridas */}
      {improvements?.keywords?.suggestions && improvements.keywords.suggestions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            🔑 Keywords Sugeridas
          </h4>
          <div className="flex flex-wrap gap-2">
            {improvements.keywords.suggestions.map((kw: any, idx: number) => (
              <span 
                key={idx} 
                className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm border border-blue-200 dark:border-blue-800"
              >
                {typeof kw === 'string' ? kw : kw.keyword || kw.word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Si no hay mejoras */}
      {!improvements?.seo?.suggestions?.length && 
       !improvements?.readability?.suggestions?.length && 
       !improvements?.structure?.suggestions?.length && 
       !improvements?.engagement?.suggestions?.length && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <span className="text-4xl mb-2 block">✨</span>
          <p className="text-green-700 dark:text-green-300 font-medium">
            ¡Tu contenido está muy bien optimizado!
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            No se encontraron mejoras significativas para sugerir.
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================
// BLOG STATISTICS VIEW (Individual Post)
// ============================================

const BlogStatisticsView: React.FC<{ data: any }> = ({ data }) => {
  const { post, stats, performance } = data || {};

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No publicado';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          📊 Estadísticas del Blog
        </h2>
        <h3 className="text-md text-gray-700 dark:text-gray-300 line-clamp-2">
          {post?.title || 'Blog sin título'}
        </h3>
        {stats?.publishedAt && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Publicado: {formatDate(stats.publishedAt)} ({stats.daysSincePublished} días)
          </p>
        )}
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {formatNumber(stats?.views || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">👁️ Vistas</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
            {formatNumber(stats?.likes || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">❤️ Likes</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatNumber(stats?.comments || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">💬 Comentarios</div>
        </div>
      </div>

      {/* Rendimiento */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          📈 Rendimiento
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {performance?.viewsPerDay || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Vistas/día promedio</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {performance?.engagementRate || 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tasa de engagement</div>
          </div>
        </div>
      </div>

      {/* Detalles del contenido */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          📝 Detalles del Contenido
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats?.wordCount || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Palabras</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats?.readingTime || 0}m
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Lectura</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats?.score !== 'N/A' ? stats?.score : '—'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// BLOG STATISTICS GENERAL VIEW
// ============================================

const BlogStatisticsGeneralView: React.FC<{ data: any }> = ({ data }) => {
  const { summary, topPerformers, insights } = data || {};

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          📊 Estadísticas Generales del Blog
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Resumen de rendimiento de todos los posts publicados
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {summary?.totalPosts || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">📝 Posts</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {formatNumber(summary?.totalViews || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">👁️ Vistas totales</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
            {formatNumber(summary?.totalLikes || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">❤️ Likes totales</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {summary?.averageReadingTime || 0}m
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">⏱️ Tiempo promedio</div>
        </div>
      </div>

      {/* Top performers */}
      {topPerformers && topPerformers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            🏆 Posts más populares
          </h4>
          <ul className="space-y-2">
            {topPerformers.slice(0, 5).map((post: any, idx: number) => (
              <li key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    #{idx + 1}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {post.title}
                  </span>
                </div>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 ml-2">
                  {formatNumber(post.views)} 👁️
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            💡 Insights
          </h4>
          <ul className="space-y-2">
            {insights.map((insight: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-yellow-500">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ============================================
// EVENT LIST VIEW
// ============================================

interface EventListViewProps {
  data: any;
  onItemClick?: (itemId: string, itemTitle?: string) => void;
}

const EventListView: React.FC<EventListViewProps> = ({ data, onItemClick }) => {
  const events = data.events || [];
  const totalCount = data.totalCount || events.length;
  const dateRange = data.dateRange;

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          📅
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          No hay eventos para mostrar
        </p>
        {dateRange && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Período: {dateRange}
          </p>
        )}
      </div>
    );
  }

  // Agrupar eventos por fecha
  const groupedEvents = events.reduce((groups: any, event: any) => {
    const date = new Date(event.startDate).toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  // Determinar icono según tipo de evento
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting': return '👥';
      case 'appointment': return '📅';
      case 'reminder': return '⏰';
      case 'event': return '📌';
      default: return '📅';
    }
  };

  // Determinar color según prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/10';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/10';
      default: return 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mis Eventos
          </h2>
          {dateRange && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {dateRange}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {totalCount} {totalCount === 1 ? 'evento' : 'eventos'}
          </span>
        </div>
      </div>

      {/* Lista de eventos agrupados por fecha */}
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([date, dateEvents]: [string, any]) => (
          <div key={date}>
            {/* Fecha separador */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 py-2 mb-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
                {date}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {dateEvents.length} {dateEvents.length === 1 ? 'evento' : 'eventos'}
              </span>
            </div>

            {/* Eventos del día */}
            <div className="space-y-3">
              {dateEvents.map((event: any) => (
                <div
                  key={event.id}
                  onClick={() => onItemClick?.(event.id, event.title)}
                  className={`group p-4 rounded-lg border-l-4 transition-all cursor-pointer hover:shadow-md ${getPriorityColor(event.priority)}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icono y hora */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-2xl mb-1">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(event.startDate).toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      {!event.allDay && event.endDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          hasta {new Date(event.endDate).toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      )}
                    </div>

                    {/* Contenido del evento */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {event.title}
                        </h4>
                        {event.priority && event.priority !== 'low' && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            event.priority === 'high' 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          }`}>
                            {event.priority === 'high' ? 'Alta' : 'Media'}
                          </span>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                        {event.category && (
                          <span className="flex items-center gap-1">
                            🏷️ {event.category}
                          </span>
                        )}
                        {event.location?.address && (
                          <span className="flex items-center gap-1">
                            📍 {event.location.address}
                          </span>
                        )}
                        {event.organizer?.name && (
                          <span className="flex items-center gap-1">
                            👤 {event.organizer.name}
                          </span>
                        )}
                        {event.attendees && event.attendees > 0 && (
                          <span className="flex items-center gap-1">
                            👥 {event.attendees} {event.attendees === 1 ? 'asistente' : 'asistentes'}
                          </span>
                        )}
                        {event.hasReminder && (
                          <span className="flex items-center gap-1">
                            🔔 Recordatorio
                          </span>
                        )}
                      </div>

                      {/* Status badge */}
                      {event.status && event.status !== 'scheduled' && (
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            event.status === 'completed' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : event.status === 'cancelled'
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                              : ''
                          }`}>
                            {event.status === 'completed' ? '✅ Completado' : 
                             event.status === 'cancelled' ? '❌ Cancelado' : event.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SERVICE PREVIEW
// ============================================

const ServicePreview: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-6">
    {/* Imagen del servicio */}
    {data.imagenUrl && (
      <div className="rounded-xl overflow-hidden">
        <img 
          src={data.imagenUrl} 
          alt={data.nombre}
          className="w-full h-48 object-cover"
        />
      </div>
    )}

    {/* Header con icono y nombre */}
    <div className="flex items-start gap-4">
      {data.iconoUrl && (
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <img src={data.iconoUrl} alt="" className="w-10 h-10" />
        </div>
      )}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {data.nombre}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {data.descripcion}
        </p>
      </div>
    </div>

    {/* Precio y duración */}
    <div className="flex gap-4">
      {data.precio && (
        <div className="flex-1 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-sm text-green-700 dark:text-green-300 mb-1">Precio</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            ${data.precio}
          </div>
        </div>
      )}
      {data.duracion && (
        <div className="flex-1 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">Duración</div>
          <div className="text-xl font-semibold text-blue-900 dark:text-blue-100">
            {data.duracion}
          </div>
        </div>
      )}
    </div>

    {/* Descripción larga */}
    {data.descripcionLarga && (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Descripción Detallada
        </h3>
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: data.descripcionLarga }}
        />
      </div>
    )}

    {/* Características */}
    {data.caracteristicas && data.caracteristicas.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Características
        </h3>
        <ul className="space-y-2">
          {data.caracteristicas.map((feature: string, idx: number) => (
            <li 
              key={idx}
              className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
            >
              <span className="text-green-500 mt-1">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Categoría */}
    {data.categoria && (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg">
        <span className="text-sm font-medium">Categoría:</span>
        <span className="text-sm">{data.categoria}</span>
      </div>
    )}
  </div>
);

// ============================================
// SESSION DETAILS VIEW - Detalles de la conversación
// ============================================

interface SessionDetailsViewProps {
  data: any;
}

const SessionDetailsView: React.FC<SessionDetailsViewProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <FileText size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Sin conversación activa
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          Inicia una nueva conversación para ver los detalles aquí
        </p>
      </div>
    );
  }

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header con título de la sesión */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {data.title || 'Conversación'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
          ID: {data.sessionId}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {data.messageCount || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mensajes
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {data.agentsUsed?.length || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Agentes usados
          </div>
        </div>
      </div>

      {/* Información detallada */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        <div className="p-4 flex justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Creada</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(data.createdAt)}
          </span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Última actividad</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(data.updatedAt)}
          </span>
        </div>
        {data.category && (
          <div className="p-4 flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Categoría</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
              {data.category}
            </span>
          </div>
        )}
      </div>

      {/* Agentes utilizados */}
      {data.agentsUsed && data.agentsUsed.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Agentes utilizados
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.agentsUsed.map((agent: string, index: number) => (
              <span 
                key={index}
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
              >
                {agent}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Último mensaje */}
      {data.lastMessage && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Último mensaje
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            "{data.lastMessage}"
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================
// SERVICE ANALYSIS VIEW - Vista técnica para administradores
// ============================================

interface ServiceAnalysisViewProps {
  data: any;
  onItemClick?: (itemId: string, itemTitle?: string) => void;
}

const ServiceAnalysisView: React.FC<ServiceAnalysisViewProps> = ({ data, onItemClick }) => {
  // 🔍 DEBUG: Ver qué datos llegan al componente
  console.log('🔍 [ServiceAnalysisView] Data completa recibida:', JSON.stringify(data, null, 2));
  console.log('🔍 [ServiceAnalysisView] Estructura:', {
    hasService: !!data?.service,
    hasAnalysis: !!data?.analysis,
    serviceKeys: data?.service ? Object.keys(data.service) : [],
    analysisKeys: data?.analysis ? Object.keys(data.analysis) : [],
    rawDataKeys: Object.keys(data || {})
  });

  const { service, analysis } = data || {};

  // Si no hay service, mostrar mensaje de error
  if (!service) {
    console.warn('⚠️ [ServiceAnalysisView] No hay datos de servicio');
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-yellow-700 dark:text-yellow-300">No se encontraron datos del servicio</p>
        <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  // Función para determinar color del score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30 border-green-500';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500';
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-500';
    return 'bg-red-100 dark:bg-red-900/30 border-red-500';
  };

  const getScoreRing = (score: number) => {
    if (score >= 80) return 'stroke-green-500';
    if (score >= 60) return 'stroke-yellow-500';
    if (score >= 40) return 'stroke-orange-500';
    return 'stroke-red-500';
  };

  // Componente de círculo de progreso
  const ScoreCircle = ({ score, label, size = 80 }: { score: number; label: string; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="transform -rotate-90" style={{ width: size, height: size }}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth="6"
              fill="none"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              className={getScoreRing(score)}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset,
                transition: 'stroke-dashoffset 0.5s ease'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</span>
          </div>
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header con info del servicio */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
        <div className="flex items-start gap-4">
          {service.imagen ? (
            <img 
              src={service.imagen} 
              alt={service.titulo}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
              <span className="text-2xl">🛠️</span>
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {service.titulo}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-purple-600 dark:text-purple-400">
                {service.categoria || 'Sin categoría'}
              </span>
              {service.destacado && (
                <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                  ⭐ Destacado
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              ID: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">{service.id}</code>
            </div>
          </div>
          <a
            href={`/dashboard/servicios/${service.id}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </a>
        </div>
      </div>

      {/* Métricas de análisis */}
      {analysis && (
        <>
          {/* Scores circulares */}
          <div className="grid grid-cols-5 gap-2">
            <ScoreCircle score={analysis.score} label="General" size={70} />
            <ScoreCircle score={analysis.seoScore} label="SEO" size={70} />
            <ScoreCircle score={analysis.qualityScore} label="Calidad" size={70} />
            <ScoreCircle score={analysis.completenessScore} label="Completitud" size={70} />
            <ScoreCircle score={analysis.conversionScore} label="Conversión" size={70} />
          </div>

          {/* Quick Wins */}
          {analysis.quickWins?.length > 0 && (
            <div className={`p-4 rounded-lg border-l-4 ${getScoreBg(70)}`}>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span>⚡</span> Quick Wins ({analysis.quickWins.length})
              </h4>
              <ul className="space-y-1">
                {analysis.quickWins.slice(0, 4).map((qw: any, idx: number) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    {qw.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Problemas Críticos */}
          {analysis.criticalIssues?.length > 0 && (
            <div className={`p-4 rounded-lg border-l-4 ${getScoreBg(30)}`}>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span>⚠️</span> Problemas Críticos ({analysis.criticalIssues.length})
              </h4>
              <ul className="space-y-1">
                {analysis.criticalIssues.slice(0, 4).map((issue: any, idx: number) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-red-500">⊗</span>
                    <span>
                      <strong>{issue.title}</strong>
                      {issue.detail && <span className="text-gray-500 dark:text-gray-400"> - {issue.detail}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fortalezas */}
          {analysis.strengths?.length > 0 && (
            <div className={`p-4 rounded-lg border-l-4 ${getScoreBg(85)}`}>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span>💪</span> Fortalezas ({analysis.strengths.length})
              </h4>
              <ul className="space-y-1">
                {analysis.strengths.slice(0, 4).map((s: any, idx: number) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-green-500">●</span>
                    {s.title}
                    {s.impact === 'alto' && (
                      <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded">
                        Alto impacto
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Acciones sugeridas */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          📌 Acciones disponibles:
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onItemClick?.(service.id, 'analiza el SEO de este servicio')}
            className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-lg transition-all"
          >
            🔍 Analizar SEO
          </button>
          <button
            onClick={() => onItemClick?.(service.id, '¿cómo mejorar la conversión de este servicio?')}
            className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-lg transition-all"
          >
            📈 Mejorar Conversión
          </button>
          <button
            onClick={() => onItemClick?.(service.id, 'genera una descripción optimizada para este servicio')}
            className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs rounded-lg transition-all"
          >
            ✍️ Generar Descripción
          </button>
          <button
            onClick={() => onItemClick?.(service.id, 'sugiere un precio competitivo para este servicio')}
            className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 text-xs rounded-lg transition-all"
          >
            💰 Sugerir Precio
          </button>
        </div>
      </div>

      {/* Footer con enlaces */}
      <div className="flex gap-2 pt-2">
        <a
          href={`/dashboard/servicios/${service.id}/edit`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm text-center rounded-lg transition-all"
        >
          Abrir en Editor
        </a>
        <a
          href={`/servicios/${service.slug || service.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-all"
        >
          Ver Público
        </a>
      </div>
    </div>
  );
};

// ============================================
// SERVICE LIST VIEW - Vista especializada para servicios
// ============================================

interface ServiceListViewProps {
  data: any;
  onItemClick?: (itemId: string, itemTitle?: string) => void;
  onDashboardClick?: (itemId: string) => void;
}

const ServiceListView: React.FC<ServiceListViewProps> = ({ data, onItemClick, onDashboardClick: _onDashboardClick }) => {
  const items = data.items || [];
  const totalCount = data.totalCount || items.length;
  const categories = data.categories || [];

  // Estado para filtro de categoría
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // Filtrar items por categoría
  const filteredItems = selectedCategory 
    ? items.filter((item: any) => item.subtitle === selectedCategory)
    : items;

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
          <span className="text-3xl">🛠️</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No hay servicios disponibles
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Actualmente no tenemos servicios para mostrar.
        </p>
      </div>
    );
  }

  // Determinar color del precio según valor
  const getPriceStyle = (price: number | null, priceLabel: string) => {
    if (!price && priceLabel === 'Consultar') {
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
    return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl">🛠️</span>
            Catálogo de Servicios
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {totalCount} {totalCount === 1 ? 'servicio disponible' : 'servicios disponibles'}
          </p>
        </div>
        
        {/* Acceso rápido a gestión de servicios */}
        <a
          href="/dashboard/servicios/management"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Ver Servicios
        </a>
      </div>

      {/* Filtros de categoría */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 text-sm rounded-full transition-all ${
              !selectedCategory
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Todos ({totalCount})
          </button>
          {categories.map((cat: string) => {
            const count = items.filter((i: any) => i.subtitle === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Grid de servicios */}
      <div className="grid gap-4">
        {filteredItems.map((item: any) => (
          <div
            key={item.id}
            className="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-lg"
          >
            <div className="flex gap-4">
              {/* Imagen del servicio */}
              {item.image && (
                <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Sin imagen - placeholder */}
              {!item.image && (
                <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                  <span className="text-3xl">🛠️</span>
                </div>
              )}

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-sm text-purple-600 dark:text-purple-400">
                      {item.subtitle}
                    </span>
                  </div>
                  
                  {/* Badge de precio */}
                  <span className={`flex-shrink-0 px-3 py-1 text-sm font-bold rounded-lg ${getPriceStyle(item.price, item.priceLabel)}`}>
                    {item.priceLabel}
                  </span>
                </div>

                {/* Descripción */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {item.description}
                </p>

                {/* Badges adicionales */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {item.destacado && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                      ⭐ Destacado
                    </span>
                  )}
                  {item.estado === 'activo' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                      ✓ Activo
                    </span>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onItemClick?.(item.id, item.title)}
                    className="flex-1 px-2.5 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300 rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Más Info
                  </button>
                  <a
                    href={`/dashboard/servicios/management`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer con acciones globales */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          <a
            href="/dashboard/servicios/management"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Servicio
          </a>
          <a
            href="/servicios"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ver Web Pública
          </a>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MODO LISTA
// ============================================

const ListMode: React.FC<{ content: CanvasContent; onItemClick?: (itemId: string, itemTitle?: string) => void }> = ({ content, onItemClick }) => {
  const data = content.data;
  
  // Si es event_list, delegar a EventListView
  if (content.type === 'event_list') {
    return <EventListView data={data} onItemClick={onItemClick} />;
  }

  // Si es service_list, delegar a ServiceListView
  if (content.type === 'service_list') {
    return <ServiceListView data={data} onItemClick={onItemClick} />;
  }
  
  // Soportar 'items', 'posts', o 'events' para compatibilidad
  const items = data.items || data.posts || data.events || [];
  const totalCount = data.totalCount || data.total || items.length;

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No se encontraron elementos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {content.title || 'Lista de elementos'}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {totalCount} {totalCount === 1 ? 'elemento' : 'elementos'}
        </span>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {items.map((item: any, idx: number) => (
          <div 
            key={item.id || idx}
            onClick={() => onItemClick?.(item.id, item.title || item.nombre)}
            className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex gap-4">
              {/* Imagen */}
              {item.imageUrl && (
                <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title || item.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              
              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title || item.nombre}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {item.description || item.excerpt || item.descripcion}
                </p>
                
                {/* Metadata - Soportar tanto item.metadata como propiedades directas del item (para posts) */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {(item.metadata?.date || item.publishedAt) && (
                    <span className="flex items-center gap-1">
                      📅 {item.metadata?.date || new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                  {(item.metadata?.author || item.author) && (
                    <span className="flex items-center gap-1">
                      👤 {item.metadata?.author || item.author}
                    </span>
                  )}
                  {(item.metadata?.category || item.category) && (
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                      {item.metadata?.category || item.category}
                    </span>
                  )}
                  {item.metadata?.readingTime && (
                    <span className="flex items-center gap-1">
                      ⏱️ {item.metadata.readingTime}
                    </span>
                  )}
                  {(item.metadata?.views !== undefined || item.views !== undefined) && (
                    <span className="flex items-center gap-1">
                      👁️ {item.metadata?.views || item.views || 0} vistas
                    </span>
                  )}
                </div>
                
                {/* Tags */}
                {item.metadata?.tags && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.metadata.tags.split(', ').slice(0, 3).map((tag: string, i: number) => (
                      <span 
                        key={i}
                        className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CanvasEditor;
