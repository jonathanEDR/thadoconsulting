/**
 * 💬 useAIChat Hook
 * Gestiona el chat conversacional con BlogAgent
 */

import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { getApiUrl } from '../../utils/apiConfig';

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    type: string;
    label: string;
  }>;
}

export interface ChatContext {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

interface ChatResponse {
  message: string;
  suggestions?: string[];
  actions?: Array<{
    type: string;
    label: string;
  }>;
  metadata?: Record<string, any>;
}

export const useAIChat = () => {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Enviar mensaje al agente
   */
  const sendMessage = useCallback(async (
    message: string,
    context: ChatContext
  ): Promise<ChatMessage | null> => {
    let userMessage: ChatMessage | null = null;
    
    try {
      setIsLoading(true);
      setError(null);

      // Validar mensaje
      if (!message || message.trim().length === 0) {
        setError('El mensaje no puede estar vacío');
        setIsLoading(false);
        return null;
      }

      // Agregar mensaje del usuario inmediatamente
      userMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage!]);

      // Obtener token de autenticación
      console.log('[useAIChat] Obteniendo token de Clerk...');
      const token = await getToken();
      
      if (!token) {
        const errorMsg = 'Usuario no autenticado. Por favor, inicia sesión nuevamente.';
        console.error('[useAIChat] ❌ Token no disponible:', errorMsg);
        setError(errorMsg);
        setMessages(prev => prev.filter(msg => msg.id !== userMessage?.id));
        setIsLoading(false);
        return null;
      }
      
      console.log('[useAIChat] ✅ Token obtenido');

      // Enviar al backend
      console.log('[useAIChat] Enviando solicitud a:', `${getApiUrl()}/agents/blog/chat`);
      const response = await axios.post<{ success: boolean; data: ChatResponse }>(
        `${getApiUrl()}/agents/blog/chat`,
        {
          message,
          context: {
            ...context,
            chatHistory: messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('[useAIChat] ✅ Respuesta recibida:', response.status);

      if (response.data.success) {
        const agentMessage: ChatMessage = {
          id: `agent-${Date.now()}`,
          role: 'agent',
          content: response.data.data.message,
          timestamp: new Date(),
          suggestions: response.data.data.suggestions,
          actions: response.data.data.actions
        };

        setMessages(prev => [...prev, agentMessage]);
        return agentMessage;
      }

      throw new Error('No se recibió respuesta válida del agente');

    } catch (err: any) {
      console.error('[useAIChat] ❌ Error:', err);
      
      let errorMessage = 'Error enviando mensaje';
      
      if (err.response?.status === 401) {
        errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Endpoint no encontrado. Verifica que el servidor backend esté corriendo.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Error en el servidor. Intenta de nuevo en unos momentos.';
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.error || 'Solicitud inválida';
      } else if (err.message === 'Network Error') {
        errorMessage = 'Error de conexión. Verifica que el servidor backend esté disponible.';
      } else {
        errorMessage = err.response?.data?.error || err.message || 'Error enviando mensaje';
      }
      
      console.error('[useAIChat] Mensaje de error:', errorMessage);
      setError(errorMessage);
      
      // Remover el mensaje del usuario si hubo error
      if (userMessage) {
        setMessages(prev => prev.filter(msg => msg.id !== userMessage?.id));
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getToken, messages]);

  /**
   * Limpiar historial de chat
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  /**
   * Eliminar último mensaje
   */
  const removeLastMessage = useCallback(() => {
    setMessages(prev => prev.slice(0, -1));
  }, []);

  /**
   * Reintentar último mensaje
   */
  const retryLastMessage = useCallback(async (context: ChatContext) => {
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    
    if (lastUserMessage) {
      // Eliminar último mensaje del agente si existe
      setMessages(prev => {
        const lastAgentIndex = prev.map((m, i) => ({ ...m, index: i }))
          .reverse()
          .find(m => m.role === 'agent')?.index;
        
        if (lastAgentIndex !== undefined) {
          return prev.filter((_, i) => i !== lastAgentIndex);
        }
        return prev;
      });

      // Reintentar
      return await sendMessage(lastUserMessage.content, context);
    }

    return null;
  }, [messages, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    removeLastMessage,
    retryLastMessage
  };
};
