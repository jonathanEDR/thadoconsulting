import axios, { type AxiosResponse } from 'axios';
import { getApiUrl } from '../utils/apiConfig';

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

// Configuración base del cliente AI
const aiApiClient = axios.create({
  baseURL: `${getApiUrl()}/agents`,
  timeout: parseInt(import.meta.env.VITE_AI_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para autenticación con Clerk
aiApiClient.interceptors.request.use(async (config) => {
  // Método 1: Usar token configurado por setAuthToken
  if (currentAuthToken) {
    console.log('🔑 Usando token configurado por setAuthToken:', currentAuthToken?.substring(0, 20) + '...');
    config.headers.Authorization = `Bearer ${currentAuthToken}`;
    return config;
  }

  // Método 2: Intentar obtener el token de Clerk de diferentes maneras
  try {
    // Desde window.Clerk (si está disponible)
    if (window.Clerk && window.Clerk.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        console.log('🔑 Token obtenido de window.Clerk.session:', token?.substring(0, 20) + '...');
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      }
    }

    // Método 3: Desde localStorage (backup)
    const fallbackToken = localStorage.getItem('authToken') || 
                         localStorage.getItem('clerk-db-jwt') ||
                         localStorage.getItem('__clerk_client_jwt');
    
    if (fallbackToken) {
      console.log('🔑 Token obtenido de localStorage:', fallbackToken?.substring(0, 20) + '...');
      config.headers.Authorization = `Bearer ${fallbackToken}`;
    } else {
      console.warn('❌ No se encontró token en ningún lugar');
    }

  } catch (error) {
    console.warn('❌ No se pudo obtener token de autenticación:', error);
  }
  
  return config;
});

// Interceptor para manejo de errores
aiApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Error en respuesta de API:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        headers: error.config?.headers
      }
    });

    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout: El análisis está tomando demasiado tiempo');
    }
    if (error.response?.status === 401) {
      throw new Error(`No autorizado: ${error.response?.data?.message || 'Inicia sesión nuevamente'}`);
    }
    if (error.response?.status === 429) {
      throw new Error('Límite de solicitudes excedido: Intenta más tarde');
    }
    throw error;
  }
);

// Tipos de datos
export interface AIAnalysisRequest {
  postId?: string;
  content?: string;
  title?: string;
  category?: string;
  analysisType?: 'quick' | 'complete' | 'seo_focus' | 'readability_focus';
  detailLevel?: 'basic' | 'standard' | 'detailed';
}

export interface AIAnalysisResponse {
  success: boolean;
  data: {
    scores: {
      overall: number;
      readability: number;
      seo: number;
      engagement: number;
      structure: number;
    };
    recommendations: Array<{
      id: string;
      type: 'critical' | 'important' | 'suggestion';
      category: 'seo' | 'content' | 'structure' | 'engagement';
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      effort: 'low' | 'medium' | 'high';
      implementation?: string;
    }>;
    tags?: string[];
    keywords?: string[];
    metadata?: {
      processingTime: number;
      tokensUsed: number;
      agentUsed: string;
    };
  };
  message?: string;
}

export interface TagGenerationRequest {
  content: string;
  title: string;
  category?: string;
  maxTags?: number;
  language?: string;
}

export interface TagGenerationResponse {
  success: boolean;
  data: {
    tags: string[];
    keywords: string[];
    confidence: number;
  };
}

export interface SystemMetricsResponse {
  success: boolean;
  data: {
    tokensUsed: number;
    analysisCount: number;
    averageResponseTime: number;
    successRate: number;
    systemHealth: {
      orchestrator: string;
      openai: string;
      memory: string;
    };
  };
}

// Variable global para almacenar el token
let currentAuthToken: string | null = null;

// Servicio principal de IA
export const aiService = {
  /**
   * Configurar token de autenticación
   */
  setAuthToken(token: string): void {
    currentAuthToken = token;
  },

  /**
   * Obtener token actual
   */
  getCurrentToken(): string | null {
    return currentAuthToken;
  },
  /**
   * Análisis completo de contenido con IA
   */
  async analyzeContent(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    try {
      const response: AxiosResponse<AIAnalysisResponse> = await aiApiClient.post(
        '/blog/analyze',
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error en análisis de contenido:', error);
      throw error;
    }
  },

  /**
   * Análisis rápido sin persistencia
   */
  async quickAnalyze(
    content: string,
    title: string,
    category?: string
  ): Promise<AIAnalysisResponse> {
    try {
      const response: AxiosResponse<AIAnalysisResponse> = await aiApiClient.post(
        '/blog/analyze',
        { content, title, category, analysisType: 'quick' }
      );
      return response.data;
    } catch (error) {
      console.error('Error en análisis rápido:', error);
      throw error;
    }
  },

  /**
   * Generación inteligente de tags
   */
  async generateTags(request: TagGenerationRequest): Promise<TagGenerationResponse> {
    try {
      const response: AxiosResponse<TagGenerationResponse> = await aiApiClient.post(
        '/blog/tags',
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error en generación de tags:', error);
      throw error;
    }
  },

  /**
   * Optimización SEO automática
   */
  async optimizeSEO(postId: string): Promise<AIAnalysisResponse> {
    try {
      const response: AxiosResponse<AIAnalysisResponse> = await aiApiClient.post(
        '/blog/seo',
        { postId }
      );
      return response.data;
    } catch (error) {
      console.error('Error en optimización SEO:', error);
      throw error;
    }
  },

  /**
   * Obtener métricas del sistema
   */
  async getSystemMetrics(): Promise<SystemMetricsResponse> {
    try {
      const response: AxiosResponse<SystemMetricsResponse> = await aiApiClient.get('/testing/system-metrics');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo métricas:', error);
      throw error;
    }
  },



  /**
   * Health check del sistema de IA
   */
  async healthCheck(): Promise<{ success: boolean; status: string }> {
    try {
      const response = await aiApiClient.get('/health');
      return {
        success: true,
        status: response.data.data.overall
      };
    } catch (error) {
      console.error('Error en health check:', error);
      return {
        success: false,
        status: 'unhealthy'
      };
    }
  },

  /**
   * Verificar capacidades disponibles
   */
  async getCapabilities(): Promise<any> {
    try {
      const response = await aiApiClient.get('/capabilities');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo capacidades:', error);
      throw error;
    }
  },

  /**
   * Ejecutar test completo del sistema avanzado
   */
  async runAdvancedSystemTest(): Promise<any> {
    try {
      const response = await aiApiClient.get('/testing/test-advanced-agents');
      return response.data;
    } catch (error) {
      console.error('Error ejecutando test avanzado:', error);
      throw error;
    }
  },

  /**
   * Health check avanzado del sistema
   */
  async advancedHealthCheck(): Promise<any> {
    try {
      const response = await aiApiClient.get('/testing/health-advanced');
      return response.data;
    } catch (error) {
      console.error('Error en health check avanzado:', error);
      throw error;
    }
  }
};

export default aiService;