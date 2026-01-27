import axios from 'axios';

// Extender tipo Window para Clerk
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

export interface AIActionRequest {
  action: string;
  selectedText: string;
  context?: {
    wordCount: number;
    isCode: boolean;
    surroundingText?: string;
    position?: 'start' | 'middle' | 'end';
  };
}

export interface AIActionResponse {
  success: boolean;
  result: string;
  action: string;
  originalText: string;
  suggestions?: string[];
  metadata?: {
    processingTime: number;
    confidence: number;
    tokens?: number;
  };
}

class SelectionAIService {
  private cache: Map<string, AIActionResponse> = new Map();
  private readonly CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutos
  private readonly API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Obtener token de autenticación de Clerk
  private async getAuthToken(): Promise<string | null> {
    try {
      if (window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo token de Clerk:', error);
      return null;
    }
  }

  // Mapear acción del menú de selección a tipo de patrón del backend
  private mapActionToPatternType(action: string): string {
    const actionMap: Record<string, string> = {
      'expand': 'expand',
      'rewrite': 'rewrite',
      'summarize': 'summarize',
      'continue': 'continue',
      'examples': 'examples',
      'seo': 'seo'
    };
    return actionMap[action] || 'custom';
  }

  // Generar clave de cache
  private getCacheKey(action: string, text: string): string {
    const normalizedText = text.trim().toLowerCase();
    return `${action}:${normalizedText.substring(0, 100)}`;
  }

  // Procesar acción de IA con backend real
  async processAIAction(request: AIActionRequest): Promise<AIActionResponse> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(request.action, request.selectedText);

    // Verificar cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      const cacheTime = cached.metadata?.processingTime || 0;
      if (Date.now() - cacheTime < this.CACHE_EXPIRY) {
        console.log('✅ Resultado desde cache');
        return cached;
      }
    }

    try {
      // Obtener token de autenticación
      const token = await this.getAuthToken();
      
      if (!token) {
        throw new Error('No se pudo obtener token de autenticación');
      }

      // Preparar datos para el backend
      const patternType = this.mapActionToPatternType(request.action);
      const payload = {
        patternType,
        selectedText: request.selectedText,
        surroundingContext: request.context?.surroundingText || '',
        modifiers: this.extractModifiers(request)
      };

      console.log('🚀 Enviando solicitud al backend:', { patternType, textLength: request.selectedText.length });

      // Llamar al backend
      const response = await axios.post(
        `${this.API_BASE_URL}/agents/blog/process-pattern`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 segundos
        }
      );

      console.log('✅ Respuesta del backend:', response.data);

      // Formatear respuesta del backend
      const result: AIActionResponse = {
        success: response.data.success,
        result: response.data.data.result,
        action: request.action,
        originalText: response.data.data.originalText,
        suggestions: [],
        metadata: {
          processingTime: Date.now() - startTime,
          confidence: response.data.data.confidence || 0.8,
          tokens: this.estimateTokens(response.data.data.result)
        }
      };

      // Guardar en cache solo si fue exitoso
      if (result.success) {
        this.cache.set(cacheKey, result);
      }
      
      return result;

    } catch (error) {
      console.error('❌ Error procesando acción de IA:', error);
      
      // Si es error de red o timeout, usar fallback
      const isFallback = axios.isAxiosError(error) && (
        !error.response || 
        error.code === 'ECONNABORTED' ||
        error.code === 'ERR_NETWORK'
      );

      return {
        success: false,
        result: this.getFallbackResult(request.action, request.selectedText, isFallback),
        action: request.action,
        originalText: request.selectedText,
        metadata: {
          processingTime: Date.now() - startTime,
          confidence: 0
        }
      };
    }
  }

  // Extraer modificadores del contexto
  private extractModifiers(request: AIActionRequest): Record<string, any> {
    const modifiers: Record<string, any> = {};

    if (request.context) {
      if (request.context.wordCount) {
        modifiers.targetLength = request.context.wordCount;
      }
      if (request.context.isCode) {
        modifiers.preserveCode = true;
      }
      if (request.context.position) {
        modifiers.position = request.context.position;
      }
    }

    return modifiers;
  }

  // Estimar tokens aproximadamente
  private estimateTokens(text: string): number {
    // Aproximación: 1 token ≈ 4 caracteres
    return Math.floor(text.length / 4);
  }

  // Resultado de respaldo si falla la IA
  private getFallbackResult(action: string, originalText: string, isNetworkError: boolean = false): string {
    const actionLabels = {
      expand: 'expandir',
      rewrite: 'reescribir',
      summarize: 'resumir',
      continue: 'continuar',
      examples: 'ejemplificar',
      seo: 'optimizar para SEO'
    };

    const actionLabel = actionLabels[action as keyof typeof actionLabels] || 'procesar';
    
    if (isNetworkError) {
      return `⚠️ No se pudo conectar con el servidor para ${actionLabel} el texto. Por favor, verifica tu conexión e intenta de nuevo.

Texto original: "${originalText}"`;
    }
    
    return `Lo siento, no pude ${actionLabel} el texto en este momento. Por favor, intenta de nuevo más tarde.

Texto original: "${originalText}"`;
  }

  // Limpiar cache periódicamente
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.metadata && (now - (value.metadata.processingTime) > this.CACHE_EXPIRY)) {
        this.cache.delete(key);
      }
    }
  }

  // Método de prueba para verificar conexión con backend
  async testConnection(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        console.warn('⚠️ No hay token de autenticación disponible');
        return false;
      }

      console.log('✅ Token de autenticación obtenido correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error en testConnection:', error);
      return false;
    }
  }
}

// Instancia singleton
export const selectionAIService = new SelectionAIService();

// Limpiar cache cada 10 minutos
setInterval(() => {
  selectionAIService.clearExpiredCache();
}, 10 * 60 * 1000);