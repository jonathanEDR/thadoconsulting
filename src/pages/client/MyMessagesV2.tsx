/**
 * 💬 MIS MENSAJES - Inbox de Mensajes del Cliente (Versión Mejorada)
 * Vista de lista compacta con panel de conversación estilo WhatsApp
 * Usa el logo del negocio para consistencia de marca
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ClientConversationPanel from '../../components/client/ClientConversationPanel';
import type { LeadMessage } from '../../types/message.types';
import type { Lead } from '../../services/crmService';
import { messageService } from '../../services/messageService';
import { crmService } from '../../services/crmService';
import { useFilterPrivateMessages } from '../../components/guards/PrivateMessageGuard';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';
import { MessageCircle, Loader, Inbox, Search, Building2, ArrowLeft, Filter } from 'lucide-react';

// 🔧 Helper para identificar si un mensaje es del equipo (no del cliente)
const isMessageFromTeam = (message: LeadMessage): boolean => {
  // Criterio 1: El tipo de mensaje NO es respuesta_cliente
  const notClientResponse = message.tipo !== 'respuesta_cliente';
  
  // Criterio 2: El autor tiene rol de admin/moderador/sistema
  const isTeamRole = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SYSTEM'].includes(message.autor?.rol || '');
  
  // Criterio 3: El autor se llama "Sistema" o "SCUTI" (mensajes automáticos)
  const isSystemAuthor = message.autor?.nombre?.toLowerCase().includes('sistema') || 
                         message.autor?.nombre?.toLowerCase().includes('scuti');
  
  // Es del equipo si cumple el criterio principal O tiene rol de equipo O es sistema
  return notClientResponse || isTeamRole || isSystemAuthor;
};

// 🔧 Helper para extraer leadId de manera consistente
const extractLeadId = (leadId: string | object): string => {
  return typeof leadId === 'object' ? (leadId as any)._id : leadId;
};

export default function MyMessages() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🎨 Tema del sidebar para consistencia visual
  const { headerGradient, colors } = useDashboardHeaderGradient();
  const accentColor = colors.from; // Usar el primer color del gradiente como acento
  
  // 🎨 Logo del negocio - usar FAVICON.png que tiene mejor visibilidad
  const businessLogo = '/FAVICON.png';

  // ========================================
  // 📊 STATE
  // ========================================
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<LeadMessage[]>([]);
  const [selectedLead, setSelectedLead] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para panel de conversación
  const [showConversation, setShowConversation] = useState(false);
  const [selectedConversationLead, setSelectedConversationLead] = useState<Lead | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // 🔄 EFFECTS
  // ========================================
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [messages, selectedLead, searchTerm]);

  // ========================================
  // 📊 FUNCIONES DE CARGA
  // ========================================

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Cargar leads del cliente
      const leadsResponse = await crmService.getClientLeads();
      const clientLeads = leadsResponse.data?.leads || [];
      setLeads(clientLeads);

      // Cargar mensajes de todos los leads
      const allMessages: LeadMessage[] = [];
      for (const lead of clientLeads) {
        try {
          const messagesResponse = await messageService.getLeadMessages(lead._id, {
            limit: 100,
            incluirPrivados: false,
          });
          const leadMessages = messagesResponse.data?.mensajes || [];
          allMessages.push(...leadMessages);
        } catch (err) {
          console.warn(`No se pudieron cargar mensajes del lead ${lead._id}`);
        }
      }

      // Ordenar por fecha (más reciente primero)
      allMessages.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Agrupar mensajes por Lead: mostrar solo el último mensaje de cada conversación
      const mensajesAgrupados = agruparMensajesPorLead(allMessages);
      setMessages(mensajesAgrupados);
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError(err.message || 'Error al cargar los mensajes');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🔄 Agrupar mensajes por Lead
   * Muestra solo el mensaje más reciente de cada conversación (Lead)
   */
  const agruparMensajesPorLead = (mensajes: LeadMessage[]): LeadMessage[] => {
    const mensajesPorLead = new Map<string, LeadMessage>();
    
    // Ya vienen ordenados por fecha más reciente primero
    for (const mensaje of mensajes) {
      const leadId = extractLeadId(mensaje.leadId);
      
      if (!mensajesPorLead.has(leadId)) {
        mensajesPorLead.set(leadId, mensaje);
      }
    }
    
    return Array.from(mensajesPorLead.values());
  };
  // ========================================
  // 🎯 FILTROS
  // ========================================

  const applyFilters = () => {
    let result = [...messages];

    // Filtro por lead
    if (selectedLead !== 'all') {
      result = result.filter((msg) => msg.leadId === selectedLead);
    }

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((msg) =>
        msg.contenido.toLowerCase().includes(term) ||
        msg.asunto?.toLowerCase().includes(term) ||
        msg.autor.nombre.toLowerCase().includes(term)
      );
    }

    setFilteredMessages(result);
  };

  const secureFilteredMessages = useFilterPrivateMessages(filteredMessages);

  // ========================================
  // 📨 ACCIONES DE MENSAJES
  // ========================================

  /**
   * 🔓 Abrir panel de conversación
   */
  const handleOpenConversation = async (message: LeadMessage) => {
    // Obtener el leadId correctamente
    const leadId = extractLeadId(message.leadId);
    
    // Buscar el lead completo
    const lead = leads.find(l => l._id === leadId);
    
    if (lead) {
      setSelectedConversationLead(lead);
      setShowConversation(true);
      
      // Marcar como leído
      if (!message.leido) {
        await handleMarkAsRead(message._id);
      }
    }
  };

  /**
   * 🔒 Cerrar panel de conversación
   */
  const handleCloseConversation = () => {
    setShowConversation(false);
    setSelectedConversationLead(null);
  };

  /**
   * 📨 Callback optimizado cuando se envía un mensaje
   * Solo actualiza el mensaje del lead actual sin recargar toda la página
   */
  const handleMessageSent = useCallback(async () => {
    if (!selectedConversationLead?._id) return;

    try {
      // Obtener el último mensaje de este lead específico
      const response = await messageService.getLeadMessages(selectedConversationLead._id, {
        limit: 1,
        incluirPrivados: false,
      });

      if (response.data?.mensajes && response.data.mensajes.length > 0) {
        const latestMessage = response.data.mensajes[0];

        // Actualizar solo este mensaje en la lista existente
        setMessages(prevMessages => {
          const leadId = selectedConversationLead._id;
          const existingIndex = prevMessages.findIndex(m => {
            const msgLeadId = extractLeadId(m.leadId);
            return msgLeadId === leadId;
          });

          if (existingIndex >= 0) {
            // Reemplazar el mensaje existente con el más reciente
            const updatedMessages = [...prevMessages];
            updatedMessages[existingIndex] = latestMessage;
            // Re-ordenar por fecha
            return updatedMessages.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          } else {
            // Agregar el nuevo mensaje al inicio
            return [latestMessage, ...prevMessages];
          }
        });
      }
    } catch (error) {
      console.error('Error actualizando mensaje en lista:', error);
    }
  }, [selectedConversationLead?._id]);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messageService.markAsRead(messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, leido: true } : msg
        )
      );
    } catch (err) {
      console.error('Error marcando como leído:', err);
    }
  };

  // ========================================
  // 🎨 HELPERS
  // ========================================

  const getLeadName = (leadId: string): string => {
    const lead = leads.find((l) => l._id === leadId);
    return lead ? lead.nombre : 'Proyecto Desconocido';
  };

  const getMessagePreview = (content: string, maxLength: number = 100): string => {
    const cleaned = content.replace(/\n/g, ' ').trim();
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `Hace ${minutes} min`;
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('es-ES', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    }
  };

  const unreadCount = messages.filter((m) => !m.leido).length;

  // ========================================
  // 🎨 RENDER
  // ========================================

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error al Cargar</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 md:py-8">
        {/* Header con tema del sidebar */}
        <div 
          className="rounded-2xl p-6 md:p-8 mb-6 text-white shadow-xl"
          style={{ background: headerGradient }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <MessageCircle className="w-8 h-8" />
                Comunicación y Solicitudes
              </h1>
              <p className="text-white/80 text-sm md:text-lg">
                Gestiona tus mensajes y el seguimiento de tus solicitudes
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/client')}
              className="px-4 md:px-6 py-2 md:py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-all border border-white/30 text-sm md:text-base flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          </div>
        </div>

        {/* Pestañas de navegación */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              onClick={() => navigate('/dashboard/client/messages')}
              className={`px-4 md:px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${
                location.pathname === '/dashboard/client/messages'
                  ? ''
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              style={location.pathname === '/dashboard/client/messages' ? { color: accentColor } : {}}
            >
              💬 Mensajes
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
              {location.pathname === '/dashboard/client/messages' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: accentColor }} />
              )}
            </button>
            <button
              onClick={() => navigate('/dashboard/client/solicitudes')}
              className={`px-4 md:px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${
                location.pathname === '/dashboard/client/solicitudes'
                  ? ''
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              style={location.pathname === '/dashboard/client/solicitudes' ? { color: accentColor } : {}}
            >
              📋 Mis Solicitudes
              {location.pathname === '/dashboard/client/solicitudes' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: accentColor }} />
              )}
            </button>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar mensajes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors"
                style={{ '--tw-ring-color': accentColor } as any}
              />
            </div>

            {/* Filtro por proyecto */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedLead}
                onChange={(e) => setSelectedLead(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors"
                style={{ '--tw-ring-color': accentColor } as any}
              >
                <option value="all">Todos los proyectos</option>
                {leads.map((lead) => (
                  <option key={lead._id} value={lead._id}>
                    {lead.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Mensajes */}
        {secureFilteredMessages.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No hay mensajes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'No se encontraron mensajes con ese criterio' : 'Los mensajes del equipo aparecerán aquí'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {secureFilteredMessages.map((message) => {
                // 🎯 Usar helper mejorado para identificar mensajes del equipo
                const isTeamMessage = isMessageFromTeam(message);
                const displayName = isTeamMessage ? 'SCUTI Company' : message.autor.nombre;
                const avatarInitial = isTeamMessage ? 'SC' : message.autor.nombre.charAt(0).toUpperCase();
                
                return (
                <div
                  key={message._id}
                  onClick={() => handleOpenConversation(message)}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  style={!message.leido ? {
                    backgroundColor: `${accentColor}10`
                  } : {}}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar - Logo del negocio para mensajes del equipo */}
                    <div className="flex-shrink-0">
                      {isTeamMessage ? (
                        <div 
                          className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md"
                          style={{ border: `2px solid ${accentColor}` }}
                        >
                          <img 
                            src={businessLogo}
                            alt="SCUTI Company"
                            className="w-9 h-9 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <Building2 className="w-5 h-5 hidden" style={{ color: accentColor }} />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                          {avatarInitial}
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${!message.leido ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {displayName}
                          </h3>
                          {isTeamMessage && (
                            <span 
                              className="px-2 py-0.5 text-xs rounded-full flex items-center gap-1 font-medium"
                              style={{ 
                                backgroundColor: `${accentColor}20`, 
                                color: accentColor 
                              }}
                            >
                              <img 
                                src={businessLogo}
                                alt=""
                                className="w-3 h-3 object-contain"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                              />
                              SCUTI COMPANY
                            </span>
                          )}
                          {!message.leido && (
                            <span 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: accentColor }}
                            ></span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          📊 {getLeadName(extractLeadId(message.leadId))}
                        </span>
                      </div>

                      {message.asunto && (
                        <h4 className={`text-sm mb-1 ${!message.leido ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                          {message.asunto}
                        </h4>
                      )}

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {getMessagePreview(message.contenido)}
                      </p>
                    </div>

                    {/* Icono de conversación */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-1">
                      <MessageCircle 
                        className="w-5 h-5" 
                        style={{ color: !message.leido ? accentColor : '#9ca3af' }}
                      />
                      {!message.leido && (
                        <span className="text-xs font-medium" style={{ color: accentColor }}>Nuevo</span>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Panel de Conversación */}
        <ClientConversationPanel
          isOpen={showConversation}
          onClose={handleCloseConversation}
          lead={selectedConversationLead}
          onMessageSent={handleMessageSent}
        />
      </div>
  );
}
