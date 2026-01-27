/**
 * 🤖 AI Analysis Panel Component
 * Panel lateral para análisis de contenido con IA en tiempo real
 * Integra análisis completo, generación de tags y optimización SEO
 */

import { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Tag,
  Zap,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAgentAnalysis } from '../../hooks/ai/useAgentAnalysis';
import { useTagGeneration } from '../../hooks/ai/useTagGeneration';
import { useOptimizationSEO } from '../../hooks/ai/useOptimizationSEO';

interface AIAnalysisPanelProps {
  postId?: string;
  content: string;
  title: string;
  category?: string;
  onTagsGenerated?: (tags: string[]) => void;
  onSEOSuggestions?: (suggestions: any) => void;
  autoAnalyze?: boolean;
}

type TabType = 'analysis' | 'tags' | 'seo';

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  postId,
  content,
  title,
  category,
  onTagsGenerated,
  onSEOSuggestions,
  autoAnalyze = false
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('analysis');
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<number>>(new Set());

  // Hooks de IA
  const {
    analysisData,
    loading: analysisLoading,
    error: analysisError,
    analyzeContent
  } = useAgentAnalysis();

  const {
    generatedTags,
    tagSuggestions,
    loading: tagsLoading,
    error: tagsError,
    generateTags,
    selectSuggestion
  } = useTagGeneration();

  const {
    optimizationResult,
    loading: seoLoading,
    error: seoError,
    optimizeSEO
  } = useOptimizationSEO();

  // Auto-análisis cuando cambia el contenido (con debounce)
  useEffect(() => {
    if (!autoAnalyze || !content || content.length < 100) return;

    const timer = setTimeout(() => {
      handleQuickAnalysis();
    }, 2000); // Esperar 2 segundos después de dejar de escribir

    return () => clearTimeout(timer);
  }, [content, title, autoAnalyze]);

  // Notificar tags generados
  useEffect(() => {
    if (generatedTags.length > 0 && onTagsGenerated) {
      onTagsGenerated(generatedTags);
    }
  }, [generatedTags, onTagsGenerated]);

  // Notificar sugerencias SEO
  useEffect(() => {
    if (optimizationResult && onSEOSuggestions) {
      onSEOSuggestions(optimizationResult);
    }
  }, [optimizationResult, onSEOSuggestions]);

  // Handlers
  const handleQuickAnalysis = async () => {
    if (postId) {
      await analyzeContent({ postId });
    } else if (content && title) {
      await analyzeContent({ content, title, category });
    }
  };

  const handleGenerateTags = async () => {
    if (content && title) {
      await generateTags({ content, title, maxTags: 10 });
    }
  };

  const handleOptimizeSEO = async () => {
    if (postId) {
      await optimizeSEO({ postId });
    }
  };

  const toggleRecommendation = (index: number) => {
    setExpandedRecommendations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleTagSelect = (tag: string) => {
    selectSuggestion(tag);
    if (onTagsGenerated) {
      onTagsGenerated([...generatedTags, tag]);
    }
  };

  // Verificar si hay contenido suficiente
  const hasEnoughContent = content.length >= 100 && title.length >= 5;

  // Renderizar score card
  const renderScoreCard = (label: string, score: number, icon: React.ReactNode, max: number = 10) => {
    const percentage = (score / max) * 100;
    const getColor = () => {
      if (percentage >= 80) return 'text-green-600 bg-green-100';
      if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
      return 'text-red-600 bg-red-100';
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
          <span className="text-gray-500 dark:text-gray-400">{icon}</span>
        </div>
        <div className="text-2xl font-bold mb-2">
          <span className={getColor().split(' ')[0]}>{score}</span>
          <span className="text-gray-400 dark:text-gray-600">/{max}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getColor().split(' ')[1]}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <h3 className="font-bold">Asistente IA</h3>
          </div>
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <p className="text-purple-100 text-sm mt-1">
          Análisis inteligente en tiempo real
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'analysis'
              ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Target className="w-4 h-4" />
            Análisis
          </div>
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'tags'
              ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Tag className="w-4 h-4" />
            Tags
          </div>
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'seo'
              ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            SEO
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        {/* Verificación de contenido */}
        {!hasEnoughContent && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Contenido insuficiente
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Escribe al menos 100 caracteres y un título para obtener análisis de IA
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Análisis */}
        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <button
              onClick={handleQuickAnalysis}
              disabled={!hasEnoughContent || analysisLoading.isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {analysisLoading.isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analizar Contenido
                </>
              )}
            </button>

            {analysisError.hasError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {analysisError.error || 'Error al analizar el contenido'}
                </p>
              </div>
            )}

            {analysisData && (
              <div className="space-y-4">
                {/* Scores */}
                <div className="grid grid-cols-2 gap-3">
                  {renderScoreCard(
                    'General',
                    analysisData.scores.overall,
                    <Target className="w-4 h-4" />
                  )}
                  {renderScoreCard(
                    'SEO',
                    analysisData.scores.seo,
                    <TrendingUp className="w-4 h-4" />
                  )}
                  {renderScoreCard(
                    'Contenido',
                    analysisData.scores.engagement,
                    <Brain className="w-4 h-4" />
                  )}
                  {renderScoreCard(
                    'Lectura',
                    analysisData.scores.readability,
                    <Clock className="w-4 h-4" />
                  )}
                </div>

                {/* Recomendaciones */}
                {analysisData.recommendations && analysisData.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Recomendaciones ({analysisData.recommendations.length})
                    </h4>
                    <div className="space-y-2">
                      {analysisData.recommendations.slice(0, 5).map((rec, index) => (
                        <div
                          key={index}
                          className={`border rounded-lg overflow-hidden transition-all ${
                            rec.type === 'critical'
                              ? 'border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-800'
                              : rec.type === 'important'
                              ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800'
                              : 'border-green-300 bg-green-50 dark:bg-green-900/10 dark:border-green-800'
                          }`}
                        >
                          <button
                            onClick={() => toggleRecommendation(index)}
                            className="w-full p-3 flex items-center justify-between hover:opacity-80 transition-opacity"
                          >
                            <div className="flex items-center gap-3 flex-1 text-left">
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                  rec.type === 'critical'
                                    ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                                    : rec.type === 'important'
                                    ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                                    : 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                                }`}
                              >
                                {rec.type}
                              </span>
                              <span className="font-medium text-sm text-gray-900 dark:text-white">
                                {rec.title}
                              </span>
                            </div>
                            {expandedRecommendations.has(index) ? (
                              <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            )}
                          </button>
                          
                          {expandedRecommendations.has(index) && (
                            <div className="px-3 pb-3 space-y-2 text-sm">
                              <p className="text-gray-700 dark:text-gray-300">
                                {rec.description}
                              </p>
                              {rec.impact && (
                                <p className="text-gray-600 dark:text-gray-400">
                                  <strong>Impacto:</strong> {rec.impact}
                                </p>
                              )}
                              {rec.effort && (
                                <p className="text-gray-600 dark:text-gray-400">
                                  <strong>Esfuerzo:</strong> {rec.effort}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab: Tags */}
        {activeTab === 'tags' && (
          <div className="space-y-4">
            <button
              onClick={handleGenerateTags}
              disabled={!hasEnoughContent || tagsLoading.isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {tagsLoading.isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Tag className="w-4 h-4" />
                  Generar Tags
                </>
              )}
            </button>

            {tagsError.hasError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {tagsError.error || 'Error al generar tags'}
                </p>
              </div>
            )}

            {generatedTags.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Tags Generados ({generatedTags.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {generatedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tagSuggestions.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Sugerencias Adicionales
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tagSuggestions.slice(0, 10).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleTagSelect(suggestion.tag)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition-colors border border-gray-300 dark:border-gray-600"
                    >
                      {suggestion.tag}
                      {suggestion.relevance && (
                        <span className="ml-1 text-xs opacity-60">
                          {Math.round(suggestion.relevance * 100)}%
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-4">
            <button
              onClick={handleOptimizeSEO}
              disabled={!hasEnoughContent || seoLoading.isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {seoLoading.isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Optimizando...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Optimizar SEO
                </>
              )}
            </button>

            {seoError.hasError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {seoError.error || 'Error al optimizar SEO'}
                </p>
              </div>
            )}

            {optimizationResult && (
              <div className="space-y-4">
                {/* Score SEO */}
                {optimizationResult.afterScore && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Score SEO
                      </span>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {optimizationResult.afterScore}/10
                    </div>
                  </div>
                )}

                {/* Sugerencias SEO */}
                {optimizationResult.recommendations && optimizationResult.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Mejoras SEO Recomendadas
                    </h4>
                    <div className="space-y-2">
                      {optimizationResult.recommendations.map((suggestion, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
                        >
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {suggestion.title}
                          </p>
                          {suggestion.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {suggestion.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords */}
                {optimizationResult.keywordAnalysis && (
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-600" />
                      Keywords Detectadas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {optimizationResult.keywordAnalysis.primary.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysisPanel;
