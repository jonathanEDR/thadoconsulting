/**
 * 🤖 Servicio de API de IA para Blog
 * Maneja todas las peticiones relacionadas con funcionalidades de Inteligencia Artificial
 */

import axios, { AxiosError } from 'axios';
import { getApiUrl } from '../../utils/apiConfig';
import { setupAuthInterceptor } from './blogApiClientSetup';
import type { ApiResponse } from '../../types/blog';

// ============================================
// TIPOS ESPECÍFICOS DE IA
// ============================================

export interface AIMetadata {
  summary: string;
  keyTopics: string[];
  entities: Array<{
    name: string;
    type: 'PERSON' | 'ORGANIZATION' | 'LOCATION' | 'EVENT' | 'WORK_OF_ART' | 'CONSUMER_GOOD' | 'OTHER';
    salience: number;
  }>;
  keyPhrases: string[];
  sentiment: {
    score: number;
    magnitude: number;
    label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
  };
  readability: {
    score: number;
    level: 'VERY_EASY' | 'EASY' | 'FAIRLY_EASY' | 'STANDARD' | 'FAIRLY_DIFFICULT' | 'DIFFICULT' | 'VERY_DIFFICULT';
    averageSentenceLength: number;
    averageWordsPerSentence: number;
  };
  contentStructure: {
    hasIntroduction: boolean;
    hasConclusion: boolean;
    headingsCount: number;
    paragraphsCount: number;
    wordsCount: number;
    readingTimeMinutes: number;
  };
  suggestedKeywords: string[];
  suggestedTags: string[];
  contentScore: number;
  improvements: Array<{
    type: 'SEO' | 'READABILITY' | 'STRUCTURE' | 'ENGAGEMENT';
    suggestion: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
}

export interface ConversationalFormat {
  conversationalContent: string;
  tone: 'PROFESSIONAL' | 'CASUAL' | 'ACADEMIC' | 'FRIENDLY';
  targetAudience: string;
  keyPoints: string[];
}

export interface QAGeneration {
  questions: Array<{
    question: string;
    answer: string;
    type: 'FACTUAL' | 'EXPLANATORY' | 'ANALYTICAL' | 'PRACTICAL';
    relevanceScore: number;
  }>;
  faqSchema: any; // JSON-LD Schema
}

export interface ContentAnalysis {
  semanticAnalysis: {
    mainTopics: Array<{
      topic: string;
      confidence: number;
      keywords: string[];
    }>;
    relatedConcepts: string[];
    contextualRelevance: number;
  };
  structuralAnalysis: {
    introduction: {
      present: boolean;
      quality: number;
      suggestions: string[];
    };
    body: {
      organization: number;
      flow: number;
      suggestions: string[];
    };
    conclusion: {
      present: boolean;
      quality: number;
      suggestions: string[];
    };
  };
  seoAnalysis: {
    keywordDensity: Record<string, number>;
    titleOptimization: number;
    metaDescriptionOptimization: number;
    headingStructure: number;
    overallSeoScore: number;
  };
}

export interface ExtendedJSONLD {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  author: any;
  publisher: any;
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: any;
  image: any;
  articleSection: string[];
  keywords: string[];
  about: any[];
  mentions: any[];
  inLanguage: string;
  wordCount: number;
  timeRequired: string;
}

// ============================================
// CONFIGURACIÓN DE AXIOS
// ============================================

const aiApiClient = axios.create({
  baseURL: `${getApiUrl()}/blog/ai`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos para operaciones de IA
});

// Configurar interceptor de autenticación
setupAuthInterceptor(aiApiClient);

// Interceptor para manejo de errores específicos de IA
aiApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('AI API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('El análisis de IA está tomando más tiempo del esperado. Por favor, intenta nuevamente.');
    }
    
    if (error.response?.status === 429) {
      throw new Error('Límite de solicitudes de IA alcanzado. Por favor, espera un momento antes de intentar nuevamente.');
    }
    
    if (error.response?.status === 503) {
      throw new Error('El servicio de IA no está disponible temporalmente. Por favor, intenta más tarde.');
    }
    
    throw error;
  }
);

// ============================================
// SERVICIOS DE IA
// ============================================

/**
 * Obtener metadata completa de IA para un post
 */
