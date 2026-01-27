/**
 * 💬 ModerationCard Component
 * Tarjeta individual de comentario para moderar
 */

import { useState } from 'react';
import { Check, X, Ban, User, Calendar, FileText, AlertTriangle, EyeOff } from 'lucide-react';
import type { BlogComment, ModerationAction } from '../../../types/blog';

interface ModerationCardProps {
  comment: BlogComment;
  selected: boolean;
  onSelect: () => void;
  onModerate: (commentId: string, action: ModerationAction, reason?: string) => Promise<void>;
}

export default function ModerationCard({ comment, selected, onSelect, onModerate }: ModerationCardProps) {
  const [moderating, setModerating] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleModerate = async (action: ModerationAction) => {
    if (action === 'reject' && !showRejectReason) {
      setShowRejectReason(true);
      return;
    }

    try {
      setModerating(true);
      await onModerate(comment._id, action, action === 'reject' ? rejectReason : undefined);
      setShowRejectReason(false);
      setRejectReason('');
    } catch (error) {
      console.error('Error al moderar:', error);
    } finally {
      setModerating(false);
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      pending: { label: 'Pendiente', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
      approved: { label: 'Aprobado', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
      rejected: { label: 'Rechazado', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
      spam: { label: 'Spam', color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300' },
      hidden: { label: 'Oculto', color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300' }
    };

    const config = statusConfig[comment.status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {comment.isReported && <AlertTriangle size={12} />}
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `Hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getAuthorName = () => {
    if (comment.author?.firstName && comment.author?.lastName) {
      return `${comment.author.firstName} ${comment.author.lastName}`;
    }
    return comment.author?.name || 'Usuario Anónimo';
  };

  return (
    <div className={`p-6 transition-colors ${selected ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-white dark:bg-gray-800'}`}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
        />

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {/* Header: Autor y fecha */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400 dark:text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-white">
                {getAuthorName()}
              </span>
            </div>
            {comment.author.email && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {comment.author.email}
              </span>
            )}
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={14} />
              {formatDate(comment.createdAt)}
            </div>
            {getStatusBadge()}
          </div>

          {/* Post relacionado */}
          {comment.post && (
            <div className="flex items-center gap-2 mb-3 text-sm">
              <FileText size={14} className="text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Comentario en el post: <span className="font-medium text-gray-900 dark:text-white">
                  {typeof comment.post === 'string' 
                    ? `ID ${comment.post}` 
                    : `ID ${(comment.post as any)?._id || 'desconocido'}`}
                </span>
              </span>
            </div>
          )}

          {/* Contenido del comentario */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>

          {/* Información de moderación automática */}
          {comment.moderation && (
            <div className="flex items-center gap-4 mb-4 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Puntuación: <span className="font-medium">{comment.moderation.score}</span>
              </span>
              {comment.moderation.moderatedBy && (
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  (Moderado automáticamente)
                </span>
              )}
            </div>
          )}

          {/* Razón de rechazo si existe */}
          {comment.status === 'rejected' && comment.moderation?.reason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Razón de rechazo:</strong> {comment.moderation.reason}
              </p>
            </div>
          )}

          {/* Formulario de razón de rechazo */}
          {showRejectReason && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Razón del rechazo (opcional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explica por qué rechazas este comentario..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                rows={3}
              />
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Si está aprobado, mostrar opciones para desaprobar u ocultar */}
            {comment.status === 'approved' && (
              <>
                <button
                  onClick={() => handleModerate('reject')}
                  disabled={moderating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  <EyeOff size={16} />
                  Despublicar
                </button>
                <button
                  onClick={() => handleModerate('spam')}
                  disabled={moderating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  <Ban size={16} />
                  Marcar como Spam
                </button>
              </>
            )}

            {/* Si NO está aprobado, mostrar botón de aprobar */}
            {comment.status !== 'approved' && (
              <button
                onClick={() => handleModerate('approve')}
                disabled={moderating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors text-sm"
              >
                <Check size={16} />
                Aprobar
              </button>
            )}
            
            {comment.status !== 'rejected' && comment.status !== 'approved' && (
              <>
                {showRejectReason ? (
                  <>
                    <button
                      onClick={() => handleModerate('reject')}
                      disabled={moderating}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      <X size={16} />
                      Confirmar Rechazo
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectReason(false);
                        setRejectReason('');
                      }}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleModerate('reject')}
                    disabled={moderating}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    <X size={16} />
                    Rechazar
                  </button>
                )}
              </>
            )}
            
            {comment.status !== 'spam' && comment.status !== 'approved' && (
              <button
                onClick={() => handleModerate('spam')}
                disabled={moderating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors text-sm"
              >
                <Ban size={16} />
                Marcar como Spam
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
