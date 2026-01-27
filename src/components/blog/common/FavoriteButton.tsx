/**
 * 🔖 FavoriteButton Component
 * Botón para guardar/quitar posts para leer después
 */

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useFavorites } from '../../../hooks/blog';

interface FavoriteButtonProps {
  postId: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  // Colores personalizables desde CMS
  iconColor?: string;
  bgColor?: string;
}

export default function FavoriteButton({
  postId,
  size = 'md',
  showText = false,
  className = '',
  iconColor,
  bgColor
}: FavoriteButtonProps) {
  
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(false);

  useEffect(() => {
    setLocalIsFavorite(isFavorite(postId));
  }, [isFavorite, postId]);

  const handleClick = async () => {
    if (loading) return;
    
    // Animación
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Toggle favorito
    await toggleFavorite(postId);
    setLocalIsFavorite(!localIsFavorite);
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
        favorite-button
        inline-flex items-center gap-2 
        rounded-lg font-medium
        transition-all duration-200
        ${sizeConfig.padding}
        ${!iconColor && !bgColor ? (
          localIsFavorite
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
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
      aria-label={localIsFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      title={localIsFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Bookmark 
        size={sizeConfig.icon}
        fill={localIsFavorite ? 'currentColor' : 'none'}
        className={`transition-all duration-200 ${isAnimating ? 'animate-bounce' : ''}`}
      />
      {showText && (
        <span className={sizeConfig.text}>
          {localIsFavorite ? 'Guardado' : 'Guardar'}
        </span>
      )}
    </button>
  );
}