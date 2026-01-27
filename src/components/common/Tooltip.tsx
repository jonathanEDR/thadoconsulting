/**
 * 💡 Tooltip Component
 * Tooltip contextual y reutilizable para Services Canvas
 * 
 * Características:
 * - Posicionamiento inteligente
 * - Múltiples variantes (dark, light, info, warning, success)
 * - Delay configurable
 * - Responsive design
 * - Accesibilidad (ARIA)
 */

import React, { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  variant?: 'dark' | 'light' | 'info' | 'warning' | 'success' | 'purple';
  delay?: number;
  disabled?: boolean;
  className?: string;
  maxWidth?: string;
  offset?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'auto',
  variant = 'dark',
  delay = 300,
  disabled = false,
  className = '',
  maxWidth = '200px',
  // offset = 8
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // ============================================
  // UTILIDADES
  // ============================================

  const getVariantClasses = () => {
    switch (variant) {
      case 'light':
        return 'bg-white text-gray-900 border border-gray-200 shadow-lg';
      case 'info':
        return 'bg-blue-600 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'success':
        return 'bg-green-600 text-white';
      case 'purple':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-900 text-white';
    }
  };

  const getArrowClasses = () => {
    const baseArrow = 'absolute w-2 h-2 transform rotate-45';
    
    switch (variant) {
      case 'light':
        return `${baseArrow} bg-white border-gray-200`;
      case 'info':
        return `${baseArrow} bg-blue-600`;
      case 'warning':
        return `${baseArrow} bg-yellow-500`;
      case 'success':
        return `${baseArrow} bg-green-600`;
      case 'purple':
        return `${baseArrow} bg-purple-600`;
      default:
        return `${baseArrow} bg-gray-900`;
    }
  };

  const calculatePosition = () => {
    if (!triggerRef.current || position !== 'auto') {
      return position;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Calcular qué posición tiene más espacio
    const spaces = {
      top: triggerRect.top,
      bottom: viewport.height - triggerRect.bottom,
      left: triggerRect.left,
      right: viewport.width - triggerRect.right
    };

    // Elegir la posición con más espacio
    const maxSpace = Math.max(...Object.values(spaces));
    const preferredPosition = Object.keys(spaces).find(
      key => spaces[key as keyof typeof spaces] === maxSpace
    ) as 'top' | 'bottom' | 'left' | 'right';

    return preferredPosition;
  };

  const getPositionClasses = () => {
    switch (actualPosition) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowPosition = () => {
    switch (actualPosition) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 -mt-1';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 -ml-1';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 -mr-1';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 -mt-1';
    }
  };

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    if (isVisible && position === 'auto') {
      const newPosition = calculatePosition();
      setActualPosition(newPosition);
    }
  }, [isVisible, position]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleMouseEnter = () => {
    if (disabled) return;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  // ============================================
  // CLEANUP
  // ============================================

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  // ============================================
  // RENDERIZADO
  // ============================================

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      ref={triggerRef}
    >
      {children}
      
      {isVisible && !disabled && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-3 py-2 text-sm font-medium rounded-lg
            transition-opacity duration-200 pointer-events-none
            ${getVariantClasses()}
            ${getPositionClasses()}
          `}
          style={{ maxWidth }}
          role="tooltip"
          aria-hidden={!isVisible}
        >
          {content}
          
          {/* Arrow */}
          <div className={`${getArrowClasses()} ${getArrowPosition()}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;