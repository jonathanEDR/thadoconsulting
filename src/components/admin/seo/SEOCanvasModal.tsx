/**
 * 🎯 SEO Canvas Modal
 * Modal principal del SEO Canvas para Admin Dashboard
 * 
 * 🔒 ACCESO RESTRINGIDO:
 * - Solo Admin Dashboard
 * - Requiere roles ADMIN o SUPER_ADMIN
 * - Verificación automática de permisos
 */

import React, { useEffect } from 'react';
import { X, MessageSquare, BarChart3, FileText, Eye, Settings, CheckCircle, Sparkles } from 'lucide-react';
import { SEOCanvasProvider, useSEOCanvasContext } from '../../../contexts/SEOCanvasContext';
import { useAuth } from '../../../contexts/AuthContext';
import SEOChatInterface from './SEOChatInterface';
import SEOAnalysisPanel from './SEOAnalysisPanel';
import SEOStructurePanel from './SEOStructurePanel';
import SEOReviewPanel from './SEOReviewPanel';
import SEOResultsPanel from './SEOResultsPanel';
import SEOToolbar from './SEOToolbar';
import SEOHistoryPanel from './SEOHistoryPanel';
import SEOConfigPanel from './SEOConfigPanel';

// Descripciones dinámicas para cada modo
const getModeDescription = (mode: string): string => {
  switch (mode) {
    case 'chat': return 'Asistente conversacional para consultas SEO';
    case 'analysis': return 'Análisis detallado del contenido actual';
    case 'structure': return 'Genera estructuras optimizadas para SEO';
    case 'review': return 'Revisión completa y recomendaciones';
    case 'config': return 'Configuración avanzada del agente';
    default: return 'Asistente SEO inteligente';
  }
};

interface SEOCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'chat' | 'analysis' | 'structure' | 'review' | 'config';
  postContext?: {
    postId?: string;
    title?: string;
    content?: string;
    description?: string;
    keywords?: string[];
  };
}

