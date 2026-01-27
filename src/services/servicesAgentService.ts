/**
 * API Service para ServicesAgent
 * Comunica con los 10 endpoints del ServicesAgent en el backend
 * 
 * Endpoints disponibles:
 * 1. POST /api/servicios/agent/chat - Chat interactivo
 * 2. POST /api/servicios/agent/create - Crear servicio con IA
 * 3. POST /api/servicios/:id/agent/edit - Editar servicio
 * 4. POST /api/servicios/:id/agent/analyze - Analizar servicio
 * 5. POST /api/servicios/agent/analyze-portfolio - Analizar portafolio
 * 6. POST /api/servicios/agent/suggest-pricing - Sugerir pricing
 * 7. POST /api/servicios/:id/agent/analyze-pricing - Analizar pricing
 * 8. POST /api/servicios/agent/optimize-packages - Optimizar paquetes
 * 9. GET /api/servicios/agent/metrics - Métricas del agente
 * 10. GET /api/servicios/agent/status - Estado del agente
 */

import { getApiUrl } from '../utils/apiConfig';

// ============================================
// INTERFACES DE REQUEST/RESPONSE
// ============================================

export interface ServicesAgentChatRequest {
  message: string;
  context?: {
    userId?: string;
    sessionId?: string;
    previousMessages?: Array<{ role: string; content: string }>;
  };
}

export interface ServicesAgentChatResponse {
  success: boolean;
  data?: {
    message: string;
    suggestions?: string[];
    quickActions?: Array<{ action: string; label: string }>;
    relatedServices?: any[];
    formState?: { // 🆕 Estado del formulario
      isCollecting: boolean;
      progress?: string;
      currentQuestion?: string;
      completed?: boolean;
      collectedData?: any;
    };
  };
  metadata?: {
    sessionId: string;
    intent: string;
    processingTime: number;
    contextSize: number;
  };
  error?: string;
}

export interface ServicesAgentCreateRequest {
  prompt?: string;
  serviceData?: {
    titulo?: string;
    descripcion?: string;
    categoria?: string;
    caracteristicas?: string[];
    beneficios?: string[];
    precio?: number;
    tipoPrecio?: string;
  };
  options?: {
    autoOptimize?: boolean;
    generateSEO?: boolean;
    includeSuggestions?: boolean;
  };
}

export interface ServicesAgentCreateResponse {
  success: boolean;
  data?: {
    serviceId: string;
    service: any;
    optimizations?: any;
    suggestions?: string[];
  };
  error?: string;
}

export interface ServicesAgentEditRequest {
  optimizations?: Array<'seo' | 'description' | 'conversion' | 'structure'>;
  instructions?: string;
  autoApply?: boolean;
}

export interface ServicesAgentAnalyzeRequest {
  detailed?: boolean;
  includeRecommendations?: boolean;
  analysisType?: 'quick' | 'standard' | 'thorough' | 'exhaustive';
}

export interface ServicesAgentAnalyzeResponse {
  success: boolean;
  data?: {
    scores: {
      seo: number;
      quality: number;
      completeness: number;
      conversion: number;
      overall: number;
    };
    analysis: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
    };
    recommendations: Array<{
      type: string;
      priority: 'high' | 'medium' | 'low';
      description: string;
      impact: string;
    }>;
  };
  error?: string;
}

export interface ServicesAgentPortfolioRequest {
  categoria?: string;
  limit?: number;
  includeGaps?: boolean;
}

export interface ServicesAgentPortfolioResponse {
  success: boolean;
  data?: {
    summary: {
      totalServices: number;
      activeServices: number;
      withPricing: number;
      withImages: number;
      avgCompleteness: number;
      averageScore?: number;
      topPerformers?: any[];
      needsImprovement?: any[];
    };
    categories: {
      [key: string]: {
        count: number;
        services: Array<{ id: string; titulo: string; estado: string }>;
      };
    };
    swot: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    gaps: Array<{
      type: string;
      description: string;
      suggestion: string;
    }>;
    recommendations: string[];
  };
  error?: string;
}

export interface ServicesAgentPricingRequest {
  serviceData: {
    titulo: string;
    descripcion: string;
    categoria?: string;
    caracteristicas?: string[];
    beneficios?: string[];
  };
  marketData?: {
    competitors?: Array<{
      name: string;
      price: number;
      features: string[];
    }>;
    targetMarket?: string;
  };
  strategy?: 'competitive' | 'premium' | 'penetration' | 'value-based';
}

