/**
 * 💬 SEO Chat Interface
 * Interface de chat para interacción con el SEO Agent
 * Solo disponible para Admin Dashboard
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useSEOCanvasContext } from '../../../contexts/SEOCanvasContext';

const SEOChatInterface: React.FC = () => {
  const {
    chatHistory,
    isLoading,
    sendChatMessage,
    clearChatHistory,
    activeMode
  } = useSEOCanvasContext();

  const [message, setMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll al final del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Auto-resize del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;

    const messageToSend = message.trim();
    setMessage('');
    
    await sendChatMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Comandos sugeridos según el modo
  const getSuggestedCommands = () => {
    switch (activeMode) {
      case 'analysis':
        return [
          'Analiza el SEO de este contenido',
          'Qué palabras clave recomendarías?',
          'Cómo puedo mejorar la legibilidad?'
        ];
      case 'structure':
        return [
          'Genera una estructura para un artículo sobre...',
          'Qué secciones debería incluir?',
          'Cómo organizar el contenido para SEO?'
        ];
      case 'review':
        return [
          'Revisa el SEO completo de este post',
          'Qué errores detectas?',
          'Dame una checklist de optimización'
        ];
      default:
        return [
          'Hola, ayúdame con el SEO de mi contenido',
          'Qué puedes hacer por mí?',
          'Analiza este texto'
        ];
    }
  };

  const suggestedCommands = getSuggestedCommands();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header del chat */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-medium text-gray-900 dark:text-white">SEO Assistant</span>
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
            )}
          </div>
          
          {chatHistory.length > 0 && (
            <button
              onClick={clearChatHistory}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Limpiar chat
            </button>
          )}
        </div>
      </div>

      {/* Mensajes del chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
        {chatHistory.length === 0 && (
          <div className="text-center py-8">
            <div className="relative inline-block mb-4">
              <Bot className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¡Hola! Soy tu asistente SEO. ¿En qué puedo ayudarte hoy?
            </p>
            
            {/* Comandos sugeridos */}
            <div className="space-y-2 max-w-sm mx-auto">
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">Comandos sugeridos:</p>
              {suggestedCommands.map((command, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(command)}
                  className="block w-full text-left p-3 text-sm bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700"
                >
                  {command}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded-2xl px-4 py-3 shadow-sm
                ${chat.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }
              `}
            >
              <div className="flex items-start space-x-2">
                {chat.role === 'assistant' && (
                  <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                )}
                {chat.role === 'user' && (
                  <User className="h-4 w-4 mt-1 flex-shrink-0 text-white/80" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{chat.content}</p>
                  <p className={`text-xs mt-2 ${
                    chat.role === 'user' ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {new Date(chat.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div ref={chatEndRef} />
      </div>

      {/* Input del chat */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SEOChatInterface;