export const getAIMetadata = async (slug: string): Promise<AIMetadata> => {
  try {
    const response = await aiApiClient.get<ApiResponse<AIMetadata>>(`/ai/metadata/${slug}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error getting AI metadata:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener metadata de IA');
  }
};

/**
 * Generar formato conversacional para un post
 */
export const generateConversationalFormat = async (
  slug: string, 
  options?: { tone?: string; targetAudience?: string }
): Promise<ConversationalFormat> => {
  try {
    const response = await aiApiClient.post<ApiResponse<ConversationalFormat>>(
      `/conversational/${slug}`,
      options || {}
    );
    return response.data.data;
  } catch (error: any) {
    console.error('Error generating conversational format:', error);
    throw new Error(error.response?.data?.message || 'Error al generar formato conversacional');
  }
};

/**
 * Generar preguntas y respuestas automáticas
 */
export const generateQA = async (slug: string): Promise<QAGeneration> => {
  try {
    const response = await aiApiClient.get<ApiResponse<QAGeneration>>(`/ai/qa/${slug}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error generating Q&A:', error);
    throw new Error(error.response?.data?.message || 'Error al generar preguntas y respuestas');
  }
};

/**
 * Análisis completo de contenido
 */
export const analyzeContent = async (slug: string): Promise<ContentAnalysis> => {
  try {
    const response = await aiApiClient.get<ApiResponse<ContentAnalysis>>(`/ai/semantic-analysis/${slug}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error analyzing content:', error);
    throw new Error(error.response?.data?.message || 'Error al analizar contenido');
  }
};

/**
 * Generar JSON-LD extendido con IA
 */
export const generateExtendedJSONLD = async (slug: string): Promise<ExtendedJSONLD> => {
  try {
    const response = await aiApiClient.get<ApiResponse<ExtendedJSONLD>>(`/ai/json-ld-extended/${slug}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error generating JSON-LD:', error);
    throw new Error(error.response?.data?.message || 'Error al generar JSON-LD');
  }
};

/**
 * Sugerir mejoras para el contenido
 */
export const suggestImprovements = async (slug: string): Promise<AIMetadata['improvements']> => {
  try {
    const response = await aiApiClient.get<ApiResponse<{ improvements: AIMetadata['improvements'] }>>(
      `/ai/suggestions/${slug}`
    );
    return response.data.data.improvements;
  } catch (error: any) {
    console.error('Error getting content improvements:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener sugerencias');
  }
};

/**
 * Analizar contenido antes de publicar (para editor)
 */
export const analyzeContentDraft = async (content: string, title: string): Promise<Partial<AIMetadata>> => {
  try {
    const response = await aiApiClient.post<ApiResponse<Partial<AIMetadata>>>(
      '/analyze-draft',
      { content, title }
    );
    return response.data.data;
  } catch (error: any) {
    console.error('Error analyzing draft content:', error);
    throw new Error(error.response?.data?.message || 'Error al analizar borrador');
  }
};

/**
 * Generar sugerencias de contenido relacionado basado en IA
 */
export const getAIRecommendations = async (
  slug: string, 
  options?: { limit?: number; includeExternal?: boolean }
): Promise<Array<{
  title: string;
  slug: string;
  relevanceScore: number;
  reason: string;
  type: 'INTERNAL' | 'EXTERNAL';
  url?: string;
}>> => {
  try {
    const response = await aiApiClient.get<ApiResponse<any>>(
      `/ai/suggestions/${slug}`,
      { params: options }
    );
    return response.data.data.recommendations;
  } catch (error: any) {
    console.error('Error getting AI recommendations:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener recomendaciones');
  }
};

/**
 * Generar resumen automático optimizado para SEO
 */
export const generateSEOSummary = async (
  slug: string,
  maxLength: number = 160
): Promise<{ summary: string; keywords: string[]; score: number }> => {
  try {
    const response = await aiApiClient.post<ApiResponse<any>>(
      `/seo-summary/${slug}`,
      { maxLength }
    );
    return response.data.data;
  } catch (error: any) {
    console.error('Error generating SEO summary:', error);
    throw new Error(error.response?.data?.message || 'Error al generar resumen SEO');
  }
};

// ============================================
// EXPORTAR SERVICIOS
// ============================================

export const blogAiApi = {
  getAIMetadata,
  generateConversationalFormat,
  generateQA,
  analyzeContent,
  generateExtendedJSONLD,
  suggestImprovements,
  analyzeContentDraft,
  getAIRecommendations,
  generateSEOSummary,
};

export default blogAiApi;