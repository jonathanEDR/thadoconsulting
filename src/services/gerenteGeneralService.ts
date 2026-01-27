/**
 * API Service para GerenteGeneral
 * Comunicación con el coordinador central de agentes IA
 * 
 * Endpoints:
 * 1. GET /api/gerente/config - Obtener configuración
 * 2. POST /api/gerente/config - Crear/Actualizar configuración
 * 3. GET /api/gerente/routing-rules - Obtener reglas de routing
 * 4. POST /api/gerente/routing-rules - Actualizar reglas
 * 5. GET /api/gerente/status - Estado del coordinador
 * 6. POST /api/gerente/test-routing - Testing de routing
 * 7. GET /api/gerente/context/:sessionId - Obtener contexto compartido
 * 8. GET /api/gerente/coordination-metrics - Métricas de coordinación
 */

import { getApiUrl } from '../utils/apiConfig';

// ============================================
// INTERFACES DE CONFIGURACIÓN
// ============================================

export interface RoutingRule {
  agent: string;
  keywords: string[];
  priority: number;
  confidence?: number;
  enabled: boolean;
  description?: string;
}

export interface RoutingConfiguration {
  coordinationPhase: {
    enabled: boolean;
    keywords: string[];
    requireMultipleAgents: boolean;
    minAgentsForCoordination: number;
  };
  individualPhase: {
    defaultAgent: string;
    rules: RoutingRule[];
  };
}

export interface OrchestrationConfig {
  parallelization: {
    enabled: boolean;
    maxConcurrentAgents: number;
  };
  timeouts: {
    perAgent: number; // segundos
    total: number; // segundos
    contextRetrieval: number; // segundos
  };
  retryPolicy: {
    maxAttempts: number;
    backoffMultiplier: number;
  };
}

// ============================================
// INTERFACES DE PERSONALIDAD
// ============================================

export interface PersonalityTrait {
  trait: string;
  intensity: number; // 1-10
}

export interface CommunicationStyle {
  tone: 'formal' | 'casual' | 'friendly' | 'professional' | 'technical' | 'motivational';
  verbosity: 'concise' | 'moderate' | 'detailed' | 'comprehensive';
  formality: number; // 1-10
  enthusiasm: number; // 1-10
  technicality: number; // 1-10
}

export interface PersonalityConfig {
  archetype: 'analyst' | 'coach' | 'expert' | 'assistant' | 'guardian' | 'innovator' | 'coordinator';
  traits: PersonalityTrait[];
  communicationStyle: CommunicationStyle;
}

// ============================================
// INTERFACES DE TRAINING
// ============================================

export interface TrainingExample {
  id: string;
  input: string;
  expectedOutput: string;
  category: string;
  notes?: string;
}

export interface TaskPrompt {
  taskType: string;
  systemPrompt: string;
  userPromptTemplate: string;
  temperature: number;
  examples: string[];
}

export interface TrainingConfig {
  examples: TrainingExample[];
  taskPrompts: TaskPrompt[];
  behaviorRules: string[];
  specialInstructions: string;
  learningMode: 'conservative' | 'balanced' | 'aggressive' | 'adaptive';
}

// ============================================
// INTERFACES DE RESPUESTAS Y PROMPTS
// ============================================

export interface ResponseConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
  includeExamples: boolean;
  includeSteps: boolean;
  includeMetrics: boolean;
  includeRecommendations: boolean;
  responseFormat: 'text' | 'structured' | 'markdown' | 'detailed';
}

export interface PromptConfig {
  useCustomPrompts: boolean;
  customSystemPrompt: string;
  promptVariables: Record<string, string>;
  contextWindow: number;
}

export interface ProjectInfo {
  name: string;
  type: string;
  domain: string;
  language: string;
  tone: string;
}

// ============================================
// INTERFACE PRINCIPAL DE CONFIGURACIÓN
// ============================================

export interface GerenteGeneralConfigData {
  agentName: 'gerente';
  enabled: boolean;
  
  // Configuración básica (OpenAI)
  config: {
    timeout: number;
    maxTokens: number;
    temperature: number;
    maxSessionsPerUser?: number;
    sessionTTLHours?: number;
    autoRouting?: boolean;
    contextSharing?: boolean;
  };
  
  // Configuración de personalidad
  personality?: PersonalityConfig;
  
  // Configuración de contexto del proyecto
  contextConfig: {
    sessionTTL: number;
    maxSessions: number;
    enableContextSharing: boolean;
    enableContextEnrichment: boolean;
    contextMemorySize: number;
    projectInfo?: ProjectInfo;
    userExpertise?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'varied';
  };
  
  // Configuración de respuestas
  responseConfig?: ResponseConfig;
  
  // Configuración de prompts
  promptConfig?: PromptConfig;
  
  // Configuración de entrenamiento
  trainingConfig?: TrainingConfig;
  
  // Configuración de routing inteligente
  routingConfig: RoutingConfiguration;
  
  // Configuración de orquestación
  orchestrationConfig?: OrchestrationConfig;
  
  // Configuración de coordinación multi-agente
  coordinationStrategies?: {
    [coordinationType: string]: {
      name: string;
      description: string;
      agentSequence: string[];
      contextFlow: 'sequential' | 'parallel' | 'hybrid';
      enabled: boolean;
      timeout: number;
      errorHandling: 'stop' | 'continue' | 'fallback';
      fallbackAgent?: string;
    };
  };
  
