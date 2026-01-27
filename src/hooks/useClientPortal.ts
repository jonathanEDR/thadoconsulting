/**
 * 🎣 USE CLIENT PORTAL - Hook Personalizado del Portal Cliente
 * Gestión centralizada del estado y polling automático
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { clientService, type ClientDashboardData, type ClientLeadWithMessages } from '../services/clientService';
import type { Lead } from '../services/crmService';
import type { LeadMessage } from '../types/message.types';

interface UseClientPortalOptions {
  enablePolling?: boolean;
  pollingInterval?: number; // en milisegundos
  autoLoad?: boolean;
}

interface UseClientPortalReturn {
  // Estado de datos
  leads: Lead[];
  messages: LeadMessage[];
  leadsWithMessages: ClientLeadWithMessages[];
  dashboardData: ClientDashboardData | null;
  
  // Estadísticas
  stats: {
    totalLeads: number;
    activeLeads: number;
    completedLeads: number;
    unreadMessages: number;
  };
  
  // Estados de carga
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // Métodos
  loadLeads: () => Promise<void>;
  loadMessages: (leadId?: string) => Promise<void>;
  loadLeadsWithMessages: () => Promise<void>;
  loadDashboard: () => Promise<void>;
  refresh: () => Promise<void>;
  replyToMessage: (messageId: string, contenido: string) => Promise<void>;
  sendMessage: (leadId: string, contenido: string, asunto?: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  markMultipleAsRead: (messageIds: string[]) => Promise<void>;
  
  // Control
  startPolling: () => void;
  stopPolling: () => void;
}

const DEFAULT_POLLING_INTERVAL = 60000; // 60 segundos

/**
 * Hook personalizado para el portal cliente con gestión de estado y polling
 */
