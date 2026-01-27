/**
 * 🎯 Services Canvas Modal
 * Modal principal del Services Canvas para Admin Dashboard
 * 
 * 🔒 ACCESO RESTRINGIDO:
 * - Solo Admin Dashboard
 * - Requiere roles ADMIN o SUPER_ADMIN
 * - Verificación automática de permisos
 * 
 * 🎨 MODOS DISPONIBLES:
 * - chat: Chat interactivo con IA
 * - analysis: Análisis de servicio
 * - pricing: Estrategias de pricing
 * - generation: Generación de contenido
 * - portfolio: Análisis de portafolio
 * 
 * ⚡ OPTIMIZACIONES:
 * - Lazy loading de paneles para reducir bundle inicial
 * - Suspense boundaries con loading states
 * - Memoización de componentes pesados
 */

import React, { useEffect, Suspense, lazy } from 'react';
import { X, MessageSquare, BarChart3, DollarSign, FileText, Briefcase } from 'lucide-react';
import { ServicesCanvasProvider, useServicesCanvasContext } from '../../../contexts/ServicesCanvasContext';
import type { ServiceContext } from '../../../contexts/ServicesCanvasContext';
import { useAuth } from '../../../contexts/AuthContext';
import ServicesCanvasErrorBoundary from './ServicesCanvasErrorBoundary';
import Tooltip from '../../common/Tooltip';

// 🚀 Lazy Loading de Paneles - Solo se cargan cuando se necesitan
const ServicesChatInterface = lazy(() => import('./ServicesChatInterface'));
const ServicesAnalysisPanel = lazy(() => import('./ServicesAnalysisPanel'));
const ServicesPricingPanel = lazy(() => import('./ServicesPricingPanel'));
const ServicesGenerationPanel = lazy(() => import('./ServicesGenerationPanel'));
const ServicesPortfolioPanel = lazy(() => import('./ServicesPortfolioPanel'));

interface ServicesCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'chat' | 'analysis' | 'pricing' | 'generation' | 'portfolio';
  serviceContext?: {
    serviceId?: string;
    serviceTitle: string;
    currentDescription: string;
    currentPrice: number;
    currency: string;
    category: string;
    descriptionCorta?: string;
    caracteristicas?: string;
    beneficios?: string;
    etiquetas?: string[];
  };
  allServices?: ServiceContext[]; // 🆕 Servicios globales para análisis de portafolio
}

// ============================================
// COMPONENTE INTERNO QUE USA EL CONTEXTO
// ============================================

