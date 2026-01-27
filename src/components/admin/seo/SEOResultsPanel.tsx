/**
 * 📊 SEO Results Panel
 * Panel para mostrar resultados de análisis y optimizaciones SEO
 * Solo disponible para Admin Dashboard
 */

import React from 'react';
import { BarChart3, CheckCircle, Target, Lightbulb, FileText, Sparkles } from 'lucide-react';
import { useSEOCanvasContext } from '../../../contexts/SEOCanvasContext';

const SEOResultsPanel: React.FC = () => {
  const { currentAnalysis, activeMode, isLoading, chatHistory } = useSEOCanvasContext();

  // Renderizar resultados de chat si estamos en modo chat
  if (activeMode === 'chat' && !currentAnalysis) {
    if (chatHistory.length === 0 && !isLoading) {
      return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Resultados SEO
            </h3>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">No hay resultados disponibles</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Inicia una conversación para ver el resumen aquí
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Mostrar resumen del chat
    const assistantMessages = chatHistory.filter(msg => msg.role === 'assistant');
    const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];

    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Resumen de Conversación
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
          {/* Estadísticas de la conversación */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Estadísticas</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="text-gray-600 dark:text-gray-400 mb-1">Mensajes totales</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{chatHistory.length}</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
                <div className="text-gray-600 dark:text-gray-400 mb-1">Respuestas IA</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{assistantMessages.length}</div>
              </div>
            </div>
          </div>

          {/* Última respuesta del asistente */}
          {lastAssistantMessage && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                Última Respuesta
              </h4>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg max-h-64 overflow-y-auto border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {lastAssistantMessage.content}
                </p>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {new Date(lastAssistantMessage.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}

          {/* Acciones sugeridas para chat */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Consejo SEO
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Para obtener análisis estructurados, selecciona un post desde el dashboard y usa los modos Análisis, Estructura o Revisión.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar contenido vacío
  if (!currentAnalysis && !isLoading) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Resultados SEO
          </h3>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No hay resultados disponibles</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {activeMode === 'chat' 
                ? 'Inicia una conversación para ver análisis'
                : 'Ejecuta un análisis para ver los resultados aquí'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar loading
  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Analizando...
          </h3>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950">
          <div className="text-center">
            <div className="relative mx-auto mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
              <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">Procesando análisis SEO...</p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar resultados usando los tipos correctos
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Resultados SEO
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
        {/* Puntuación general */}
        {currentAnalysis?.seo_score !== undefined && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
              Puntuación SEO
            </h4>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      currentAnalysis.seo_score >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      currentAnalysis.seo_score >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-rose-500'
                    }`}
                    style={{ width: `${currentAnalysis.seo_score}%` }}
                  ></div>
                </div>
              </div>
              <span className={`font-bold text-2xl ${
                currentAnalysis.seo_score >= 80 ? 'text-green-600 dark:text-green-400' :
                currentAnalysis.seo_score >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {currentAnalysis.seo_score}/100
              </span>
            </div>
          </div>
        )}

        {/* Palabras clave sugeridas */}
        {currentAnalysis?.suggested_keywords && currentAnalysis.suggested_keywords.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Palabras Clave Sugeridas</h4>
            <div className="flex flex-wrap gap-2">
              {currentAnalysis.suggested_keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-sm border border-blue-200 dark:border-blue-800"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        {currentAnalysis?.recommendations && currentAnalysis.recommendations.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
              Recomendaciones
            </h4>
            
            <div className="space-y-2">
              {currentAnalysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-800 dark:text-gray-200">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Título y descripción optimizados */}
        {(currentAnalysis?.optimized_title || currentAnalysis?.optimized_description) && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
              Metadata Optimizada
            </h4>
            <div className="space-y-3">
              {currentAnalysis.optimized_title && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título optimizado:</label>
                  <p className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                    {currentAnalysis.optimized_title}
                  </p>
                </div>
              )}
              
              {currentAnalysis.optimized_description && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción optimizada:</label>
                  <p className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                    {currentAnalysis.optimized_description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sugerencias de mejora */}
        {currentAnalysis?.improvement_suggestions && currentAnalysis.improvement_suggestions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-400" />
              Sugerencias de Mejora
            </h4>
            <div className="space-y-2">
              {currentAnalysis.improvement_suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400 dark:border-yellow-500">
                  <p className="text-sm text-gray-800 dark:text-gray-200">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estructura del contenido */}
        {currentAnalysis?.content_structure && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Análisis de Estructura</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Encabezados:</span>
                <span className="ml-2 font-bold text-gray-900 dark:text-white">{currentAnalysis.content_structure.headings.length}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Párrafos:</span>
                <span className="ml-2 font-bold text-gray-900 dark:text-white">{currentAnalysis.content_structure.paragraphs}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Palabras:</span>
                <span className="ml-2 font-bold text-gray-900 dark:text-white">{currentAnalysis.content_structure.word_count}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Legibilidad:</span>
                <span className="ml-2 font-bold text-gray-900 dark:text-white">{currentAnalysis.content_structure.readability_score}/100</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOResultsPanel;