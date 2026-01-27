/**
 * 🎯 AI Quick Action Button
 * Botón flotante para acciones rápidas de IA
 * Se puede posicionar en cualquier parte del editor
 */

import { useState } from 'react';
import { Brain, Sparkles, Tag, TrendingUp, X, Loader2 } from 'lucide-react';
import { useAgentAnalysis } from '../../hooks/ai/useAgentAnalysis';
import { useTagGeneration } from '../../hooks/ai/useTagGeneration';
import { useOptimizationSEO } from '../../hooks/ai/useOptimizationSEO';

interface AIQuickActionButtonProps {
  postId?: string;
  content: string;
  title: string;
  category?: string;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  onActionComplete?: (action: string, result: any) => void;
}

type ActionType = 'analyze' | 'tags' | 'seo' | null;

export const AIQuickActionButton: React.FC<AIQuickActionButtonProps> = ({
  postId,
  content,
  title,
  category,
  position = 'bottom-right',
  onActionComplete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionType>(null);

  const { analyzeContent, loading: analysisLoading } = useAgentAnalysis();
  const { generateTags, loading: tagsLoading } = useTagGeneration();
  const { optimizeSEO, loading: seoLoading } = useOptimizationSEO();

  const isLoading = 
    analysisLoading.isLoading || 
    tagsLoading.isLoading || 
    seoLoading.isLoading;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-left': 'bottom-4 left-4'
  };

  const handleAction = async (action: ActionType) => {
    if (!action || isLoading) return;

    setActiveAction(action);

    try {
      let result;
      
      switch (action) {
        case 'analyze':
          if (postId) {
            result = await analyzeContent({ postId });
          } else {
            result = await analyzeContent({ content, title, category });
          }
          break;
          
        case 'tags':
          result = await generateTags({ content, title, category, maxTags: 10 });
          break;
          
        case 'seo':
          if (postId) {
            result = await optimizeSEO({ postId });
          } else {
            // Para optimización SEO sin postId, usamos análisis básico
            result = await analyzeContent({ content, title, category, config: { analysisType: 'seo_focus' } });
          }
          break;
      }

      if (result && onActionComplete) {
        onActionComplete(action, result);
      }
    } catch (error) {
      console.error(`Error en acción ${action}:`, error);
    } finally {
      setActiveAction(null);
      setIsOpen(false);
    }
  };

  const actions = [
    {
      id: 'analyze' as ActionType,
      icon: Brain,
      label: 'Analizar',
      color: 'bg-purple-600 hover:bg-purple-700',
      loading: analysisLoading.isLoading
    },
    {
      id: 'tags' as ActionType,
      icon: Tag,
      label: 'Tags',
      color: 'bg-blue-600 hover:bg-blue-700',
      loading: tagsLoading.isLoading
    },
    {
      id: 'seo' as ActionType,
      icon: TrendingUp,
      label: 'SEO',
      color: 'bg-green-600 hover:bg-green-700',
      loading: seoLoading.isLoading
    }
  ];

  const hasContent = content.length >= 100 && title.length >= 5;

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Menú expandido */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-2 min-w-[200px] animate-in slide-in-from-bottom-2">
          <div className="mb-2 px-2 py-1 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Acciones IA
            </p>
          </div>
          
          {!hasContent ? (
            <div className="px-2 py-3 text-xs text-gray-500 dark:text-gray-400">
              Escribe al menos 100 caracteres para usar IA
            </div>
          ) : (
            <div className="space-y-1">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action.id)}
                    disabled={isLoading}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white transition-all ${
                      action.loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : action.color
                    } ${isLoading && !action.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {action.loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`group relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
        } ${isLoading ? 'animate-pulse' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <Brain className="w-6 h-6 text-white" />
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
          </div>
        )}

        {/* Tooltip */}
        {!isOpen && !isLoading && (
          <div className="absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Asistente IA
            <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </button>

      {/* Indicador de estado */}
      {activeAction && (
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default AIQuickActionButton;