  // Estadísticas
  statistics?: {
    totalCoordinations: number;
    successfulCoordinations: number;
    failedCoordinations: number;
    averageCoordinationTime: number;
    routingAccuracy: number;
    lastUsed?: string;
  };
  
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// INTERFACES DE RESPONSE
// ============================================

export interface GerenteGeneralStatus {
  enabled: boolean;
  status: 'operational' | 'degraded' | 'error' | 'initializing';
  activeAgents: number;
  managedAgents: string[];
  contextManagerStatus: 'ready' | 'busy' | 'error';
  lastHealthCheck: string;
  uptime: number; // milliseconds
}

export interface RoutingDecision {
  routed: boolean;
  agent: string | 'MULTI_AGENT';
  confidence: number;
  reasoning: string;
  alternativeAgents?: string[];
  executionTime: number; // ms
}

export interface CoordinationResult {
  success: boolean;
  coordinationType: string;
  agentsInvolved: string[];
  results: {
    [agentName: string]: any;
  };
  contextUsed: Record<string, any>;
  contextGenerated: Record<string, any>;
  totalTime: number; // ms
  errors?: string[];
}

export interface CoordinationMetrics {
  totalCoordinations: number;
  successfulCoordinations: number;
  failedCoordinations: number;
  averageCoordinationTime: number;
  routingAccuracy: number;
  coordinationTypeStats: {
    [coordinationType: string]: {
      count: number;
      successRate: number;
      averageTime: number;
    };
  };
  agentPerformance: {
    [agentName: string]: {
      invokedCount: number;
      successRate: number;
      averageResponseTime: number;
    };
  };
}

// ============================================
// SERVICIO PRINCIPAL
// ============================================

class GerenteGeneralService {
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
   * Obtener configuración actual del GerenteGeneral
   */
  async getConfig(): Promise<{
    success: boolean;
    data?: GerenteGeneralConfigData;
    error?: string;
  }> {
    try {
      console.log('🚀 [gerenteGeneralService] Iniciando getConfig request...');
      const response = await this.fetchWithAuth('/gerente/config', {
        method: 'GET'
      });

      console.log('📡 [gerenteGeneralService] Response status:', response.status);
      console.log('📡 [gerenteGeneralService] Response ok:', response.ok);

      if (!response.ok) {
        console.error('❌ [gerenteGeneralService] HTTP Error:', response.status);
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('📦 [gerenteGeneralService] Response JSON:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching GerenteGeneral config:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Actualizar configuración del GerenteGeneral
   */
  async updateConfig(config: Partial<GerenteGeneralConfigData>): Promise<{
    success: boolean;
    data?: GerenteGeneralConfigData;
    error?: string;
  }> {
    try {
      const response = await this.fetchWithAuth('/gerente/config', {
        method: 'PUT',  // Backend usa PUT, no POST
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error updating GerenteGeneral config:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Obtener reglas de routing actuales
   */
  async getRoutingRules(): Promise<{
    success: boolean;
    data?: RoutingConfiguration;
    error?: string;
  }> {
    try {
      const response = await this.fetchWithAuth('/gerente/routing-rules', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching routing rules:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Actualizar reglas de routing
   */
  async updateRoutingRules(rules: RoutingConfiguration): Promise<{
    success: boolean;
    data?: RoutingConfiguration;
    error?: string;
  }> {
    try {
      const response = await this.fetchWithAuth('/gerente/routing-rules', {
        method: 'PUT',  // Backend usa PUT, no POST
        body: JSON.stringify(rules)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error updating routing rules:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Inicializar/Reinicializar configuración con valores por defecto
   * SOBRESCRIBE la configuración actual
   */
  async initializeConfig(): Promise<{
    success: boolean;
    data?: GerenteGeneralConfigData;
    message?: string;
    error?: string;
  }> {
    try {
      const response = await this.fetchWithAuth('/gerente/config/initialize', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error initializing GerenteGeneral config:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Obtener estado actual del GerenteGeneral
   */
  async getStatus(): Promise<{
    success: boolean;
    data?: GerenteGeneralStatus;
    error?: string;
  }> {
    try {
      const response = await this.fetchWithAuth('/gerente/status', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching GerenteGeneral status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Testing de routing - sin autenticación requerida
   */
  async testRouting(command: string, action: string = 'identify'): Promise<{
    success: boolean;
    data?: {
      routed: boolean;
      agent: string;
      confidence: number;
      reasoning: string;
      coordinationType?: string;
    };
    error?: string;
  }> {
    try {
      const response = await this.fetchWithAuth('/gerente/test-routing', {
        method: 'POST',
        body: JSON.stringify({
          command,
          action
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error testing routing:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Obtener contexto compartido de una sesión
   */
  async getSessionContext(sessionId: string): Promise<{
    success: boolean;
    data?: Record<string, any>;
    error?: string;
  }> {
    try {
      const response = await this.fetchWithAuth(`/gerente/context/${sessionId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching session context:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Obtener métricas de coordinación
   */
  async getCoordinationMetrics(): Promise<{
    success: boolean;
    data?: CoordinationMetrics;
    error?: string;
  }> {
    try {
      const response = await this.fetchWithAuth('/gerente/coordination-metrics', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching coordination metrics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

// Exportar instancia singleton
const gerenteGeneralService = new GerenteGeneralService();
export default gerenteGeneralService;