// 💀 Loading Skeleton para Suspense
const PanelLoadingSkeleton: React.FC = () => (
  <div className="h-full p-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
    <div className="space-y-3">
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const ServicesCanvasModalContent: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'chat' | 'analysis' | 'pricing' | 'generation' | 'portfolio';
  serviceContext?: any;
}> = ({ isOpen, onClose, initialMode = 'chat', serviceContext }) => {
  const { role } = useAuth();
  const {
    // Estado
    isLoading,
    error,
    activeMode,
    // canUseAdvancedFeatures, 
    // canAccessConfiguration, 
    
    // Acciones
    openCanvas,
    setActiveMode,
    clearError
  } = useServicesCanvasContext();

  // ============================================
  // EFECTOS
  // ============================================

  // Efecto para manejar apertura inicial
  useEffect(() => {
    if (isOpen) {
      openCanvas(initialMode, serviceContext);
    }
  }, [isOpen]);

  // Efecto para forzar modo chat si se pierde el contexto del servicio
  useEffect(() => {
    if (isOpen && !serviceContext && (activeMode === 'analysis' || activeMode === 'pricing')) {
      setActiveMode('chat');
    }
  }, [serviceContext, activeMode, isOpen]);

  // ⌨️ Efecto para manejar shortcuts de teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeydown = (e: KeyboardEvent) => {
      // Ignorar si hay elementos de input activos
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement?.tagName === 'INPUT' || 
          activeElement?.tagName === 'TEXTAREA' || 
          activeElement?.contentEditable === 'true') {
        return;
      }

      // Shortcuts numéricos (1-5) para cambiar paneles
      if (e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const modes = ['chat', 'analysis', 'pricing', 'generation', 'portfolio'] as const;
        const modeIndex = parseInt(e.key) - 1;
        const targetMode = modes[modeIndex];
        
        // Verificar si el modo requiere contexto de servicio
        if ((targetMode === 'analysis' || targetMode === 'pricing') && !serviceContext) {
          // No cambiar a modos que requieren servicio si no hay contexto
          return;
        }
        
        setActiveMode(targetMode);
        return;
      }

      // Escape para cerrar modal
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Ctrl/Cmd + K para abrir chat rápido
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setActiveMode('chat');
        return;
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isOpen, setActiveMode, onClose, serviceContext]);

  // ============================================
  // VERIFICACIONES DE PERMISOS
  // ============================================

  const hasAdminAccess = role === 'ADMIN' || role === 'SUPER_ADMIN';
  // const isSuperAdmin = role === 'SUPER_ADMIN';

  if (!isOpen) return null;

  if (!hasAdminAccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Acceso Denegado</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            El Services Canvas solo está disponible para administradores.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // UTILIDADES
  // ============================================

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'chat': return MessageSquare;
      case 'analysis': return BarChart3;
      case 'pricing': return DollarSign;
      case 'generation': return FileText;
      case 'portfolio': return Briefcase;
      default: return MessageSquare;
    }
  };

  const getModeTitle = (mode: string) => {
    switch (mode) {
      case 'chat': return 'Chat Interactivo';
      case 'analysis': return 'Análisis de Servicio';
      case 'pricing': return 'Estrategias de Pricing';
      case 'generation': return 'Generación de Contenido';
      case 'portfolio': return '🌍 Análisis de Portafolio Global';
      default: return 'Services Canvas';
    }
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'chat': return 'Asistente conversacional para gestión de servicios';
      case 'analysis': return 'Análisis completo de calidad y optimización';
      case 'pricing': return 'Estrategias y recomendaciones de precio';
      case 'generation': return 'Generación automática de descripciones y contenido';
      case 'portfolio': return '🌍 Análisis global y estratégico de todo tu portafolio';
      default: return 'Herramienta de IA para servicios';
    }
  };

  const ModeIcon = getModeIcon(activeMode);

  // ============================================
  // RENDERIZADO DE MODOS
  // ============================================

  const renderActivePanel = () => {
    // 🚀 Cada panel se carga lazy con Suspense y Error Boundary
    switch (activeMode) {
      case 'chat':
        return (
          <ServicesCanvasErrorBoundary fallbackTitle="Error en Chat">
            <Suspense fallback={<PanelLoadingSkeleton />}>
              <ServicesChatInterface />
            </Suspense>
          </ServicesCanvasErrorBoundary>
        );
      case 'analysis':
        return (
          <ServicesCanvasErrorBoundary fallbackTitle="Error en Análisis">
            <Suspense fallback={<PanelLoadingSkeleton />}>
              <ServicesAnalysisPanel />
            </Suspense>
          </ServicesCanvasErrorBoundary>
        );
      case 'pricing':
        return (
          <ServicesCanvasErrorBoundary fallbackTitle="Error en Pricing">
            <Suspense fallback={<PanelLoadingSkeleton />}>
              <ServicesPricingPanel />
            </Suspense>
          </ServicesCanvasErrorBoundary>
        );
      case 'generation':
        return (
          <ServicesCanvasErrorBoundary fallbackTitle="Error en Generación">
            <Suspense fallback={<PanelLoadingSkeleton />}>
              <ServicesGenerationPanel />
            </Suspense>
          </ServicesCanvasErrorBoundary>
        );
      case 'portfolio':
        return (
          <ServicesCanvasErrorBoundary fallbackTitle="Error en Portafolio">
            <Suspense fallback={<PanelLoadingSkeleton />}>
              <ServicesPortfolioPanel />
            </Suspense>
          </ServicesCanvasErrorBoundary>
        );
      default:
        return null;
    }
  };

  // ============================================
  // RENDERIZADO PRINCIPAL
  // ============================================

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <ModeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {getModeTitle(activeMode)}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getModeDescription(activeMode)}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              clearError();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Toolbar con Modos */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-2 overflow-x-auto">
          <div className="flex items-center space-x-2 min-w-max md:min-w-0">
            <Tooltip 
              content="Chat interactivo con IA para consultas y recomendaciones personalizadas"
              variant="purple"
              position="bottom"
            >
              <button
                onClick={() => setActiveMode('chat')}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeMode === 'chat'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title="Chat Interactivo"
              >
                <MessageSquare size={18} />
                <span className="hidden sm:inline text-sm font-medium">Chat</span>
              </button>
            </Tooltip>

            <Tooltip 
              content="Análisis detallado de calidad, SEO y completitud del servicio"
              variant="purple"
              position="bottom"
            >
              <button
                onClick={() => setActiveMode('analysis')}
                disabled={!serviceContext}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeMode === 'analysis'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                    : !serviceContext
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title="Análisis de Servicio"
              >
                <BarChart3 size={18} />
                <span className="hidden sm:inline text-sm font-medium">Análisis</span>
              </button>
            </Tooltip>

            <Tooltip 
              content="Estrategias de precios basadas en mercado, competencia y valor percibido"
              variant="purple"
              position="bottom"
            >
              <button
                onClick={() => setActiveMode('pricing')}
                disabled={!serviceContext}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeMode === 'pricing'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                    : !serviceContext
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title="Estrategias de Pricing"
              >
                <DollarSign size={18} />
                <span className="hidden sm:inline text-sm font-medium">Pricing</span>
              </button>
            </Tooltip>

            <Tooltip 
              content="Genera contenido optimizado: descripciones, características, beneficios"
              variant="purple"
              position="bottom"
            >
              <button
                onClick={() => setActiveMode('generation')}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeMode === 'generation'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title="Generación de Contenido"
              >
                <FileText size={18} />
                <span className="hidden sm:inline text-sm font-medium">Generar</span>
              </button>
            </Tooltip>

            <Tooltip 
              content="Análisis completo del portafolio: gaps, oportunidades y estrategias"
              variant="purple"
              position="bottom"
            >
              <button
                onClick={() => setActiveMode('portfolio')}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeMode === 'portfolio'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title="Análisis de Portafolio"
              >
                <Briefcase size={18} />
                <span className="hidden sm:inline text-sm font-medium">Portafolio</span>
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 dark:text-red-600 hover:text-red-600 dark:hover:text-red-400 ml-2"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative bg-gray-50 dark:bg-gray-900">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
            </div>
          ) : (
            renderActivePanel()
          )}
          
          {/* Shortcuts Indicator */}
          <div className="absolute bottom-4 right-4 bg-black dark:bg-gray-950 bg-opacity-70 text-white text-xs px-3 py-2 rounded-lg">
            <div className="flex items-center space-x-3">
              <span><kbd className="bg-gray-700 dark:bg-gray-800 px-1.5 py-0.5 rounded">1-5</kbd> Paneles</span>
              <span><kbd className="bg-gray-700 dark:bg-gray-800 px-1.5 py-0.5 rounded">Esc</kbd> Cerrar</span>
              <span><kbd className="bg-gray-700 dark:bg-gray-800 px-1.5 py-0.5 rounded">⌘K</kbd> Chat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL CON PROVIDER
// ============================================

const ServicesCanvasModal: React.FC<ServicesCanvasModalProps> = (props) => {
  return (
    <ServicesCanvasProvider allServices={props.allServices}>
      <ServicesCanvasModalContent {...props} />
    </ServicesCanvasProvider>
  );
};

export default ServicesCanvasModal;
