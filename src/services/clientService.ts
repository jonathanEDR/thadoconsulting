/**
 * 👤 CLIENT SERVICE - Servicio API Específico del Cliente
 * Wrapper optimizado para operaciones del portal cliente
 */

import { crmService, type Lead } from './crmService';
import { messageService } from './messageService';
import type { LeadMessage } from '../types/message.types';

export interface ClientDashboardData {
  leads: Lead[];
  allMessages: LeadMessage[];
  unreadCount: number;
  stats: {
    totalLeads: number;
    activeLeads: number;
    completedLeads: number;
    unreadMessages: number;
  };
}

export interface ClientLeadWithMessages extends Lead {
  messages: LeadMessage[];
  unreadCount: number;
  lastMessage?: LeadMessage;
}

/**
 * Servicio centralizado para operaciones del portal cliente
 */
class ClientService {
  /**
   * Obtiene todos los leads/proyectos del cliente autenticado
   */
  async getMyLeads(): Promise<Lead[]> {
    try {
      const response = await crmService.getClientLeads();
      return response.data?.leads || [];
    } catch (error) {
      console.error('Error al obtener mis leads:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los mensajes de un lead específico (solo públicos)
   */
  async getMyMessages(leadId: string): Promise<LeadMessage[]> {
    try {
      const response = await messageService.getLeadMessages(leadId, {
        incluirPrivados: false, // Cliente solo ve mensajes públicos
      });
      return response.data?.mensajes || [];
    } catch (error) {
      console.error(`Error al obtener mensajes del lead ${leadId}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene todos los mensajes de todos los leads del cliente
   */
  async getAllMyMessages(): Promise<LeadMessage[]> {
    try {
      const leads = await this.getMyLeads();
      const allMessages: LeadMessage[] = [];

      // Obtener mensajes de cada lead en paralelo
      const messagesPromises = leads.map((lead) =>
        this.getMyMessages(lead._id).catch((err) => {
          console.warn(`Error al obtener mensajes del lead ${lead._id}:`, err);
          return [];
        })
      );

      const messagesArrays = await Promise.all(messagesPromises);
      messagesArrays.forEach((messages) => allMessages.push(...messages));

      // Ordenar por fecha (más reciente primero)
      return allMessages.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error al obtener todos mis mensajes:', error);
      throw error;
    }
  }

  /**
   * Obtiene el conteo de mensajes no leídos
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await messageService.getUnreadMessages();
      return response.data?.total || 0;
    } catch (error) {
      console.error('Error al obtener conteo de no leídos:', error);
      return 0;
    }
  }

  /**
   * Obtiene leads con sus mensajes y conteos
   */
  async getMyLeadsWithMessages(): Promise<ClientLeadWithMessages[]> {
    try {
      const leads = await this.getMyLeads();

      // Obtener mensajes de cada lead
      const leadsWithMessages = await Promise.all(
        leads.map(async (lead) => {
          try {
            const messages = await this.getMyMessages(lead._id);
            const unreadCount = messages.filter((msg) => !msg.leido).length;
            const lastMessage = messages[0]; // Ya están ordenados

            return {
              ...lead,
              messages,
              unreadCount,
              lastMessage,
            };
          } catch (error) {
            console.warn(`Error procesando lead ${lead._id}:`, error);
            return {
              ...lead,
              messages: [],
              unreadCount: 0,
              lastMessage: undefined,
            };
          }
        })
      );

      return leadsWithMessages;
    } catch (error) {
      console.error('Error al obtener leads con mensajes:', error);
      throw error;
    }
  }

  /**
   * Envía una respuesta a un mensaje
   */
  async replyToMessage(
    messageId: string,
    contenido: string,
    esPrivado: boolean = false
  ): Promise<LeadMessage> {
    try {
      const response = await messageService.replyMessage({
        messageId,
        contenido,
        esPrivado, // Las respuestas del cliente siempre son públicas por defecto
      });
      return response.data as LeadMessage;
    } catch (error) {
      console.error('Error al responder mensaje:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo mensaje en un lead (respuesta del cliente)
   */
  async sendMessage(
    leadId: string,
    contenido: string,
    asunto?: string
  ): Promise<LeadMessage> {
    try {
      const response = await messageService.sendClientMessage({
        leadId,
        contenido,
        asunto,
        prioridad: 'normal',
        canal: 'sistema',
      });
      return response.data as LeadMessage;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  }

  /**
   * Marca un mensaje como leído
   */
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await messageService.markAsRead(messageId);
    } catch (error) {
      console.error('Error al marcar mensaje como leído:', error);
      throw error;
    }
  }

  /**
   * Marca múltiples mensajes como leídos
   */
  async markMultipleAsRead(messageIds: string[]): Promise<void> {
    try {
      await Promise.all(
        messageIds.map((messageId) => this.markMessageAsRead(messageId))
      );
    } catch (error) {
      console.error('Error al marcar múltiples mensajes como leídos:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los datos del dashboard del cliente en una sola llamada
   */
  async getDashboardData(): Promise<ClientDashboardData> {
    try {
      const [leads, allMessages] = await Promise.all([
        this.getMyLeads(),
        this.getAllMyMessages(),
      ]);

      // Calcular estadísticas
      const activeStates = ['nuevo', 'contactado', 'calificado', 'propuesta', 'negociacion'];
      const activeLeads = leads.filter((lead) => activeStates.includes(lead.estado));
      const completedLeads = leads.filter((lead) => lead.estado === 'ganado');
      const unreadMessages = allMessages.filter((msg) => !msg.leido);

      return {
        leads,
        allMessages,
        unreadCount: unreadMessages.length,
        stats: {
          totalLeads: leads.length,
          activeLeads: activeLeads.length,
          completedLeads: completedLeads.length,
          unreadMessages: unreadMessages.length,
        },
      };
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error);
      throw error;
    }
  }

  /**
   * Obtiene mensajes no leídos agrupados por lead
   */
  async getUnreadMessagesByLead(): Promise<Record<string, LeadMessage[]>> {
    try {
      const leadsWithMessages = await this.getMyLeadsWithMessages();
      const unreadByLead: Record<string, LeadMessage[]> = {};

      leadsWithMessages.forEach((lead) => {
        const unreadMessages = lead.messages.filter((msg) => !msg.leido);
        if (unreadMessages.length > 0) {
          unreadByLead[lead._id] = unreadMessages;
        }
      });

      return unreadByLead;
    } catch (error) {
      console.error('Error al obtener mensajes no leídos por lead:', error);
      throw error;
    }
  }
}

// Exportar instancia única (singleton)
export const clientService = new ClientService();
export default clientService;
