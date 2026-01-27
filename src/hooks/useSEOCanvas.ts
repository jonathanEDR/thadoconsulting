/**
 * 🎯 useSEOCanvas Hook
 * Hook para gestionar el estado y funcionalidad del SEO Canvas
 * 
 * 🔒 RESTRICCIONES DE ACCESO:
 * - Solo disponible en Admin Dashboard
 * - Requiere roles ADMIN o SUPER_ADMIN
 * - Verificación automática de permisos al abrir
 * 
 * Basado en patrones existentes del sistema de agentes
 * Integra sistema de roles y permisos
 */

import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { seoAgentService, type SEOTask, type SEOAnalysisResult, type SEOChatMessage } from '../services/seoAgentService';

interface SEOCanvasState {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  activeMode: 'chat' | 'analysis' | 'structure' | 'review' | 'config';
  currentAnalysis: SEOAnalysisResult | null;
  chatHistory: SEOChatMessage[];
  sessionId: string | null;
  // Información de permisos
  canUseAdvancedFeatures: boolean;
  canAccessConfiguration: boolean;
}

interface SEOCanvasContext {
  postId?: string;
  postTitle?: string;
  currentContent?: string;
  currentMeta?: {
    description?: string;
    keywords?: string[];
  };
}

interface UseSEOCanvasOptions {
  initialContext?: SEOCanvasContext;
  autoSave?: boolean;
}

