/**
 * 🤖 Componente AIMetadata
 * Muestra metadata generada por IA en el post
 */

import React from 'react';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import type { AIMetadata } from '../../../services/blog/blogAiApi';

interface AIMetadataProps {
  metadata: AIMetadata;
  compact?: boolean;
}

export const AIMetadataComponent: React.FC<AIMetadataProps> = ({ 
  metadata, 
  compact = false 
}) => {
  if (compact) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Análisis IA</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {metadata.contentScore}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Puntuación</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metadata.readability?.score || 'N/A'}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Legibilidad</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {metadata.contentStructure?.readingTimeMinutes || 'N/A'}m
            </div>
            <div className="text-gray-600 dark:text-gray-400">Lectura</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              metadata.sentiment?.label === 'POSITIVE' ? 'text-green-600 dark:text-green-400' :
              metadata.sentiment?.label === 'NEGATIVE' ? 'text-red-600 dark:text-red-400' :
              'text-yellow-600 dark:text-yellow-400'
            }`}>
              {metadata.sentiment?.label === 'POSITIVE' ? '😊' :
               metadata.sentiment?.label === 'NEGATIVE' ? '😞' : '😐'}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Sentimiento</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-white" />
          <h3 className="text-lg font-semibold text-white">Análisis Inteligente del Contenido</h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Resumen y Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
            <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {metadata.contentScore}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Puntuación General</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <Target className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metadata.readability?.score || 'N/A'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Legibilidad</div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <Clock className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {metadata.contentStructure?.readingTimeMinutes || 'N/A'}m
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tiempo de Lectura</div>
          </div>
        </div>

        {/* Resumen IA */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Resumen Inteligente
          </h4>
          <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            {metadata.summary}
          </p>
        </div>

        {/* Temas Principales */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Temas Principales
          </h4>
          <div className="flex flex-wrap gap-2">
            {metadata.keyTopics?.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Entidades Detectadas */}
        {metadata.entities?.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Entidades Detectadas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {metadata.entities?.slice(0, 6).map((entity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
                >
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {entity.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {entity.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(entity.salience * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Análisis de Sentimientos */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Análisis de Sentimientos
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${
                  metadata.sentiment?.label === 'POSITIVE' ? 'text-green-600' :
                  metadata.sentiment?.label === 'NEGATIVE' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {metadata.sentiment?.label === 'POSITIVE' ? '😊' :
                   metadata.sentiment?.label === 'NEGATIVE' ? '😞' : '😐'}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {metadata.sentiment?.label || 'Neutro'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Puntuación: {metadata.sentiment?.score?.toFixed(2) || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Palabras Clave Sugeridas */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Palabras Clave Sugeridas
          </h4>
          <div className="flex flex-wrap gap-2">
            {metadata.suggestedKeywords?.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};