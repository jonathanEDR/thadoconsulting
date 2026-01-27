/**
 * Enhanced MessageBubble Component  
 * Versión mejorada que puede modificar su contenido dinámicamente
 * Para unificar listas de texto con botones interactivos
 */

import React, { useState } from 'react';
import { User, Copy, CheckCircle } from 'lucide-react';
import type { ChatMessage } from '../../types/scutiAI.types';
import InteractiveButtons from '../floating-chat/InteractiveButtons';
import { renderChatMarkdown } from '../../utils/markdownUtils';

interface EnhancedMessageBubbleProps {
  message: ChatMessage;
  isLatest?: boolean;
  onInteractiveClick?: (message: string) => void;
}

export const EnhancedMessageBubble: React.FC<EnhancedMessageBubbleProps> = ({ 
  message, 
  onInteractiveClick 
}) => {
  const [displayContent, setDisplayContent] = useState(message.content);
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContentReplace = (newContent: string) => {
    setDisplayContent(newContent);
  };

  // 🆕 Detectar y hacer clickeables las listas numeradas + renderizar Markdown
  const renderClickableContent = () => {
    // 🔧 Para mensajes del usuario, solo renderizar markdown básico
    if (isUser) {
      return (
        <div 
          className="mb-0 whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderChatMarkdown(displayContent) }}
        />
      );
    }

    // Para mensajes del bot sin handler de clicks, renderizar markdown
    if (!onInteractiveClick) {
      return (
        <div 
          className="mb-0 whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed chat-markdown-content"
          dangerouslySetInnerHTML={{ __html: renderChatMarkdown(displayContent) }}
        />
      );
    }

    // Detectar si hay lista numerada (1. 2. 3. etc.)
    const listPattern = /^(\d+)\.\s+(.+)$/gm;
    const lines = displayContent.split('\n');
    const hasNumberedList = lines.some(line => listPattern.test(line.trim()));

    if (!hasNumberedList) {
      // 🔧 Renderizar con markdown si no hay lista numerada clickeable
      return (
        <div 
          className="mb-0 whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed chat-markdown-content"
          dangerouslySetInnerHTML={{ __html: renderChatMarkdown(displayContent) }}
        />
      );
    }

    // Renderizar con elementos clickeables (listas numeradas) + markdown en el resto
    return (
      <div className="mb-0 text-sm sm:text-base leading-relaxed">
        {lines.map((line, index) => {
          const match = line.trim().match(/^(\d+)\.\s+(.+)$/);
          
          if (match) {
            const [, number, text] = match;
            return (
              <div 
                key={index}
                onClick={() => onInteractiveClick(text.trim())}
                className="py-1.5 px-2 -mx-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors group"
              >
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  <span className="font-semibold">{number}.</span> {text}
                </span>
              </div>
            );
          } else {
            // 🔧 Renderizar líneas no-numeradas con markdown
            return (
              <div 
                key={index} 
                className="whitespace-pre-wrap break-words chat-markdown-content"
                dangerouslySetInnerHTML={{ __html: renderChatMarkdown(line) || '\u00A0' }}
              />
            );
          }
        })}
      </div>
    );
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAgentIcon = (agent?: string) => {
    if (!agent) return '🤖';
    if (agent === 'MULTI_AGENT') return '🔄';
    if (agent.toLowerCase().includes('blog')) return '📝';
    if (agent.toLowerCase().includes('seo')) return '🔍';
    if (agent.toLowerCase().includes('services')) return '💼';
    return '🤖';
  };

  const getAgentColor = (agent?: string) => {
    if (!agent) return 'purple';
    if (agent === 'MULTI_AGENT') return 'indigo';
    if (agent.toLowerCase().includes('blog')) return 'blue';
    if (agent.toLowerCase().includes('seo')) return 'green';
    if (agent.toLowerCase().includes('services')) return 'orange';
    return 'purple';
  };

  return (
    <div className={`flex gap-2 sm:gap-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar - Responsive */}
      <div 
        className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-medium ${
          isUser 
            ? 'bg-blue-600 dark:bg-blue-500' 
            : `bg-${getAgentColor(message.agentUsed)}-600 dark:bg-${getAgentColor(message.agentUsed)}-500`
        }`}
      >
        {isUser ? <User size={14} className="sm:w-4 sm:h-4" /> : <span className="text-xs sm:text-sm">{getAgentIcon(message.agentUsed)}</span>}
      </div>

      {/* Mensaje - Responsive */}
      <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`relative group rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm'
          }`}
        >
          {/* Contenido del mensaje - usando displayContent con elementos clickeables */}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {renderClickableContent()}
          </div>

          {/* Botón copiar (aparece en hover en desktop, siempre visible en móvil) */}
          <button
            onClick={handleCopy}
            className={`absolute -top-1 sm:-top-2 ${
              isUser ? '-left-1 sm:-left-2' : '-right-1 sm:-right-2'
            } opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-700 rounded-full p-1 sm:p-1.5 shadow-lg hover:scale-110 transform touch-manipulation`}
            title="Copiar mensaje"
          >
            {copied ? (
              <CheckCircle size={12} className="text-green-600 sm:w-3.5 sm:h-3.5" />
            ) : (
              <Copy size={12} className="text-gray-600 dark:text-gray-300 sm:w-3.5 sm:h-3.5" />
            )}
          </button>
        </div>

        {/* 🆕 Botones Interactivos - Solo para mensajes del asistente */}
        {!isUser && onInteractiveClick && (
          <InteractiveButtons 
            message={message}
            onButtonClick={onInteractiveClick}
            onReplaceContent={handleContentReplace}
          />
        )}

        {/* Metadata */}
        <div className={`flex items-center gap-2 text-xs ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Timestamp */}
          <span className="text-gray-500 dark:text-gray-400">
            {formatTime(message.timestamp)}
          </span>

          {/* Agente usado */}
          {!isUser && message.agentUsed && (
            <>
              <span className="text-gray-400">•</span>
              <span
                className={`px-2 py-0.5 rounded-full text-${getAgentColor(
                  message.agentUsed
                )}-600 dark:text-${getAgentColor(
                  message.agentUsed
                )}-400 bg-${getAgentColor(
                  message.agentUsed
                )}-50 dark:bg-${getAgentColor(message.agentUsed)}-900/30 font-medium`}
              >
                {message.agentUsed}
              </span>
            </>
          )}

          {/* Coordinación multi-agente */}
          {!isUser && message.metadata?.agentsInvolved && message.metadata.agentsInvolved.length > 1 && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                🔄 {message.metadata.agentsInvolved.length} agentes
              </span>
            </>
          )}

          {/* Tiempo de respuesta */}
          {!isUser && message.metadata?.responseTime && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">
                {(message.metadata.responseTime / 1000).toFixed(1)}s
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessageBubble;