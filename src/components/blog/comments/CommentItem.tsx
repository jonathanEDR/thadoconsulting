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

  // Estilos según el estado (mantenemos estos fijos para claridad visual)
  const statusColors: Record<string, { bg: string; border: string }> = {
    approved: { bg: '', border: '' },
    pending: { bg: '#fef3c7', border: '#fcd34d' },
    rejected: { bg: '#fee2e2', border: '#fca5a5' },
    spam: { bg: '#f3f4f6', border: '#d1d5db' },
    hidden: { bg: '#f3f4f6', border: '#d1d5db' }
  };

  // Estilos dinámicos del contenedor
  const containerStyle: React.CSSProperties = comment.status === 'approved' ? {
    backgroundColor: styles?.cardBackground || '#ffffff',
    borderColor: styles?.cardBorder || '#e5e7eb',
  } : {
    backgroundColor: statusColors[comment.status].bg,
    borderColor: statusColors[comment.status].border,
  };

  const containerClass = `
    comment-item
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
                className="font-semibold hover:underline"
                style={{ color: styles?.authorColor || '#111827' }}
              >
                {authorName}
              </Link>
            ) : (
              <p 
                className="font-semibold"
                style={{ color: styles?.authorColor || '#111827' }}
              >
                {authorName}
              </p>
            )}
            <div 
              className="flex items-center gap-2 text-xs"
              style={{ color: styles?.dateColor || '#6b7280' }}
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
                  <span className="font-medium" style={{ color: '#d97706' }}>Pendiente de aprobación</span>
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
              className="p-1 rounded transition-opacity hover:opacity-70"
              style={{ color: styles?.dateColor || '#9ca3af' }}
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <div 
                  className="absolute right-0 top-full mt-1 rounded-lg shadow-xl border py-1 z-20 min-w-[150px]"
                  style={{
                    background: styles?.cardBackground || '#ffffff',
                    borderColor: styles?.cardBorder || '#e5e7eb'
                  }}
                >
                  {isAuthor && onEdit && (
                    <button
                      onClick={() => {
                        onEdit(comment._id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left transition-opacity hover:opacity-70"
                      style={{ color: styles?.textColor || '#374151' }}
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
                      className="flex items-center gap-2 w-full px-3 py-2 text-left transition-opacity hover:opacity-70"
                      style={{ color: '#dc2626' }}
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
                      className="flex items-center gap-2 w-full px-3 py-2 text-left transition-opacity hover:opacity-70"
                      style={{ color: '#ea580c' }}
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
          className="whitespace-pre-wrap"
          style={{ color: styles?.textColor || '#374151' }}
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
            className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded transition-opacity disabled:opacity-50 hover:opacity-70"
            style={{ color: styles?.dateColor || '#6b7280' }}
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="font-medium">{localVotes.likes}</span>
          </button>

          <button
            onClick={() => handleVote('dislike')}
            disabled={isVoting}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded transition-opacity disabled:opacity-50 hover:opacity-70"
            style={{ color: styles?.dateColor || '#6b7280' }}
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="font-medium">{localVotes.dislikes}</span>
          </button>

          {/* Score */}
          <span 
            className="text-sm font-semibold"
            style={{
              color: localVotes.score > 0 ? '#16a34a' :
                     localVotes.score < 0 ? '#dc2626' :
                     styles?.dateColor || '#6b7280'
            }}
          >
            {localVotes.score > 0 && '+'}{localVotes.score}
          </span>
        </div>

        {/* Responder */}
        {canReply && onReply && (
          <button
            onClick={() => onReply(comment._id)}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded transition-opacity hover:opacity-70"
            style={{ color: styles?.dateColor || '#6b7280' }}
          >
            <Reply className="w-4 h-4" />
            <span>Responder</span>
          </button>
        )}

        {/* Reportes (admin) */}
        {isAdmin && comment.isReported && (
          <span 
            className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium"
            style={{ background: '#fed7aa', color: '#9a3412' }}
          >
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
