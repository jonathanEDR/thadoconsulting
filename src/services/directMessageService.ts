import axios from 'axios';

// Extender Window para incluir Clerk
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación de Clerk
api.interceptors.request.use(
  async (config) => {
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 📧 SERVICIO DE MENSAJERÍA DIRECTA
 * Permite enviar mensajes a usuarios sin leads (usuarios del blog)
 */

export interface DirectUser {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username?: string;
  profileImage?: string;
  messageCount: number;
  hasVirtualLead: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface DirectMessageData {
  asunto?: string;
  contenido: string;
  prioridad?: 'baja' | 'normal' | 'alta' | 'urgente';
  canal?: string;
  etiquetas?: string[];
}

export interface DirectMessageHistory {
  _id: string;
  asunto: string;
  contenido: string;
  tipo: string;
  autor: {
    userId: string;
    nombre: string;
    email: string;
    rol: string;
  };
  destinatario: {
    userId: string;
    nombre: string;
    email: string;
    rol: string;
  };
  createdAt: string;
  leido: boolean;
  prioridad: string;
}

/**
 * Obtener lista de TODOS los usuarios activos del sistema
 */
export const getAllActiveUsers = async (search?: string): Promise<{
  users: DirectUser[];
  total: number;
  showing: number;
}> => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('limit', '100');

    console.log('🔍 Obteniendo usuarios activos...', { search });
    
    const response = await api.get(`/direct-messages/users/active?${params}`);
    
    console.log('✅ Respuesta recibida:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Error obteniendo usuarios activos:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

/**
 * Enviar mensaje directo a un usuario
 */
export const sendDirectMessage = async (
  userId: string,
  messageData: DirectMessageData
): Promise<{
  success: boolean;
  message: string;
  data: {
    messageId: string;
    leadId: string;
    isVirtual: boolean;
  };
}> => {
  try {
    const response = await api.post(`/direct-messages/send/${userId}`, messageData);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error enviando mensaje directo:', error);
    throw error;
  }
};

/**
 * Obtener historial de mensajes directos de un usuario
 */
export const getUserMessageHistory = async (
  userId: string
): Promise<{
  messages: DirectMessageHistory[];
  total: number;
  leadId: string | null;
}> => {
  try {
    const response = await api.get(`/direct-messages/history/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error obteniendo historial:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas de mensajería directa
 */
export const getDirectMessageStats = async (): Promise<{
  totalActiveUsers: number;
  usersWithMessages: number;
}> => {
  try {
    const response = await api.get('/direct-messages/stats');
    return response.data.stats;
  } catch (error: any) {
    console.error('❌ Error obteniendo estadísticas:', error);
    throw error;
  }
};
