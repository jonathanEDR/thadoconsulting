/**
 * 📋 ModerationQueue Component
 * Lista de comentarios para moderar
 */

import { RefreshCw } from 'lucide-react';
import type { BlogComment, ModerationAction } from '../../../types/blog';
import ModerationCard from './ModerationCard';

interface ModerationQueueProps {
  comments: BlogComment[];
  loading: boolean;
  error: string | null;
  selectedComments: Set<string>;
  onSelectComment: (commentId: string) => void;
  onSelectAll: () => void;
  onModerate: (commentId: string, action: ModerationAction, reason?: string) => Promise<void>;
  onRefetch: () => void;
}

export default function ModerationQueue({
  comments,
  loading,
  error,
  selectedComments,
  onSelectComment,
  onSelectAll,
  onModerate,
  onRefetch
}: ModerationQueueProps) {

  // Asegurar que comments sea siempre un array
  const safeComments = comments || [];

  if (loading && safeComments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando comentarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-700 dark:text-red-400 font-semibold mb-2">Error al cargar comentarios</p>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">{error}</p>
          <button
            onClick={onRefetch}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (safeComments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No hay comentarios pendientes
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          ¡Excelente trabajo! Todos los comentarios están moderados.
        </p>
        <button
          onClick={onRefetch}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header con checkbox select all */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <input
          type="checkbox"
          checked={selectedComments.size === safeComments.length && safeComments.length > 0}
          onChange={onSelectAll}
          className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {selectedComments.size > 0 
            ? `${selectedComments.size} seleccionado(s)` 
            : 'Seleccionar todos'}
        </span>
        <button
          onClick={onRefetch}
          className="ml-auto p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Actualizar"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Lista de comentarios */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {safeComments.map((comment) => (
          <ModerationCard
            key={comment._id}
            comment={comment}
            selected={selectedComments.has(comment._id)}
            onSelect={() => onSelectComment(comment._id)}
            onModerate={onModerate}
          />
        ))}
      </div>
    </div>
  );
}
