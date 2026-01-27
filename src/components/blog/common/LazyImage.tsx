/**
 * 🖼️ LazyImage Component
 * Carga diferida de imágenes con placeholder mejorado
 */

import { useState, useRef, useEffect } from 'react';
import { getImageUrl, getPlaceholderImage, getErrorImage, isValidImageUrl } from '../../../utils/imageUtils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  fallbackSrc,
  width = 400,
  height = 300,
  onLoad,
  onError
}: LazyImageProps) {
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  // Generar URLs de respaldo
  const placeholderUrl = getPlaceholderImage(width, height);
  const errorUrl = getErrorImage(width, height);
  const processedSrc = isValidImageUrl(src) ? getImageUrl(src) : errorUrl;
  const finalFallbackSrc = fallbackSrc ? getImageUrl(fallbackSrc) : errorUrl;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Comenzar a cargar 50px antes
      }
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => observer.disconnect();
  }, [isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div 
      ref={placeholderRef}
      className="lazy-image-container relative overflow-hidden w-full h-full"
    >
      {/* Placeholder mientras carga */}
      {!isLoaded && (
        <div className={`
          lazy-image-placeholder
          flex items-center justify-center bg-gray-100 dark:bg-gray-800 
          animate-pulse transition-opacity duration-300
          ${placeholderClassName}
          ${isLoaded ? 'opacity-0' : 'opacity-100'}
        `}>
          <img 
            src={placeholderUrl}
            alt="Cargando..."
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* Imagen real */}
      {isInView && (
        <img
          ref={imgRef}
          src={hasError ? finalFallbackSrc : processedSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          className={`
            transition-opacity duration-500 ease-in-out
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${!isLoaded ? 'absolute inset-0' : ''}
            ${className}
          `}
        />
      )}
    </div>
  );
}