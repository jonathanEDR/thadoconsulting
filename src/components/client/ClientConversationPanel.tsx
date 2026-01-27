/**
 * 💬 CLIENT CONVERSATION PANEL
 * Panel lateral estilo WhatsApp para conversaciones del cliente
 * Similar al ConversationPanel de admin pero sin notas internas
 * Integrado con el tema del dashboard para consistencia visual
 * Usa el logo del negocio para consistencia de marca
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { messageService } from '../../services/messageService';
import type { LeadMessage } from '../../types/message.types';
import type { Lead } from '../../services/crmService';
import { useDashboardSidebarConfig } from '../../hooks/cms/useDashboardSidebarConfig';
import { useTheme } from '../../contexts/ThemeContext';
import {
  X,
  Send,
  Loader,
  MessageCircle,
  Building2,
  ChevronDown
} from 'lucide-react';

interface ClientConversationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onMessageSent?: () => void;
}

export default function ClientConversationPanel({
  isOpen,
  onClose,
  lead,
  onMessageSent
}: ClientConversationPanelProps) {
  const { user: clerkUser } = useUser();
  
  // 🎨 Hook para obtener colores del tema del sidebar del cliente
  const { clientConfig } = useDashboardSidebarConfig();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Logo del negocio - usar FAVICON.png que tiene mejor visibilidad
  const businessLogo = '/FAVICON.png';
  
  // Generar gradiente del header basado en la configuración del sidebar
  const headerGradient = isDarkMode
    ? `linear-gradient(to right, ${clientConfig.headerGradientFromDark}, ${clientConfig.headerGradientViaDark}, ${clientConfig.headerGradientToDark})`
    : `linear-gradient(to right, ${clientConfig.headerGradientFrom}, ${clientConfig.headerGradientVia}, ${clientConfig.headerGradientTo})`;
  
  // Colores para los botones activos
  const activeButtonGradient = isDarkMode
    ? `linear-gradient(to right, ${clientConfig.activeItemGradientFromDark}, ${clientConfig.activeItemGradientToDark})`
    : `linear-gradient(to right, ${clientConfig.activeItemGradientFrom}, ${clientConfig.activeItemGradientTo})`;
  
  // Estado
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Referencias
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ========================================
  // 📊 CARGAR MENSAJES
  // ========================================

  const loadMessages = useCallback(async () => {
    if (!lead?._id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await messageService.getLeadMessages(lead._id, {
        limit: 100,
        incluirPrivados: false, // El cliente NO ve notas internas
      });
      
      const allMessages = response.data?.mensajes || [];
      
      // Filtrar: excluir notas internas por seguridad adicional
      const clientMessages = allMessages.filter(
        (msg: LeadMessage) => msg.tipo !== 'nota_interna'
      );
      
      // Ordenar por fecha (más antiguo primero para el chat)
      clientMessages.sort((a: LeadMessage, b: LeadMessage) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      setMessages(clientMessages);
      
      // Marcar mensajes no leídos como leídos
      const unreadMessages = clientMessages.filter((msg: LeadMessage) => !msg.leido);
      for (const msg of unreadMessages) {
        try {
          await messageService.markAsRead(msg._id);
        } catch (e) {
          console.warn('No se pudo marcar como leído:', msg._id);
        }
      }
    } catch (err: any) {
      console.error('Error cargando mensajes:', err);
      setError('Error al cargar los mensajes');
    } finally {
      setIsLoading(false);
    }
  }, [lead?._id]);

  // ========================================
  // 🔄 EFFECTS
  // ========================================

  useEffect(() => {
    if (isOpen && lead) {
      loadMessages();
    }
  }, [isOpen, lead, loadMessages]);

  // Scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Auto-focus en textarea cuando se abre
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Detectar scroll para mostrar botón de ir abajo
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  // ========================================
  // 📤 ENVIAR MENSAJE
  // ========================================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !lead?._id || isSending) return;
    
    const messageContent = newMessage.trim();
    
    // 🚀 OPTIMISTIC UPDATE: Limpiar input y mostrar mensaje inmediatamente
    setNewMessage('');
    setIsSending(true);
    
    // Crear mensaje optimista para mostrar inmediatamente
    const optimisticMessage: LeadMessage = {
      _id: `temp-${Date.now()}`,
      leadId: lead._id,
      autor: {
        userId: clerkUser?.id || '',
        nombre: clerkUser?.fullName || clerkUser?.firstName || 'Tú',
        email: clerkUser?.primaryEmailAddress?.emailAddress || '',
        rol: 'CLIENT',
        profileImage: clerkUser?.imageUrl || null,
      },
      contenido: messageContent,
      tipo: 'respuesta_cliente',
      esPrivado: false,
      estado: 'pendiente', // Estado temporal mientras se envía
      leido: false,
      prioridad: 'normal',
      eliminado: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as LeadMessage;

    // Agregar mensaje optimista al final de la lista
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Scroll al nuevo mensaje
    setTimeout(() => scrollToBottom(), 50);
    
    try {
      // Encontrar el último mensaje para responder
      const lastMessage = messages.length > 0 
        ? messages[messages.length - 1] 
        : null;
      
      if (lastMessage) {
        // Responder al último mensaje
        await messageService.replyMessage({
          messageId: lastMessage._id,
          contenido: messageContent,
          esPrivado: false,
        });
      } else {
        // Si no hay mensajes, usar replyMessage con el primer mensaje disponible
        // o enviar como mensaje de cliente
        console.warn('No hay mensajes previos para responder');
        // Intentar enviar como mensaje de cliente
        // Nota: El cliente normalmente responde a mensajes existentes
      }
      
      // ✅ Éxito: Recargar mensajes para obtener el ID real del servidor
      try {
        await loadMessages();
      } catch (e) {
        console.warn('Error recargando mensajes:', e);
      }
      
      // Scroll al final
      scrollToBottom();
      
      // Notificar al componente padre (actualización optimizada)
      if (onMessageSent) {
        onMessageSent();
      }
      
      // Re-focus en textarea
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      
    } catch (err: any) {
      console.error('Error enviando mensaje:', err);
      
      // ❌ Error: Remover el mensaje optimista
      setMessages(prev => prev.filter(m => m._id !== optimisticMessage._id));
      
      // Restaurar el mensaje si falla
      setNewMessage(messageContent);
      const errorMsg = err.response?.data?.message || err.message || 'Error al enviar mensaje';
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ========================================
  // 🎨 HELPERS
  // ========================================

  const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit',
        month: 'long',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Determinar si el mensaje es del cliente actual
  const isOwnMessage = (message: LeadMessage): boolean => {
    // Verificar por email del clerk user
    const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress?.toLowerCase();
    const authorEmail = message.autor?.email?.toLowerCase();
    
    if (userEmail && authorEmail && userEmail === authorEmail) {
      return true;
    }
    
    // Si el tipo es respuesta_cliente, es del cliente
    if (message.tipo === 'respuesta_cliente') {
      return true;
    }
    
    // Si el autor tiene rol CLIENT, es del cliente
    if (message.autor?.rol === 'CLIENT') {
      return true;
    }
    
    return false;
  };
  
  // 🔧 Helper para identificar si un mensaje es del equipo (opuesto a isOwnMessage)
  // Útil para lógica de avatares y estilos
  const isTeamMessage = (message: LeadMessage): boolean => !isOwnMessage(message);

  // Agrupar mensajes por fecha
  const groupMessagesByDate = (msgs: LeadMessage[]) => {
    const groups: { date: string; messages: LeadMessage[] }[] = [];
    let currentDate = '';
    
    for (const msg of msgs) {
      const msgDate = new Date(msg.createdAt).toDateString();
      
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({
          date: msg.createdAt,
          messages: [msg]
        });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    }
    
    return groups;
  };

  // ========================================
  // 🎨 RENDER
  // ========================================

  if (!isOpen) return null;

  const messageGroups = groupMessagesByDate(messages);

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Panel de conversación */}
      <div className={`
        fixed inset-y-0 right-0 w-full sm:w-[420px] lg:w-[480px]
        shadow-2xl z-50
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col
      `}
      style={{
        backgroundColor: isDarkMode ? clientConfig.sidebarBgDark : clientConfig.sidebarBgLight,
      }}
      >
        
        {/* Header del chat - Usa el gradiente del sidebar del cliente */}
        <div 
          className="flex-shrink-0 text-white p-4 shadow-lg"
          style={{ background: headerGradient }}  
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo del negocio */}
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <img 
                  src={businessLogo}
                  alt="THADO Consulting"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    // Fallback al ícono si la imagen falla
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Building2 className="w-6 h-6 hidden" />
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {lead?.nombre || 'THADO Consulting'}
                </h3>
                <p className="text-sm text-white/80">
                  {lead?.tipoServicio || 'consultoria'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenedor de mensajes - Tema oscuro/claro consistente */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto relative"
          style={{
            backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(243, 244, 246, 1)',
            backgroundImage: isDarkMode 
              ? 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%234B5563\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
              : 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader 
                  className="w-10 h-10 animate-spin mx-auto mb-3" 
                  style={{ color: isDarkMode ? clientConfig.headerGradientFromDark : clientConfig.headerGradientFrom }}
                />
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Cargando conversación...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Sin mensajes
                </h4>
                <p className={isDarkMode ? 'text-gray-500 text-sm' : 'text-gray-500 text-sm'}>
                  Aún no hay mensajes en esta conversación
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {messageGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {/* Separador de fecha */}
                  <div className="flex items-center justify-center my-4">
                    <div 
                      className="px-3 py-1 rounded-full shadow-sm"
                      style={{
                        backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {formatMessageDate(group.date)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Mensajes del día */}
                  {group.messages.map((message) => {
                    const isOwn = isOwnMessage(message);
                    const fromTeam = isTeamMessage(message);
                    
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
                      >
                        {/* Avatar del equipo con fondo blanco (solo para mensajes del equipo) */}
                        {fromTeam && (
                          <div className="flex-shrink-0 mr-2">
                            <div 
                              className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md"
                              style={{ border: `2px solid ${isDarkMode ? clientConfig.headerGradientFromDark : clientConfig.headerGradientFrom}` }}
                            >
                              <img 
                                src={businessLogo}
                                alt="THADO"
                                className="w-5 h-5 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const sibling = e.currentTarget.nextElementSibling;
                                  if (sibling) sibling.classList.remove('hidden');
                                }}
                              />
                              <Building2 
                                className="w-4 h-4 hidden" 
                                style={{ color: isDarkMode ? clientConfig.headerGradientFromDark : clientConfig.headerGradientFrom }}
                              />
                            </div>
                          </div>
                        )}
                        
                        <div 
                        className={`
                          max-w-[75%] rounded-2xl px-4 py-3 shadow-sm
                          ${isOwn 
                            ? 'text-white rounded-br-md' 
                            : 'rounded-bl-md'
                          }
                        `}
                        style={{
                          background: isOwn 
                            ? activeButtonGradient
                            : isDarkMode ? 'rgba(55, 65, 81, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                          color: isOwn ? 'white' : isDarkMode ? '#f3f4f6' : '#111827'
                        }}
                      >
                          {/* Header del mensaje (para mensajes del equipo) */}
                          {fromTeam && (
                            <div className="flex items-center gap-2 mb-1">
                              <span 
                                className="text-xs font-semibold"
                                style={{ 
                                  color: isDarkMode 
                                    ? clientConfig.headerGradientViaDark || clientConfig.headerGradientFromDark
                                    : clientConfig.headerGradientFrom 
                                }}
                              >
                                THADO Consulting
                              </span>
                            </div>
                          )}
                          
                          {/* Asunto si existe */}
                          {message.asunto && (
                            <div 
                              className="text-xs font-semibold mb-1"
                              style={{ 
                                color: isOwn 
                                  ? 'rgba(255,255,255,0.8)' 
                                  : isDarkMode ? '#9ca3af' : '#6b7280'
                              }}
                            >
                              📌 {message.asunto}
                            </div>
                          )}
                          
                          {/* Contenido */}
                          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                            {message.contenido}
                          </p>
                          
                          {/* Hora y estado */}
                          <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isOwn ? 'text-green-100' : 'text-gray-400 dark:text-gray-500'}`}>
                            <span>{formatMessageTime(message.createdAt)}</span>
                            {/* Indicador de estado del mensaje */}
                            {isOwn && (
                              message._id.startsWith('temp-') ? (
                                // Mensaje enviando (optimista)
                                <svg className="animate-spin h-3 w-3 ml-1" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                              ) : message.leido ? (
                                // Mensaje leído
                                <span className="ml-1" title="Leído">✓✓</span>
                              ) : (
                                // Mensaje enviado pero no leído
                                <span className="ml-1 opacity-60" title="Enviado">✓</span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              
              {/* Referencia para scroll automático */}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Botón de scroll al final */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-4 right-4 p-3 text-white rounded-full shadow-lg transition-all transform hover:scale-105 hover:shadow-xl"
              style={{ background: activeButtonGradient }}
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Input de mensaje */}
        <div 
          className="flex-shrink-0 p-4"
          style={{
            backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 1)',
            borderTop: `1px solid ${isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'rgba(229, 231, 235, 1)'}`
          }}
        >
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                rows={1}
                className="w-full px-4 py-3 pr-12 rounded-2xl resize-none max-h-32 min-h-[48px] focus:outline-none"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.6)' : 'rgba(243, 244, 246, 1)',
                  border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 1)'}`,
                  color: isDarkMode ? '#f3f4f6' : '#111827',
                  height: 'auto',
                  minHeight: '48px',
                  maxHeight: '128px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              className="p-3 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
              style={{ 
                background: (!newMessage.trim() || isSending) 
                  ? (isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 1)') 
                  : activeButtonGradient 
              }}
            >
              {isSending ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <p className={`text-xs mt-2 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Presiona Enter para enviar • Shift+Enter para nueva línea
          </p>
        </div>
      </div>
    </>
  );
}