// Componente interno que usa el contexto
const SEOCanvasModalContent: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'chat' | 'analysis' | 'structure' | 'review' | 'config';
  postContext?: any;
}> = ({ isOpen, onClose, initialMode = 'chat', postContext }) => {
  const { role } = useAuth();
  const {
    // Estado
    isLoading,
    error,
    activeMode,
    canUseAdvancedFeatures,
    canAccessConfiguration,
    
    // Acciones
    openCanvas,
    setActiveMode,
    clearError
  } = useSEOCanvasContext(); // Usar el contexto en lugar del hook directo

  // Efecto para manejar apertura inicial - SOLO una vez cuando se abre
  useEffect(() => {
    if (isOpen) {
      const contextToPass = postContext ? {
        postId: postContext.postId,
        postTitle: postContext.title,
        currentContent: postContext.content,
        currentMeta: {
          description: postContext.description,
          keywords: postContext.keywords
        }
      } : undefined;
      
      // Forzar modo chat si no hay post y se intenta abrir en otro modo
      const modeToOpen = !postContext && (initialMode === 'analysis' || initialMode === 'review') 
        ? 'chat' 
        : initialMode;
      
      openCanvas(modeToOpen, contextToPass);
    }
  }, [isOpen]); // Solo depender de isOpen

  // Efecto para forzar modo chat si se pierde el contexto del post
  useEffect(() => {
    if (isOpen && !postContext && (activeMode === 'analysis' || activeMode === 'review')) {
      setActiveMode('chat');
    }
  }, [postContext, activeMode, isOpen]);

  // Verificar que el usuario tiene permisos de administrador
  const hasAdminAccess = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isSuperAdmin = role === 'SUPER_ADMIN';

  // Si no está abierto, no renderizar nada
  if (!isOpen) return null;

  // Verificación simplificada - Si llegamos aquí desde BlogDashboard, ya se verificaron los permisos
  // Solo verificamos a nivel de UI como backup
  if (!hasAdminAccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Acceso Denegado</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            El SEO Canvas solo está disponible para administradores.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Obtener el ícono del modo activo
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'chat': return MessageSquare;
      case 'analysis': return BarChart3;
      case 'structure': return FileText;
      case 'review': return Eye;
      default: return MessageSquare;
    }
  };

  const ModeIcon = getModeIcon(activeMode);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header Rediseñado con Gradiente */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
          <div className="flex items-center space-x-4">
            {/* Icono con gradiente */}
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <ModeIcon className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            
            {/* Título y descripción */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                SEO Canvas
                <span className="text-xs font-normal px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">
                  IA
                </span>
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getModeDescription(activeMode)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Badges de permisos mejorados */}
            <div className="flex items-center space-x-2">
              {canUseAdvancedFeatures && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-medium border border-green-200 dark:border-green-800">
                  Admin Access
                </span>
              )}
              {canAccessConfiguration && isSuperAdmin && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-800">
                  Super Admin
                </span>
              )}
            </div>
            
            {/* Botón de configuración (solo SUPER_ADMIN) */}
            {canAccessConfiguration && isSuperAdmin && (
              <button
                onClick={() => setActiveMode('config')}
                className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-all duration-200"
                title="Configuración SEO"
              >
                <Settings size={20} />
              </button>
            )}
            
            {/* Botón cerrar mejorado */}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
              title="Cerrar SEO Canvas"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Indicador de contexto del post + Tabs de navegación */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {/* Indicador de post seleccionado (solo si hay contexto) */}
          {postContext && (
            <div className="px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-100 dark:border-green-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Analizando: <strong className="text-green-700 dark:text-green-400">{postContext.title}</strong>
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-xs text-gray-500 hover:text-green-700 dark:text-gray-400 dark:hover:text-green-400 transition-colors font-medium"
                >
                  Cambiar post →
                </button>
              </div>
            </div>
          )}
          
          {/* Tabs de navegación mejoradas */}
          <div className="flex space-x-1 px-4 pt-2">
            {/* Tab Chat - Siempre disponible */}
            <button
              onClick={() => setActiveMode('chat')}
              className={`relative px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 rounded-t-lg ${
                activeMode === 'chat'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <MessageSquare className="inline-block h-4 w-4 mr-2" />
              Chat
            </button>
            
            {/* Tab Análisis - Requiere post */}
            <button
              onClick={() => postContext && setActiveMode('analysis')}
              disabled={!postContext}
              className={`relative group px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 rounded-t-lg ${
                !postContext
                  ? 'border-transparent text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : activeMode === 'analysis'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <BarChart3 className="inline-block h-4 w-4 mr-2" />
              Análisis
              {/* Tooltip elegante para tabs deshabilitadas */}
              {!postContext && (
                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-20">
                  Selecciona un post desde el dashboard
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                </div>
              )}
            </button>
            
            {/* Tab Estructura - Disponible siempre (puede generar sin post) */}
            <button
              onClick={() => setActiveMode('structure')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 rounded-t-lg ${
                activeMode === 'structure'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <FileText className="inline-block h-4 w-4 mr-2" />
              Estructura
            </button>
            
            {/* Tab Revisión - Requiere post */}
            <button
              onClick={() => postContext && setActiveMode('review')}
              disabled={!postContext}
              className={`relative group px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 rounded-t-lg ${
                !postContext
                  ? 'border-transparent text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : activeMode === 'review'
                  ? 'border-green-600 text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Eye className="inline-block h-4 w-4 mr-2" />
              Revisión
              {/* Tooltip elegante para tabs deshabilitadas */}
              {!postContext && (
                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-20">
                  Selecciona un post desde el dashboard
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                </div>
              )}
            </button>

            {/* Tab Configuración - Solo SUPER_ADMIN */}
            {isSuperAdmin && (
              <button
                onClick={() => setActiveMode('config')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 rounded-t-lg ${
                  activeMode === 'config'
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-900/20'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                title="Configuración avanzada (Solo SUPER_ADMIN)"
              >
                <Settings className="inline-block h-4 w-4 mr-2" />
                Configuración
              </button>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <SEOToolbar />

        {/* Contenido principal */}
        <div className="flex-1 flex overflow-hidden bg-gray-50 dark:bg-gray-950">
          {/* Panel izquierdo - Chat/Análisis/Configuración */}
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900">
            {activeMode === 'chat' && <SEOChatInterface />}
            {activeMode === 'analysis' && (
              <SEOAnalysisPanel
                content={postContext?.content || ''}
                title={postContext?.title || ''}
                description={postContext?.description}
                keywords={postContext?.keywords}
              />
            )}
            {activeMode === 'structure' && (
              <SEOStructurePanel
                topic={postContext?.title}
                keywords={postContext?.keywords}
              />
            )}
            {activeMode === 'review' && (
              <SEOReviewPanel
                content={postContext?.content || ''}
                title={postContext?.title || ''}
                description={postContext?.description}
                keywords={postContext?.keywords}
                postId={postContext?.postId}
              />
            )}
            {activeMode === 'config' && <SEOConfigPanel />}
          </div>

          {/* Panel derecho - Resultados */}
          <div className="w-1/2 flex flex-col bg-white dark:bg-gray-900">
            <SEOResultsPanel />
          </div>
        </div>

        {/* Loading Overlay mejorado */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
                <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Procesando...</span>
            </div>
          </div>
        )}

        {/* Error Toast mejorado */}
        {error && (
          <div className="absolute top-4 right-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl shadow-lg max-w-md backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm">{error}</span>
              <button
                onClick={clearError}
                className="ml-3 p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/50 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Panel de historial (flotante) */}
      <SEOHistoryPanel />
    </div>
  );
};

// Componente wrapper que provee el contexto
const SEOCanvasModal: React.FC<SEOCanvasModalProps> = (props) => {
  const initialContext = props.postContext ? {
    postId: props.postContext.postId,
    postTitle: props.postContext.title,
    currentContent: props.postContext.content,
    currentMeta: {
      description: props.postContext.description,
      keywords: props.postContext.keywords
    }
  } : undefined;

  return (
    <SEOCanvasProvider initialContext={initialContext}>
      <SEOCanvasModalContent {...props} />
    </SEOCanvasProvider>
  );
};

export default SEOCanvasModal;