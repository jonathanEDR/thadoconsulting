/**
 * SCUTI AI Service
 * Servicio para comunicación con GerenteGeneral (backend)
 * 
 * Este servicio es un wrapper amigable sobre gerenteGeneralService
 * que abstrae la complejidad para el chat UI
 */

import { getApiUrl } from '../utils/apiConfig';
import type { 
  ChatSession, 
  ChatMessage, 
  CommandResponse,
  ScutiAIStatus 
} from '../types/scutiAI.types';

class ScutiAIService {
  private apiUrl = getApiUrl();

  /**
   * Helper para obtener token de autenticación desde Clerk
   */
  private async getToken(): Promise<string | null> {
    const session = window.Clerk?.session;
    if (session) {
      return await session.getToken();
    }
    return null;
  }

  /**
   * Helper para hacer fetch con autenticación
   */
  private async fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    return await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers,
    });
  }

  // ============================================
  // MENSAJES / COMANDOS
  // ============================================

  /**
   * Enviar mensaje/comando a SCUTI AI (GerenteGeneral)
   * @param message - Mensaje del usuario
   * @param sessionId - ID de sesión existente (opcional)
   * @param userId - ID del usuario
   * @param additionalContext - Contexto adicional (sessionId de blog, conversationMode, etc)
   */
  async sendMessage(
    message: string,
    sessionId?: string,
    userId?: string,
    additionalContext?: Record<string, any>
  ): Promise<{
    success: boolean;
    data?: CommandResponse;
    error?: string;
  }> {
    try {
      const response = await this.fetchWithAuth('/gerente/command', {
        method: 'POST',
        body: JSON.stringify({
          command: message,
          action: 'coordinate', // Siempre usar coordinate para routing inteligente
          sessionId,
          params: {
            userId,
            ...additionalContext // Agregar contexto adicional (sessionId de blog, conversationMode, etc)
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      // Extraer el mensaje de la estructura anidada
      // Caso 1: Coordinación con múltiples agentes
      // { success, data: { message, results: [{ agent, result: { message } }] } }
      let responseText = '';
      let involvedAgents: string[] = [];
      
      if (result.data?.results && Array.isArray(result.data.results)) {
        // GerenteGeneral coordinó múltiples agentes
        involvedAgents = result.data.results.map((r: any) => r.agent);
        
        // Extraer mensaje del primer agente que tenga uno
        for (const agentResult of result.data.results) {
          const agentMessage = agentResult.result?.result?.message || 
                              agentResult.result?.message ||
                              agentResult.result?.result?.response ||
                              agentResult.result?.response;
          
          if (agentMessage && agentMessage !== 'Tarea coordinada exitosamente') {
            responseText = agentMessage;
            break;
          }
        }
        
        // Si no encontramos mensaje en results, usar el mensaje principal
        if (!responseText) {
          responseText = result.data?.message || 'Tarea completada';
        }
      } else {
        // Caso 2: Respuesta directa de un agente
        // { success, data: { result: { message }, agentName } }
        const agentResult = result.data?.result || {};
        responseText = agentResult.message || 
                      agentResult.response || 
                      agentResult.content ||
                      agentResult.text ||
                      result.data?.message ||
                      'Tarea completada';
        
        involvedAgents = result.data?.agentName ? [result.data.agentName] : [];
      }

      // Extraer canvas_data si existe
      const canvasData = result.data?.canvas_data || 
                        result.canvas_data ||
                        null;

      return {
        success: result.success,
        data: {
          success: result.success,
          response: responseText, // ← Extraído correctamente de la estructura anidada
          agent: result.data?.agentName || result.data?.agent || involvedAgents[0],
          agentsInvolved: result.data?.agents || involvedAgents,
          routingDecision: result.data?.routingDecision,
          sessionId: result.sessionId || sessionId,
          context: result.data?.context,
          canvasData: canvasData, // ← Datos para el canvas
          metadata: {
            responseTime: result.data?.responseTime,
            tokensUsed: result.data?.tokensUsed,
            model: result.data?.model
          }
        }
      };
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // ============================================
  // SESIONES / CONVERSACIONES
  // ============================================

  /**
   * Obtener todas las sesiones de un usuario
   * @param userId - ID del usuario
   * @param limit - Número máximo de sesiones a retornar
   */
  async getUserSessions(
    userId: string,
    limit: number = 50
  ): Promise<{
    success: boolean;
    data?: {
      sessions: ChatSession[];
      count: number;
    };
    error?: string;
  }> {
    try {
      // console.log('📋 [ScutiAI] Obteniendo sesiones para usuario:', userId);

      const response = await this.fetchWithAuth(
        `/gerente/sessions/user/${userId}?limit=${limit}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      // console.log('📥 [ScutiAI] Sesiones recibidas:', result);

      // Transformar las sesiones al formato de ChatSession
      const sessions: ChatSession[] = result.data?.sessions?.map((session: any) => {
        // El backend retorna globalContext e interactions como propiedades separadas
        const title = session.globalContext?.currentGoal || 
                      session.globalContext?.projectName ||
                      `Chat ${session.createdAt ? new Date(session.createdAt).toLocaleDateString() : 'sin fecha'}`;
        
        // Crear estructura context para transformContextToMessages
        const context = {
          ...session.globalContext,
          interactions: session.interactions || []
        };

        return {
          sessionId: session.sessionId,
          userId: session.userId,
          title: title,
          messages: this.transformContextToMessages(context),
          context: context,
          createdAt: session.createdAt ? new Date(session.createdAt) : new Date(),
          updatedAt: session.updatedAt ? new Date(session.updatedAt) : new Date(),
          lastActivity: session.lastActivity ? new Date(session.lastActivity) : undefined,
          isActive: session.status === 'active',
          pinned: false
        };
      }) || [];

      return {
        success: true,
        data: {
          sessions,
          count: result.data?.count || sessions.length
        }
      };
    } catch (error) {
      console.error('❌ Error obteniendo sesiones:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Obtener detalles de una sesión específica
   * @param sessionId - ID de la sesión
   */
  async getSession(
    sessionId: string
  ): Promise<{
    success: boolean;
    data?: ChatSession;
    error?: string;
  }> {
    try {
      console.log('🔍 [ScutiAI] Obteniendo sesión:', sessionId);

      const response = await this.fetchWithAuth(
        `/gerente/sessions/${sessionId}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('📥 [ScutiAI] Sesión recibida:', result);

      // El backend puede devolver en result.data o result.session
      const sessionData = result.data?.session || result.data || result.session;
      
      if (!sessionData) {
        throw new Error('No se recibió información de la sesión');
      }
      
      // El backend retorna globalContext e interactions como propiedades separadas
      const title = sessionData.globalContext?.currentGoal || 
                    sessionData.globalContext?.projectName ||
                    `Chat ${sessionData.createdAt ? new Date(sessionData.createdAt).toLocaleDateString() : 'sin fecha'}`;
      
      // Crear estructura context para transformContextToMessages
      const context = {
        ...sessionData.globalContext,
        interactions: sessionData.interactions || []
      };

      const session: ChatSession = {
        sessionId: sessionData.sessionId,
        userId: sessionData.userId,
        title: title,
        messages: this.transformContextToMessages(context),
        context: context,
        createdAt: sessionData.createdAt ? new Date(sessionData.createdAt) : new Date(),
        updatedAt: sessionData.updatedAt ? new Date(sessionData.updatedAt) : new Date(),
        lastActivity: sessionData.lastActivity ? new Date(sessionData.lastActivity) : undefined,
        isActive: sessionData.status === 'active',
        pinned: false
      };

      return {
        success: true,
        data: session
      };
    } catch (error) {
      console.error('❌ Error obteniendo sesión:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Completar/finalizar una sesión
   * @param sessionId - ID de la sesión a completar
   */
  async completeSession(
    sessionId: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      console.log('✅ [ScutiAI] Completando sesión:', sessionId);

      const response = await this.fetchWithAuth(
        `/gerente/sessions/${sessionId}/complete`,
        { method: 'POST' }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      return {
        success: result.success
      };
    } catch (error) {
      console.error('❌ Error completando sesión:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // ============================================
  // ESTADO DEL SISTEMA
  // ============================================

  /**
   * Obtener estado actual de SCUTI AI (GerenteGeneral)
   */
  async getStatus(): Promise<{
    success: boolean;
    data?: ScutiAIStatus;
    error?: string;
  }> {
    try {
      const response = await this.fetchWithAuth('/gerente/status', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        data: {
          enabled: result.data?.enabled || true,
          status: result.data?.status || 'operational',
          activeAgents: result.data?.activeAgents || 0,
          managedAgents: result.data?.managedAgents || [],
          uptime: result.data?.uptime || 0,
          lastHealthCheck: result.data?.lastHealthCheck || new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Error obteniendo estado:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // ============================================
  // UTILIDADES PRIVADAS
  // ============================================

  /**
   * Transformar contexto de sesión a array de mensajes
   * @private
   */
  private transformContextToMessages(context: any): ChatMessage[] {
    if (!context || !context.interactions) {
      return [];
    }

    const messages: ChatMessage[] = [];

    // El backend almacena interacciones en este formato:
    // { timestamp, agent, action, input, result, duration, success }
    context.interactions.forEach((interaction: any, index: number) => {
      const timestamp = new Date(interaction.timestamp || Date.now());

      // Extraer mensaje del usuario (múltiples formatos posibles)
      const userMessage = interaction.input?.userMessage ||        // Formato nuevo
                         interaction.input?.userCommand ||         // Formato nuevo alternativo
                         interaction.input?.task?.command ||       // Formato original
                         interaction.input?.command ||             // Formato directo
                         interaction.input?.message;               // Formato alternativo

      if (userMessage) {
        messages.push({
          id: `user-${index}-${interaction.timestamp}`,
          role: 'user',
          content: userMessage,
          timestamp: timestamp
        });
      }

      // Extraer respuesta del agente (múltiples formatos posibles)
      const agentResponse = interaction.result?.agentResponse ||   // Formato nuevo
                           interaction.result?.message ||          // Formato directo
                           interaction.result?.result?.message ||  // Formato anidado
                           interaction.result?.response ||         // Formato alternativo
                           interaction.result?.data?.message;      // Formato data wrapper

      if (agentResponse) {
        messages.push({
          id: `assistant-${index}-${interaction.timestamp}`,
          role: 'assistant',
          content: agentResponse,
          timestamp: timestamp,
          agentUsed: interaction.agent,
          metadata: {
            agent: interaction.agent,
            responseTime: interaction.duration,
            action: interaction.action,
            success: interaction.success
          }
        });
      }
    });

    return messages;
  }
}

// Exportar instancia singleton
const scutiAIService = new ScutiAIService();
export default scutiAIService;
