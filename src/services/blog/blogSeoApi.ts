/**
 * 🎯 Servicio de API SEO Avanzado para Blog
 * Maneja análisis SEO, optimización automática y generación de schema markup
 * NOTA: Versión simplificada que usa las rutas de IA existentes
 */

import axios, { AxiosError } from 'axios';
import { getApiUrl } from '../../utils/apiConfig';
import { setupAuthInterceptor } from './blogApiClientSetup';
import type { ApiResponse } from '../../types/blog';

// ============================================
// TIPOS ESPECÍFICOS DE SEO
// ============================================

export interface SEOAnalysis {
  overallScore: number;
  recommendations: Array<{
    type: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    category: 'TITLE' | 'DESCRIPTION' | 'HEADINGS' | 'KEYWORDS' | 'IMAGES' | 'LINKS' | 'STRUCTURE';
    issue: string;
    suggestion: string;
    impact: number;
  }>;
  titleAnalysis: {
    length: number;
    optimal: boolean;
    keywordPresence: boolean;
    readability: number;
    suggestions: string[];
  };
  descriptionAnalysis: {
    length: number;
    optimal: boolean;
    keywordPresence: boolean;
    callToAction: boolean;
    suggestions: string[];
  };
  keywordAnalysis: {
    density: Record<string, number>;
    distribution: 'GOOD' | 'KEYWORD_STUFFING' | 'UNDER_OPTIMIZED';
    primaryKeywords: string[];
    secondaryKeywords: string[];
    suggestions: string[];
  };
  headingStructure: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    hierarchy: boolean;
    keywordOptimization: number;
    suggestions: string[];
  };
  contentAnalysis: {
    wordCount: number;
    readingLevel: string;
    averageSentenceLength: number;
    passiveVoicePercentage: number;
    transitionWords: number;
    suggestions: string[];
  };
  technicalSEO: {
    imageAltTags: number;
    internalLinks: number;
    externalLinks: number;
    schemaMarkup: boolean;
    mobileOptimization: number;
    suggestions: string[];
  };
}

export interface SchemaMarkup {
  article: any;
  breadcrumb: any;
  faq?: any;
  howTo?: any;
  organization: any;
  website: any;
}

export interface SEOPreview {
  googlePreview: {
    title: string;
    url: string;
    description: string;
    isTruncated: boolean;
  };
  facebookPreview: {
    title: string;
    description: string;
    image: string;
    url: string;
  };
  twitterPreview: {
    title: string;
    description: string;
    image: string;
    cardType: 'summary' | 'summary_large_image';
  };
}

export interface KeywordResearch {
  suggestions: Array<{
    keyword: string;
    searchVolume: number;
    difficulty: number;
    relevance: number;
    intent: 'INFORMATIONAL' | 'NAVIGATIONAL' | 'TRANSACTIONAL' | 'COMMERCIAL';
    longtail: boolean;
  }>;
  relatedKeywords: string[];
  semanticKeywords: string[];
  competitorKeywords: string[];
}

export interface SEOOptimization {
  optimizedTitle: string;
  optimizedDescription: string;
  suggestedKeywords: string[];
  suggestedHeadings: Array<{
    level: 'h1' | 'h2' | 'h3';
    text: string;
    keywords: string[];
  }>;
  contentSuggestions: Array<{
    section: string;
    suggestion: string;
    keywords: string[];
  }>;
  schemaMarkup: SchemaMarkup;
}

// ============================================
// CONFIGURACIÓN DE AXIOS
// ============================================

const seoApiClient = axios.create({
  baseURL: `${getApiUrl()}/blog/seo`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // 20 segundos para análisis SEO
});

// Configurar interceptor de autenticación
setupAuthInterceptor(seoApiClient);

// Interceptor para manejo de errores específicos de SEO
seoApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('SEO API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('El análisis SEO está tomando más tiempo del esperado. Por favor, intenta nuevamente.');
    }
    
    if (error.response?.status === 429) {
      throw new Error('Límite de análisis SEO alcanzado. Por favor, espera un momento antes de intentar nuevamente.');
    }
    
    throw error;
  }
);

