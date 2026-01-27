/**
 * 💬 CONVERSATION PANEL - Panel de Conversación Estilo WhatsApp
 * Panel lateral para ver y responder mensajes de un Lead
 * Integrado con el tema del dashboard para consistencia visual
 */

import React, { useState, useEffect, useRef } from 'react';
import { messageService, formatRelativeTime } from '../../../services/messageService';
import type { LeadMessage } from '../../../types/message.types';
import { useUser } from '@clerk/clerk-react';
import { useDashboardHeaderGradient } from '../../../hooks/cms/useDashboardHeaderGradient';

// ========================================
// 🎨 TIPOS
// ========================================

interface Lead {
  _id: string;
  nombre: string;
  correo?: string;
  celular?: string;
  empresa?: string;
  estado?: string;
  tipoServicio?: string;
  usuarioRegistrado?: {
    userId: string;
    nombre: string;
    email: string;
  };
}

interface ConversationPanelProps {
  lead: Lead;
  initialMessage?: LeadMessage;
  onClose: () => void;
  onMessageSent?: () => void;
}

// ========================================
// 🎨 COMPONENTE PRINCIPAL
// ========================================

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  lead,
  // initialMessage - reservado para scroll automático al mensaje seleccionado
  onClose,
  onMessageSent,
}) => {
  const { user } = useUser();
  
  // 🎨 Hook para obtener colores del tema del dashboard
  const { headerGradient, isDarkMode } = useDashboardHeaderGradient();
  
  // State
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'client' | 'internal'>('client');
  const [replyingTo, setReplyingTo] = useState<LeadMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ========================================
  // 🔄 EFECTOS
  // ========================================

  useEffect(() => {
    loadMessages();
  }, [lead._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [newMessage]);

  // ========================================
  // 📥 FUNCIONES
  // ========================================

  const loadMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await messageService.getLeadMessages(lead._id, {
        incluirPrivados: true,
        limit: 100,
      });
      
      if (response.success && response.data) {
        // Ordenar mensajes de más antiguo a más reciente para el chat
        const sortedMessages = [...(response.data.mensajes || [])].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setMessages(sortedMessages);
      }
    } catch (err: any) {
      console.error('Error cargando mensajes:', err);
      setError(err.message || 'Error al cargar los mensajes');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    const messageContent = newMessage.trim();
    const currentMessageType = messageType;
    const currentReplyingTo = replyingTo;
    
    setIsSending(true);
    setError(null);

    // 🚀 OPTIMISTIC UPDATE: Agregar mensaje localmente inmediatamente
    const optimisticMessage: LeadMessage = {
      _id: `temp-${Date.now()}`, // ID temporal
      leadId: lead._id,
      autor: {
        userId: user?.id || '',
        nombre: user?.fullName || user?.firstName || 'Tú',
        email: user?.primaryEmailAddress?.emailAddress || '',
        rol: 'ADMIN',
        profileImage: user?.imageUrl || null,
      },
      contenido: messageContent,
      tipo: currentMessageType === 'internal' ? 'nota_interna' : 'mensaje_cliente',
      esPrivado: currentMessageType === 'internal',
      estado: 'pendiente', // Estado temporal mientras se envía
      leido: false,
      prioridad: 'normal',
      eliminado: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as LeadMessage;

    // Agregar mensaje optimista al final de la lista
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Limpiar input inmediatamente para mejor UX
    setNewMessage('');
    setReplyingTo(null);
    
    // Scroll al nuevo mensaje
    setTimeout(() => scrollToBottom(), 50);

    try {
      if (currentReplyingTo) {
        // Responder a un mensaje específico
        await messageService.replyMessage({
          messageId: currentReplyingTo._id,
          contenido: messageContent,
          esPrivado: currentMessageType === 'internal',
        });
      } else if (currentMessageType === 'internal') {
        // Nota interna
        await messageService.sendInternalMessage({
          leadId: lead._id,
          contenido: messageContent,
          prioridad: 'normal',
        });
      } else {
        // Mensaje al cliente - verificar que tenga usuario registrado
        if (!lead.usuarioRegistrado?.userId) {
          // Si no tiene usuario, forzar a nota interna automáticamente
          console.warn('Lead sin usuario registrado, enviando como nota interna');
          await messageService.sendInternalMessage({
            leadId: lead._id,
            contenido: `[Mensaje pendiente para cliente]: ${messageContent}`,
            prioridad: 'normal',
          });
          setError('El lead no tiene usuario vinculado. El mensaje se guardó como nota interna.');
        } else {
          await messageService.sendClientMessage({
            leadId: lead._id,
            contenido: messageContent,
            prioridad: 'normal',
            canal: 'sistema',
          });
        }
      }

      // ✅ Éxito: Recargar mensajes para obtener el ID real del servidor
      // Esto reemplazará el mensaje optimista con el real
      try {
        await loadMessages();
      } catch (loadErr) {
        console.error('Error recargando mensajes:', loadErr);
      }
      
      // Notificar al padre (solo actualiza stats, no recarga toda la página)
      onMessageSent?.();
      
      // Volver a enfocar el textarea para continuar escribiendo
      setTimeout(() => {
        textareaRef.current?.focus();
        scrollToBottom();
      }, 100);
      
    } catch (err: any) {
      console.error('Error enviando mensaje:', err);
      setError(err.response?.data?.message || err.message || 'Error al enviar el mensaje');
      
      // ❌ Error: Remover el mensaje optimista
      setMessages(prev => prev.filter(m => m._id !== optimisticMessage._id));
      
      // Restaurar el contenido del mensaje para que el usuario pueda reintentar
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messageService.markAsRead(messageId);
      setMessages(prev => 
        prev.map(m => m._id === messageId ? { ...m, leido: true } : m)
      );
    } catch (err) {
      console.error('Error marcando como leído:', err);
    }
  };

  // ========================================
  // 🎨 HELPERS DE RENDER
  // ========================================

  const getMessageTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'nota_interna': return '📝';
      case 'mensaje_cliente': return '✉️';
      case 'respuesta_cliente': return '💬';
      case 'email': return '📧';
      case 'sms': return '📱';
      case 'notificacion': return '🔔';
      default: return '💬';
    }
  };



  const isOwnMessage = (message: LeadMessage) => {
    return message.autor.userId === user?.id;
  };

  const isClientMessage = (message: LeadMessage) => {
    return message.tipo === 'respuesta_cliente';
  };

  const getStatusBadge = (estado: string) => {
    const estados: Record<string, { color: string; label: string }> = {
      nuevo: { color: 'bg-blue-500', label: 'Nuevo' },
      en_revision: { color: 'bg-yellow-500', label: 'En Revisión' },
      contactando: { color: 'bg-purple-500', label: 'Contactando' },
      cotizacion: { color: 'bg-orange-500', label: 'Cotización' },
      aprobado: { color: 'bg-green-500', label: 'Aprobado' },
      en_desarrollo: { color: 'bg-indigo-500', label: 'En Desarrollo' },
      completado: { color: 'bg-emerald-500', label: 'Completado' },
      rechazado: { color: 'bg-red-500', label: 'Rechazado' },
      cancelado: { color: 'bg-gray-500', label: 'Cancelado' },
    };
    
    const config = estados[estado] || { color: 'bg-gray-500', label: estado };
    
    return (
      <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // ========================================
  // 🎨 RENDER
  // ========================================

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[560px] shadow-2xl z-50 flex flex-col border-l ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header - Usa el gradiente del dashboard */}
      <div 
        className="flex-shrink-0 text-white p-4"
        style={{ background: headerGradient }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold truncate">{lead.nombre}</h2>
              {lead.estado && getStatusBadge(lead.estado)}
            </div>
            <div className="text-sm text-white/80 space-y-0.5">
              {lead.correo && (
                <p className="truncate">📧 {lead.correo}</p>
              )}
              {lead.celular && (
                <p>📱 {lead.celular}</p>
              )}
              {lead.empresa && (
                <p className="truncate">🏢 {lead.empresa}</p>
              )}
              {lead.tipoServicio && (
                <p>🎯 {lead.tipoServicio}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors ml-2"
            title="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Indicador de usuario vinculado */}
        {lead.usuarioRegistrado ? (
          <div className="mt-3 px-3 py-2 bg-white/20 rounded-lg text-sm">
            <span className="font-medium">✅ Usuario vinculado:</span> {lead.usuarioRegistrado.nombre}
          </div>
        ) : (
          <div className="mt-3 px-3 py-2 bg-yellow-500/30 rounded-lg text-sm">
            <span className="font-medium">⚠️ Sin usuario vinculado</span>
            <span className="text-white/80"> - Solo notas internas disponibles</span>
          </div>
        )}
      </div>

      {/* Messages Container - Tema oscuro consistente */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
        isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
      }`}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-2">⏳</div>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Cargando conversación...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-4xl mb-2">💬</p>
              <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Sin mensajes
              </p>
              <p className={isDarkMode ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>
                Inicia la conversación enviando un mensaje
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwn = isOwnMessage(message);
              const isClient = isClientMessage(message);
              const isInternal = message.tipo === 'nota_interna';
              
              // Determinar alineación y estilo basados en isDarkMode
              let alignment = 'justify-start';
              let bubbleStyle = isDarkMode 
                ? 'bg-gray-700 text-white' 
                : 'bg-white text-gray-900';
              let borderStyle = isDarkMode 
                ? 'border-l-4 border-gray-600' 
                : 'border-l-4 border-gray-300';
              
              if (isInternal) {
                // Notas internas - estilo especial de "sticky note" centrado
                alignment = 'justify-center';
                bubbleStyle = isDarkMode 
                  ? 'bg-amber-900/30 text-amber-100 border border-amber-700' 
                  : 'bg-amber-50 text-amber-900 border border-amber-300';
                borderStyle = '';
              } else if (isClient) {
                // Mensajes del cliente - izquierda
                alignment = 'justify-start';
                bubbleStyle = isDarkMode 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-white text-gray-900';
                borderStyle = 'border-l-4 border-purple-500';
              } else if (isOwn || message.tipo === 'mensaje_cliente') {
                // Mensajes enviados al cliente - derecha
                alignment = 'justify-end';
                bubbleStyle = 'bg-gradient-to-r from-blue-600 to-purple-600 text-white';
                borderStyle = '';
              }

              return (
                <div key={message._id} className={`flex ${alignment}`}>
                  {/* Nota interna con estilo especial */}
                  {isInternal ? (
                    <div className={`max-w-[90%] rounded-lg p-3 shadow-sm ${bubbleStyle}`}>
                      <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${isDarkMode ? 'border-amber-700' : 'border-amber-300'}`}>
                        <span className="text-lg">📝</span>
                        <span className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                          Nota del Equipo
                        </span>
                        <span className={`text-xs ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                          (Solo visible para el equipo)
                        </span>
                      </div>
                      <div className={`text-xs mb-1 ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                        <span className="font-medium">{message.autor.nombre}</span>
                      </div>
                      <div className="whitespace-pre-wrap break-words text-sm">
                        {message.contenido}
                      </div>
                      <div className={`flex items-center justify-end mt-2 text-xs ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                        <span>{formatRelativeTime(message.createdAt)}</span>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`max-w-[85%] rounded-xl p-3 shadow-sm ${bubbleStyle} ${borderStyle}`}
                      onClick={() => !message.leido && handleMarkAsRead(message._id)}
                    >
                      {/* Avatar + Header del mensaje */}
                      <div className="flex items-start gap-2 mb-2">
                        {/* Avatar del autor */}
                        {isClient && (message.autor?.rol === 'CLIENT' || message.autor?.rol === 'USER') ? (
                          /* Mensaje del Cliente Real - Avatar usando profileImage guardado */
                          message.autor?.profileImage ? (
                            <img 
                              src={message.autor.profileImage}
                              alt={message.autor.nombre}
                              className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling;
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : (
                            /* Sin imagen de perfil - Usar inicial */
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {message.autor?.nombre?.[0]?.toUpperCase() || 'C'}
                            </div>
                          )
                        ) : !isClient && !isOwn ? (
                          /* Mensaje del Equipo - Logo de la empresa */
                          <div className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden flex-shrink-0 border border-green-500">
                            <img 
                              src="/FAVICON.png"
                              alt="SCUTI"
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        ) : null}
                        
                        {/* Info del autor */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs opacity-80 flex-wrap">
                            <span>{getMessageTypeIcon(message.tipo)}</span>
                            <span className="font-medium">{message.autor.nombre}</span>
                            {!message.leido && !isOwn && (
                              <span className="px-1.5 py-0.5 bg-red-500 text-white rounded text-[10px]">
                                Nuevo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="whitespace-pre-wrap break-words text-sm">
                        {message.contenido}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <span>{formatRelativeTime(message.createdAt)}</span>
                        <div className="flex items-center gap-2">
                          {/* Indicador de estado del mensaje */}
                          {message._id.startsWith('temp-') ? (
                            // Mensaje enviando (optimista)
                            <span className="flex items-center gap-1 text-blue-400" title="Enviando...">
                              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                            </span>
                          ) : message.leido ? (
                            // Mensaje leído
                            <span title="Leído" className="text-blue-400">✓✓</span>
                          ) : (
                            // Mensaje enviado pero no leído
                            <span title="Enviado" className="opacity-60">✓</span>
                          )}
                          {!message._id.startsWith('temp-') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setReplyingTo(message);
                                textareaRef.current?.focus();
                              }}
                              className="hover:opacity-100 opacity-60 transition-opacity"
                              title="Responder"
                            >
                              ↩️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm border-t border-red-200 dark:border-red-800">
          ⚠️ {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 underline hover:no-underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Reply Preview */}
      {replyingTo && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                ↩️ Respondiendo a {replyingTo.autor.nombre}
              </p>
              <p className={`text-sm truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {replyingTo.contenido.substring(0, 60)}...
              </p>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className={`p-1 rounded ${isDarkMode ? 'hover:bg-blue-800' : 'hover:bg-blue-200'}`}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Input Area - Tema oscuro consistente */}
      <div className={`flex-shrink-0 border-t p-4 ${
        isDarkMode 
          ? 'border-gray-700 bg-gray-900' 
          : 'border-gray-200 bg-white'
      }`}>
        {/* Message Type Selector */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setMessageType('client')}
            disabled={!lead.usuarioRegistrado}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              messageType === 'client'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${!lead.usuarioRegistrado ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ✉️ Mensaje al Cliente
          </button>
          <button
            onClick={() => setMessageType('internal')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              messageType === 'internal'
                ? 'bg-amber-500 text-white shadow-md'
                : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📝 Nota Interna
          </button>
        </div>

        {/* Input */}
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
              placeholder={
                messageType === 'internal'
                  ? 'Escribe una nota interna (solo visible para el equipo)...'
                  : 'Escribe tu mensaje al cliente...'
              }
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px] ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500'
              }`}
              rows={1}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className={`p-3 rounded-xl transition-all ${
              newMessage.trim() && !isSending
                ? messageType === 'internal'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSending ? (
              <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>

        {/* Hint */}
        <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
};

export default ConversationPanel;
