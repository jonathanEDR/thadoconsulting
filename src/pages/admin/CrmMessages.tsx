/**
 * 💬 CRM MESSAGES - Página de Gestión de Mensajería
 * Panel administrativo completo para gestionar todos los mensajes del CRM
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageFiltersComponent } from '../../components/crm/messages/MessageFilters';
import { TemplateEditor } from '../../components/crm/templates/TemplateEditor';
import { MessageComposer } from '../../components/crm/messages/MessageComposer';
import { ConversationPanel } from '../../components/crm/messages/ConversationPanel';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';
import type { 
  LeadMessage, 
  MessageTemplate, 
  MessageFilters, 
  MessageStats,
  CreateInternalMessageData,
  CreateClientMessageData 
} from '../../types/message.types';
import { messageService, templateService } from '../../services/messageService';
import { crmService } from '../../services/crmService';
import * as directMessageService from '../../services/directMessageService';
import { MESSAGE_TYPE_LABELS, MESSAGE_PRIORITY_COLORS } from '../../types/message.types';
import { formatRelativeTime } from '../../services/messageService';

type ViewMode = 'messages' | 'templates';
type TemplateModalMode = 'selector' | 'editor' | null;

/**
 * 🎨 Componente Principal CrmMessages
 */
export const CrmMessages: React.FC = () => {
  // 🎨 Obtener gradiente del header del sidebar para consistencia visual
  const { headerGradient } = useDashboardHeaderGradient();
  
  // 🔗 Parámetros de URL para abrir conversación desde notificaciones
  const [searchParams, setSearchParams] = useSearchParams();
  const urlLeadId = searchParams.get('leadId');
  const urlMessageId = searchParams.get('messageId');
  
  // Flag para evitar abrir múltiples veces
  const hasOpenedFromUrl = useRef(false);
  
  // ========================================
  // 📊 STATE
  // ========================================
  
  const [viewMode, setViewMode] = useState<ViewMode>('messages');
  
  // Mensajes
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageFilters, setMessageFilters] = useState<MessageFilters>({
    page: 1,
    limit: 50,
  });
  const [stats, setStats] = useState<MessageStats | null>(null);
  
  // Panel de conversación
  const [showConversation, setShowConversation] = useState(false);
  const [selectedConversationLead, setSelectedConversationLead] = useState<any>(null);
  const [selectedConversationMessage, setSelectedConversationMessage] = useState<LeadMessage | null>(null);
  
  // Plantillas
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [templateModal, setTemplateModal] = useState<TemplateModalMode>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | undefined>();
  const [templateFavorites, setTemplateFavorites] = useState<string[]>([]);

  // Selección múltiple
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  // Composer Modal
  const [showComposer, setShowComposer] = useState(false);
  const [composerMode, setComposerMode] = useState<'internal' | 'client'>('internal');
  const [selectedLead, setSelectedLead] = useState<string>('');
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  
  // Direct Messages (usuarios sin leads)
  const [messageTarget, setMessageTarget] = useState<'lead' | 'user'>('lead');
  const [directUsers, setDirectUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // ========================================
  // 🔄 EFFECTS
  // ========================================

  useEffect(() => {
    if (viewMode === 'messages') {
      loadMessages();
      loadStats();
    } else {
      loadTemplates();
    }
  }, [viewMode, messageFilters.page]);

  /**
   * 🔔 Abrir conversación desde notificación (URL params)
   */
  useEffect(() => {
    const openConversationFromUrl = async () => {
      // Solo procesar si hay parámetros y no hemos abierto ya
      if (!urlLeadId || hasOpenedFromUrl.current || showConversation) return;
      
      hasOpenedFromUrl.current = true;
      
      try {
        // Cargar datos del lead
        const response = await crmService.getLead(urlLeadId);
        
        if (response.success && response.data) {
          const leadData = response.data;
          
          // Si tenemos messageId, intentar cargar ese mensaje específico
          let messageData = null;
          if (urlMessageId) {
            try {
              const msgResponse = await messageService.getMessage(urlMessageId);
              if (msgResponse.success && msgResponse.data) {
                messageData = msgResponse.data;
              }
            } catch (msgError) {
              console.warn('No se pudo cargar el mensaje específico:', msgError);
            }
          }
          
          // Abrir panel de conversación
          setSelectedConversationLead(leadData);
          setSelectedConversationMessage(messageData);
          setShowConversation(true);
          
          // Limpiar los parámetros de URL después de procesar
          setSearchParams({}, { replace: true });
        }
      } catch (error) {
        console.error('Error abriendo conversación desde URL:', error);
        hasOpenedFromUrl.current = false; // Permitir reintentar
      }
    };
    
    // Esperar a que los mensajes se carguen antes de procesar URL
    if (messages.length > 0 || !isLoadingMessages) {
      openConversationFromUrl();
    }
  }, [urlLeadId, urlMessageId, messages.length, isLoadingMessages, showConversation, setSearchParams]);

  // ========================================
  // 📩 FUNCIONES DE MENSAJES
  // ========================================

  const loadMessages = async () => {
    setIsLoadingMessages(true);
    try {
      // Filtrar para excluir notas internas de la lista principal
      // Las notas internas solo se ven dentro del panel de conversación
      const filtersWithoutInternalNotes = {
        ...messageFilters,
        // Solo mostrar mensajes de cliente y respuestas en la bandeja principal
        excluirNotasInternas: true,
      };

      // Si hay texto de búsqueda, usar searchMessages
      if (messageFilters.search && messageFilters.search.length >= 3) {
        const response = await messageService.searchMessages(filtersWithoutInternalNotes);
        if (response.success && response.data) {
          // Filtrar notas internas del resultado
          const mensajesFiltrados = (response.data.mensajes || []).filter(
            (m: any) => m.tipo !== 'nota_interna'
          );
          // Agrupar por Lead: mostrar solo el último mensaje de cada conversación
          const mensajesAgrupados = agruparMensajesPorLead(mensajesFiltrados);
          setMessages(mensajesAgrupados);
        }
      } else {
        // Si no hay búsqueda, cargar todos los mensajes (excepto notas internas)
        const response = await messageService.getAllMessages(filtersWithoutInternalNotes);
        if (response.success && response.data) {
          // Filtrar notas internas del resultado
          const mensajesFiltrados = (response.data.mensajes || []).filter(
            (m: any) => m.tipo !== 'nota_interna'
          );
          // Agrupar por Lead: mostrar solo el último mensaje de cada conversación
          const mensajesAgrupados = agruparMensajesPorLead(mensajesFiltrados);
          setMessages(mensajesAgrupados);
        }
      }
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      // En caso de error, mostrar array vacío
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  /**
   * 🔄 Agrupar mensajes por Lead
   * Muestra solo el mensaje más reciente de cada conversación (Lead)
   * Esto evita que aparezcan múltiples filas para el mismo Lead
   */
  const agruparMensajesPorLead = (mensajes: LeadMessage[]): LeadMessage[] => {
    const mensajesPorLead = new Map<string, LeadMessage>();
    
    // Ordenar por fecha más reciente primero
    const mensajesOrdenados = [...mensajes].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Agrupar: solo guardar el primer mensaje (más reciente) de cada Lead
    for (const mensaje of mensajesOrdenados) {
      const leadId = typeof mensaje.leadId === 'object' 
        ? mensaje.leadId._id 
        : mensaje.leadId;
      
      if (!mensajesPorLead.has(leadId)) {
        mensajesPorLead.set(leadId, mensaje);
      }
    }
    
    // Retornar como array ordenado por fecha
    return Array.from(mensajesPorLead.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const loadStats = async () => {
    try {
      const response = await messageService.getMessageStats();
      if (response.success && response.data) {
        const stats: MessageStats = {
          total: response.data.total || 0,
          noLeidos: response.data.noLeidos || 0,
          enviados: response.data.enviados || 0,
          respondidos: response.data.respondidos || 0,
          porTipo: response.data.porTipo || {},
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleFilterChange = (filters: MessageFilters) => {
    setMessageFilters({ ...messageFilters, ...filters, page: 1 });
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await messageService.markAsRead(messageId);
      if (response.success) {
        await loadMessages();
        await loadStats();
      }
    } catch (error) {
      console.error('Error marcando como leído:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (selectedMessages.size === 0) {
      alert('Selecciona al menos un mensaje');
      return;
    }

    try {
      const promises = Array.from(selectedMessages).map(id => 
        messageService.markAsRead(id)
      );
      await Promise.all(promises);
      setSelectedMessages(new Set());
      await loadMessages();
      await loadStats();
    } catch (error) {
      console.error('Error marcando mensajes como leídos:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este mensaje?')) {
      return;
    }

    try {
      const response = await messageService.deleteMessage(messageId);
      if (response.success) {
        await loadMessages();
        await loadStats();
      }
    } catch (error) {
      console.error('Error eliminando mensaje:', error);
    }
  };

  const toggleMessageSelection = (messageId: string) => {
    const newSelection = new Set(selectedMessages);
    if (newSelection.has(messageId)) {
      newSelection.delete(messageId);
    } else {
      newSelection.add(messageId);
    }
    setSelectedMessages(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedMessages.size === messages.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(messages.map(m => m._id)));
    }
  };

  /**
   * 💬 Abrir panel de conversación
   */
  const handleOpenConversation = async (message: LeadMessage) => {
    try {
      // Obtener información del lead
      let leadData = null;
      
      if (typeof message.leadId === 'object' && message.leadId !== null) {
        // Ya tenemos la info del lead populada
        const leadInfo = message.leadId as any;
        leadData = {
          _id: leadInfo._id,
          nombre: leadInfo.nombre || 'Lead',
          correo: leadInfo.correo,
          estado: leadInfo.estado,
          usuarioRegistrado: leadInfo.usuarioRegistrado,
        };
      } else if (typeof message.leadId === 'string') {
        // Necesitamos cargar el lead completo
        const response = await crmService.getLead(message.leadId);
        if (response.success && response.data) {
          leadData = response.data;
        }
      }

      if (leadData) {
        setSelectedConversationLead(leadData);
        setSelectedConversationMessage(message);
        setShowConversation(true);
      } else {
        console.error('No se pudo obtener información del lead');
        alert('Error: No se pudo obtener información de la solicitud');
      }
    } catch (error) {
      console.error('Error abriendo conversación:', error);
      alert('Error al abrir la conversación');
    }
  };

  /**
   * 🔄 Cerrar panel de conversación
   */
  const handleCloseConversation = () => {
    setShowConversation(false);
    setSelectedConversationLead(null);
    setSelectedConversationMessage(null);
  };

  /**
   * 🔄 Callback optimizado cuando se envía un mensaje desde el panel de conversación
   * Solo actualiza las estadísticas y el mensaje más reciente del lead en la lista
   * SIN recargar toda la tabla de mensajes para evitar re-renders innecesarios
   */
  const handleConversationMessageSent = useCallback(async () => {
    // 1. Solo actualizar las estadísticas (ligero)
    try {
      const response = await messageService.getMessageStats();
      if (response.success && response.data) {
        setStats({
          total: response.data.total || 0,
          noLeidos: response.data.noLeidos || 0,
          enviados: response.data.enviados || 0,
          respondidos: response.data.respondidos || 0,
          porTipo: response.data.porTipo || {},
        });
      }
    } catch (error) {
      console.error('Error actualizando estadísticas:', error);
    }

    // 2. Actualizar solo el mensaje del lead actual en la lista (si existe)
    if (selectedConversationLead?._id) {
      try {
        // Obtener el último mensaje de este lead específico
        const response = await messageService.getLeadMessages(selectedConversationLead._id, {
          limit: 1,
          incluirPrivados: false,
        });
        
        if (response.success && response.data?.mensajes && response.data.mensajes.length > 0) {
          const latestMessage = response.data.mensajes[0];
          
          // Actualizar solo este mensaje en la lista existente
          setMessages(prevMessages => {
            // Buscar si ya existe un mensaje de este lead
            const leadId = selectedConversationLead._id;
            const existingIndex = prevMessages.findIndex(m => {
              const msgLeadId = typeof m.leadId === 'object' ? m.leadId._id : m.leadId;
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
    }
  }, [selectedConversationLead?._id]);

  /**
   * Cargar lista de leads para el composer
   */
  const loadLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const response = await crmService.getLeads({
        page: 1,
        limit: 100,
      });
      if (response.success && response.data) {
        setLeads(response.data || []);
      }
    } catch (error) {
      console.error('Error cargando leads:', error);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  /**
   * Cargar lista de usuarios activos para mensajes directos
   */
  const loadDirectUsers = async () => {
    setIsLoadingUsers(true);
    try {
      console.log('🔄 Cargando usuarios activos...');
      const response = await directMessageService.getAllActiveUsers();
      console.log('✅ Usuarios cargados:', response);
      setDirectUsers(response.users || []);
      
      if (response.users.length === 0) {
        console.warn('⚠️ No se encontraron usuarios activos');
      }
    } catch (error: any) {
      console.error('❌ Error cargando usuarios:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setDirectUsers([]);
      
      // Mostrar error al usuario
      alert(`Error cargando usuarios: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  /**
   * Abrir composer de mensajes
   */
  const handleOpenComposer = (mode: 'internal' | 'client' = 'internal') => {
    setComposerMode(mode);
    setShowComposer(true);
    if (messageTarget === 'lead' && leads.length === 0) {
      loadLeads();
    } else if (messageTarget === 'user' && directUsers.length === 0) {
      loadDirectUsers();
    }
  };

  /**
   * Cerrar composer
   */
  const handleCloseComposer = () => {
    setShowComposer(false);
    setSelectedLead('');
    setSelectedUser('');
    setMessageTarget('lead');
  };

  /**
   * Enviar mensaje desde composer
   */
  const handleSendMessage = async (data: CreateInternalMessageData | CreateClientMessageData) => {
    try {
      // Si el target es usuario directo, usar el servicio de mensajes directos
      if (messageTarget === 'user' && selectedUser) {
        await directMessageService.sendDirectMessage(selectedUser, {
          asunto: data.asunto,
          contenido: data.contenido,
          prioridad: data.prioridad,
          canal: 'sistema',
        });
      } else if (messageTarget === 'lead' && selectedLead) {
        // Mensaje tradicional a través de lead
        if (composerMode === 'internal') {
          await messageService.sendInternalMessage(data as CreateInternalMessageData);
        } else {
          await messageService.sendClientMessage(data as CreateClientMessageData);
        }
      } else {
        throw new Error('Debe seleccionar un destinatario');
      }
      
      handleCloseComposer();
      loadMessages(); // Recargar lista
      
      // Mostrar notificación de éxito (opcional)
      console.log('✅ Mensaje enviado correctamente');
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  // ========================================
  // 📋 FUNCIONES DE PLANTILLAS
  // ========================================

  const loadTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const response = await templateService.getTemplates();
      if (response.success && response.data) {
        setTemplates(response.data.plantillas || []);
      }
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleSaveTemplate = async (data: Partial<MessageTemplate>) => {
    try {
      let response;
      if (selectedTemplate) {
        response = await templateService.updateTemplate(selectedTemplate._id, data);
      } else {
        response = await templateService.createTemplate(data as any);
      }

      if (response.success) {
        setTemplateModal(null);
        setSelectedTemplate(undefined);
        await loadTemplates();
      } else {
        alert(response.message || 'Error al guardar plantilla');
      }
    } catch (error) {
      console.error('Error guardando plantilla:', error);
      alert('Error al guardar la plantilla');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta plantilla?')) {
      return;
    }

    try {
      const response = await templateService.deleteTemplate(templateId);
      if (response.success) {
        await loadTemplates();
      }
    } catch (error) {
      console.error('Error eliminando plantilla:', error);
    }
  };

  const handleToggleFavorite = async (templateId: string) => {
    try {
      const response = await templateService.toggleFavorite(templateId);
      if (response.success) {
        // Toggle en el estado local
        setTemplateFavorites(prev => {
          const newFavorites = new Set(prev);
          if (newFavorites.has(templateId)) {
            newFavorites.delete(templateId);
          } else {
            newFavorites.add(templateId);
          }
          return Array.from(newFavorites);
        });
        await loadTemplates();
      }
    } catch (error) {
      console.error('Error toggle favorito:', error);
    }
  };

  // ========================================
  // 🎨 RENDER HELPERS
  // ========================================

  const getMessageTypeBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      nota_interna: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      mensaje_cliente: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      respuesta_cliente: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[tipo] || 'bg-gray-100 text-gray-700'}`}>
        {MESSAGE_TYPE_LABELS[tipo as keyof typeof MESSAGE_TYPE_LABELS] || tipo}
      </span>
    );
  };

  const getPriorityBadge = (prioridad: string) => {
    const color = MESSAGE_PRIORITY_COLORS[prioridad as keyof typeof MESSAGE_PRIORITY_COLORS] || 'gray';
    const colors: Record<string, string> = {
      gray: 'bg-gray-500',
      blue: 'bg-blue-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
    };

    return (
      <span className={`w-2 h-2 rounded-full ${colors[color]}`} title={prioridad}></span>
    );
  };

  // ========================================
  // 🎨 RENDER PRINCIPAL
  // ========================================

  return (
    <SmartDashboardLayout>
      <div className="w-full">
        {/* Header - 🎨 Usando gradiente dinámico del sidebar */}
        <div 
          className="rounded-2xl p-6 md:p-8 mb-8 text-white shadow-xl"
          style={{ background: headerGradient }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">💬</span>
                Gestión de Mensajes
              </h1>
              <p className="text-white/90 text-lg">
                Administra todos los mensajes y plantillas del sistema
              </p>
            </div>

            {/* Toggle View Mode + Nuevo Mensaje */}
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              {/* Botones de Vista - Siempre visibles */}
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => setViewMode('messages')}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                    viewMode === 'messages'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="sm:hidden">💬</span>
                  <span className="hidden sm:inline">💬 Mensajes</span>
                </button>
                <button
                  onClick={() => setViewMode('templates')}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                    viewMode === 'templates'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="sm:hidden">📋</span>
                  <span className="hidden sm:inline">📋 Plantillas</span>
                </button>
              </div>

              {/* Botones de Acción - solo visible en modo mensajes */}
              {viewMode === 'messages' && (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <button
                    onClick={() => handleOpenComposer('client')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <span>✉️</span>
                    <span>Mensaje a Cliente</span>
                  </button>
                  <button
                    onClick={() => handleOpenComposer('internal')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <span>📝</span>
                    <span>Nota Interna</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          {stats && viewMode === 'messages' && (
            <div className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.total}
                </div>
                <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">Total Mensajes</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-2 sm:p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.noLeidos}
                </div>
                <div className="text-xs sm:text-sm text-red-700 dark:text-red-300">No Leídos</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-2 sm:p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.enviados}
                </div>
                <div className="text-xs sm:text-sm text-green-700 dark:text-green-300">Enviados</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.respondidos}
                </div>
                <div className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">Respondidos</div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-8">
        {/* VISTA: MENSAJES */}
        {viewMode === 'messages' && (
          <div className="space-y-6">
            {/* Filtros colapsables */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <MessageFiltersComponent
                onFilterChange={handleFilterChange}
                currentFilters={messageFilters}
                compact={true}
                defaultExpanded={false}
              />
            </div>

            {/* Acciones Batch */}
            {selectedMessages.size > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                <div className="text-sm text-blue-900 dark:text-blue-300">
                  <strong>{selectedMessages.size}</strong> mensaje{selectedMessages.size !== 1 ? 's' : ''} seleccionado{selectedMessages.size !== 1 ? 's' : ''}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  >
                    ✅ Marcar como leídos
                  </button>
                  <button
                    onClick={() => setSelectedMessages(new Set())}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                  >
                    ✖ Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Tabla de Mensajes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin text-4xl mb-2">⏳</div>
                    <p className="text-gray-600 dark:text-gray-400">Cargando mensajes...</p>
                  </div>
                </div>
              ) : messages.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedMessages.size === messages.length && messages.length > 0}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Lead
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Contenido
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Autor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {messages.map((message) => (
                        <tr
                          key={message._id}
                          className={`hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer ${
                            !message.leido ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                          }`}
                          onClick={() => handleOpenConversation(message)}
                        >
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedMessages.has(message._id)}
                              onChange={() => toggleMessageSelection(message._id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getPriorityBadge(message.prioridad)}
                              {!message.leido && (
                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded animate-pulse">
                                  Nuevo
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {getMessageTypeBadge(message.tipo)}
                              {message.tipo === 'respuesta_cliente' && (
                                <span className="text-purple-600 dark:text-purple-400" title="Respuesta del cliente">
                                  💬
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {/* Avatar del Lead o Logo de la Empresa */}
                              {/* Verificar si es realmente un mensaje del cliente (rol CLIENT o USER) */}
                              {message.tipo === 'respuesta_cliente' && 
                               (message.autor?.rol === 'CLIENT' || message.autor?.rol === 'USER') ? (
                                /* Mensaje del Cliente Real - Mostrar su avatar */
                                message.autor?.profileImage ? (
                                  /* Tiene imagen de perfil guardada */
                                  <img 
                                    src={message.autor.profileImage}
                                    alt={message.autor.nombre}
                                    className="w-8 h-8 rounded-full object-cover"
                                    onError={(e) => {
                                      // Fallback a inicial si falla la imagen
                                      const target = e.currentTarget;
                                      target.style.display = 'none';
                                      const fallback = target.nextElementSibling;
                                      if (fallback) fallback.classList.remove('hidden');
                                    }}
                                  />
                                ) : (
                                  /* Sin imagen de perfil - Usar inicial */
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {message.autor?.nombre?.[0]?.toUpperCase() || 'C'}
                                  </div>
                                )
                              ) : (
                                /* Mensaje del Equipo - Mostrar logo de la empresa */
                                <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-green-500">
                                  <img 
                                    src="/FAVICON.png"
                                    alt="SCUTI Company"
                                    className="w-5 h-5 object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      const fallback = e.currentTarget.nextElementSibling;
                                      if (fallback) fallback.classList.remove('hidden');
                                    }}
                                  />
                                  <span className="text-xs font-bold text-green-600 hidden">SC</span>
                                </div>
                              )}
                              {/* Eliminar fallback duplicado - ya está incluido arriba */}
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {typeof message.leadId === 'object' && message.leadId?.nombre 
                                    ? message.leadId.nombre 
                                    : `Lead #${typeof message.leadId === 'string' 
                                        ? message.leadId.substring(0, 8) 
                                        : message.leadId?._id?.substring(0, 8) || 'N/A'}`}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {typeof message.leadId === 'object' && message.leadId?.correo 
                                    ? message.leadId.correo 
                                    : 'Ver conversación →'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-md">
                            <div className="flex items-start gap-2">
                              <span className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                                {message.tipo === 'mensaje_cliente' ? '→' : '←'}
                              </span>
                              <div>
                                <div className="text-sm text-gray-900 dark:text-white line-clamp-2">
                                  {message.contenido.substring(0, 100)}
                                  {message.contenido.length > 100 && '...'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {message.tipo === 'mensaje_cliente' ? 'Enviado al cliente' : 'Respuesta del cliente'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {message.autor.nombre}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {formatRelativeTime(message.createdAt)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleOpenConversation(message)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="Abrir conversación"
                              >
                                💬
                              </button>
                              {!message.leido && (
                                <button
                                  onClick={() => handleMarkAsRead(message._id)}
                                  className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                  title="Marcar como leído"
                                >
                                  ✅
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteMessage(message._id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-4xl mb-2">💬</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No hay mensajes
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Los mensajes aparecerán aquí cuando se envíen
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VISTA: PLANTILLAS */}
        {viewMode === 'templates' && (
          <div className="space-y-6">
            {/* Header con botón crear */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Plantillas de Mensajes
              </h2>
              <button
                onClick={() => {
                  setSelectedTemplate(undefined);
                  setTemplateModal('editor');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                ➕ Nueva Plantilla
              </button>
            </div>

            {/* Grid de Plantillas */}
            {isLoadingTemplates ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin text-4xl mb-2">⏳</div>
                  <p className="text-gray-600 dark:text-gray-400">Cargando plantillas...</p>
                </div>
              </div>
            ) : templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template._id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {template.titulo}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {template.descripcion}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleFavorite(template._id)}
                        className="text-xl"
                      >
                        {templateFavorites.includes(template._id) ? '⭐' : '☆'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {getMessageTypeBadge(template.tipo)}
                      {template.categoria && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded text-xs">
                          {template.categoria}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Usado {template.vecesUsada} veces
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedTemplate(template);
                            setTemplateModal('editor');
                          }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-4xl mb-2">📋</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No hay plantillas
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Crea tu primera plantilla para agilizar la comunicación
                </p>
                <button
                  onClick={() => {
                    setSelectedTemplate(undefined);
                    setTemplateModal('editor');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  ➕ Crear Primera Plantilla
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Message Composer */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {composerMode === 'internal' ? '📝 Nueva Nota Interna' : '✉️ Mensaje a Cliente'}
              </h2>
              <button
                onClick={handleCloseComposer}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Selector de Tipo de Destinatario */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    📬 Tipo de Destinatario
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMessageTarget('lead');
                        setSelectedUser('');
                        if (leads.length === 0) loadLeads();
                      }}
                      className={`
                        px-4 py-3 rounded-lg font-medium transition-all
                        ${messageTarget === 'lead'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                        }
                      `}
                    >
                      📝 Solicitud
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMessageTarget('user');
                        setSelectedLead('');
                        if (directUsers.length === 0) loadDirectUsers();
                      }}
                      className={`
                        px-4 py-3 rounded-lg font-medium transition-all
                        ${messageTarget === 'user'
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                        }
                      `}
                    >
                      👤 Usuario Directo
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {messageTarget === 'lead' 
                      ? '📝 Envía mensaje a una solicitud activa'
                      : '👤 Envía mensaje directo a cualquier usuario registrado'
                    }
                  </p>
                </div>

                {/* Selector de Lead (si target es 'lead') */}
                {messageTarget === 'lead' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📊 Seleccionar Solicitud *
                    </label>
                    {isLoadingLeads ? (
                      <div className="flex items-center gap-2 text-gray-500 py-8">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span>Cargando solicitudes...</span>
                      </div>
                    ) : leads.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          No hay solicitudes disponibles
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Crea una solicitud primero para poder enviar mensajes
                        </p>
                      </div>
                    ) : (
                      <select
                        value={selectedLead}
                        onChange={(e) => setSelectedLead(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">-- Seleccione una solicitud --</option>
                        {leads.map((lead) => (
                          <option key={lead._id} value={lead._id}>
                            {lead.nombre} {lead.empresa ? `- ${lead.empresa}` : ''} ({lead.tipoServicio})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* Selector de Usuario Directo (si target es 'user') */}
                {messageTarget === 'user' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      👤 Seleccionar Usuario *
                    </label>
                    {isLoadingUsers ? (
                      <div className="flex items-center gap-2 text-gray-500 py-8">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                        <span>Cargando usuarios...</span>
                      </div>
                    ) : directUsers.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          No hay usuarios disponibles
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          No se encontraron usuarios activos
                        </p>
                      </div>
                    ) : (
                      <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">-- Seleccione un usuario --</option>
                        {directUsers.map((user) => (
                          <option key={user.clerkId} value={user.clerkId}>
                            {user.fullName} - {user.email} ({user.role})
                            {user.messageCount > 0 && ` • ${user.messageCount} mensajes`}
                          </option>
                        ))}
                      </select>
                    )}
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      📬 Todos los usuarios registrados en el sistema
                    </p>
                  </div>
                )}

                {/* Message Composer - Solo se muestra cuando hay un destinatario seleccionado */}
                {(messageTarget === 'lead' && selectedLead) || (messageTarget === 'user' && selectedUser) ? (
                  <MessageComposer
                    leadId={messageTarget === 'lead' ? selectedLead : 'virtual'}
                    leadData={messageTarget === 'lead' ? leads.find(l => l._id === selectedLead) : undefined}
                    messageType={composerMode}
                    onSend={handleSendMessage}
                    onCancel={handleCloseComposer}
                    templates={templates}
                    showSubject={true}
                    showPriority={true}
                  />
                ) : (
                  <div className="text-center py-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-4xl mb-3">👆</div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      {messageTarget === 'lead' 
                        ? 'Selecciona una solicitud para continuar'
                        : 'Selecciona un usuario para continuar'
                      }
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      El formulario de mensaje aparecerá aquí
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Template Editor */}
      {templateModal === 'editor' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <TemplateEditor
              template={selectedTemplate}
              onSave={handleSaveTemplate}
              onCancel={() => {
                setTemplateModal(null);
                setSelectedTemplate(undefined);
              }}
            />
          </div>
        </div>
      )}

      {/* Panel: Conversación */}
      {showConversation && selectedConversationLead && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleCloseConversation}
          />
          {/* Panel */}
          <ConversationPanel
            lead={selectedConversationLead}
            initialMessage={selectedConversationMessage || undefined}
            onClose={handleCloseConversation}
            onMessageSent={handleConversationMessageSent}
          />
        </>
      )}
      </div>
    </SmartDashboardLayout>
  );
};

export default CrmMessages;
