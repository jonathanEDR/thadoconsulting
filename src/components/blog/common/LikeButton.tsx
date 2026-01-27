/**
 * ❤️ LikeButton Component
 * Botón para dar "Me Gusta" a posts del blog
 */

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { blogPostApi } from '../../../services/blog/blogPostApi';

interface LikeButtonProps {
  postId: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  // Colores personalizables desde CMS
  iconColor?: string;
  bgColor?: string;
}

export default function LikeButton({
  postId,
  size = 'md',
  showText = false,
  className = '',
  iconColor,
  bgColor
}: LikeButtonProps) {
  
  const { getToken, isSignedIn, userId } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  const [localIsLiked, setLocalIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar estado de like desde localStorage
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('blog_liked_posts') || '[]');
    setLocalIsLiked(likedPosts.includes(postId));
  }, [postId]);

  const handleClick = async () => {
    if (loading) return;
    
    // Animación
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Si el usuario está autenticado, guardar en el backend
    if (isSignedIn && userId) {
      try {
        setLoading(true);
        
        // Obtener token fresco
        const token = await getToken();
        
        if (!token) {
          return;
        }
        
        await blogPostApi.toggleLike(postId);
      } catch (err) {
        console.error('Error al dar like:', err);
        return;
      } finally {
        setLoading(false);
      }
    }

    // Actualizar localStorage
    const likedPosts = JSON.parse(localStorage.getItem('blog_liked_posts') || '[]');
    
    if (localIsLiked) {
      // Remover like
      const updated = likedPosts.filter((id: string) => id !== postId);
      localStorage.setItem('blog_liked_posts', JSON.stringify(updated));
      setLocalIsLiked(false);
    } else {
      // Agregar like
      likedPosts.push(postId);
      localStorage.setItem('blog_liked_posts', JSON.stringify(likedPosts));
      setLocalIsLiked(true);
    }
  };

  // Tamaños
  const sizes = {
    sm: { icon: 16, padding: 'px-2 py-1', text: 'text-xs' },
    md: { icon: 20, padding: 'px-3 py-2', text: 'text-sm' },
    lg: { icon: 24, padding: 'px-4 py-3', text: 'text-base' }
  };

  const sizeConfig = sizes[size];

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        like-button
        inline-flex items-center gap-2 
        rounded-lg font-medium
        transition-all duration-200
        ${sizeConfig.padding}
        ${!iconColor && !bgColor ? (
          localIsLiked
            ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30'
            : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
        ) : ''}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isAnimating ? 'scale-110' : 'scale-100'}
        ${className}
      `}
      style={{
        ...(bgColor ? { backgroundColor: bgColor } : {}),
        ...(iconColor ? { color: iconColor } : {})
      }}
      aria-label={localIsLiked ? 'Quitar me gusta' : 'Dar me gusta'}
      title={localIsLiked ? 'Quitar me gusta' : 'Dar me gusta'}
    >
      <Heart 
        size={sizeConfig.icon}
        fill={localIsLiked ? 'currentColor' : 'none'}
        className={`transition-all duration-200 ${isAnimating ? 'animate-bounce' : ''}`}
      />
      {showText && (
        <span className={sizeConfig.text}>
          Me gusta
        </span>
      )}
    </button>
  );
}
