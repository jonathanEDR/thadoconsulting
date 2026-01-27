/**
 * 📊 Services Analysis Panel
 * Panel de análisis de servicios con métricas y visualizaciones
 * Analiza: Calidad, SEO, Completeness, Genera recomendaciones
 * 
 * ⚡ Optimizaciones:
 * - React.memo() para evitar re-renders innecesarios
 * - useCallback para handlers
 */

import React, { useState, memo, useCallback } from 'react';
import { BarChart3, Target, TrendingUp, AlertCircle, CheckCircle, Loader2, Lightbulb, Play, Search, DollarSign, FileText, Image, Zap } from 'lucide-react';
import { useServicesCanvasContext } from '../../../contexts/ServicesCanvasContext';

const ServicesAnalysisPanel: React.FC = memo(() => {
  const { 
    isLoading, 
    currentAnalysis, 
    currentService,
    analyzeService, 
    error,
    clearError 
  } = useServicesCanvasContext();
  
  const [analyzing, setAnalyzing] = useState(false);

  // ============================================
  // HANDLERS (Memoizados con useCallback)
  // ============================================

  const handleAnalyze = useCallback(async () => {
    if (!currentService) return;
    
    setAnalyzing(true);
    clearError();
    await analyzeService(currentService);
    setAnalyzing(false);
  }, [currentService, analyzeService, clearError]);

  // ============================================
  // UTILIDADES
  // ============================================

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // const getScoreBgColor = (score: number) => {
  //   if (score >= 80) return 'bg-green-100';
  //   if (score >= 60) return 'bg-yellow-100';
  //   return 'bg-red-100';
  // };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  // Obtener icono según el tipo de recomendación
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'seo': return <Search className="h-4 w-4" />;
      case 'pricing': return <DollarSign className="h-4 w-4" />;
      case 'contenido': return <FileText className="h-4 w-4" />;
      case 'visual': return <Image className="h-4 w-4" />;
      case 'conversión': return <Zap className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  // Obtener color según el tipo
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'seo': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pricing': return 'bg-green-100 text-green-700 border-green-200';
      case 'contenido': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'visual': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'conversión': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // ============================================
  // RENDER SCORE CIRCLE
  // ============================================

  const renderScoreCircle = (score: number, label: string, size: 'sm' | 'lg' = 'lg') => {
    // const circleSize = size === 'lg' ? 20 : 16;
    const strokeWidth = size === 'lg' ? 3 : 2;
    
    return (
      <div className="flex flex-col items-center">
        <div className={`relative ${size === 'lg' ? 'w-20 h-20' : 'w-16 h-16'}`}>
          <svg 
            className={`${size === 'lg' ? 'w-20 h-20' : 'w-16 h-16'} transform -rotate-90`} 
            viewBox="0 0 36 36"
          >
            {/* Background circle */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
              strokeWidth={strokeWidth}
              strokeDasharray={`${score}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${size === 'lg' ? 'text-lg' : 'text-sm'} font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-600 mt-2 text-center font-medium">{label}</span>
      </div>
    );
  };

  // ============================================
  // RENDER ESTADOS
  // ============================================

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-1">Error en el análisis</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar análisis
          </button>
        </div>
      </div>
    );
  }

  if (!currentService || !currentService.serviceId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <div className="p-4 bg-purple-100 rounded-full mb-4">
          <BarChart3 className="h-12 w-12 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Análisis de Servicio
        </h3>
        <p className="text-center text-sm text-gray-600 max-w-md mb-6">
          Necesitas tener un servicio guardado para poder analizarlo. 
          Primero guarda el servicio y luego vuelve a abrir el asistente.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> El análisis evaluará la calidad del contenido, 
            optimización SEO, completitud de la información y te dará recomendaciones específicas.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading || analyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Analizando servicio...
        </h3>
        <p className="text-sm text-gray-600 text-center max-w-md">
          Evaluando calidad, SEO, completitud y generando recomendaciones personalizadas
        </p>
        <div className="mt-6 w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="max-w-md w-full text-center">
          <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Target className="h-10 w-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Listo para analizar
          </h3>
          <p className="text-gray-600 mb-6">
            Analizaremos: <strong>{currentService.serviceTitle}</strong>
          </p>
          <button
            onClick={handleAnalyze}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Play className="h-5 w-5 mr-2" />
            Iniciar Análisis
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER RESULTADOS
  // ============================================

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Resultados del Análisis</h3>
          </div>
          <button
            onClick={handleAnalyze}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Re-analizar
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Score General + Scores Individuales */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="h-5 w-5 text-purple-600 mr-2" />
            Puntuación General
          </h4>
          
          <div className="flex items-center justify-around flex-wrap gap-4">
            {renderScoreCircle(currentAnalysis.score, 'General', 'lg')}
            
            {currentAnalysis.seoScore !== undefined && (
              renderScoreCircle(currentAnalysis.seoScore, 'SEO', 'sm')
            )}
            
            {currentAnalysis.qualityScore !== undefined && (
              renderScoreCircle(currentAnalysis.qualityScore, 'Calidad', 'sm')
            )}
            
            {currentAnalysis.completenessScore !== undefined && (
              renderScoreCircle(currentAnalysis.completenessScore, 'Completitud', 'sm')
            )}

            {currentAnalysis.conversionScore !== undefined && (
              renderScoreCircle(currentAnalysis.conversionScore, 'Conversión', 'sm')
            )}
          </div>

          {/* Quick Wins y Problemas Críticos */}
          {((currentAnalysis.quickWins?.length ?? 0) > 0 || (currentAnalysis.criticalIssues?.length ?? 0) > 0) && (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {currentAnalysis.quickWins && currentAnalysis.quickWins.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h5 className="text-xs font-semibold text-green-800 mb-2 flex items-center">
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Quick Wins (mejoras rápidas)
                  </h5>
                  <ul className="space-y-1">
                    {currentAnalysis.quickWins.map((item: string, idx: number) => (
                      <li key={idx} className="text-xs text-green-700 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1.5 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {currentAnalysis.criticalIssues && currentAnalysis.criticalIssues.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h5 className="text-xs font-semibold text-red-800 mb-2 flex items-center">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    Problemas Críticos
                  </h5>
                  <ul className="space-y-1">
                    {currentAnalysis.criticalIssues.map((item: string, idx: number) => (
                      <li key={idx} className="text-xs text-red-700 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1.5 text-red-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fortalezas Detalladas */}
        {currentAnalysis.strengths && currentAnalysis.strengths.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Fortalezas ({currentAnalysis.strengths.length})
            </h4>
            <div className="space-y-3">
              {currentAnalysis.strengths.map((strength: any, index: number) => (
                <div key={index} className="border-l-4 border-green-500 bg-green-50 rounded-r-lg p-4">
                  {typeof strength === 'string' ? (
                    <p className="text-sm text-gray-700">{strength}</p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-green-900">{strength.title}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          strength.impact === 'alto' ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-700'
                        }`}>
                          impacto {strength.impact}
                        </span>
                      </div>
                      <p className="text-sm text-green-800">{strength.detail}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded">
                        {strength.category}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debilidades/Áreas de Mejora Detalladas */}
        {currentAnalysis.weaknesses && currentAnalysis.weaknesses.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              Áreas de Mejora ({currentAnalysis.weaknesses.length})
            </h4>
            <div className="space-y-3">
              {currentAnalysis.weaknesses.map((weakness: any, index: number) => (
                <div key={index} className={`border-l-4 rounded-r-lg p-4 ${
                  weakness.severity === 'alta' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-yellow-500 bg-yellow-50'
                }`}>
                  {typeof weakness === 'string' ? (
                    <p className="text-sm text-gray-700">{weakness}</p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold ${weakness.severity === 'alta' ? 'text-red-900' : 'text-yellow-900'}`}>
                          {weakness.title}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          weakness.severity === 'alta' 
                            ? 'bg-red-200 text-red-800' 
                            : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          severidad {weakness.severity}
                        </span>
                      </div>
                      <p className={`text-sm ${weakness.severity === 'alta' ? 'text-red-800' : 'text-yellow-800'}`}>
                        {weakness.detail}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          weakness.severity === 'alta' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {weakness.category}
                        </span>
                        {weakness.affectsScore && (
                          <span className="px-2 py-0.5 bg-red-300 text-red-900 text-xs rounded font-medium">
                            ⚠️ Afecta puntuación
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recomendaciones Detalladas */}
        {currentAnalysis.recommendations && currentAnalysis.recommendations.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Lightbulb className="h-5 w-5 text-purple-600 mr-2" />
                Plan de Acción
              </h4>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                {currentAnalysis.recommendations.length} mejoras identificadas
              </span>
            </div>
            
            <div className="space-y-4">
              {currentAnalysis.recommendations.map((rec: any, index: number) => (
                <div 
                  key={index} 
                  className={`group relative border-l-4 rounded-r-lg p-5 transition-all duration-200 hover:shadow-md ${
                    rec.priority === 'high' 
                      ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                      : rec.priority === 'medium'
                        ? 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                        : 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  {/* Header con Tipo, Título y Prioridad */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${getTypeColor(rec.type)}`}>
                        {getTypeIcon(rec.type)}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900 block">
                          {rec.title || rec.type}
                        </span>
                        <span className="text-xs text-gray-500">Recomendación #{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {rec.difficulty && (
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          rec.difficulty === 'fácil' ? 'bg-green-100 text-green-700' :
                          rec.difficulty === 'media' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {rec.difficulty}
                        </span>
                      )}
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(rec.priority)}`}>
                        Prioridad {getPriorityLabel(rec.priority)}
                      </span>
                    </div>
                  </div>

                  {/* Descripción */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-3 pl-12">
                    {rec.description}
                  </p>

                  {/* Acción sugerida */}
                  {rec.action && (
                    <div className="ml-12 mb-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold text-purple-700">📋 Acción:</span> {rec.action}
                      </p>
                    </div>
                  )}

                  {/* Footer con métricas */}
                  <div className="flex flex-wrap items-center gap-4 pl-12 pt-3 border-t border-gray-200">
                    <div className="flex items-center text-xs text-gray-600">
                      <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                      <span className="font-medium">Impacto:</span>
                      <span className="ml-1 text-green-700 font-semibold">{rec.impact}</span>
                    </div>
                    
                    {rec.estimatedImprovement && (
                      <div className="flex items-center text-xs text-gray-600">
                        <Target className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                        <span className="font-medium">Mejora estimada:</span>
                        <span className="ml-1 text-blue-700 font-semibold">{rec.estimatedImprovement}</span>
                      </div>
                    )}

                    {rec.timeToImplement && (
                      <div className="flex items-center text-xs text-gray-600">
                        <Zap className="h-3.5 w-3.5 mr-1.5 text-orange-600" />
                        <span className="font-medium">Tiempo:</span>
                        <span className="ml-1 text-orange-700 font-semibold">{rec.timeToImplement}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Nota informativa */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-lg">
              <div className="flex items-start">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-purple-900 font-semibold mb-1">
                    💡 Estrategia recomendada
                  </p>
                  <p className="text-xs text-purple-700 leading-relaxed">
                    1. Comienza con las mejoras marcadas como <span className="font-semibold text-red-600">prioridad alta</span> y <span className="font-semibold text-green-600">dificultad fácil</span>.
                    <br />
                    2. Las Quick Wins generan resultados inmediatos con poco esfuerzo.
                    <br />
                    3. Cada mejora incrementará tu puntuación y las conversiones de tu servicio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Agregar displayName para debugging
ServicesAnalysisPanel.displayName = 'ServicesAnalysisPanel';

export default ServicesAnalysisPanel;
