/**
 * 📊 Blog Analytics Service
 * Servicio para consumir datos de analytics del blog desde el backend
 * 
 * Reemplaza los datos mock por datos REALES de la base de datos
 */

import { getApiUrl } from '../utils/apiConfig';

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface PostStats {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagementRate: number;
}

export interface SEOAuditSummary {
  overallScore: number;
  criticalIssues: number;
  warnings: number;
  hasAudit: boolean;
}

export interface PostAIAnalysis {
  contentScore: number | null;
  seoScore: number | null;
  sentiment: {
    score: number;
    label: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  };
  readability: {
    score: number | null;
    level: string;
  };
  hasAIAnalysis: boolean;
  seoAudit: SEOAuditSummary | null;
}

export interface AnalyticsPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  readingTime: number;
  featuredImage?: string;
  category: string;
  stats: PostStats;
  aiAnalysis: PostAIAnalysis;
}

export interface TotalStats {
  totalViews: number;
  totalComments: number;
  totalLikes: number;
  totalShares: number;
  avgReadingTime: number;
  avgContentScore: number;
  avgSeoScore: number;
  avgEngagement: number;
  globalEngagementRate: number;
  postsCount: number;
  postsWithAIAnalysis: number;
}

export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

export interface ReadabilityDistribution {
  easy: number;
  medium: number;
  hard: number;
}

