import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';

interface AIPreviewModalProps {
  isOpen: boolean;
  originalText: string;
  expandedText: string;
  actionLabel: string;
  onAccept: () => void;
  onCancel: () => void;
}

const AIPreviewModal: React.FC<AIPreviewModalProps> = ({
  isOpen,
  originalText,
  expandedText,
  actionLabel,
  onAccept,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Preview de IA: {actionLabel}
              </h3>
              <p className="text-blue-100 text-sm">
                Revisa el contenido generado y decide si aplicarlo
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          {/* Original Text */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                Texto Original
              </h4>
              <span className="text-xs text-gray-500 ml-auto">
                {originalText.length} caracteres
              </span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                {originalText}
              </p>
            </div>
          </div>

          {/* Expanded Text */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                Texto Mejorado con IA
              </h4>
              <span className="text-xs text-gray-500 ml-auto">
                {expandedText.length} caracteres
              </span>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                {expandedText}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Caracteres agregados:</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                +{expandedText.length - originalText.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Mejora:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {Math.round((expandedText.length / originalText.length - 1) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Cancelar
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
          >
            <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
            📋 Copiar al Portapapeles
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPreviewModal;
