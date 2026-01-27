/**
 * API Service para configuración de agentes
 * Gestiona las llamadas al backend para configuración de agentes AI
 */

import { getApiUrl } from '../utils/apiConfig';

export interface AgentConfigData {
  agentName: 'blog' | 'seo' | 'services' | 'gerente';
  enabled: boolean;
  
  // Configuración básica (compartida entre agentes)
  config: {
    timeout: number;
    maxTokens: number;
    temperature: number;
    
    // BlogAgent específicas
    maxTagsPerPost?: number;
    minContentLength?: number;
    seoScoreThreshold?: number;
    autoOptimization?: boolean;
    // Control de sugerencias automáticas
    autoSuggestions?: boolean;
    suggestionDebounceMs?: number;
    suggestionMinLength?: number;
    suggestionContextLength?: number;
    
    // ServicesAgent específicas
    minDescriptionLength?: number;
    optimalDescriptionLength?: number;
    maxDescriptionLength?: number;
    qualityScoreThreshold?: number;
    completenessThreshold?: number;
    creativityLevel?: 'low' | 'balanced' | 'high' | 'very_high';
    considerMarketRates?: boolean;
    includeValueAnalysis?: boolean;
    suggestDiscounts?: boolean;
    autoSuggestImprovements?: boolean;
    includeSEORecommendations?: boolean;
    includeConversionTips?: boolean;
    canCreateServices?: boolean;
    canEditServices?: boolean;
    canDeleteServices?: boolean;
    canManagePricing?: boolean;
  };
  
  // Configuración de personalidad
  personality: {
    archetype: 'analyst' | 'coach' | 'expert' | 'assistant' | 'guardian' | 'innovator';
    traits: Array<{
      trait: 'analytical' | 'friendly' | 'precise' | 'creative' | 'professional' | 'enthusiastic' | 'technical' | 'supportive';
      intensity: number; // 1-10
    }>;
    communicationStyle: {
      tone: 'formal' | 'casual' | 'friendly' | 'professional' | 'technical' | 'motivational';
      verbosity: 'concise' | 'moderate' | 'detailed' | 'comprehensive';
      formality: number; // 1-10
      enthusiasm: number; // 1-10
      technicality: number; // 1-10
    };
  };
  
  // Configuración de contexto
  contextConfig: {
    projectInfo: {
      name: string;
      type: string;
      domain: string;
      language: string;
      tone: string;
    };
    userExpertise: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  
  // Configuración de respuestas
  responseConfig: {
    defaultLanguage: string;
    supportedLanguages: string[];
    includeExamples: boolean;
    includeSteps: boolean;
    includeMetrics: boolean;
    includeRecommendations: boolean;
    responseFormat: 'text' | 'structured' | 'markdown' | 'detailed';
  };
  
  // Configuración de prompts
  promptConfig: {
    useCustomPrompts: boolean;
    customSystemPrompt: string;
    promptVariables: Record<string, string>;
    contextWindow: number;
  };
  
  // Configuración de entrenamiento
  trainingConfig?: {
    examples: Array<{
      id: string;
      input: string;
      expectedOutput: string;
      category: string;
      notes?: string;
    }>;
    taskPrompts: Array<{
      taskType: string;
      systemPrompt: string;
      userPromptTemplate: string;
      temperature: number;
      examples: string[];
    }>;
    behaviorRules: string[];
    specialInstructions: string;
    learningMode: 'conservative' | 'balanced' | 'aggressive';
  };

  // Estadísticas
  statistics?: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    lastUsed?: string;
  };
  
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// INTERFACES ESPECÍFICAS PARA SERVICESAGENT
// ============================================

/**
 * Configuración de Análisis para ServicesAgent
 */
export interface ServicesAgentAnalysisConfig {
  minDescriptionLength: number;
  optimalDescriptionLength: number;
  maxDescriptionLength: number;
  seoScoreThreshold: number;
  qualityScoreThreshold: number;
  completenessThreshold: number;
  includeCompetitorAnalysis: boolean;
  includeSEOAnalysis: boolean;
  includePricingAnalysis: boolean;
  includeGapAnalysis: boolean;
  analysisDepth: 'quick' | 'standard' | 'thorough' | 'exhaustive';
}

/**
 * Configuración de Generación para ServicesAgent
 */
export interface ServicesAgentGenerationConfig {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  creativityLevel: 'low' | 'balanced' | 'high' | 'very_high';
  includeExamples: boolean;
  includeSEOTags: boolean;
  includeMetadata: boolean;
  generateMultipleVariations: boolean;
  variationsCount: number;
  validateBeforeCreate: boolean;
  autoOptimizeSEO: boolean;
  suggestImprovements: boolean;
}

/**
 * Configuración de Pricing para ServicesAgent
 */
export interface ServicesAgentPricingConfig {
  defaultStrategy: 'competitive' | 'premium' | 'penetration' | 'value-based';
  considerMarketRates: boolean;
  includeCompetitorPricing: boolean;
  includeValueAnalysis: boolean;
  minimumMargin: number;
  optimalMargin: number;
  premiumMargin: number;
  suggestDiscounts: boolean;
  maxDiscountPercentage: number;
  bundleDiscount: number;
  analyzeBundleOpportunities: boolean;
  defaultCurrency: string;
  supportedCurrencies: string[];
  pricingTypes: string[];
}

/**
 * Configuración de Optimización para ServicesAgent
 */
export interface ServicesAgentOptimizationConfig {
  types: Array<'seo' | 'description' | 'structure' | 'conversion' | 'complete'>;
  autoSuggestImprovements: boolean;
  autoApplyMinorFixes: boolean;
  includeSEORecommendations: boolean;
  optimizeMetaTags: boolean;
  optimizeHeadings: boolean;
  optimizeKeywords: boolean;
  includeConversionTips: boolean;
  includeCTAOptimization: boolean;
  includeValuePropositionTips: boolean;
  improveReadability: boolean;
  improveClarity: boolean;
  enhanceBenefits: boolean;
  suggestABTests: boolean;
  generateVariations: boolean;
}

/**
 * Configuración de Permisos para ServicesAgent
 */
export interface ServicesAgentPermissionsConfig {
  canCreateServices: boolean;
  canCreatePackages: boolean;
  canEditServices: boolean;
  canEditPackages: boolean;
  canEditPricing: boolean;
  canEditSEO: boolean;
  canDeleteServices: boolean;
  canDeletePackages: boolean;
  canPublishServices: boolean;
  canUnpublishServices: boolean;
  canManagePricing: boolean;
  canSuggestDiscounts: boolean;
  canAccessAnalytics: boolean;
  canViewCompetitors: boolean;
}

/**
 * Configuración de Chat para ServicesAgent
 */
export interface ServicesAgentChatConfig {
  maxContextLength: number;
  includeServiceContext: boolean;
  includePortfolioContext: boolean;
  maxResponseLength: number;
  includeRecommendations: boolean;
  includeExamples: boolean;
  includeNextSteps: boolean;
  adaptToUserExpertise: boolean;
  rememberPreferences: boolean;
  suggestActions: boolean;
  suggestQuestions: boolean;
}

/**
 * Configuración completa específica de ServicesAgent
 */
export interface ServicesAgentFullConfig extends AgentConfigData {
  servicesConfig?: {
    analysis?: ServicesAgentAnalysisConfig;
    generation?: ServicesAgentGenerationConfig;
    pricing?: ServicesAgentPricingConfig;
    optimization?: ServicesAgentOptimizationConfig;
    permissions?: ServicesAgentPermissionsConfig;
    chat?: ServicesAgentChatConfig;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class AgentConfigService {
  private async getAuthToken(): Promise<string | null> {
    // Obtener token de Clerk desde sessionStorage o localStorage
    const session = window.Clerk?.session;
    if (session) {
      return await session.getToken();
    }
    return null;
  }

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

    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      ...options,
      headers,
    });