export function useClientPortal(options: UseClientPortalOptions = {}): UseClientPortalReturn {
  const {
    enablePolling = false,
    pollingInterval = DEFAULT_POLLING_INTERVAL,
    autoLoad = true,
  } = options;

  // Estado
  const [leads, setLeads] = useState<Lead[]>([]);
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [leadsWithMessages, setLeadsWithMessages] = useState<ClientLeadWithMessages[]>([]);
  const [dashboardData, setDashboardData] = useState<ClientDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Referencias para polling
  const pollingIntervalRef = useRef<number | null>(null);
  const isPollingActiveRef = useRef<boolean>(false);

  // Estadísticas calculadas
  const stats = {
    totalLeads: dashboardData?.stats.totalLeads || leads.length,
    activeLeads: dashboardData?.stats.activeLeads || 0,
    completedLeads: dashboardData?.stats.completedLeads || 0,
    unreadMessages: dashboardData?.stats.unreadMessages || messages.filter((m) => !m.leido).length,
  };

  /**
   * Cargar leads del cliente
   */
  const loadLeads = useCallback(async () => {
    try {
      setError(null);
      const leadsData = await clientService.getMyLeads();
      setLeads(leadsData);
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al cargar leads';
      setError(errorMsg);
      console.error('Error en loadLeads:', err);
      throw err;
    }
  }, []);

  /**
   * Cargar mensajes (todos o de un lead específico)
   */
  const loadMessages = useCallback(async (leadId?: string) => {
    try {
      setError(null);
      if (leadId) {
        const messagesData = await clientService.getMyMessages(leadId);
        setMessages(messagesData);
      } else {
        const allMessages = await clientService.getAllMyMessages();
        setMessages(allMessages);
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al cargar mensajes';
      setError(errorMsg);
      console.error('Error en loadMessages:', err);
      throw err;
    }
  }, []);

  /**
   * Cargar leads con sus mensajes
   */
  const loadLeadsWithMessages = useCallback(async () => {
    try {
      setError(null);
      const data = await clientService.getMyLeadsWithMessages();
      setLeadsWithMessages(data);
      
      // También actualizar leads y mensajes
      setLeads(data.map((l) => ({ ...l, messages: undefined, unreadCount: undefined, lastMessage: undefined } as Lead)));
      const allMessages = data.flatMap((l) => l.messages);
      setMessages(allMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al cargar leads con mensajes';
      setError(errorMsg);
      console.error('Error en loadLeadsWithMessages:', err);
      throw err;
    }
  }, []);

  /**
   * Cargar todos los datos del dashboard
   */
  const loadDashboard = useCallback(async () => {
    try {
      setError(null);
      const data = await clientService.getDashboardData();
      setDashboardData(data);
      setLeads(data.leads);
      setMessages(data.allMessages);
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al cargar dashboard';
      setError(errorMsg);
      console.error('Error en loadDashboard:', err);
      throw err;
    }
  }, []);

  /**
   * Refrescar datos (no muestra loading inicial)
   */
  const refresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      await loadDashboard();
    } catch (err) {
      console.error('Error en refresh:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadDashboard]);

  /**
   * Responder a un mensaje
   */
  const replyToMessage = useCallback(async (messageId: string, contenido: string) => {
    try {
      setError(null);
      await clientService.replyToMessage(messageId, contenido);
      // Refrescar mensajes después de responder
      await refresh();
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al responder mensaje';
      setError(errorMsg);
      console.error('Error en replyToMessage:', err);
      throw err;
    }
  }, [refresh]);

  /**
   * Enviar mensaje nuevo
   */
  const sendMessage = useCallback(async (leadId: string, contenido: string, asunto?: string) => {
    try {
      setError(null);
      await clientService.sendMessage(leadId, contenido, asunto);
      // Refrescar mensajes después de enviar
      await refresh();
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al enviar mensaje';
      setError(errorMsg);
      console.error('Error en sendMessage:', err);
      throw err;
    }
  }, [refresh]);

  /**
   * Marcar mensaje como leído
   */
  const markAsRead = useCallback(async (messageId: string) => {
    try {
      setError(null);
      await clientService.markMessageAsRead(messageId);
      
      // Actualizar estado local inmediatamente
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, leido: true, fechaLeido: new Date().toISOString() } : msg
        )
      );
      
      // Actualizar dashboard data si existe
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          allMessages: dashboardData.allMessages.map((msg) =>
            msg._id === messageId ? { ...msg, leido: true, fechaLeido: new Date().toISOString() } : msg
          ),
          stats: {
            ...dashboardData.stats,
            unreadMessages: Math.max(0, dashboardData.stats.unreadMessages - 1),
          },
        });
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al marcar como leído';
      setError(errorMsg);
      console.error('Error en markAsRead:', err);
      throw err;
    }
  }, [dashboardData]);

  /**
   * Marcar múltiples mensajes como leídos
   */
  const markMultipleAsRead = useCallback(async (messageIds: string[]) => {
    try {
      setError(null);
      await clientService.markMultipleAsRead(messageIds);
      
      // Actualizar estado local
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg._id) ? { ...msg, leido: true, fechaLeido: new Date().toISOString() } : msg
        )
      );
      
      // Actualizar dashboard data
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          allMessages: dashboardData.allMessages.map((msg) =>
            messageIds.includes(msg._id) ? { ...msg, leido: true, fechaLeido: new Date().toISOString() } : msg
          ),
          stats: {
            ...dashboardData.stats,
            unreadMessages: Math.max(0, dashboardData.stats.unreadMessages - messageIds.length),
          },
        });
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al marcar mensajes como leídos';
      setError(errorMsg);
      console.error('Error en markMultipleAsRead:', err);
      throw err;
    }
  }, [dashboardData]);

  /**
   * Iniciar polling automático
   */
  const startPolling = useCallback(() => {
    if (isPollingActiveRef.current) {
      console.log('⏸️ Polling ya está activo');
      return;
    }

    console.log(`🔄 Iniciando polling cada ${pollingInterval / 1000}s`);
    isPollingActiveRef.current = true;

    pollingIntervalRef.current = window.setInterval(async () => {
      if (isPollingActiveRef.current) {
        console.log('🔄 Polling: actualizando datos...');
        await refresh();
      }
    }, pollingInterval);
  }, [pollingInterval, refresh]);

  /**
   * Detener polling automático
   */
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      console.log('⏹️ Deteniendo polling');
      window.clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    isPollingActiveRef.current = false;
  }, []);

  /**
   * Efecto de carga inicial
   */
  useEffect(() => {
    if (autoLoad) {
      setIsLoading(true);
      loadDashboard()
        .finally(() => setIsLoading(false));
    }
  }, [autoLoad, loadDashboard]);

  /**
   * Efecto de polling
   */
  useEffect(() => {
    if (enablePolling) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enablePolling, startPolling, stopPolling]);

  return {
    // Datos
    leads,
    messages,
    leadsWithMessages,
    dashboardData,
    stats,
    
    // Estados
    isLoading,
    isRefreshing,
    error,
    
    // Métodos
    loadLeads,
    loadMessages,
    loadLeadsWithMessages,
    loadDashboard,
    refresh,
    replyToMessage,
    sendMessage,
    markAsRead,
    markMultipleAsRead,
    
    // Control
    startPolling,
    stopPolling,
  };
}

export default useClientPortal;