// ============================================
// SERVICIOS SEO
// ============================================

/**
 * Realizar análisis SEO completo de un post
 */
export const analyzeSEO = async (_slug: string): Promise<SEOAnalysis> => {
  try {
    // TEMPORAL: Datos simulados hasta implementar rutas SEO específicas
    const mockSEOAnalysis: SEOAnalysis = {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      recommendations: [
        {
          type: 'MEDIUM',
          category: 'TITLE',
          issue: 'Título podría ser más específico',
          suggestion: 'Considera añadir palabras clave relacionadas al tema',
          impact: 15
        }
      ],
      titleAnalysis: {
        length: 60,
        optimal: true,
        keywordPresence: true,
        readability: 85,
        suggestions: []
      },
      descriptionAnalysis: {
        length: 155,
        optimal: true,
        keywordPresence: true,
        callToAction: false,
        suggestions: ['Agregar una llamada a la acción']
      },
      keywordAnalysis: {
        density: { 'web': 2.1, 'desarrollo': 1.8 },
        distribution: 'GOOD',
        primaryKeywords: ['web', 'desarrollo'],
        secondaryKeywords: ['tecnología', 'programación'],
        suggestions: []
      },
      headingStructure: {
        h1Count: 1,
        h2Count: 3,
        h3Count: 5,
        hierarchy: true,
        keywordOptimization: 75,
        suggestions: []
      },
      contentAnalysis: {
        wordCount: 800,
        readingLevel: 'Intermedio',
        averageSentenceLength: 18,
        passiveVoicePercentage: 10,
        transitionWords: 15,
        suggestions: []
      },
      technicalSEO: {
        imageAltTags: 90,
        internalLinks: 3,
        externalLinks: 2,
        schemaMarkup: true,
        mobileOptimization: 95,
        suggestions: []
      }
    };

    return mockSEOAnalysis;
  } catch (error: any) {
    console.error('Error analyzing SEO:', error);
    throw new Error('Error al analizar SEO del post');
  }
};

/**
 * Generar schema markup para un post
 */
export const generateSchemaMarkup = async (_slug: string): Promise<SchemaMarkup> => {
  try {
    // TEMPORAL: Datos simulados hasta implementar rutas SEO específicas
    const mockSchema: SchemaMarkup = {
      article: {
        '@type': 'Article',
        headline: 'Artículo de ejemplo',
        author: { '@type': 'Person', name: 'THADO Consulting Team' },
        datePublished: new Date().toISOString()
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: []
      },
      organization: {
        '@type': 'Organization',
        name: 'THADO Consulting'
      },
      website: {
        '@type': 'WebSite',
        name: 'THADO Consulting Blog'
      }
    };

    return mockSchema;
  } catch (error: any) {
    console.error('Error generating schema markup:', error);
    throw new Error('Error al generar schema markup');
  }
};

/**
 * Obtener vista previa SEO para diferentes plataformas
 */
export const getSEOPreview = async (
  slug: string,
  customTitle?: string,
  customDescription?: string
): Promise<SEOPreview> => {
  try {
    const response = await seoApiClient.post<ApiResponse<SEOPreview>>(
      `/preview/${slug}`,
      { customTitle, customDescription }
    );
    return response.data.data;
  } catch (error: any) {
    console.error('Error getting SEO preview:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener vista previa SEO');
  }
};

/**
 * Investigación de keywords para un tema
 */
export const researchKeywords = async (
  topic: string,
  options?: {
    language?: string;
    country?: string;
    includeQuestions?: boolean;
  }
): Promise<KeywordResearch> => {
  try {
    const response = await seoApiClient.post<ApiResponse<KeywordResearch>>(
      '/keywords/research',
      { topic, ...options }
    );
    return response.data.data;
  } catch (error: any) {
    console.error('Error researching keywords:', error);
    throw new Error(error.response?.data?.message || 'Error al investigar keywords');
  }
};

/**
 * Optimización automática SEO basada en IA
 */
