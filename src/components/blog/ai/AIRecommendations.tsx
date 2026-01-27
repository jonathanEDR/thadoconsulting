/**
 * 🚀 Componente de Recomendaciones Inteligentes
 * Muestra contenido relacionado basado en IA
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ExternalLink, 
  TrendingUp,
  Target
} from 'lucide-react';

interface Recommendation {
  title: string;
  slug: string;
  relevanceScore: number;
  reason: string;
  type: 'INTERNAL' | 'EXTERNAL';
  url?: string;
}

interface AIRecommendationsProps {
  recommendations: Recommendation[];
  loading?: boolean;
  title?: string;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ 
  recommendations, 
  loading = false,
  title = "Contenido Relacionado Inteligente"
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations.length) {
    return null;
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-white" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-purple-100 text-sm mt-1">
          Sugerencias basadas en análisis inteligente del contenido
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="group border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Título y enlace */}
                  <div className="flex items-start gap-2 mb-2">
                    {rec.type === 'INTERNAL' ? (
                      <Link
                        to={`/blog/${rec.slug}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400"
                      >
                        {rec.title}
                      </Link>
                    ) : (
                      <a
                        href={rec.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400 flex items-center gap-1"
                      >
                        {rec.title}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Razón de la recomendación */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {rec.reason}
                  </p>

                  {/* Metadatos */}
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(rec.relevanceScore)}`}>
                      <Target className="w-3 h-3 inline mr-1" />
                      {Math.round(rec.relevanceScore * 100)}% relevante
                    </span>
                    
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                      {rec.type === 'INTERNAL' ? '📝 Nuestro blog' : '🌐 Externo'}
                    </span>
                  </div>
                </div>

                {/* Indicador de relevancia */}
                <div className="ml-4 flex items-center">
                  <div className="flex flex-col items-center">
                    <TrendingUp 
                      className={`w-5 h-5 ${
                        rec.relevanceScore >= 0.8 ? 'text-green-500' :
                        rec.relevanceScore >= 0.6 ? 'text-yellow-500' :
                        'text-red-500'
                      }`} 
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {Math.round(rec.relevanceScore * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nota sobre las recomendaciones */}
        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
            <div className="text-sm text-purple-800 dark:text-purple-200">
              <p className="font-medium mb-1">Recomendaciones Inteligentes</p>
              <p>
                Estas sugerencias han sido generadas automáticamente mediante análisis semántico 
                del contenido, considerando temas, entidades y contexto del artículo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};