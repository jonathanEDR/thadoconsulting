/**
 * SCUTI AI Chat Page
 * Página principal del chatbot inteligente
 * 
 * Esta es la interfaz principal de SCUTI AI que permite a los usuarios
 * interactuar con el GerenteGeneral de forma conversacional.
 * 
 * Features:
 * - Chat en tiempo real con GerenteGeneral
 * - Gestión de múltiples conversaciones
 * - Routing inteligente automático
 * - Historial persistente
 * - Responsive design
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useScutiAI } from '../../hooks/useScutiAI';
import ChatHeader from '../../components/scuti-ai/ChatHeader';
import MessageBubble from '../../components/scuti-ai/MessageBubble';
import ChatInput from '../../components/scuti-ai/ChatInput';
import SessionList from '../../components/scuti-ai/SessionList';
import CanvasEditor from '../../components/scuti-ai/CanvasEditor';
import CategoryQuickActions from '../../components/scuti-ai/CategoryQuickActions';
import EventDetailModal from '../../components/agenda/EventDetailModal';
import type { CategoryType } from '../../types/scuti-ai';

// Tipo para tamaño del Canvas
type CanvasSize = 'small' | 'medium' | 'large' | 'full';

import {
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { SCUTI_AI_MASCOT } from '../../utils/brandAssets';

const ScutiAIChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Estado para categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  // Estado para modal de eventos
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Estado para sidebar colapsado
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 🆕 Estado para tamaño flexible del Canvas
  const [canvasSizeState, setCanvasSizeState] = useState<CanvasSize>('medium');
  const [canvasCustomWidth, setCanvasCustomWidth] = useState<number>(33.333);

  const {
    // Estado
    sessions,
    activeSession,
    messages,
    systemStatus,
    error,

    // Canvas
    canvasVisible,
    canvasExpanded,
    canvasMode,
    canvasContent,

    // Loading states
    loadingSessions,
    loadingMessages,
    sending,

    // Acciones
    selectSession,
    createNewSession,
    sendMessage,
    completeSession,
    loadSystemStatus,
    clearError,

    // Canvas actions
    hideCanvas,
    toggleCanvasExpand,
    showCanvas: _showCanvas, // No usado directamente, el canvas se abre automáticamente
    
    // 🆕 Blog context
    activeBlogContext,
    setActiveBlogContext,
    clearBlogContext
  } = useScutiAI();

  // Cargar estado del sistema al montar (solo una vez)
  useEffect(() => {
    // 🆕 Solo cargar si no hay status activo (evita duplicados)
    if (!systemStatus) {
      loadSystemStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 🆕 Sin dependencias - solo al montar

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listener para opciones seleccionadas en el Canvas
  useEffect(() => {
    const handleOptionSelected = (event: Event) => {
      const customEvent = event as CustomEvent<{ value: string }>;
      const optionValue = customEvent.detail.value;
      
      console.log('🎯 Opción seleccionada:', optionValue);
      
      // Enviar el valor de la opción como mensaje
      sendMessage(optionValue);
    };

    window.addEventListener('scuti-ai-option-selected', handleOptionSelected);

    return () => {
      window.removeEventListener('scuti-ai-option-selected', handleOptionSelected);
    };
  }, [sendMessage]);

  // Handlers
  const handleSendMessage = (messageText: string) => {
    sendMessage(messageText);
    // Resetear categoría al enviar mensaje
    setSelectedCategory(null);
  };

  // Handlers de navegación de categorías
  const handleCategorySelect = (category: CategoryType) => {
    // Blog y Servicios van directo a listar (sin accesos directos intermedios)
    if (category === 'blog') {
      sendMessage('mostrar blog');
      return;
    }
    if (category === 'servicios') {
      sendMessage('ver catálogo de servicios');
      return;
    }
    // Agenda mantiene sus accesos directos
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleCategoryActionClick = (prompt: string) => {
    sendMessage(prompt);
    setSelectedCategory(null);
  };

  const handleExport = () => {
    if (!activeSession || messages.length === 0) return;

    // Crear contenido de exportación
    const content = messages
      .map(msg => `[${msg.role}] ${msg.content}`)
      .join('\n\n');

    // Crear blob y descargar
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scuti-ai-chat-${activeSession.sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearConversation = () => {
    if (!activeSession) return;

    if (window.confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
      completeSession(activeSession.sessionId);
      createNewSession();
    }
  };

  const handleSettings = () => {
    navigate('/dashboard/ai-agents');
  };

  // 🆕 Handler para "Ver detalles" - Abre el Canvas con info de la sesión
  const handleViewDetails = () => {
    if (!activeSession) {
      // Si no hay sesión activa, mostrar canvas vacío
      _showCanvas({
        type: 'session_details',
        title: 'Sin conversación activa',
        data: null
      }, 'preview');
      return;
    }

    // Preparar datos de la sesión para mostrar en el Canvas
    const sessionDetails = {
      type: 'session_details' as const,
      title: activeSession.title || 'Detalles de la Conversación',
      data: {
        sessionId: activeSession.sessionId,
        title: activeSession.title,
        createdAt: activeSession.createdAt,
        updatedAt: activeSession.updatedAt,
        messageCount: messages.length,
        agentsUsed: [...new Set(messages.filter(m => m.agentUsed).map(m => m.agentUsed))],
        lastMessage: messages.length > 0 ? messages[messages.length - 1].content.substring(0, 100) + '...' : null
      }
    };

    _showCanvas(sessionDetails, 'preview');
  };

  // 🆕 Handler para "Compartir" - Copia enlace de la conversación
  const handleShare = async () => {
    if (!activeSession) {
      alert('No hay conversación activa para compartir');
      return;
    }

    // Crear enlace con el ID de la sesión
    const shareUrl = `${window.location.origin}/dashboard/scuti-ai?session=${activeSession.sessionId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      // El ChatHeader maneja el feedback visual
    } catch (err) {
      console.error('Error al copiar:', err);
      // Fallback
      prompt('Copia este enlace:', shareUrl);
    }
  };

  // Handler para cuando se hace click en un item del canvas
  const handleCanvasItemClick = async (itemId: string, itemTitle?: string) => {
    // Si es un evento, cargar y mostrar el modal de detalles
    if (canvasContent?.type === 'event_list') {
      try {
        const token = await getToken();
        const response = await fetch(`http://localhost:5000/api/events/${itemId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setSelectedEvent(data.data);
          setShowEventDetailModal(true);
        } else {
          console.error('Error cargando evento:', response.status);
        }
      } catch (error) {
        console.error('Error al cargar evento:', error);
      }
      return;
    }

    // Si es un servicio en lista, enviar consulta automática para más info
    if (canvasContent?.type === 'service_list') {
      if (itemTitle) {
        sendMessage(`Dame información detallada del servicio: ${itemTitle}`);
      } else {
        sendMessage(`Dame información del servicio con id: ${itemId}`);
      }
      return;
    }

    // Si es análisis de servicio, enviar la acción directamente
    // itemTitle contiene el mensaje de acción (ej: "analiza el SEO de este servicio")
    if (canvasContent?.type === 'service_analysis') {
      if (itemTitle) {
        sendMessage(itemTitle);
      }
      return;
    }
    
    // Si es un blog, enviar comando automático para verlo
    // 🆕 También establecer el contexto del blog activo
    if (canvasContent?.type === 'blog_list') {
      // Establecer contexto inmediatamente (optimistic update)
      setActiveBlogContext({
        id: itemId,
        title: itemTitle || 'Blog seleccionado',
        slug: undefined // Se actualizará cuando llegue la respuesta del backend
      });
      
      // Usar el título para un mensaje más natural
      if (itemTitle) {
        sendMessage(`ver blog: ${itemTitle}`);
      } else {
        sendMessage(`ver blog id: ${itemId}`);
      }
      return;
    }
    
    // Para otros tipos de contenido de blog, también usar el título
    if (itemTitle) {
      sendMessage(`ver blog: ${itemTitle}`);
    } else {
      sendMessage(`ver blog id: ${itemId}`);
    }
  };

  // Handler para cuando se hace click en editar blog
  const handleEditBlog = (blogId: string) => {
    // Navegar a la página de edición de blog
    navigate(`/dashboard/blog/posts/${blogId}/edit`);
  };

  return (
      <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
        {/* Sidebar con historial de conversaciones */}
        <div className={`${isSidebarCollapsed ? 'w-14' : 'w-72'} flex-shrink-0 transition-all duration-300`}>
          <SessionList
            sessions={sessions}
            activeSession={activeSession}
            onSelectSession={selectSession}
            onNewSession={createNewSession}
            loading={loadingSessions}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Área principal de chat - Se ajusta dinámicamente según el Canvas */}
        <div 
          className="flex flex-col transition-all duration-300"
          style={{ 
            width: canvasVisible 
              ? `calc(100% - ${isSidebarCollapsed ? '3.5rem' : '18rem'} - ${canvasCustomWidth}%)` 
              : `calc(100% - ${isSidebarCollapsed ? '3.5rem' : '18rem'})`,
            minWidth: '300px'
          }}
        >
          {/* Header */}
          <ChatHeader
            session={activeSession}
            systemStatus={systemStatus}
            onExport={handleExport}
            onClear={handleClearConversation}
            onSettings={handleSettings}
            onViewDetails={handleViewDetails}
            onShare={handleShare}
          />
          
          {/* 🆕 Indicador de Blog Activo */}
          {activeBlogContext && (
            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">📝</span>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Trabajando con: <strong>{activeBlogContext.title}</strong>
                </span>
              </div>
              <button
                onClick={() => {
                  clearBlogContext();
                  sendMessage('mostrar blog');
                }}
                className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
              >
                Cambiar blog
              </button>
            </div>
          )}

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
              {/* Estado vacío - Mostrar categorías o acciones contextuales */}
              {messages.length === 0 && !loadingMessages && (
                <>
                  {selectedCategory ? (
                    // Vista de acciones rápidas contextuales
                    <CategoryQuickActions
                      category={selectedCategory}
                      onBack={handleBackToCategories}
                      onActionClick={handleCategoryActionClick}
                      disabled={sending}
                    />
                  ) : (
                    // Vista inicial con tarjetas de categorías - COMPACTO
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center mb-4 p-2">
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
                        <Sparkles size={32} className="text-purple-600 dark:text-purple-400 hidden" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        ¡Hola! Soy THADO AI
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-4">
                        Selecciona una categoría para comenzar:
                      </p>
                      <div className="grid grid-cols-3 gap-3 max-w-xl">
                        <button
                          onClick={() => handleCategorySelect('blog')}
                          className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all transform hover:scale-105 hover:shadow-md border border-transparent hover:border-blue-300 dark:hover:border-blue-700"
                        >
                          <div className="text-xl mb-1">📝</div>
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5">
                            Contenido & Blog
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Crear y optimizar artículos
                          </p>
                        </button>
                        <button
                          onClick={() => handleCategorySelect('servicios')}
                          className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all transform hover:scale-105 hover:shadow-md border border-transparent hover:border-purple-300 dark:hover:border-purple-700"
                        >
                          <div className="text-xl mb-1">💼</div>
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5">
                            Servicios
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Analizar y gestionar portafolio
                          </p>
                        </button>
                        <button
                          onClick={() => handleCategorySelect('agenda')}
                          className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-left hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-all transform hover:scale-105 hover:shadow-md border border-transparent hover:border-pink-300 dark:hover:border-pink-700"
                        >
                          <div className="text-xl mb-1">📅</div>
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5">
                            Agenda
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Gestionar eventos y reuniones
                          </p>
                        </button>
                      </div>
                      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                        ¿En qué puedo ayudarte hoy?
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Loading inicial */}
              {loadingMessages && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-blue-600" />
                </div>
              )}

              {/* Mensajes */}
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isLatest={index === messages.length - 1}
                />
              ))}

              {/* Typing indicator */}
              {sending && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center p-1 overflow-hidden">
                    <img
                      src={SCUTI_AI_MASCOT.png}
                      alt={SCUTI_AI_MASCOT.alt}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">
                      Error al procesar mensaje
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                  </div>
                  <button
                    onClick={clearError}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <ChatInput
            onSend={handleSendMessage}
            disabled={!activeSession}
            loading={sending}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Canvas Editor */}
        <CanvasEditor
          isVisible={canvasVisible}
          isExpanded={canvasExpanded}
          mode={canvasMode}
          content={canvasContent}
          onClose={hideCanvas}
          onToggleExpand={toggleCanvasExpand}
          onItemClick={handleCanvasItemClick}
          onEditClick={handleEditBlog}
          canvasSize={canvasSizeState}
          onSizeChange={setCanvasSizeState}
          customWidth={canvasCustomWidth}
          onWidthChange={setCanvasCustomWidth}
        />

        {/* Event Detail Modal */}
        {selectedEvent && (
          <EventDetailModal
            show={showEventDetailModal}
            event={selectedEvent}
            onClose={() => {
              setShowEventDetailModal(false);
              setSelectedEvent(null);
            }}
            onEdit={undefined}
            onDelete={undefined}
            onStatusChange={undefined}
            isLoading={false}
          />
        )}
      </div>
  );
};

export default ScutiAIChatPage;
