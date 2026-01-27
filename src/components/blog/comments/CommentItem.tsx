/**
 * 💬 CommentItem Component
 * Item individual de comentario con votación y respuestas
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Reply, Flag, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';
import type { BlogComment } from '../../../types/blog';

// Estilos configurables desde CMS
export interface CommentItemStyles {
  cardBackground?: string;
  cardBorder?: string;
  authorColor?: string;
  textColor?: string;
  dateColor?: string;
}

interface CommentItemProps {
  comment: BlogComment;
  level?: number;
  maxLevel?: number;
  currentUserId?: string;
  isAdmin?: boolean;
  onReply?: (commentId: string) => void;
  onEdit?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onVote?: (commentId: string, voteType: 'like' | 'dislike') => Promise<void>;
  onReport?: (commentId: string) => void;
  className?: string;
  styles?: CommentItemStyles;
  avatarShape?: 'circle' | 'square';
}

export default function CommentItem({
  comment,
  level = 0,
  maxLevel = 3,
  currentUserId,
  isAdmin = false,
  onReply,
  onEdit,
  onDelete,
  onVote,
  onReport,
  className = '',
  styles,
  avatarShape = 'circle'
}: CommentItemProps) {
  
  // Clase de forma del avatar
  const avatarShapeClass = avatarShape === 'circle' ? 'rounded-full' : 'rounded-lg';

  const [showMenu, setShowMenu] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [localVotes, setLocalVotes] = useState(comment.votes);

  // Determinar si el usuario puede editar/eliminar
  const isAuthor = currentUserId && comment.author.userId === currentUserId;
  const canModerate = isAdmin;
  const canReply = level < maxLevel;

  // Formatear fecha
  const commentDate = new Date(comment.createdAt);
  const formattedDate = commentDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Nombre del autor
  // Si author.userId está poblado, puede ser un objeto con firstName/lastName/username
  const isPopulatedUser = comment.author.userId && typeof comment.author.userId !== 'string';
  const authorName = isPopulatedUser && (comment.author.userId as any).firstName
    ? `${(comment.author.userId as any).firstName} ${(comment.author.userId as any).lastName || ''}`.trim()
    : comment.author.name || 'Usuario invitado';
  
  // Verificar si el perfil es público
  const isPublicProfile = isPopulatedUser && 
    (comment.author.userId as any).username && 
    (comment.author.userId as any).blogProfile?.isPublicProfile !== false;

  // Manejar votación
  const handleVote = async (voteType: 'like' | 'dislike') => {
    if (!onVote || isVoting) return;

    setIsVoting(true);
    try {
      await onVote(comment._id, voteType);
      
      // Actualizar votos localmente
      setLocalVotes(prev => ({
        ...prev,
        likes: voteType === 'like' ? prev.likes + 1 : prev.likes,
        dislikes: voteType === 'dislike' ? prev.dislikes + 1 : prev.dislikes,
        score: voteType === 'like' ? prev.score + 1 : prev.score - 1
      }));
    } catch (error) {
      console.error('Error al votar:', error);
    } finally {
      setIsVoting(false);
    }
  };

  // Estilos según el estado
  const statusColors: Record<string, string> = {
    approved: '',
    pending: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    rejected: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    spam: 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600',
    hidden: 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
  };

  // Estilos dinámicos del contenedor
  const containerStyle: React.CSSProperties = comment.status === 'approved' ? {
    backgroundColor: styles?.cardBackground || undefined,
    borderColor: styles?.cardBorder || undefined,
  } : {};

  const containerClass = `
    comment-item
    ${comment.status !== 'approved' ? statusColors[comment.status] : ''}
    ${comment.status === 'approved' && !styles?.cardBackground ? 'bg-white dark:bg-gray-800' : ''}
    ${comment.status === 'approved' && !styles?.cardBorder ? 'border-gray-200 dark:border-gray-700' : ''}
    border rounded-lg p-4
    ${level > 0 ? 'ml-8 mt-3' : 'mt-4'}
    ${className}
  `;

  return (
    <div className={containerClass} style={containerStyle}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {(() => {
            const profileUsername = isPublicProfile ? (comment.author.userId as any).username : undefined;
            // Intentar obtener la imagen del perfil, priorizando profileImage de Clerk, luego avatar del blog
            const profileImg = isPopulatedUser 
              ? ((comment.author.userId as any).profileImage || (comment.author.userId as any).blogProfile?.avatar)
              : (comment.author.avatar || undefined);
            const profileUrl = isPublicProfile && profileUsername ? `/perfil/${profileUsername}` : (comment.author.website || null);

            const avatarNode = profileImg ? (
              <img 
                src={getImageUrl(profileImg)} 
                alt={authorName} 
                className={`w-10 h-10 ${avatarShapeClass} object-cover`}
                onError={(e) => {
                  // Si la imagen falla, mostrar iniciales
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
            ) : null;
            
            const fallbackAvatar = (
              <div 
                className={`w-10 h-10 ${avatarShapeClass} bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center`}
                style={{ display: profileImg ? 'none' : 'flex' }}
              >
                <span className="text-white font-semibold text-sm">{authorName.charAt(0).toUpperCase()}</span>
              </div>
            );

            const avatarContent = (
              <>
                {avatarNode}
                {fallbackAvatar}
              </>
            );

            // Solo enlazar si el perfil es público
            if (profileUrl && profileUsername && isPublicProfile) {
              return (
                <Link to={profileUrl} aria-label={`Ver perfil de ${authorName}`} className="block">
                  {avatarContent}
                </Link>
              );
            }
            
            // Enlace externo para website (usuarios invitados)
            if (profileUrl && !profileUsername && comment.author.website) {
              return (
                <a href={profileUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ver sitio de ${authorName}`}>
                  {avatarContent}
                </a>
              );
            }

            return <div className="block">{avatarContent}</div>;
          })()}

          <div>
            {/* Nombre del autor - solo enlazar si el perfil es público */}
            {isPublicProfile ? (
              <Link 
                to={`/perfil/${(comment.author.userId as any).username}`} 
                className={`font-semibold hover:underline ${!styles?.authorColor ? 'text-gray-900 dark:text-white' : ''}`}
                style={{ color: styles?.authorColor || undefined }}
              >
                {authorName}
              </Link>
            ) : (
              <p 
                className={`font-semibold ${!styles?.authorColor ? 'text-gray-900 dark:text-white' : ''}`}
                style={{ color: styles?.authorColor || undefined }}
              >
                {authorName}
              </p>
            )}
            <div 
              className={`flex items-center gap-2 text-xs ${!styles?.dateColor ? 'text-gray-500 dark:text-gray-400' : ''}`}
              style={{ color: styles?.dateColor || undefined }}
            >
              <span>{formattedDate}</span>
              {comment.editedAt && (
                <>
                  <span>•</span>
                  <span className="italic">Editado</span>
                </>
              )}
              {comment.status === 'pending' && (
                <>
                  <span>•</span>
                  <span className="text-yellow-600 font-medium">Pendiente de aprobación</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menú de acciones */}
        {(isAuthor || canModerate) && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-20 min-w-[150px]">
                  {isAuthor && onEdit && (
                    <button
                      onClick={() => {
                        onEdit(comment._id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                  )}

                  {(isAuthor || canModerate) && onDelete && (
                    <button
                      onClick={() => {
                        onDelete(comment._id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  )}

                  {!isAuthor && onReport && (
                    <button
                      onClick={() => {
                        onReport(comment._id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                    >
                      <Flag className="w-4 h-4" />
                      <span>Reportar</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Contenido del comentario */}
      <div className="prose prose-sm max-w-none mb-3">
        <p 
          className={`whitespace-pre-wrap ${!styles?.textColor ? 'text-gray-700 dark:text-gray-300' : ''}`}
          style={{ color: styles?.textColor || undefined }}
        >
          {comment.content}
        </p>
      </div>

      {/* Footer con acciones */}
      <div className="flex items-center gap-4">
        {/* Votación */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote('like')}
            disabled={isVoting}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors disabled:opacity-50"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="font-medium">{localVotes.likes}</span>
          </button>

          <button
            onClick={() => handleVote('dislike')}
            disabled={isVoting}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="font-medium">{localVotes.dislikes}</span>
          </button>

          {/* Score */}
          <span className={`text-sm font-semibold ${
            localVotes.score > 0 ? 'text-green-600 dark:text-green-400' :
            localVotes.score < 0 ? 'text-red-600 dark:text-red-400' :
            'text-gray-500 dark:text-gray-400'
          }`}>
            {localVotes.score > 0 && '+'}{localVotes.score}
          </span>
        </div>

        {/* Responder */}
        {canReply && onReply && (
          <button
            onClick={() => onReply(comment._id)}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
          >
            <Reply className="w-4 h-4" />
            <span>Responder</span>
          </button>
        )}

        {/* Reportes (admin) */}
        {isAdmin && comment.isReported && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-medium">
            <Flag className="w-3 h-3" />
            {comment.reports?.length || 0} reportes
          </span>
        )}
      </div>

      {/* Respuestas anidadas */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              level={level + 1}
              maxLevel={maxLevel}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onVote={onVote}
              onReport={onReport}
            />
          ))}
        </div>
      )}
    </div>
  );
}
