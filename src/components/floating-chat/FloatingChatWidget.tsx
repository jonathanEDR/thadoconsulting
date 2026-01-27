/**
 * FloatingChatWidget Component
 * Contenedor principal del chatbot flotante
 * 
 * Características:
 * - Combina botón flotante y ventana de chat
 * - Gestiona todo el estado mediante useFloatingChat
 * - Se puede integrar en cualquier página
 * - Animaciones coordinadas
 * - Accesible globalmente
 * - 🆕 Configuración dinámica desde CMS
 */

import React, { useState, useEffect } from 'react';
import FloatingChatButton from './FloatingChatButton';
import FloatingChatWindow from './FloatingChatWindow';
import useFloatingChat from '../../hooks/useFloatingChat';
import { getPageBySlug } from '../../services/cmsApi';
import { defaultChatbotConfig } from '../../config/defaultChatbotConfig';
import type { ChatbotConfig } from '../../types/cms';

interface FloatingChatWidgetProps {
  className?: string;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({ 
  className = '' 
}) => {
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig>(defaultChatbotConfig);
  const [configLoading, setConfigLoading] = useState(true);

  // 🆕 Cargar configuración del CMS
  useEffect(() => {
    const loadChatbotConfig = async () => {
      try {
          // Obtener configuración desde la página home
          const pageData = await getPageBySlug('home');
          if (pageData?.content?.chatbotConfig) {
            setChatbotConfig(pageData.content.chatbotConfig);
          }
      } catch (error) {
          // Opcional: podrías manejar el error con una alerta o log externo si es necesario
      } finally {
        setConfigLoading(false);
      }
    };
    
    loadChatbotConfig();
  }, []);

  const {
    // Estado UI
    isOpen,
    isExpanded,
    
    // Mensajes
    messages,
    loading,
    
    // Notificaciones
    unreadCount,
    
    // Sistema
    systemStatus,
    
    // Acciones
    toggleChat,
    closeChat,
    toggleExpand,
    sendMessage
  } = useFloatingChat();

  // No renderizar hasta que la configuración esté cargada
  if (configLoading) {
    return null;
  }

  // No renderizar si el chatbot está deshabilitado
  if (chatbotConfig.enabled === false) {
    return null;
  }

  return (
    <div className={className}>
      {/* Botón Flotante */}
      <FloatingChatButton
        isOpen={isOpen}
        onClick={toggleChat}
        unreadCount={unreadCount}
        config={chatbotConfig}
      />

      {/* Ventana de Chat */}
      <FloatingChatWindow
        isOpen={isOpen}
        isExpanded={isExpanded}
        onClose={closeChat}
        onToggleExpand={toggleExpand}
        messages={messages}
        onSendMessage={sendMessage}
        loading={loading}
        systemStatus={systemStatus}
        config={chatbotConfig}
      />

      {/* Estilos globales para animaciones */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingChatWidget;
