/**
 * 📊 SEO Analysis Panel
 * Panel de análisis SEO en tiempo real con métricas y visualizaciones
 */

import React, { useState, useEffect } from 'react';
import { BarChart3, Target, Search, TrendingUp, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useSEOCanvasContext } from '../../../contexts/SEOCanvasContext';

interface SEOAnalysisPanelProps {
  content?: string;
  title?: string;
  description?: string;
  keywords?: string[];
}

const SEOAnalysisPanel: React.FC<SEOAnalysisPanelProps> = ({
  content,
  title,
  description,
  keywords
}) => {
  const { 
    isLoading, 
    currentAnalysis, 
    analyzeContent, 
    error,
    clearError 
  } = useSEOCanvasContext();
  
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [autoAnalyze, setAutoAnalyze] = useState(false); // Desactivado por defecto

  // Auto-análisis cuando hay contenido disponible (solo si está activado)
  useEffect(() => {
    if (autoAnalyze && content && title && !isLoading) {
      const timer = setTimeout(() => {
        handleAnalyze();
      }, 1000); // Debounce de 1 segundo

      return () => clearTimeout(timer);
    }
  }, [content, title, description, keywords, autoAnalyze]);

  // Actualizar datos de análisis cuando currentAnalysis cambie
  useEffect(() => {
    if (currentAnalysis) {
      setAnalysisData(currentAnalysis);
    }
  }, [currentAnalysis]);

  const handleAnalyze = async () => {
    if (!content || !title) {
      return;
    }

    clearError();
    const result = await analyzeContent(content, title, description, keywords);
    if (result) {
      setAnalysisData(result);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const renderScoreCircle = (score: number, label: string) => {
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
              className="dark:stroke-gray-600"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
              strokeWidth="2"
              strokeDasharray={`${score}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">{label}</span>
      </div>
    );
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
          <span className="text-red-800 dark:text-red-300">{error}</span>
        </div>
        <button
          onClick={handleAnalyze}
          className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
        >
          Reintentar análisis
        </button>
      </div>
    );
  }

  if (!content || !title) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <BarChart3 className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Análisis SEO</h3>
        <p className="text-center text-sm">
          Proporciona contenido y título para obtener un análisis SEO detallado en tiempo real.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Analizando contenido...</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Evaluando SEO, keywords y estructura del contenido
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header con controles */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Análisis SEO
          </h3>
          <div className="flex items-center space-x-2">
            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={autoAnalyze}
                onChange={(e) => setAutoAnalyze(e.target.checked)}
                className="mr-1 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              Auto-análisis
            </label>
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Analizar ahora
            </button>
          </div>
        </div>
      </div>

      {/* Contenido del análisis */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-gray-900">
        {analysisData ? (
          <>
            {/* Puntuación general */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Puntuación SEO General</h4>
              <div className="flex items-center justify-center">
                {renderScoreCircle(analysisData.seo_score || 0, 'Puntuación General')}
              </div>
            </div>

            {/* Puntuaciones por categoría */}
            {analysisData.category_scores && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Puntuaciones por Categoría</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(analysisData.category_scores).map(([category, score]: [string, any]) => (
                    <div key={category} className="text-center">
                      {renderScoreCircle(score, category.replace('_', ' ').toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Análisis de keywords */}
            {analysisData.keyword_analysis && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Análisis de Keywords</h4>
                <div className="space-y-3">
                  {analysisData.keyword_analysis.primary_keywords && (
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Keywords principales:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysisData.keyword_analysis.primary_keywords.map((keyword: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-lg">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysisData.keyword_analysis.keyword_density && (
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Densidad: </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{analysisData.keyword_analysis.keyword_density}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Keywords sugeridas */}
            {analysisData.suggested_keywords && analysisData.suggested_keywords.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Keywords Sugeridas</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisData.suggested_keywords.map((keyword: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-lg">
                      <Search className="inline h-3 w-3 mr-1" />
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendaciones */}
            {analysisData.recommendations && analysisData.recommendations.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recomendaciones</h4>
                <div className="space-y-2">
                  {analysisData.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Análisis de meta tags */}
            {analysisData.meta_analysis && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Meta Tags</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Título:</span>
                    <div className="flex items-center">
                      <span className="text-sm mr-2 text-gray-900 dark:text-gray-200">{analysisData.meta_analysis.title_score || 0}/100</span>
                      {(analysisData.meta_analysis.title_score || 0) >= 80 ? (
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Descripción:</span>
                    <div className="flex items-center">
                      <span className="text-sm mr-2 text-gray-900 dark:text-gray-200">{analysisData.meta_analysis.description_score || 0}/100</span>
                      {(analysisData.meta_analysis.description_score || 0) >= 80 ? (
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Legibilidad */}
            {analysisData.readability && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Legibilidad</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Puntuación:</span>
                  <div className="flex items-center">
                    <span className={`text-sm mr-2 ${getScoreColor(analysisData.readability.score || 0)}`}>
                      {analysisData.readability.score || 0}/100
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({analysisData.readability.level || 'N/A'})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Texto de análisis adicional */}
            {analysisData.analysis_text && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Análisis Detallado</h4>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{analysisData.analysis_text}</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <Target className="h-8 w-8 mb-2" />
            <p className="text-sm">Haz clic en "Analizar ahora" para obtener insights SEO</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOAnalysisPanel;