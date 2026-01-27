import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCarouselProps {
  totalItems: number;
  autoPlayInterval?: number;
  autoPlayEnabled?: boolean;
}

export const useCarousel = ({ 
  totalItems, 
  autoPlayInterval = 5000,
  autoPlayEnabled = true 
}: UseCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlayEnabled);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Detectar cantidad de slides a mostrar según el viewport
  const [slidesToShow, setSlidesToShow] = useState(() => {
    if (typeof window === 'undefined') return 3; // Desktop: 3 tarjetas
    if (window.innerWidth < 768) return 1;       // Móvil: 1 tarjeta
    if (window.innerWidth < 1024) return 2;      // Tablet: 2 tarjetas
    return 3;                                     // Desktop: 3 tarjetas
  });
  
  // Actualizar slidesToShow en resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);  // Móvil: 1 tarjeta
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);  // Tablet: 2 tarjetas
      } else {
        setSlidesToShow(3);  // Desktop: 3 tarjetas
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const maxSlide = Math.max(0, totalItems - slidesToShow);
  
  // Navegación del carrusel con useCallback para estabilidad
  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => {
      const currentMax = Math.max(0, totalItems - slidesToShow);
      return prev >= currentMax ? 0 : prev + 1;
    });
  }, [totalItems, slidesToShow]);
  
  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => {
      const currentMax = Math.max(0, totalItems - slidesToShow);
      return prev <= 0 ? currentMax : prev - 1;
    });
  }, [totalItems, slidesToShow]);
  
  const goToSlide = useCallback((index: number) => {
    const currentMax = Math.max(0, totalItems - slidesToShow);
    if (index >= 0 && index <= currentMax) {
      setCurrentSlide(index);
    }
  }, [totalItems, slidesToShow]);
  
  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || totalItems <= slidesToShow) {
      return;
    }
    
    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, totalItems, slidesToShow, autoPlayInterval, goToNext]);
  
  // Touch events para swipe en móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      goToNext();
    }
    if (touchStart - touchEnd < -75) {
      goToPrev();
    }
    
    // Reactivar auto-play después de 3 segundos
    setTimeout(() => {
      if (autoPlayEnabled) {
        setIsAutoPlaying(true);
      }
    }, 3000);
  };
  
  // Pausar/reanudar auto-play
  const pauseAutoPlay = () => setIsAutoPlaying(false);
  const resumeAutoPlay = () => autoPlayEnabled && setIsAutoPlaying(true);
  
  return {
    currentSlide,
    slidesToShow,
    maxSlide,
    goToNext,
    goToPrev,
    goToSlide,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    pauseAutoPlay,
    resumeAutoPlay,
    carouselRef,
    canNavigate: totalItems > slidesToShow
  };
};
