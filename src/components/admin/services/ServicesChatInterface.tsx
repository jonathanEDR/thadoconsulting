/**
 * 💬 Services Chat Interface
 * Interface de chat para interacción con el Services Agent
 * Solo disponible para Admin Dashboard
 * 
 * Características:
 * - Chat interactivo con historial
 * - Comandos sugeridos contextuales
 * - Auto-scroll y auto-resize
 * - Typing indicator
 * - Timestamps en mensajes
 * 
 * ⚡ Optimizaciones:
 * - React.memo() para evitar re-renders innecesarios
 * - useMemo para comandos sugeridos
 * - useCallback para handlers
 */

import React, { useState, useRef, useEffect, memo, useMemo, useCallback } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useServicesCanvasContext } from '../../../contexts/ServicesCanvasContext';
import QuickActionButton from './QuickActionButton';
import FormCollectionProgress from './FormCollectionProgress';
import CategoryButtons from './CategoryButtons';
import { chatMarkdownToHTML } from '../../../utils/blog/markdownUtils';

const ServicesChatInterface: React.FC = memo(() => {
  const {
    chatHistory,
    isLoading,
    currentService,
    allServices, // 🆕 Acceso a servicios globales
    sendChatMessage,
    clearChatHistory,
    executeQuickAction, // 🆕 Para ejecutar acciones
    // activeMode
  } = useServicesCanvasContext();

  const [message, setMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ============================================
  // EFECTOS
  // ============================================

  // Auto-scroll al final del chat cuando hay nuevos mensajes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Auto-resize del textarea según contenido
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // ============================================
  // HANDLERS (Memoizados con useCallback)
  // ============================================

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;

    const messageToSend = message.trim();
    setMessage('');
    
    // Resetear altura del textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    await sendChatMessage(messageToSend);
  }, [message, isLoading, sendChatMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  }, [handleSendMessage]);

  const handleSuggestedCommand = useCallback((command: string) => {
    setMessage(command);
    textareaRef.current?.focus();
  }, []);

  // ============================================
  // COMANDOS SUGERIDOS CONTEXTUALES (Memoizado)
  // ============================================

  const suggestedCommands = useMemo(() => {
    if (currentService?.serviceId) {
      // Si hay un servicio cargado - acciones específicas para ese servicio
      return [
        `Analiza la calidad de "${currentService.serviceTitle}"`,
        `Mejora la descripción de este servicio`,
        `Qué precio recomiendas para "${currentService.serviceTitle}"?`,
        `Genera características y beneficios para este servicio`,
        `Optimiza el SEO de este servicio`
      ];
    } else {
      // Contexto global - acciones de gestión de portafolio
      return [
        'Crea un nuevo servicio de desarrollo web',
        'Analiza mi portafolio de servicios',
        'Qué servicios me recomiendas agregar?',
        'Ayúdame a definir precios competitivos',
        'Genera ideas de paquetes y bundles'
      ];
    }
  }, [currentService?.serviceId, currentService?.serviceTitle]);

  // ============================================
  // RENDERIZADO
  // ============================================

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header del chat */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-white">Services Assistant</span>
              <p className="text-xs text-gray-500">
                {currentService?.serviceId 
                  ? `Trabajando en: ${currentService.serviceTitle}`
                  : `🌍 Modo global - ${allServices.length} servicio${allServices.length !== 1 ? 's' : ''} disponible${allServices.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
            )}
          </div>
          
          {chatHistory.length > 0 && (
            <button
              onClick={clearChatHistory}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors px-3 py-1 rounded-md hover:bg-gray-100"
            >
              Limpiar chat
            </button>
          )}
        </div>
      </div>

      {/* Mensajes del chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center py-8">
            <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Bot className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Hola! Soy tu asistente de servicios
            </h3>
            <p className="text-gray-600 mb-6">
              Puedo ayudarte a crear, analizar y optimizar tus servicios.
            </p>
            
            {/* Comandos sugeridos */}
            <div className="max-w-md mx-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">
                💡 Prueba estos comandos:
              </p>
              <div className="space-y-2">
                {suggestedCommands.map((command, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedCommand(command)}
                    className="block w-full text-left p-3 text-sm bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500/50 rounded-lg transition-all shadow-sm hover:shadow-md group"
                  >
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-400">
                      {command}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {chatHistory.map((chat, index) => (
          <div
            key={chat.id || index}
            className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded-lg px-4 py-3 shadow-sm
                ${chat.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                }
              `}
            >
              <div className="flex items-start space-x-2">
                {chat.role === 'assistant' && (
                  <div className="flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                )}
                {chat.role === 'user' && (
                  <div className="flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {/* 🆕 Renderizar Form Collection Progress */}
                  {chat.role === 'assistant' && chat.formState && (
                    <FormCollectionProgress
                      progress={chat.formState.progress || '0/0'}
                      currentQuestion={chat.formState.currentQuestion}
                      completedFields={[]} // Se puede mejorar para mostrar campos completados
                      isCollecting={chat.formState.isCollecting}
                    />
                  )}

                  {/* 🆕 Renderizar Category Buttons si el campo actual es 'categoria' y tipo 'select' */}
                  {chat.role === 'assistant' && 
                   chat.formState && 
                   chat.formState.isCollecting &&
                   chat.formState.currentField === 'categoria' &&
                   chat.formState.fieldType === 'select' &&
                   chat.formState.options && 
                   chat.formState.options.length > 0 && (
                    <CategoryButtons
                      options={chat.formState.options}
                      onSelect={(category) => {
                        setMessage(category);
                        handleSendMessage({ preventDefault: () => {} } as React.FormEvent);
                      }}
                      disabled={isLoading}
                    />
                  )}
                  
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {chat.role === 'assistant' ? (
                      <span 
                        dangerouslySetInnerHTML={{ __html: chatMarkdownToHTML(chat.content) }}
                        className="[&>strong]:font-semibold [&>strong]:text-purple-600 dark:[&>strong]:text-purple-400 [&>em]:italic [&>a]:text-purple-500 [&>a]:underline"
                      />
                    ) : (
                      chat.content
                    )}
                  </div>
                  
                  {/* 🆕 Renderizar Quick Actions */}
                  {chat.role === 'assistant' && chat.quickActions && chat.quickActions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-semibold text-purple-600 mb-2">
                        💡 Acciones sugeridas:
                      </p>
                      {chat.quickActions.map((qa, idx) => (
                        <QuickActionButton
                          key={`${chat.id}_qa_${idx}`}
                          quickAction={{
                            action: qa.action,
                            label: qa.label,
                            description: qa.description,
                            data: qa.data,
                            variant: 'primary',
                            requiresConfirmation: qa.action === 'create_service' || qa.action === 'edit_service'
                          }}
                          onExecute={executeQuickAction}
                          disabled={isLoading}
                        />
                      ))}
                    </div>
                  )}
                  
                  <p className={`text-xs mt-1 ${
                    chat.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {new Date(chat.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator cuando está cargando */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-purple-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Input del chat */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            title="Enviar mensaje"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
        
        <p className="text-xs text-gray-400 mt-2 text-center">
          💡 Tip: Usa Shift + Enter para agregar saltos de línea
        </p>
      </div>
    </div>
  );
});

// Agregar displayName para debugging
ServicesChatInterface.displayName = 'ServicesChatInterface';

export default ServicesChatInterface;