export const useSEOCanvas = (options: UseSEOCanvasOptions = {}) => {
  const { role } = useAuth();
  const { initialContext } = options;

  const [state, setState] = useState<SEOCanvasState>({
    isOpen: false,
    isLoading: false,
    error: null,
    activeMode: 'chat',
    currentAnalysis: null,
    chatHistory: [],
    sessionId: null,
    canUseAdvancedFeatures: false,
    canAccessConfiguration: false
  });

  const [context, setContext] = useState<SEOCanvasContext>(initialContext || {});
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generar session ID único
  const generateSessionId = useCallback(() => {
    return `seo_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Verificar permisos del usuario - SOLO ADMIN/SUPER_ADMIN en Admin Dashboard
  const checkUserPermissions = useCallback(async () => {
    // Verificar permisos basados en el rol actual
    return new Promise<{ canAccessConfig: boolean; canUseAdvanced: boolean }>((resolve) => {
      const hasAdminAccess = role === 'ADMIN' || role === 'SUPER_ADMIN';
      const isSuperAdmin = role === 'SUPER_ADMIN';
      
      setState(prev => ({
        ...prev,
        canAccessConfiguration: isSuperAdmin,
        canUseAdvancedFeatures: hasAdminAccess
      }));

      resolve({ canAccessConfig: isSuperAdmin, canUseAdvanced: hasAdminAccess });
    });
  }, [role]);

  // Abrir canvas - Con verificación de permisos basada en roles
  const openCanvas = useCallback(async (mode: SEOCanvasState['activeMode'] = 'chat', newContext?: SEOCanvasContext) => {
    setState(prev => ({
      ...prev,
      isOpen: true,
      activeMode: mode,
      sessionId: prev.sessionId || generateSessionId(),
      error: null,
      isLoading: false
    }));

    if (newContext) {
      setContext(prev => ({ ...prev, ...newContext }));
    }

    // Verificar permisos basados en roles reales
    const hasAdminAccess = role === 'ADMIN' || role === 'SUPER_ADMIN';
    const isSuperAdmin = role === 'SUPER_ADMIN';

    setState(prev => ({
      ...prev,
      canAccessConfiguration: isSuperAdmin,
      canUseAdvancedFeatures: hasAdminAccess
    }));
  }, [generateSessionId, role]);

  // Cerrar canvas
  const closeCanvas = useCallback(() => {
    // Cancelar cualquier petición en curso
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState(prev => ({
      ...prev,
      isOpen: false,
      isLoading: false,
      error: null
    }));
  }, []);

  // Cambiar modo activo
  const setActiveMode = useCallback((mode: SEOCanvasState['activeMode']) => {
    setState(prev => ({
      ...prev,
      activeMode: mode,
      error: null
    }));
  }, []);

  // Actualizar contexto
  const updateContext = useCallback((newContext: Partial<SEOCanvasContext>) => {
    setContext(prev => ({ ...prev, ...newContext }));
  }, []);

  // Ejecutar tarea SEO
  const executeTask = useCallback(async (task: SEOTask): Promise<SEOAnalysisResult | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Cancelar petición anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const response = await seoAgentService.executeTask(task);

      if (response.success && (response.data || response.result)) {
        const result = response.data || response.result;
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          currentAnalysis: result || null,
          error: null
        }));

        return result || null;
      } else {
        throw new Error(response.error || 'Error ejecutando tarea SEO');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        const errorMessage = error.message || 'Error desconocido';
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }));
        console.error('❌ Error executing SEO task:', error);
      }
      return null;
    } finally {
      abortControllerRef.current = null;
    }
  }, []);

  // Enviar mensaje de chat
  const sendChatMessage = useCallback(async (message: string): Promise<string | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Agregar mensaje del usuario al historial
    const userMessage: SEOChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMessage]
    }));

    try {
      const response = await seoAgentService.sendChatMessage(message, {
        post_id: context.postId,
        post_title: context.postTitle,
        current_content: context.currentContent
      });

      if (response.success && (response.data || response.result)) {
        // Extraer el contenido de la respuesta correctamente
        let content: any = '';
        if (response.data) {
          // Si response.data es un objeto con response, extraer response
          const dataObj = response.data as any;
          content = typeof dataObj === 'object' && dataObj.response 
            ? dataObj.response 
            : dataObj;
        } else if (response.result) {
          // Si response.result es un objeto con response, extraer response  
          const resultObj = response.result as any;
          content = typeof resultObj === 'object' && resultObj.response
            ? resultObj.response
            : resultObj;
        }

        const assistantMessage: SEOChatMessage = {
          role: 'assistant',
          content: String(content || ''),
          timestamp: new Date().toISOString()
        };

        setState(prev => ({
          ...prev,
          isLoading: false,
          chatHistory: [...prev.chatHistory, assistantMessage],
          error: null
        }));

        return assistantMessage.content;
      } else {
        throw new Error(response.error || 'Error enviando mensaje');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error en el chat';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      console.error('❌ Error sending chat message:', error);
      return null;
    }
  }, [context]);

  // Funciones específicas de análisis
  const analyzeContent = useCallback(async (content: string, title: string, description?: string, keywords?: string[]) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await seoAgentService.executeTask({
        type: 'content_analysis',
        content,
        title,
        description,
        keywords: keywords || context.currentMeta?.keywords,
        metadata: { 
          postId: context.postId,
          currentContent: context.currentContent 
        }
      });
      
      if (response.success && (response.data || response.result)) {
        let analysisResult: any = response.data || response.result;
        
        // Si la respuesta tiene una propiedad 'analysis', usarla
        if (analysisResult && typeof analysisResult === 'object' && 'analysis' in analysisResult) {
          analysisResult = analysisResult.analysis;
        }
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          currentAnalysis: analysisResult || null,
          error: null
        }));

        return analysisResult;
      } else {
        throw new Error(response.error || 'Error analizando contenido');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error analizando contenido';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      console.error('❌ Error analyzing content:', error);
      return null;
    }
  }, [context]);

  const optimizeContent = useCallback(async (content: string, title: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await seoAgentService.optimizeContent(content, title);
      
      if (response.success && (response.data || response.result)) {
        const result = response.data || response.result;
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          currentAnalysis: result || null,
          error: null
        }));

        return result || null;
      } else {
        throw new Error(response.error || 'Error optimizando contenido');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error optimizando contenido';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      console.error('❌ Error optimizing content:', error);
      return null;
    }
  }, []);

  const generateStructure = useCallback(async (topic: string, keywords: string[], targetAudience?: string) => {
    return executeTask({
      type: 'generate_structure',
      metadata: {
        topic,
        keywords,
        target_audience: targetAudience
      }
    });
  }, [executeTask]);

  const reviewContent = useCallback(async (
    customContent?: string,
    customTitle?: string,
    customDescription?: string,
    customKeywords?: string[]
  ) => {
    // Usar parámetros personalizados o del contexto
    const content = customContent || context.currentContent;
    const title = customTitle || context.postTitle;
    const description = customDescription || context.currentMeta?.description;
    const keywords = customKeywords || context.currentMeta?.keywords;

    if (!content || !title) {
      setState(prev => ({
        ...prev,
        error: 'Contenido y título son requeridos para la revisión'
      }));
      return null;
    }

    return executeTask({
      type: 'content_review',
      content,
      title,
      description,
      keywords
    });
  }, [executeTask, context]);

  // Limpiar historial de chat
  const clearChatHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      chatHistory: [],
      sessionId: generateSessionId()
    }));
  }, [generateSessionId]);

  // Limpiar análisis actual
  const clearAnalysis = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentAnalysis: null,
      error: null
    }));
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  // Acciones rápidas predefinidas
  const quickActions = {
    analyzeCurrentContent: () => {
      if (context.currentContent && context.postTitle) {
        setActiveMode('analysis');
        return analyzeContent(context.currentContent, context.postTitle);
      }
      return Promise.resolve(null);
    },

    optimizeCurrentContent: () => {
      if (context.currentContent && context.postTitle) {
        setActiveMode('analysis');
        return optimizeContent(context.currentContent, context.postTitle);
      }
      return Promise.resolve(null);
    },

    startStructureGeneration: () => {
      setActiveMode('structure');
    },

    startContentReview: () => {
      setActiveMode('review');
      return reviewContent();
    }
  };

  return {
    // Estado
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    error: state.error,
    activeMode: state.activeMode,
    currentAnalysis: state.currentAnalysis,
    chatHistory: state.chatHistory,
    sessionId: state.sessionId,
    context,

    // Permisos
    canUseAdvancedFeatures: state.canUseAdvancedFeatures,
    canAccessConfiguration: state.canAccessConfiguration,

    // Acciones principales
    openCanvas,
    closeCanvas,
    setActiveMode,
    updateContext,
    checkUserPermissions,

    // Funciones de comunicación
    sendChatMessage,
    executeTask,

    // Funciones específicas
    analyzeContent,
    optimizeContent,
    generateStructure,
    reviewContent,

    // Utilidades
    clearChatHistory,
    clearAnalysis,
    clearError,

    // Acciones rápidas
    quickActions
  };
};

export default useSEOCanvas;