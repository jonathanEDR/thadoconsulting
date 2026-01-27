/**
 * 🎯 SEO Agent Service
 * Servicio para comunicación con el SEOAgent backend
 * 
 * 🔒 RESTRICCIONES DE ACCESO:
 * - Solo disponible en Admin Dashboard
 * - Requiere roles ADMIN o SUPER_ADMIN
 * - NO disponible para CLIENT/USER en blog público
 * 
 * Reutiliza la infraestructura existente de agentes
 * Integra sistema de roles y permisos
 */

import { getApiUrl } from '../utils/apiConfig';
import type { UserRole } from '../types/roles';

// Tipos para las tareas del SEO Agent
export interface SEOTask {
  type: 'analyze_content' | 'content_analysis' | 'optimize_seo' | 'content_optimization' | 'generate_structure' | 'keyword_research' | 'competitor_analysis' | 'content_review';
  content?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  target_url?: string;
  competitors?: string[];
  metadata?: Record<string, any>;
}

export interface SEOAnalysisResult {
  seo_score: number;
  recommendations: string[];
  optimized_title?: string;
  optimized_description?: string;
  suggested_keywords: string[];
  content_structure?: {
    headings: string[];
    paragraphs: number;
    word_count: number;
    readability_score: number;
  };
  technical_issues: string[];
  improvement_suggestions: string[];
}

export interface SEOChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    task_type?: string;
    analysis_data?: any;
  };
}

export interface SEOChatSession {
  session_id: string;
  messages: SEOChatMessage[];
  context: {
    post_id?: string;
    post_title?: string;
    current_content?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  result?: T;
  error?: string;
  message?: string;
}

class SEOAgentService {
  private async getAuthToken(): Promise<string | null> {
    // Obtener token de Clerk desde sessionStorage o localStorage
    const session = window.Clerk?.session;
    if (session) {
      return await session.getToken();
    }
    return null;
  }