    return response;
  }

  /**
   * Obtener todas las configuraciones de agentes
   */
  async getAllConfigs(): Promise<ApiResponse<AgentConfigData[]>> {
    try {
      const response = await this.fetchWithAuth('/agents/config');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching agent configs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Obtener configuración de un agente específico
   */
  async getConfig(agentName: string): Promise<ApiResponse<AgentConfigData>> {
    try {
      const response = await this.fetchWithAuth(`/agents/config/${agentName}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching config for ${agentName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Actualizar configuración de un agente
   */
  async updateConfig(
    agentName: string,
    config: Partial<AgentConfigData>
  ): Promise<ApiResponse<AgentConfigData>> {
    try {
      const response = await this.fetchWithAuth(`/agents/config/${agentName}`, {
        method: 'PUT',
        body: JSON.stringify(config),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating config for ${agentName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar configuración',
      };
    }
  }

  /**
   * Resetear configuración de un agente a valores por defecto
   */
  async resetConfig(agentName: string): Promise<ApiResponse<AgentConfigData>> {
    try {
      const response = await this.fetchWithAuth(`/agents/config/${agentName}/reset`, {
        method: 'POST',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error resetting config for ${agentName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al resetear configuración',
      };
    }
  }

  /**
   * Obtener configuración específica del SEOAgent
   */
  async getSEOAgentConfig(): Promise<any> {
    try {
      const response = await this.fetchWithAuth('/agents/config/SEOAgent');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting SEOAgent config:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener configuración del SEOAgent',
      };
    }
  }

  /**
   * Actualizar configuración de entrenamiento del SEOAgent
   */
  async updateSEOAgentTraining(trainingConfig: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.fetchWithAuth('/agents/config/SEOAgent/training', {
        method: 'PUT',
        body: JSON.stringify({ trainingConfig }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating SEOAgent training:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar entrenamiento del SEOAgent',
      };
    }
  }

  /**
   * Probar el SEOAgent con input específico
   */
  async testSEOAgent(input: { input: string }): Promise<any> {
    try {
      const response = await this.fetchWithAuth('/agents/seo/test', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error testing SEOAgent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al probar SEOAgent',
      };
    }
  }
}

export const agentConfigService = new AgentConfigService();
export default agentConfigService;
