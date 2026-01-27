/**
 * ❓ Componente Q&A Automático
 * Muestra preguntas y respuestas generadas por IA
 */

import React, { useState } from 'react';
import { 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  Bot,
  HelpCircle
} from 'lucide-react';
import type { QAGeneration } from '../../../services/blog/blogAiApi';

interface QAComponentProps {
  qaData: QAGeneration;
  showSchema?: boolean;
}

export const QAComponent: React.FC<QAComponentProps> = ({ 
  qaData, 
  showSchema = false 
}) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set([0]));

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FACTUAL':
        return '📊';
      case 'EXPLANATORY':
        return '💡';
      case 'ANALYTICAL':
        return '🔍';
      case 'PRACTICAL':
        return '⚙️';
      default:
        return '❓';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'FACTUAL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'EXPLANATORY':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'ANALYTICAL':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200';
      case 'PRACTICAL':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-white" />
          <h3 className="text-lg font-semibold text-white">
            Preguntas y Respuestas Generadas por IA
          </h3>
        </div>
        <p className="text-blue-100 text-sm mt-1">
          {qaData.questions.length} preguntas generadas automáticamente
        </p>
      </div>

      <div className="p-6">
        {/* Lista de Q&A */}
        <div className="space-y-4">
          {qaData.questions.map((qa, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
            >
              {/* Pregunta */}
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-4 py-4 text-left bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {qa.question}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(qa.type)}`}>
                          {getTypeIcon(qa.type)} {qa.type}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Relevancia: {Math.round(qa.relevanceScore * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {expandedQuestions.has(index) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Respuesta */}
              {expandedQuestions.has(index) && (
                <div className="px-4 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {qa.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Schema JSON-LD (solo para desarrolladores) */}
        {showSchema && qaData.faqSchema && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Schema JSON-LD (FAQ)
            </h4>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
              <code className="text-gray-800 dark:text-gray-200">
                {JSON.stringify(qaData.faqSchema, null, 2)}
              </code>
            </pre>
          </div>
        )}

        {/* Nota sobre IA */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Generado automáticamente por IA</p>
              <p>
                Estas preguntas y respuestas han sido generadas automáticamente basándose en el 
                contenido del artículo. Pueden ayudarte a comprender mejor los temas tratados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};