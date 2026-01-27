// ===================================================
// TIPOS COMPARTIDOS PARA HOOKS DE IA - DASHBOARD ADMIN
// ===================================================

export interface AIAnalysisScore {
  overall: number;
  readability: number;
  seo: number;
  engagement: number;
  structure: number;
}

export interface AIRecommendation {
  id: string;
  type: 'critical' | 'important' | 'suggestion';
  category: 'seo' | 'content' | 'structure' | 'engagement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  implementation?: string;
}

export interface AIAnalysisResult {
  scores: AIAnalysisScore;
  recommendations: AIRecommendation[];
  summary?: {
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
  };
  metadata?: {
    analysisType: string;
    processingTime: number;
    tokensUsed: number;
    timestamp: string;
  };
}

// Estados de carga para hooks
export interface LoadingState {
  isLoading: boolean;
  isAnalyzing: boolean;
  isGenerating: boolean;
  isOptimizing: boolean;
  progress?: number;
}

// Estados de error
export interface ErrorState {
  hasError: boolean;
  error: string | null;
  errorCode?: number;
  timestamp?: string;
}

// Configuraciones de análisis
export interface AnalysisConfig {
  analysisType?: 'quick' | 'complete' | 'seo_focus' | 'readability_focus';
  detailLevel?: 'basic' | 'standard' | 'detailed';
  includeRecommendations?: boolean;
  includeSummary?: boolean;
  includeMetadata?: boolean;
}

// Tipos para generación de tags
export interface TagGenerationRequest {
  content: string;
  title?: string;
  category?: string;
  existingTags?: string[];
  maxTags?: number;
  focusKeywords?: string[];
}

export interface TagSuggestion {
  tag: string;
  relevance: number;
  category: 'primary' | 'secondary' | 'contextual';
  confidence: number;
  reason?: string;
}

export interface TagGenerationResult {
  suggestions: TagSuggestion[];
  recommended: string[];
  metadata: {
    processingTime: number;
    totalCandidates: number;
    selectedCount: number;
  };
}

// Tipos para optimización SEO
export interface SEOOptimizationTarget {
  postId: string;
  currentSEOScore?: number;
  focusKeywords?: string[];
  targetAudience?: string;
}

export interface SEORecommendation extends AIRecommendation {
  seoCategory: 'keywords' | 'meta' | 'structure' | 'content' | 'technical';
  currentValue?: string;
  suggestedValue?: string;
  expectedImpact?: number;
}

export interface SEOOptimizationResult {
  beforeScore: number;
  afterScore?: number;
  recommendations: SEORecommendation[];
  optimizations: {
    applied: string[];
    pending: string[];
    failed: string[];
  };
  keywordAnalysis?: {
    primary: string[];
    secondary: string[];
    density: Record<string, number>;
  };
}

// Tipos para métricas del sistema
export interface SystemHealth {
  orchestrator: 'healthy' | 'degraded' | 'unhealthy';
  openai: 'healthy' | 'degraded' | 'unhealthy';
  memory: 'healthy' | 'degraded' | 'unhealthy';
  database?: 'healthy' | 'degraded' | 'unhealthy';
  overall: 'healthy' | 'degraded' | 'unhealthy';
}

export interface SystemMetrics {
  tokensUsed: number;
  analysisCount: number;
  averageResponseTime: number;
  successRate: number;
  systemHealth: SystemHealth;
  performance?: {
    cpuUsage: number;
    memoryUsage: number;
    activeConnections: number;
    queueSize: number;
  };
}

// Tipos para configuración de hooks
export interface HookConfig {
  autoRefresh?: boolean;
  refreshInterval?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enableCache?: boolean;
  cacheTimeout?: number;
}

// Respuestas de API normalizadas
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
  requestId?: string;
}

// Tipos para el contexto de autenticación
export interface AuthContext {
  token: string | null;
  user: {
    id: string;
    role: string;
    permissions: string[];
  } | null;
  isAuthenticated: boolean;
}

// Estados combinados para hooks complejos
export interface HookState<T> {
  data: T | null;
  loading: LoadingState;
  error: ErrorState;
  lastUpdated?: string;
  cache?: {
    key: string;
    expires: string;
  };
}

// Tipos de eventos para tracking
export interface AnalyticsEvent {
  type: 'analysis_started' | 'analysis_completed' | 'tags_generated' | 'seo_optimized' | 'error_occurred';
  data: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

// Export de utilidades de tipo
export type AnalysisType = 'quick' | 'complete' | 'seo_focus' | 'readability_focus';
export type DetailLevel = 'basic' | 'standard' | 'detailed';
export type RecommendationType = 'critical' | 'important' | 'suggestion';
export type RecommendationCategory = 'seo' | 'content' | 'structure' | 'engagement';
export type Impact = 'high' | 'medium' | 'low';
export type Effort = 'low' | 'medium' | 'high';
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';