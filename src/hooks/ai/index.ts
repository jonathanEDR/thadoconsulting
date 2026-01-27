// ===================================================
// ÍNDICE DE HOOKS DE IA PARA DASHBOARD ADMINISTRATIVO
// ===================================================

// Exportar todos los hooks personalizados
export { useAgentAnalysis } from './useAgentAnalysis';
export { useTagGeneration } from './useTagGeneration';
export { useOptimizationSEO } from './useOptimizationSEO';
export { useSystemMetrics } from './useSystemMetrics';
export { useAIChat } from './useAIChat';
export { useContentGeneration } from './useContentGeneration';
export { useAutoComplete } from './useAutoComplete';

// Exportar todos los tipos
export * from './types';

// Re-exportar tipos específicos para conveniencia
export type {
  AIAnalysisResult,
  AIRecommendation,
  TagGenerationRequest,
  TagGenerationResult,
  TagSuggestion,
  SEOOptimizationTarget,
  SEOOptimizationResult,
  SEORecommendation,
  SystemMetrics,
  SystemHealth,
  LoadingState,
  ErrorState,
  HookConfig
} from './types';