/**
 * Sales Chat Service
 * Servicio específico para el chatbot de ventas que usa directamente ServicesAgent
 * 
 * Este servicio bypasea al GerenteGeneral y va directo al agente de ventas
 */

import { getApiUrl } from '../utils/apiConfig';

class SalesChatService {
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

  /**
   * Enviar mensaje directamente al ServicesAgent (Agente de Ventas)
   * @param message - Mensaje del usuario
   * @param sessionId - ID de sesión
   * @param context - Contexto adicional
   */
  async sendMessage(
    message: string,
    sessionId: string,
    context: Record<string, any> = {}
  ): Promise<{
    success: boolean;
    data?: {
      response: string;
      agent: string;
      metadata?: any;
    };
    error?: string;
  }> {
    try {
      console.log('📤 [SalesChatService] Sending to ServicesAgent (PUBLIC):', {
        message: message.substring(0, 50) + '...',
        sessionId
      });

      // Usar el endpoint PÚBLICO del ServicesAgent (no requiere autenticación)
      const response = await this.fetchWithAuth('/servicios/agent/chat/public', {
        method: 'POST',
        body: JSON.stringify({
          message,
          sessionId,
          context
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // 🚨 Manejar rate limiting específicamente
        if (response.status === 429) {
          const retryAfter = errorData.retryAfter || 600; // segundos
          const minutes = Math.ceil(retryAfter / 60);
          throw new Error(
            `⏱️ Has alcanzado el límite de mensajes. Por favor espera ${minutes} minutos antes de continuar.`
          );
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      // 🔍 Buscar response en múltiples ubicaciones (por compatibilidad)
      const responseText = result.response || result.data?.response || result.data?.message;

      console.log('✅ [SalesChatService] Response from Asesor de Ventas SCUTI:', {
        success: result.success,
        hasResponse: !!responseText,
        responseLength: responseText?.length || 0
      });

      // Estructura de respuesta del Asesor de Ventas SCUTI
      return {
        success: result.success,
        data: {
          response: responseText || 'Sin respuesta',
          agent: result.agent || 'Asesor de Ventas SCUTI',
          metadata: result.metadata || result.data?.metadata
        }
      };

    } catch (error) {
      console.error('❌ [SalesChatService] Error:', error);
      
      // Mensaje de error más amigable
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Obtener información de un servicio específico
   * @param servicioId - ID del servicio
   */
  async getServiceInfo(servicioId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const response = await this.fetchWithAuth(`/servicios/${servicioId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Listar servicios disponibles
   */
  async listServices(): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
  }> {
    try {
      const response = await this.fetchWithAuth('/servicios/public');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

// Exportar instancia singleton
export const salesChatService = new SalesChatService();
export default salesChatService;