export const optimizeContent = async (
  content: string,
  title: string,
  targetKeywords: string[]
): Promise<SEOOptimization> => {
  try {
    const response = await seoApiClient.post<ApiResponse<SEOOptimization>>(
      '/optimize',
      { content, title, targetKeywords }
    );
    return response.data.data;
  } catch (error: any) {
    console.error('Error optimizing content:', error);
    throw new Error(error.response?.data?.message || 'Error al optimizar contenido');
  }
};

/**
 * Análisis de competidores para SEO
 */
export const analyzeCompetitors = async (
  keywords: string[],
  options?: { limit?: number; includeBacklinks?: boolean }
): Promise<Array<{
  url: string;
  title: string;
  description: string;
  keywords: string[];
  backlinks: number;
  domainAuthority: number;
  contentLength: number;
  gaps: string[];
}>> => {
  try {
    const response = await seoApiClient.post<ApiResponse<any>>(
      '/competitors/analyze',
      { keywords, ...options }
    );
    return response.data.data.competitors;
  } catch (error: any) {
    console.error('Error analyzing competitors:', error);
    throw new Error(error.response?.data?.message || 'Error al analizar competidores');
  }
};

/**
 * Generar meta tags optimizados con IA
 */
export const generateMetaTags = async (
  slug: string,
  options?: {
    focusKeywords?: string[];
    customBrand?: string;
    includeTwitter?: boolean;
    includeFacebook?: boolean;
  }
): Promise<{
  title: string;
  description: string;
  keywords: string[];
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
  canonical: string;
}> => {
  try {
    const response = await seoApiClient.post<ApiResponse<any>>(
      `/meta-tags/${slug}`,
      options || {}
    );
    return response.data.data;
  } catch (error: any) {
    console.error('Error generating meta tags:', error);
    throw new Error(error.response?.data?.message || 'Error al generar meta tags');
  }
};

/**
 * Análisis SEO en tiempo real para el editor
 */
export const analyzeLiveContent = async (
  content: string,
  title: string,
  description?: string,
  keywords?: string[]
): Promise<Partial<SEOAnalysis>> => {
  try {
    const response = await seoApiClient.post<ApiResponse<Partial<SEOAnalysis>>>(
      '/analyze-live',
      { content, title, description, keywords }
    );
    return response.data.data;
  } catch (error: any) {
    console.error('Error analyzing live content:', error);
    throw new Error(error.response?.data?.message || 'Error al analizar contenido en vivo');
  }
};

/**
 * Obtener sitemap XML automático
 */
export const generateSitemap = async (
  options?: {
    includeImages?: boolean;
    includeLastModified?: boolean;
    includeChangeFreq?: boolean;
  }
): Promise<{ xml: string; entries: number }> => {
  try {
    const response = await seoApiClient.get<ApiResponse<any>>(
      '/sitemap/generate',
      { params: options }
    );
    return response.data.data;
  } catch (error: any) {
    console.error('Error generating sitemap:', error);
    throw new Error(error.response?.data?.message || 'Error al generar sitemap');
  }
};

/**
 * Análisis de enlaces internos y sugerencias
 */
export const analyzeInternalLinks = async (slug: string): Promise<{
  currentLinks: Array<{
    text: string;
    url: string;
    isInternal: boolean;
    anchor: string;
  }>;
  suggestions: Array<{
    targetUrl: string;
    suggestedAnchor: string;
    relevanceScore: number;
    reason: string;
  }>;
  linkStrength: number;
}> => {
  try {
    const response = await seoApiClient.get<ApiResponse<any>>(`/internal-links/${slug}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error analyzing internal links:', error);
    throw new Error(error.response?.data?.message || 'Error al analizar enlaces internos');
  }
};

// ============================================
// EXPORTAR SERVICIOS
// ============================================

export const blogSeoApi = {
  analyzeSEO,
  generateSchemaMarkup,
  getSEOPreview,
  researchKeywords,
  optimizeContent,
  analyzeCompetitors,
  generateMetaTags,
  analyzeLiveContent,
  generateSitemap,
  analyzeInternalLinks,
};

export default blogSeoApi;