  private async getUserRole(): Promise<UserRole | null> {
    try {
      const session = window.Clerk?.session;
      if (session) {
        const token = await session.getToken();
        const response = await fetch(`${getApiUrl()}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('🔍 [SEOAgentService] Profile API response:', data);
          // El endpoint devuelve { success: true, data: { role: '...', ... } }
          const userRole = data.data?.role || null;
          console.log('🔍 [SEOAgentService] User role from API:', userRole);
          return userRole;
        } else {
          console.error('❌ [SEOAgentService] Profile API error:', response.status, response.statusText);
        }
      }
    } catch (error) {
      console.warn('Could not get user role:', error);
    }
    return null;
  }

  private async hasRequiredAccess(requiredRoles: UserRole[]): Promise<boolean> {
    try {
      const userRole = await this.getUserRole();
      console.log('🔍 [SEOAgentService] Checking access - User role:', userRole, 'Required roles:', requiredRoles);
      
      if (!userRole) {
        console.warn('⚠️ [SEOAgentService] No user role found');
        return false;
      }
      
      // Mapa de jerarquía de roles (mayor número = mayor privilegio)
      const roleHierarchy: Record<UserRole, number> = {
        'SUPER_ADMIN': 5,
        'ADMIN': 4,
        'MODERATOR': 3,
        'CLIENT': 2,
        'USER': 1
      } as const;
      
      const userLevel = roleHierarchy[userRole] || 0;
      const requiredLevel = Math.min(...requiredRoles.map(role => roleHierarchy[role] || 999));
      
      console.log('🔍 [SEOAgentService] User level:', userLevel, 'Required level:', requiredLevel, 'Has access:', userLevel >= requiredLevel);
      
      return userLevel >= requiredLevel;
    } catch (error) {
      console.warn('Error checking role access:', error);
      return false;
    }
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  /**
   * Ejecutar una tarea SEO específica
   * Requiere: SUPER_ADMIN, ADMIN o MODERATOR
   */
  async executeTask(task: SEOTask): Promise<ApiResponse<SEOAnalysisResult>> {
    // Verificar permisos para funciones avanzadas
    const hasAccess = await this.hasRequiredAccess(['SUPER_ADMIN' as UserRole, 'ADMIN' as UserRole, 'MODERATOR' as UserRole]);
    if (!hasAccess) {
      return {
        success: false,
        error: 'No tienes permisos suficientes para ejecutar tareas avanzadas del SEO Agent. Requiere rol de Moderador o superior.',
      };
    }

    try {
      // Mapear tipos de tarea a endpoints específicos
      let endpoint = '/agents/seo/execute';
      
      switch (task.type) {
        case 'analyze_content':
        case 'content_analysis':
          endpoint = '/agents/seo/analyze';
          break;
        case 'generate_structure':
          endpoint = '/agents/seo/structure';
          break;
        case 'content_review':
          endpoint = '/agents/seo/review';
          break;
        case 'keyword_research':
          endpoint = '/agents/seo/keywords';
          break;
        case 'competitor_analysis':
          endpoint = '/agents/seo/competitors';
          break;
        case 'content_optimization':
          endpoint = '/agents/seo/optimize';
          break;
      }

      const response = await this.fetchWithAuth(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          content: task.content,
          title: task.title,
          description: task.description,
          keywords: task.keywords,
          target_url: task.target_url,
          competitors: task.competitors,
          topic: task.metadata?.topic,
          targetAudience: task.metadata?.targetAudience,
          industry: task.metadata?.industry,
          targetKeywords: task.keywords,
          optimize: task.metadata?.optimize !== false
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error executing SEO task:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error ejecutando tarea SEO',
      };
    }
  }

  /**
   * Optimizar contenido SEO (usando endpoint específico)
   */
  async optimizeContent(content: string, title: string): Promise<ApiResponse<SEOAnalysisResult>> {
    try {
      const response = await this.fetchWithAuth('/agents/blog/seo', {
        method: 'POST',
        body: JSON.stringify({
          content,
          title,
          optimize: true
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error optimizing SEO content:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error optimizando contenido SEO',
      };
    }
  }

  /**
   * Chat conversacional con SEO Agent
   * Simula funcionalidad de chat usando comandos genéricos
   */
  async sendChatMessage(
    message: string,
    context?: {
      post_id?: string;
      post_title?: string;
      current_content?: string;
    }
  ): Promise<ApiResponse<string>> {
    try {
      const response = await this.fetchWithAuth('/agents/command', {
        method: 'POST',
        body: JSON.stringify({
          command: `SEO_CHAT: ${message}`,
          target: 'seo',
          context: context || {},
          metadata: {
            type: 'chat_message',
            timestamp: new Date().toISOString()
          }
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending chat message to SEO Agent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error enviando mensaje al SEO Agent',
      };
    }
  }

  /**
   * Analizar keywords para contenido
   */
  async analyzeKeywords(content: string, targetKeywords?: string[]): Promise<ApiResponse<any>> {
    return this.executeTask({
      type: 'keyword_research',
      content,
      keywords: targetKeywords
    });
  }

  /**
   * Generar estructura de contenido optimizada
   */
  async generateContentStructure(
    topic: string,
    keywords: string[],
    targetAudience?: string
  ): Promise<ApiResponse<any>> {
    return this.executeTask({
      type: 'generate_structure',
      metadata: {
        topic,
        keywords,
        target_audience: targetAudience
      }
    });
  }

  /**
   * Analizar competencia
   */
  async analyzeCompetitors(
    topic: string,
    competitors: string[]
  ): Promise<ApiResponse<any>> {
    return this.executeTask({
      type: 'competitor_analysis',
      metadata: {
        topic,
        competitors
      }
    });
  }

  /**
   * Revisión completa de contenido existente
   */
  async reviewContent(
    content: string,
    title: string,
    currentMeta?: {
      description?: string;
      keywords?: string[];
    }
  ): Promise<ApiResponse<SEOAnalysisResult>> {
    return this.executeTask({
      type: 'content_review',
      content,
      title,
      description: currentMeta?.description,
      keywords: currentMeta?.keywords
    });
  }

  /**
   * Probar conectividad con SEO Agent (solo para admins)
   */
  async testConnection(input: string = 'Test connection'): Promise<ApiResponse<any>> {
    // Verificar permisos de administrador
    const hasAccess = await this.hasRequiredAccess(['SUPER_ADMIN' as UserRole, 'ADMIN' as UserRole]);
    if (!hasAccess) {
      return {
        success: false,
        error: 'No tienes permisos suficientes para probar la conexión del SEO Agent. Requiere rol de Administrador.',
      };
    }

    try {
      const response = await this.fetchWithAuth('/agents/seo/test', {
        method: 'POST',
        body: JSON.stringify({ input }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error testing SEO Agent connection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error probando conexión con SEO Agent',
      };
    }
  }

  /**
   * Obtener configuración del SEO Agent (solo para admins)
   */
  async getConfiguration(): Promise<ApiResponse<any>> {
    const hasAccess = await this.hasRequiredAccess(['SUPER_ADMIN' as UserRole, 'ADMIN' as UserRole]);
    if (!hasAccess) {
      return {
        success: false,
        error: 'Solo los administradores pueden acceder a la configuración del SEO Agent.',
      };
    }

    try {
      const response = await this.fetchWithAuth('/agents/seo/config', {
        method: 'GET',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting SEO Agent configuration:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo configuración del SEO Agent',
      };
    }
  }

  /**
   * Actualizar configuración del SEO Agent (solo para admins)
   */
  async updateConfiguration(config: any): Promise<ApiResponse<any>> {
    const hasAccess = await this.hasRequiredAccess(['SUPER_ADMIN' as UserRole, 'ADMIN' as UserRole]);
    if (!hasAccess) {
      return {
        success: false,
        error: 'Solo los administradores pueden modificar la configuración del SEO Agent.',
      };
    }

    try {
      const response = await this.fetchWithAuth('/agents/seo/config', {
        method: 'POST',
        body: JSON.stringify({ config }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating SEO Agent configuration:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error actualizando configuración del SEO Agent',
      };
    }
  }

  /**
   * Guardar auditoría SEO en el post
   */
  async saveSEOAudit(postId: string, auditData: any): Promise<ApiResponse<any>> {
    const hasAccess = await this.hasRequiredAccess(['SUPER_ADMIN' as UserRole, 'ADMIN' as UserRole, 'MODERATOR' as UserRole]);
    if (!hasAccess) {
      return {
        success: false,
        error: 'No tienes permisos para guardar auditorías SEO.',
      };
    }

    try {
      const response = await this.fetchWithAuth(`/agents/seo/audit/save/${postId}`, {
        method: 'POST',
        body: JSON.stringify({ auditData }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving SEO audit:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error guardando auditoría SEO',
      };
    }
  }

  /**
   * Obtener auditoría SEO guardada del post
   */
  async getSEOAudit(postId: string): Promise<ApiResponse<any>> {
    const hasAccess = await this.hasRequiredAccess(['SUPER_ADMIN' as UserRole, 'ADMIN' as UserRole, 'MODERATOR' as UserRole]);
    if (!hasAccess) {
      return {
        success: false,
        error: 'No tienes permisos para ver auditorías SEO.',
      };
    }

    try {
      const response = await this.fetchWithAuth(`/agents/seo/audit/${postId}`, {
        method: 'GET',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting SEO audit:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo auditoría SEO',
      };
    }
  }
}

// Exportar instancia singleton
export const seoAgentService = new SEOAgentService();
export default seoAgentService;