/**
 * useScutiAI Hook
 * Custom hook para gestionar el estado y lógica de SCUTI AI Chat
 * 
 * Características:
 * - Gestión de sesiones/conversaciones
 * - Envío y recepción de mensajes
 * - Historial de chat
 * - Loading states
 * - Error handling
 */

import { useState, useCallback, useEffect } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useAuth } from '../contexts/AuthContext';
import scutiAIService from '../services/scutiAIService';
import type { 
  ChatSession, 
  ChatMessage, 
  ScutiAIStatus,
  SessionFilters,
  CanvasContent,
  CanvasMode
} from '../types/scutiAI.types';

export const useScutiAI = () => {
  const { userId } = useClerkAuth();
  const { role } = useAuth(); // Obtener rol del usuario

  // ============================================
  // ESTADO
  // ============================================

  // Sesiones
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Mensajes de la sesión activa
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Estado de envío
  const [sending, setSending] = useState(false);

  // Estado del sistema
  const [systemStatus, setSystemStatus] = useState<ScutiAIStatus | null>(null);

  // Errores
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filters, setFilters] = useState<SessionFilters>({});

  // Canvas Editor
  const [canvasVisible, setCanvasVisible] = useState(false);
  const [canvasExpanded, setCanvasExpanded] = useState(false);
  const [canvasMode, setCanvasMode] = useState<CanvasMode>('empty');
  const [canvasContent, setCanvasContent] = useState<CanvasContent | null>(null);

  // Blog creation context
  const [blogCreationSessionId, setBlogCreationSessionId] = useState<string | null>(null);
  const [conversationMode, setConversationMode] = useState<string | null>(null);

  // 🆕 Blog context - Para mantener el blog seleccionado activo
  const [activeBlogContext, setActiveBlogContext] = useState<{
    id: string;
    title: string;
    slug?: string;
  } | null>(null);

  // 🆕 Cache para evitar múltiples llamadas
  const [lastSessionsLoad, setLastSessionsLoad] = useState<number>(0);
  const [lastStatusLoad, setLastStatusLoad] = useState<number>(0);
  const CACHE_TTL = 30000; // 30 segundos

  // ============================================
  // CARGAR SESIONES (con debounce y caché)
  // ============================================

  const loadSessions = useCallback(async () => {
    if (!userId) {
      console.warn('⚠️ No userId available');
      return;
    }

    // 🆕 Evitar llamadas duplicadas con caché
    const now = Date.now();
    if (now - lastSessionsLoad < CACHE_TTL) {
      console.log('💾 Usando sesiones cacheadas');
      return;
    }

    setLoadingSessions(true);
    setError(null);

    try {
      const result = await scutiAIService.getUserSessions(userId, 50);

      if (result.success && result.data) {
        setSessions(result.data.sessions);
        setLastSessionsLoad(now);
        // console.log('✅ Sesiones cargadas:', result.data.sessions.length);
      } else {
        throw new Error(result.error || 'Error cargando sesiones');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('❌ Error cargando sesiones:', err);
    } finally {
      setLoadingSessions(false);
    }
  }, [userId, lastSessionsLoad]);

  // Cargar sesiones al montar (solo una vez por TTL)
  useEffect(() => {
    if (userId) {
      loadSessions();
    }
  }, [userId]); // 🆕 Eliminado loadSessions de dependencias para evitar loops

  // ============================================
  // CARGAR SESIÓN ESPECÍFICA
  // ============================================

  const loadSession = useCallback(async (sessionId: string) => {
    setLoadingMessages(true);
    setError(null);

    try {
      const result = await scutiAIService.getSession(sessionId);

      if (result.success && result.data) {
        setActiveSession(result.data);
        setMessages(result.data.messages);
        console.log('✅ Sesión cargada:', sessionId);
      } else {
        throw new Error(result.error || 'Error cargando sesión');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('❌ Error cargando sesión:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // ============================================
  // SELECCIONAR SESIÓN ACTIVA
  // ============================================

  const selectSession = useCallback(async (session: ChatSession) => {
    // Si la sesión ya tiene mensajes, usarla directamente
    if (session.messages && session.messages.length > 0) {
      setActiveSession(session);
      setMessages(session.messages);
      setError(null);
      console.log('✅ Sesión seleccionada (con mensajes en cache):', session.sessionId);
    } else {
      // Si no tiene mensajes, cargarlos del backend
      console.log('🔄 Cargando mensajes de la sesión:', session.sessionId);
      await loadSession(session.sessionId);
    }
  }, [loadSession]);

  // ============================================
  // CREAR NUEVA SESIÓN
  // ============================================

  const createNewSession = useCallback(() => {
    // Crear sesión vacía temporal
    const newSession: ChatSession = {
      sessionId: `temp-${Date.now()}`,
      userId: userId || '',
      title: 'Nueva conversación',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    setActiveSession(newSession);
    setMessages([]);
    setError(null);
    console.log('✅ Nueva sesión creada (temporal)');
  }, [userId]);

  // ============================================
  // CANVAS EDITOR (Definir antes de sendMessage para usarlo allí)
  // ============================================

  const showCanvas = useCallback((content: CanvasContent, mode: CanvasMode = 'preview') => {
    setCanvasContent(content);
    setCanvasMode(mode);
    setCanvasVisible(true);
  }, []);

  const hideCanvas = useCallback(() => {
    setCanvasVisible(false);
    setCanvasMode('empty');
    // Limpiar contexto de blog creation
    setBlogCreationSessionId(null);
    setConversationMode(null);
  }, []);

  const toggleCanvasExpand = useCallback(() => {
    setCanvasExpanded(prev => !prev);
  }, []);

  const updateCanvasContent = useCallback((content: CanvasContent) => {
    setCanvasContent(content);
  }, []);

  // ============================================
  // ENVIAR MENSAJE
  // ============================================

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) {
      console.warn('⚠️ Mensaje vacío');
      return;
    }

    if (!userId) {
      setError('Usuario no autenticado');
      return;
    }

    setSending(true);
    setError(null);

    // 🆕 Detectar si el usuario quiere cambiar de blog o limpiar contexto
    const messageLower = messageText.toLowerCase();
    if (messageLower.includes('cambiar blog') || 
        messageLower.includes('otro blog') || 
        messageLower.includes('salir del blog') ||
        messageLower.includes('volver a blogs')) {
      setActiveBlogContext(null);
      console.log('🔄 Contexto de blog limpiado');
    }

    // Mensaje del usuario (optimistic update)
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Construir contexto adicional para conversación de blog
      const additionalContext: Record<string, any> = {
        // 🔧 Siempre incluir rol y panel
        userRole: role || 'USER',
        isAdminPanel: true // Scuti-AI siempre se usa desde panel admin
      };
      
      // 🆕 Incluir contexto del blog activo si existe
      if (activeBlogContext) {
        additionalContext.activeBlogId = activeBlogContext.id;
        additionalContext.activeBlogTitle = activeBlogContext.title;
        additionalContext.activeBlogSlug = activeBlogContext.slug;
        console.log('📝 Enviando contexto de blog activo:', activeBlogContext);
      }
      
      if (blogCreationSessionId && conversationMode) {
        additionalContext.blogCreationSessionId = blogCreationSessionId;
        additionalContext.conversationMode = conversationMode;
        console.log('📝 Enviando contexto de creación de blog:', {
          blogCreationSessionId,
          conversationMode
        });
      }

      // Enviar al backend
      const result = await scutiAIService.sendMessage(
        messageText,
        activeSession?.sessionId?.startsWith('temp-') ? undefined : activeSession?.sessionId,
        userId,
        additionalContext // Siempre enviar contexto con rol
      );

      if (result.success && result.data) {
        // Mensaje del asistente
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.data.response || 'Sin respuesta',
          timestamp: new Date(),
          agentUsed: result.data.agent,
          metadata: {
            agent: result.data.agent,
            routingDecision: result.data.routingDecision,
            agentsInvolved: result.data.agentsInvolved,
            responseTime: result.data.metadata?.responseTime,
            coordinationType: result.data.routingDecision?.coordinationType
          }
        };

        setMessages(prev => [...prev, assistantMessage]);

        // 🎨 Si hay canvas_data (snake_case o camelCase), abrir el canvas automáticamente
        const canvasDataRaw = result.data.canvasData || result.data.canvas_data;
        
        if (canvasDataRaw) {
          
          const canvasContent: CanvasContent = {
            type: canvasDataRaw.type || 'preview',
            title: canvasDataRaw.title,
            data: canvasDataRaw.data,
            metadata: {
              agentUsed: result.data.agent,
              timestamp: new Date(),
              action: canvasDataRaw.metadata?.action,
              itemCount: canvasDataRaw.data?.items?.length,
              blogId: canvasDataRaw.metadata?.blogId,
              serviceId: canvasDataRaw.metadata?.serviceId,
              sessionId: canvasDataRaw.data?.sessionId
            }
          };
          
          const mode = canvasDataRaw.mode || 
                      (canvasDataRaw.type === 'list' ? 'list' : 'preview');
          
          // Si es una conversación de creación de blog, establecer el contexto
          if (canvasDataRaw.type === 'blog_creation') {
            const blogSessionId = canvasDataRaw.data?.sessionId || 
                                 canvasDataRaw.metadata?.sessionId;
            
            setBlogCreationSessionId(blogSessionId);
            setConversationMode('blog_creation');
          }
          
          // 🆕 Si es un blog individual (vista de blog), guardar contexto activo
          if (canvasDataRaw.type === 'blog' || canvasDataRaw.type === 'blog_preview') {
            const blogData = canvasDataRaw.data;
            if (blogData) {
              setActiveBlogContext({
                id: blogData.id || canvasDataRaw.metadata?.blogId,
                title: blogData.title || canvasContent.title,
                slug: blogData.slug
              });
              console.log('📝 Blog activo establecido:', blogData.title);
            }
          }
          
          // 🆕 Si es análisis SEO de un blog, mantener/actualizar contexto
          if (canvasDataRaw.type === 'seo_analysis' && canvasDataRaw.metadata?.blogId) {
            const blogTitle = canvasDataRaw.data?.title || canvasDataRaw.title;
            setActiveBlogContext(prev => ({
              id: canvasDataRaw.metadata.blogId,
              title: blogTitle || prev?.title || 'Blog',
              slug: canvasDataRaw.data?.slug || prev?.slug
            }));
          }
          
          showCanvas(canvasContent, mode);
        }

        // Actualizar sessionId si era temporal
        if (result.data.sessionId && activeSession?.sessionId?.startsWith('temp-')) {
          const updatedSession: ChatSession = {
            ...activeSession,
            sessionId: result.data.sessionId,
            updatedAt: new Date(),
            lastActivity: new Date()
          };
          setActiveSession(updatedSession);

          // Agregar a la lista de sesiones
          setSessions(prev => [updatedSession, ...prev]);
        }

        // Actualizar última actividad de la sesión existente
        if (activeSession && !activeSession.sessionId.startsWith('temp-')) {
          setMessages(prev => [...prev]); // Forzar actualización
          
          const updatedSession: ChatSession = {
            ...activeSession,
            updatedAt: new Date(),
            lastActivity: new Date(),
            messages: [...messages, userMessage, assistantMessage]
          };
          setActiveSession(updatedSession);

          // Actualizar en la lista de sesiones
          setSessions(prev =>
            prev.map(s => (s.sessionId === updatedSession.sessionId ? updatedSession : s))
          );
          
          console.log('🔄 Sesión actualizada:', updatedSession.sessionId);
        }

        console.log('✅ Mensaje enviado y respuesta recibida');
      } else {
        throw new Error(result.error || 'Error enviando mensaje');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('❌ Error enviando mensaje:', err);

      // Remover mensaje del usuario en caso de error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setSending(false);
    }
  }, [userId, activeSession, messages, showCanvas]);

  // ============================================
  // COMPLETAR/FINALIZAR SESIÓN
  // ============================================

  const completeSession = useCallback(async (sessionId: string) => {
    try {
      const result = await scutiAIService.completeSession(sessionId);

      if (result.success) {
        // Actualizar estado local
        setSessions(prev =>
          prev.map(s =>
            s.sessionId === sessionId ? { ...s, isActive: false } : s
          )
        );

        if (activeSession?.sessionId === sessionId) {
          setActiveSession(prev => prev ? { ...prev, isActive: false } : null);
        }

        console.log('✅ Sesión completada:', sessionId);
      } else {
        throw new Error(result.error || 'Error completando sesión');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('❌ Error completando sesión:', err);
    }
  }, [activeSession]);

  // ============================================
  // CARGAR ESTADO DEL SISTEMA (con caché)
  // ============================================

  const loadSystemStatus = useCallback(async () => {
    // 🆕 Evitar llamadas duplicadas con caché
    const now = Date.now();
    if (now - lastStatusLoad < CACHE_TTL) {
      console.log('💾 Usando estado del sistema cacheado');
      return;
    }

    try {
      const result = await scutiAIService.getStatus();

      if (result.success && result.data) {
        setSystemStatus(result.data);
        setLastStatusLoad(now);
      }
    } catch (err) {
      console.error('❌ Error cargando estado del sistema:', err);
    }
  }, [lastStatusLoad]);

  // ============================================
  // LIMPIAR ERROR
  // ============================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // APLICAR FILTROS
  // ============================================

  const applyFilters = useCallback((newFilters: SessionFilters) => {
    setFilters(newFilters);
  }, []);

  // Sesiones filtradas
  const filteredSessions = sessions.filter(session => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = session.title?.toLowerCase().includes(searchLower);
      const messageMatch = session.messages.some(m =>
        m.content.toLowerCase().includes(searchLower)
      );
      if (!titleMatch && !messageMatch) return false;
    }

    if (filters.pinned !== undefined && session.pinned !== filters.pinned) {
      return false;
    }

    if (filters.agentUsed) {
      const hasAgent = session.messages.some(m => m.agentUsed === filters.agentUsed);
      if (!hasAgent) return false;
    }

    return true;
  });

  // ============================================
  // RETURN
  // ============================================

  return {
    // Estado
    sessions: filteredSessions,
    activeSession,
    messages,
    systemStatus,
    error,
    filters,

    // Canvas
    canvasVisible,
    canvasExpanded,
    canvasMode,
    canvasContent,

    // Loading states
    loadingSessions,
    loadingMessages,
    sending,

    // Acciones
    loadSessions,
    loadSession,
    selectSession,
    createNewSession,
    sendMessage,
    completeSession,
    loadSystemStatus,
    clearError,
    applyFilters,

    // Canvas actions
    showCanvas,
    hideCanvas,
    toggleCanvasExpand,
    updateCanvasContent,
    
    // 🆕 Blog context
    activeBlogContext,
    setActiveBlogContext,
    clearBlogContext: () => setActiveBlogContext(null)
  };
};

export default useScutiAI;
