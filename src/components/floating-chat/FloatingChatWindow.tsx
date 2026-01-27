/**
 * FloatingChatWindow Component
 * Ventana flotante del chat con mensajes e input
 * 
 * Features:
 * - Ventana compacta y responsive
 * - Reutiliza componentes existentes (ChatInput, MessageBubble)
 * - Header personalizado minimalista
 * - Auto-scroll al último mensaje
 * - Animaciones de entrada/salida
 * - 🆕 Configuración dinámica desde CMS
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Minimize2,
  Maximize2,
  X,
  Brain,
  Loader2,
  Sparkles
} from 'lucide-react';
import { SCUTI_AI_MASCOT } from '../../utils/brandAssets';
import EnhancedMessageBubble from './EnhancedMessageBubble';
import ChatInput from '../scuti-ai/ChatInput';
import ChatTextSelection from './ChatTextSelection';
import type { ChatMessage } from '../../types/scutiAI.types';
import type { ChatbotConfig } from '../../types/cms';

interface FloatingChatWindowProps {
  isOpen: boolean;
  isExpanded: boolean;
  onClose: () => void;
  onToggleExpand: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  loading?: boolean;
  systemStatus?: string;
  config: ChatbotConfig;
}

export const FloatingChatWindow: React.FC<FloatingChatWindowProps> = ({
  isOpen,
  isExpanded,
  onClose,
  onToggleExpand,
  messages,
  onSendMessage,
  loading = false,
  systemStatus = 'operational',
  config
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tema actual
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };
    
    checkTheme();
    
    // Observar cambios en el tema
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Obtener estilos según tema
  const headerStyles = config.headerStyles[theme];

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`
        fixed z-40
        bg-white dark:bg-gray-900
        rounded-2xl shadow-2xl
        flex flex-col
        transition-all duration-300 ease-in-out
        border border-gray-200 dark:border-gray-800
        
        /* Responsive para móvil */
        ${isExpanded 
          ? /* Expandido - Fullscreen en móvil, modal en desktop */
            'sm:w-[90vw] sm:h-[85vh] sm:max-w-4xl sm:bottom-6 sm:right-6 ' +
            'bottom-0 right-0 left-0 top-0 w-full h-full rounded-none sm:rounded-2xl'
          : /* Normal - Casi fullscreen en móvil, ventana en desktop posicionada según CMS */
            'sm:w-96 sm:h-[600px] ' +
            'bottom-0 left-0 w-full sm:left-auto sm:w-96 rounded-none sm:rounded-2xl sm:h-[600px] ' +
            // Safe area para iOS
            'h-[100dvh] pb-[env(safe-area-inset-bottom)] ' +
            // Evitar que el teclado cubra el input
            'max-h-[100dvh]'
        }
        animate-slideUp
      `}
      style={
        !isMobile && !isExpanded ? {
          // Solo en desktop y modo normal: usar posicionamiento del CMS
          bottom: `calc(${config.buttonStyles.position.bottom} + 80px)`,
          right: config.buttonStyles.position.right
        } : undefined
      }
    >
      {/* Header Compacto con estilos dinámicos del CMS - Responsive */}
      <div 
        className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl sm:rounded-t-2xl"
        style={{ background: headerStyles.background }}
      >
        {/* Logo y Título */}
        <div className="flex items-center gap-3">
          {/* Logo Dinámico */}
          {config.logo[theme] ? (
            <img
              src={config.logo[theme]}
              alt={config.logoAlt}
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden p-1"
              style={{ background: 'linear-gradient(to bottom right, #EFF6FF, #F5F3FF)' }}
            >
              <img
                src={SCUTI_AI_MASCOT.png}
                alt={SCUTI_AI_MASCOT.alt}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <Brain size={16} className="text-purple-600 hidden" />
            </div>
          )}
          
          <div>
            {/* Nombre del Bot desde CMS */}
            <h3 
              className="font-bold text-sm flex items-center gap-2"
              style={{ color: headerStyles.titleColor }}
            >
              {config.botName}
              <Sparkles size={14} className="text-purple-500" />
            </h3>
            
            {/* Estado desde CMS */}
            <div className="flex items-center gap-1.5 text-[10px]">
              <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor()}`}></div>
              <span style={{ color: headerStyles.subtitleColor }}>
                {config.statusText}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleExpand}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isExpanded ? 'Minimizar' : 'Expandir'}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-red-600"
            title="Cerrar"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Área de Mensajes - Responsive */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-950"
      >
        {messages.length === 0 ? (
          // Estado vacío - Mensaje de bienvenida desde CMS
          <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 p-2">
              <img
                src={SCUTI_AI_MASCOT.png}
                alt={SCUTI_AI_MASCOT.alt}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <Brain size={40} className="text-blue-600 dark:text-blue-400 hidden" />
            </div>
            {/* Título desde CMS */}
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
              {config.welcomeMessage.title}
            </h3>
            {/* Descripción desde CMS */}
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
              {config.welcomeMessage.description}
            </p>
            
            {/* Preguntas Sugeridas desde CMS */}
            <div className="space-y-2 w-full max-w-xs">
              {config.suggestedQuestions?.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onSendMessage(question.message)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg text-xs sm:text-sm text-left transition-all border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base sm:text-lg">{question.icon || '📝'}</span>
                    <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-tight">{question.text}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Mensajes
          <>
            {messages.map((message) => (
              <EnhancedMessageBubble
                key={message.id}
                message={message}
                isLatest={messages[messages.length - 1].id === message.id}
                onInteractiveClick={onSendMessage}
              />
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <Loader2 size={16} className="animate-spin" />
                <span>THADO AI está escribiendo...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area - Responsive */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="px-3 sm:px-0">
          <ChatInput
            onSend={onSendMessage}
            disabled={loading}
            loading={loading}
            placeholder="Escribe tu mensaje..."
          />
        </div>
      </div>

      {/* Powered by badge (condicional según config) */}
      {config.behavior.showPoweredBy && (
        <div className="px-4 py-2 text-center border-t border-gray-200 dark:border-gray-800">
          <span className="text-[10px] text-gray-400 dark:text-gray-600">
            Powered by <span className="font-semibold text-blue-600">THADO AI</span> 📊
          </span>
        </div>
      )}

      {/* 🆕 Menú de selección de texto */}
      <ChatTextSelection 
        onSendMessage={onSendMessage}
        containerRef={messagesContainerRef}
      />
    </div>
  );
};

export default FloatingChatWindow;