export interface TopicTrend {
  topic: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TopKeyword {
  keyword: string;
  count: number;
}

export interface CategoryDistribution {
  name: string;
  postsCount: number;
  totalViews: number;
  avgViews: number;
}

export interface PerformanceInsights {
  topPostsByViews: AnalyticsPost[];
  topPostsByEngagement: AnalyticsPost[];
  postsNeedingAttention: AnalyticsPost[];
  summary: {
    postsWithAIAnalysis: number;
    postsWithoutAIAnalysis: number;
    postsWithHighScore: number;
    postsWithLowScore: number;
  };
}

export interface BlogAnalyticsData {
  posts: AnalyticsPost[];
  totalStats: TotalStats;
  sentimentDistribution: SentimentDistribution;
  readabilityDistribution: ReadabilityDistribution;
  topicTrends: TopicTrend[];
  topKeywords: TopKeyword[];
  categoryDistribution: CategoryDistribution[];
  performanceInsights: PerformanceInsights;
  hasData: boolean;
  message?: string;
  timeRange?: string;
  generatedAt?: string;
}

export interface AnalyticsApiResponse {
  success: boolean;
  data?: BlogAnalyticsData;
  error?: string;
  message?: string;
}

// ============================================
// CLASE DE SERVICIO
// ============================================

class BlogAnalyticsService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = getApiUrl();
  }

  /**
   * Configurar token de autenticación
   */
  setAuthToken(token: string) {
    this.token = token;
  }

  /**
   * Obtener headers de autenticación
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * 📊 Obtener resumen de analytics del blog
   * @param timeRange - Rango de tiempo: '7d' | '30d' | '90d' | '1y'
   */
  async getAnalyticsOverview(timeRange: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<BlogAnalyticsData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/blog/analytics/overview?timeRange=${timeRange}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const result: AnalyticsApiResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Error obteniendo analytics');
      }

      return result.data;
    } catch (error) {
      console.error('❌ Error en getAnalyticsOverview:', error);
      throw error;
    }
  }

  /**
   * 📈 Obtener analytics de un post específico
   * @param postId - ID del post
   */
  async getPostAnalytics(postId: string): Promise<AnalyticsPost> {
    try {
      const response = await fetch(
        `${this.baseUrl}/blog/analytics/post/${postId}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Error obteniendo analytics del post');
      }

      return result.data;
    } catch (error) {
      console.error('❌ Error en getPostAnalytics:', error);
      throw error;
    }
  }

  /**
   * 👁️ Registrar una vista de post (para tracking)
   * @param postId - ID del post
   */
  async trackPostView(postId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/blog/analytics/track-view/${postId}`,
        {
          method: 'POST',
          headers: this.getHeaders(),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('❌ Error en trackPostView:', error);
      return false;
    }
  }

  /**
   * 📊 Calcular métricas derivadas
   * Útil para UI que necesita métricas adicionales
   */
  calculateDerivedMetrics(data: BlogAnalyticsData): {
    engagementRate: number;
    avgViewsPerPost: number;
    topPerformingPosts: AnalyticsPost[];
    lowPerformingPosts: AnalyticsPost[];
  } {
    const { posts, totalStats } = data;
    
    // Engagement rate: (likes + shares + comments) / views * 100
    const totalEngagement = totalStats.totalLikes + totalStats.totalShares + totalStats.totalComments;
    const engagementRate = totalStats.totalViews > 0 
      ? (totalEngagement / totalStats.totalViews) * 100 
      : 0;

    // Promedio de vistas por post
    const avgViewsPerPost = totalStats.postsCount > 0 
      ? Math.round(totalStats.totalViews / totalStats.postsCount) 
      : 0;

    // Top 5 posts por vistas
    const sortedByViews = [...posts].sort((a, b) => b.stats.views - a.stats.views);
    const topPerformingPosts = sortedByViews.slice(0, 5);
    
    // Bottom 5 posts (que tengan al menos algo de data)
    const lowPerformingPosts = sortedByViews.slice(-5).reverse();

    return {
      engagementRate: Math.round(engagementRate * 100) / 100,
      avgViewsPerPost,
      topPerformingPosts,
      lowPerformingPosts
    };
  }

  // ============================================
  // MÉTODOS DE ANÁLISIS IA
  // ============================================

  /**
   * 🤖 Guardar análisis de IA para un post
   */
  async saveAIAnalysis(postId: string, analysis: {
    contentScore?: {
      total: number;
      seo: number;
      readability: number;
      structure: number;
      engagement: number;
      grade: string;
    };
    seoScore?: number;
    semanticAnalysis?: {
      keywords?: Array<{ word: string; frequency: number; relevance: number }>;
      entities?: { technologies?: string[]; concepts?: string[] };
      topics?: Array<{ name: string; weight: number; confidence: number }>;
      readabilityScore?: number;
      sentimentScore?: number;
    };
    aiMetadata?: {
      primaryKeywords?: string[];
      secondaryKeywords?: string[];
      detectedTopics?: string[];
      targetAudience?: { primary?: string; secondary?: string[]; characteristics?: string[] };
      expertiseLevel?: string;
      contentFormat?: string;
      tone?: string;
    };
    conversationalData?: {
      summary?: string;
      keyTakeaways?: string[];
      answersQuestions?: Array<{ question: string; confidence: string; type: string }>;
    };
  }): Promise<{ success: boolean; savedAt: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/blog/analytics/ai-analysis/${postId}`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(analysis),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const result = await response.json();
      return {
        success: result.success,
        savedAt: result.data?.savedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error en saveAIAnalysis:', error);
      throw error;
    }
  }

  /**
   * 📖 Obtener análisis de IA guardado de un post
   */
  async getAIAnalysis(postId: string): Promise<{
    _id: string;
    title: string;
    slug: string;
    hasAnalysis: boolean;
    aiOptimization: any;
    lastAnalyzedAt: string | null;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/blog/analytics/ai-analysis/${postId}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('❌ Error en getAIAnalysis:', error);
      throw error;
    }
  }

  /**
   * 🗑️ Resetear análisis de IA de un post
   */
  async resetAIAnalysis(postId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/blog/analytics/ai-analysis/${postId}`,
        {
          method: 'DELETE',
          headers: this.getHeaders(),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('❌ Error en resetAIAnalysis:', error);
      return false;
    }
  }
}

// Instancia singleton
export const blogAnalyticsService = new BlogAnalyticsService();

// Export por defecto
export default blogAnalyticsService;
