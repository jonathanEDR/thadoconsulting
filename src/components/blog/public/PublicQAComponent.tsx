/**
 * 🎯 Componente de Q&A para Posts Públicos
 * Versión simplificada y discreta para lectores
 */

import React from 'react';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { QAGeneration } from '../../../services/blog/blogAiApi';

interface PublicQAComponentProps {
  qaData: QAGeneration | null;
  loading?: boolean;
}

export const PublicQAComponent: React.FC<PublicQAComponentProps> = ({ qaData, loading }) => {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!qaData || !qaData.questions || qaData.questions.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 sm:p-8 border border-blue-100 dark:border-gray-600">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-600 rounded-lg">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Preguntas Frecuentes
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generadas automáticamente con IA
          </p>
        </div>
      </div>

      {/* Q&A List */}
      <div className="space-y-3">
        {qaData.questions.slice(0, 5).map((qa, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all"
          >
            {/* Question */}
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="font-medium text-gray-900 dark:text-white pr-4">
                {qa.question}
              </span>
              {expandedIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
            </button>

            {/* Answer */}
            {expandedIndex === index && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {qa.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
        💡 Estas preguntas fueron generadas automáticamente usando inteligencia artificial
      </div>
    </div>
  );
};

export default PublicQAComponent;
