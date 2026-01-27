/**
 * Tipos TypeScript para SCUTI AI
 * Sistema de chat inteligente con GerenteGeneral
 */

// ============================================
// MENSAJE
// ============================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agentUsed?: string;
  metadata?: {
    agent?: string;
    routingDecision?: RoutingDecision;
    agentsInvolved?: string[];
    responseTime?: number;
    coordinationType?: string;
    action?: string;
    success?: boolean;
    error?: string;
  };
}

// ============================================
// SESIÓN / CONVERSACIÓN
// ============================================

export interface ChatSession {
  sessionId: string;
  userId: string;
  title?: string;
  messages: ChatMessage[];
  context?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastActivity?: Date;
  isActive: boolean;
  pinned?: boolean;
}

// ============================================
// ROUTING DECISION
// ============================================

export interface RoutingDecision {
  routed: boolean;
  agent: string | 'MULTI_AGENT';
  confidence: number;
  reasoning: string;
  alternativeAgents?: string[];
  executionTime?: number;
  coordinationType?: string;
}

// ============================================
// RESPUESTA DE COMANDO
// ============================================

export interface CommandResponse {
  success: boolean;
  response?: string;
  agent?: string;
  agentsInvolved?: string[];
  routingDecision?: RoutingDecision;
  sessionId?: string;
  context?: Record<string, any>;
  canvasData?: any; // Datos para el canvas editor
  canvas_data?: any; // Alias snake_case para compatibilidad backend
  metadata?: {
    responseTime?: number;
    tokensUsed?: number;
    model?: string;
  };
  error?: string;
}

// ============================================
// ESTADO DEL SISTEMA
// ============================================

export interface ScutiAIStatus {
  enabled: boolean;
  status: 'operational' | 'degraded' | 'error' | 'initializing';
  activeAgents: number;
  managedAgents: string[];
  uptime: number;
  lastHealthCheck: string;
}

// ============================================
// QUICK ACTIONS
// ============================================

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  prompt: string;
  category: 'blog' | 'services' | 'seo' | 'agenda' | 'general';
  description?: string;
}

// ============================================
// FILTROS
// ============================================

export interface SessionFilters {
  search?: string;
  pinned?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  agentUsed?: string;
}

// ============================================
// ESTADÍSTICAS
// ============================================

export interface ChatStatistics {
  totalSessions: number;
  totalMessages: number;
  averageMessagesPerSession: number;
  mostUsedAgent: string;
  agentUsageStats: {
    [agentName: string]: {
      count: number;
      percentage: number;
    };
  };
  coordinationStats?: {
    multiAgentSessions: number;
    averageAgentsPerCoordination: number;
  };
}

// ============================================
// CANVAS EDITOR
// ============================================

export type CanvasMode = 'preview' | 'list' | 'empty' | 'conversation' | 'suggestions';

export type CanvasContentType = 'blog' | 'service' | 'service_list' | 'service_analysis' | 'list' | 'html' | 'markdown' | 'blog_creation' | 'blog_list' | 'blog_improvements' | 'blog_statistics' | 'blog_statistics_general' | 'seo_analysis' | 'event_list' | 'empty_state' | 'session_details';

export interface CanvasContent {
  type: CanvasContentType;
  title?: string;
  data: any;
  metadata?: {
    agentUsed?: string;
    timestamp?: Date;
    action?: string;
    itemCount?: number;
    blogId?: string; // ID del blog para edición
    serviceId?: string; // ID del servicio para edición
    sessionId?: string; // ID de sesión para blog creation
  };
}

export interface BlogCanvasData {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  categories?: string[];
  tags?: string[];
  imageUrl?: string;
}

export interface ServiceCanvasData {
  id?: string;
  nombre: string;
  descripcion: string;
  descripcionLarga?: string;
  precio?: number;
  duracion?: string;
  caracteristicas?: string[];
  iconoUrl?: string;
  imagenUrl?: string;
  categoria?: string;
}

export interface ListCanvasData {
  items: Array<BlogCanvasData | ServiceCanvasData>;
  totalCount: number;
  filters?: Record<string, any>;
}