export interface ServicesAgentPricingResponse {
  success: boolean;
  data?: {
    suggestedPrice: number;
    priceRange: {
      min: number;
      max: number;
      optimal: number;
    };
    strategies: Array<{
      name: string;
      price: number;
      rationale: string;
      pros: string[];
      cons: string[];
    }>;
    analysis: {
      marketPosition: string;
      competitiveness: string;
      valuePerception: string;
    };
  };
  error?: string;
}

export interface ServicesAgentMetricsResponse {
  success: boolean;
  data?: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    operationsByType: Record<string, number>;
    lastUsed: string;
    uptime: string;
  };
  error?: string;
}

export interface ServicesAgentStatusResponse {
  success: boolean;
  data?: {
    enabled: boolean;
    status: 'active' | 'inactive' | 'error';
    capabilities: string[];
    version: string;
    lastHealthCheck: string;
  };
  error?: string;
}

// ============================================
// SERVICIO API
// ============================================

class ServicesAgentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${getApiUrl()}/servicios/agent`;
  }

  /**
   * Obtener token de autenticación de Clerk
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const session = window.Clerk?.session;
      if (session) {
        return await session.getToken();
      }
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Realizar fetch con autenticación
   */
  private async fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    // Manejar rate limiting
    if (response.status === 429) {
      throw new Error('Demasiadas solicitudes. Por favor, espera unos minutos e intenta de nuevo.');
    }

    // Manejar errores de autenticación
    if (response.status === 401) {
      throw new Error('No autenticado. Por favor, inicia sesión nuevamente.');
    }

    // Manejar errores de permisos
    if (response.status === 403) {
      throw new Error('No tienes permisos para realizar esta acción.');
    }

    return response;
  }

  /**
   * 1. Obtener estado del agente
   * GET /api/servicios/agent/status
   */
  async getStatus(): Promise<ServicesAgentStatusResponse> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/status`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting ServicesAgent status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener estado del agente',
      };
    }
  }

  /**
   * 2. Obtener métricas del agente
   * GET /api/servicios/agent/metrics
   */
  async getMetrics(): Promise<ServicesAgentMetricsResponse> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/metrics`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting ServicesAgent metrics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener métricas del agente',
      };
    }
  }

  /**
   * 3. Chat con el agente
   * POST /api/servicios/agent/chat
   */
  async chat(request: ServicesAgentChatRequest): Promise<ServicesAgentChatResponse> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/chat`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error chatting with ServicesAgent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al comunicarse con el agente',
      };
    }
  }

  /**
   * 4. Crear servicio con IA
   * POST /api/servicios/agent/create
   */
  async createService(request: ServicesAgentCreateRequest): Promise<ServicesAgentCreateResponse> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/create`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating service with agent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al crear servicio',
      };
    }
  }

  /**
   * 5. Editar servicio con IA
   * POST /api/servicios/:id/agent/edit
   */
  async editService(
    serviceId: string,
    request: ServicesAgentEditRequest
  ): Promise<ServicesAgentCreateResponse> {
    try {
      const response = await this.fetchWithAuth(
        `${getApiUrl()}/servicios/${serviceId}/agent/edit`,
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error editing service with agent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al editar servicio',
      };
    }
  }

  /**
   * 6. Analizar servicio individual
   * POST /api/servicios/:id/agent/analyze
   */
  async analyzeService(
    serviceId: string,
    options?: ServicesAgentAnalyzeRequest
  ): Promise<ServicesAgentAnalyzeResponse> {
    try {
      const response = await this.fetchWithAuth(
        `${getApiUrl()}/servicios/${serviceId}/agent/analyze`,
        {
          method: 'POST',
          body: JSON.stringify(options || {}),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing service:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al analizar servicio',
      };
    }
  }

  /**
   * ❌ DEPRECADO: Usar generateCompleteContent() en su lugar
   * 🔄 REDIRIGIDO: Este método ahora usa el endpoint optimizado
   */
  async generateContent(
    serviceId: string,
    contentType: 'full_description' | 'short_description' | 'features' | 'benefits' | 'faq' | 'incluye' | 'noIncluye' | 'seo',
    style: 'formal' | 'casual' | 'technical' = 'formal'
  ): Promise<any> {
    console.warn(`⚠️ [DEPRECATED] generateContent() is deprecated. Redirecting to generateCompleteContent()`);
    
    try {
      // 🔄 REDIRIGIR al método optimizado
      const result = await this.generateCompleteContent(serviceId, style, true);
      
      // 🆕 Para SEO, verificar el campo directamente
      let content = result.data?.generatedContent?.[contentType];
      
      // 🔧 FIX: Si es SEO y no tiene palabraClavePrincipal, generarla desde el título
      if (contentType === 'seo' && content && !content.palabraClavePrincipal) {
        const titulo = result.data?.service?.titulo || content?.titulo || '';
        content.palabraClavePrincipal = titulo
          .toLowerCase()
          .replace(/[^a-záéíóúñü\s]/g, '')
          .trim()
          .split(/\s+/)
          .filter((word: string) => word.length > 2)
          .slice(0, 3)
          .join(' ');
        console.log(`🔧 [generateContent] palabraClavePrincipal auto-generated: "${content.palabraClavePrincipal}"`);
      }
      
      if (result.success && content) {
        // Simular la estructura del método viejo para compatibilidad
        return {
          success: true,
          data: {
            type: contentType,
            content: content,
            service: result.data.service,
            redirectedFromDeprecated: true
          }
        };
      }
      
      throw new Error(`Content type ${contentType} not generated in complete content`);
      
    } catch (error) {
      console.error(`❌ [DEPRECATED_REDIRECT] Error redirecting to optimized method:`, error);
      throw error;
    }
  }

  /**
   * 🚀 6.6. Generar TODAS las características de una sola vez (OPTIMIZADO)
   * POST /api/servicios/:id/agent/generate-complete
   * 
   * Este endpoint unificado genera:
   * - Características (5 items)
   * - Beneficios (5 items)
   * - Qué Incluye (5 items)
   * - Qué NO Incluye (5 items)
   * - FAQ (5 preguntas)
   * 
   * TODO EN UNA SOLA LLAMADA A LA API (~90s vs 30-45s separadas)
   */
  async generateCompleteContent(
    serviceId: string,
    style: 'formal' | 'casual' | 'technical' = 'formal',
    forceRegenerate: boolean = false
  ): Promise<any> {
    try {
      const url = `${getApiUrl()}/servicios/${serviceId}/agent/generate-complete`;
      
      // Timeout extendido a 120 segundos para generación completa
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);
      
      const response = await this.fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify({ style, forceRegenerate }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [servicesAgentService] Error response:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error(`❌ [servicesAgentService] Exception en generateCompleteContent:`, error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Timeout: La generación completa tomó demasiado tiempo (>120s). Esto puede deberse a problemas de red o servidor ocupado.',
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al generar contenido completo',
      };
    }
  }

  /**
   * 7. Analizar portafolio completo
   * POST /api/servicios/agent/analyze-portfolio
   */
  async analyzePortfolio(
    request?: ServicesAgentPortfolioRequest
  ): Promise<ServicesAgentPortfolioResponse> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/analyze-portfolio`, {
        method: 'POST',
        body: JSON.stringify(request || {}),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing portfolio:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al analizar portafolio',
      };
    }
  }

  /**
   * 8. Sugerir pricing
   * POST /api/servicios/agent/suggest-pricing
   */
  async suggestPricing(
    request: ServicesAgentPricingRequest
  ): Promise<ServicesAgentPricingResponse> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/suggest-pricing`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error suggesting pricing:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al sugerir pricing',
      };
    }
  }

  /**
   * 9. Analizar pricing de servicio
   * POST /api/servicios/:id/agent/analyze-pricing
   */
  async analyzePricing(
    serviceId: string,
    options?: { includeCompetitive?: boolean }
  ): Promise<ServicesAgentPricingResponse> {
    try {
      const response = await this.fetchWithAuth(
        `${getApiUrl()}/servicios/${serviceId}/agent/analyze-pricing`,
        {
          method: 'POST',
          body: JSON.stringify(options || {}),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing pricing:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al analizar pricing',
      };
    }
  }

  /**
   * 10. Optimizar paquetes
   * POST /api/servicios/agent/optimize-packages
   */
  async optimizePackages(data?: any): Promise<any> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/optimize-packages`, {
        method: 'POST',
        body: JSON.stringify(data || {}),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error optimizing packages:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al optimizar paquetes',
      };
    }
  }
}

// Exportar instancia singleton
export const servicesAgentService = new ServicesAgentService();
export default servicesAgentService;
