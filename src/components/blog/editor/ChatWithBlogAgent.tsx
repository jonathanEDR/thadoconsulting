/**
 * 💬 ChatWithBlogAgent Component
 * Interfaz de chat conversacional con el agente de blog
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useAIChat, type ChatMessage, type ChatContext } from '../../../hooks/ai/useAIChat';
import { renderChatMarkdown } from '../../../utils/markdownUtils';

interface ChatWithBlogAgentProps {
  context: ChatContext;
  onApplyContent?: (content: string) => void;
}

export const ChatWithBlogAgent: React.FC<ChatWithBlogAgentProps> = ({
  context,
  onApplyContent
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat();

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message, context);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = async (action: string) => {
    const quickActions: Record<string, string> = {
      expand: 'Expande el contenido actual con más detalles',
      improve: 'Mejora la calidad y claridad del contenido',
      seo: 'Dame recomendaciones de SEO para este contenido',
      ideas: 'Sugiéreme ideas para continuar este artículo'
    };

    const message = quickActions[action];
    if (message) {
      await sendMessage(message, context);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Chat con Asistente IA
          </h3>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto text-purple-300 dark:text-purple-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              ¡Hola! Soy tu asistente de blog. ¿En qué puedo ayudarte?
            </p>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
              <button
                onClick={() => handleQuickAction('expand')}
                className="px-3 py-2 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              >
                📝 Expandir contenido
              </button>
              <button
                onClick={() => handleQuickAction('improve')}
                className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                ✨ Mejorar calidad
              </button>
              <button
                onClick={() => handleQuickAction('seo')}
                className="px-3 py-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
              >
                🔍 Optimizar SEO
              </button>
              <button
                onClick={() => handleQuickAction('ideas')}
                className="px-3 py-2 text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
              >
                💡 Sugerir ideas
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onApplyContent={onApplyContent}
              />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">El asistente está pensando...</span>
              </div>
            )}
          </>
        )}
        
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregúntame algo o pide ayuda..."
            rows={2}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
};

// Componente de burbuja de mensaje
interface MessageBubbleProps {
  message: ChatMessage;
  onApplyContent?: (content: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onApplyContent }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
        }`}
      >
        {/* ✅ Renderizar markdown correctamente */}
        {isUser ? (
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        ) : (
          <div 
            className="text-sm prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderChatMarkdown(message.content) }}
          />
        )}
        
        {/* Suggestions */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
            {message.suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {message.actions && message.actions.length > 0 && onApplyContent && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
            {message.actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  // Aquí podrías ejecutar la acción específica
                  console.log('Action:', action);
                }}
                className="px-3 py-1 text-xs bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-2 text-xs opacity-70">
          {new Date(message.timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatWithBlogAgent;
