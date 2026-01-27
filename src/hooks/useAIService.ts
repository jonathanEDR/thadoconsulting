import { useAuth } from '@clerk/clerk-react';
import { aiService } from '../services/aiService';
import type { 
  AIAnalysisRequest, 
  AIAnalysisResponse, 
  TagGenerationRequest, 
  TagGenerationResponse, 
  SystemMetricsResponse 
} from '../services/aiService';

/**
 * Hook que integra el servicio de IA con la autenticación de Clerk
 */
export const useAIService = () => {
  const { getToken, isSignedIn } = useAuth();

  // Crear una versión autenticada del servicio
  const createAuthenticatedService = async () => {
    if (!isSignedIn) {
      throw new Error('Usuario no autenticado');
    }

    const token = await getToken();
    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación');
    }

    // Configurar el token globalmente para el servicio
    aiService.setAuthToken(token);
    return aiService;
  };

  const analyzeContent = async (request: AIAnalysisRequest): Promise<AIAnalysisResponse> => {
    const service = await createAuthenticatedService();
    return service.analyzeContent(request);
  };

  const quickAnalyze = async (
    content: string, 
    title: string, 
    category?: string
  ): Promise<AIAnalysisResponse> => {
    const service = await createAuthenticatedService();
    return service.quickAnalyze(content, title, category);
  };

  const generateTags = async (request: TagGenerationRequest): Promise<TagGenerationResponse> => {
    const service = await createAuthenticatedService();
    return service.generateTags(request);
  };

  const optimizeSEO = async (postId: string): Promise<AIAnalysisResponse> => {
    const service = await createAuthenticatedService();
    return service.optimizeSEO(postId);
  };

  const getSystemMetrics = async (): Promise<SystemMetricsResponse> => {
    const service = await createAuthenticatedService();
    return service.getSystemMetrics();
  };



  const healthCheck = async (): Promise<{ success: boolean; status: string }> => {
    // Health check no requiere autenticación
    return aiService.healthCheck();
  };

  const getCapabilities = async (): Promise<any> => {
    // Capabilities no requiere autenticación
    return aiService.getCapabilities();
  };

  const runAdvancedSystemTest = async (): Promise<any> => {
    const service = await createAuthenticatedService();
    return service.runAdvancedSystemTest();
  };

  const advancedHealthCheck = async (): Promise<any> => {
    const service = await createAuthenticatedService();
    return service.advancedHealthCheck();
  };

  return {
    analyzeContent,
    quickAnalyze,
    generateTags,
    optimizeSEO,
    getSystemMetrics,
    healthCheck,
    getCapabilities,
    runAdvancedSystemTest,
    advancedHealthCheck,
    isAuthenticated: isSignedIn
  };
};

export default useAIService;