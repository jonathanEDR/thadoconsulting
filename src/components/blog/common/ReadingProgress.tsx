/**
 * 📊 ReadingProgress Component
 * Barra de progreso de lectura con colores configurables
 * Soporta gradientes y colores sólidos
 */

import { useEffect, useState } from 'react';

interface ReadingProgressProps {
  position?: 'top' | 'bottom';
  height?: string;
  barColor?: string;           // Color sólido de la barra
  barGradientFrom?: string;    // Gradiente desde
  barGradientTo?: string;      // Gradiente hasta
  trackColor?: string;         // Color del fondo/track
}

export default function ReadingProgress({
  position = 'top',
  height = '3px',
  barColor,
  barGradientFrom,
  barGradientTo,
  trackColor
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      
      setProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Calculate initial progress

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determinar el estilo de la barra: gradiente o color sólido
  const getBarStyle = () => {
    // Si hay gradiente configurado
    if (barGradientFrom && barGradientTo) {
      return { background: `linear-gradient(to right, ${barGradientFrom}, ${barGradientTo})` };
    }
    // Si el barColor ya es un gradiente
    if (barColor?.includes('gradient')) {
      return { background: barColor };
    }
    // Color sólido
    if (barColor) {
      return { backgroundColor: barColor };
    }
    // Default: sin estilo inline, usa clase Tailwind
    return {};
  };

  const barStyle = getBarStyle();
  const hasCustomBarStyle = Object.keys(barStyle).length > 0;

  return (
    <div 
      className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50`}
      style={{ 
        height,
        backgroundColor: trackColor || undefined 
      }}
    >
      <div
        className={`h-full transition-all duration-150 ease-out ${!hasCustomBarStyle ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' : ''}`}
        style={{ 
          width: `${progress}%`,
          ...barStyle
        }}
      />
    </div>
  );
}
