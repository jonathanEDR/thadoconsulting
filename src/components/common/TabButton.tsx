/**
 * 🔘 TAB BUTTON - Botón Individual de Tab
 * Componente especializado para cada botón del sistema de tabs
 */

import React from 'react';
import type { Tab } from './TabNavigator';

// ============================================
// TIPOS
// ============================================

interface TabButtonProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ============================================
// COMPONENTE
// ============================================

/**
 * Botón individual de tab con estados visuales profesionales
 * 
 * @example
 * ```tsx
 * <TabButton
 *   tab={{ id: 'basic', title: 'Básico', icon: '📋', hasErrors: true }}
 *   isActive={activeTab === 'basic'}
 *   onClick={() => setActiveTab('basic')}
 *   showDescription={true}
 * />
 * ```
 */
export const TabButton: React.FC<TabButtonProps> = ({
  tab,
  isActive,
  onClick,
  showDescription = true,
  size = 'md',
  className = ''
}) => {
  // ============================================
  // CONFIGURACIÓN DE TAMAÑOS
  // ============================================

  const sizeConfig = {
    sm: {
      button: 'px-3 py-2 text-sm',
      icon: 'text-base',
      title: 'text-sm',
      description: 'text-xs',
      badge: 'text-xs px-1 py-0.5'
    },
    md: {
      button: 'px-4 py-3 text-base',
      icon: 'text-lg',
      title: 'text-base',
      description: 'text-xs',
      badge: 'text-xs px-1.5 py-0.5'
    },
    lg: {
      button: 'px-6 py-4 text-lg',
      icon: 'text-xl',
      title: 'text-lg',
      description: 'text-sm',
      badge: 'text-sm px-2 py-1'
    }
  };

  const config = sizeConfig[size];

  // ============================================
  // CLASES DINÁMICAS
  // ============================================

  const getButtonClasses = (): string => {
    const baseClasses = `
      relative flex items-center gap-3 rounded-lg transition-all duration-200 
      cursor-pointer group select-none outline-none
      focus:outline-none focus:ring-2 focus:ring-purple-500/50
      ${config.button}
    `;
    
    if (isActive) {
      return `${baseClasses} bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105`;
    }
    
    if (tab.hasErrors) {
      return `${baseClasses} bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:scale-102`;
    }
    
    if (tab.isCompleted) {
      return `${baseClasses} bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 hover:scale-102`;
    }
    
    return `${baseClasses} bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-300/50 dark:border-gray-600/50 hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:scale-102`;
  };

  // ============================================
  // INDICADORES DE ESTADO
  // ============================================

  const StatusIndicator = () => {
    if (tab.hasErrors) {
      return (
        <div 
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse"
          title="Tiene errores que corregir"
        >
          <span className="text-white text-xs font-bold">!</span>
        </div>
      );
    }
    
    if (tab.isCompleted) {
      return (
        <div 
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
          title="Completado correctamente"
        >
          <span className="text-white text-xs">✓</span>
        </div>
      );
    }
    
    if (isActive) {
      return (
        <div 
          className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"
          title="Tab activo"
        />
      );
    }
    
    return null;
  };

  const OptionalBadge = () => {
    if (!tab.isOptional) return null;
    
    return (
      <span 
        className={`
          opacity-60 bg-white/10 rounded font-medium
          ${config.badge}
        `}
        title="Esta sección es opcional"
      >
        opcional
      </span>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <button
      onClick={onClick}
      className={`${getButtonClasses()} ${className}`}
      title={tab.description || tab.title}
      aria-pressed={isActive}
      aria-describedby={tab.description ? `${tab.id}-description` : undefined}
    >
      {/* Icono */}
      <span className={`flex-shrink-0 ${config.icon}`}>
        {tab.icon}
      </span>
      
      {/* Contenido */}
      <div className="flex flex-col items-start min-w-0 flex-1">
        {/* Título y badge */}
        <div className="flex items-center gap-2 w-full">
          <span className={`font-medium truncate ${config.title}`}>
            {tab.title}
          </span>
          <OptionalBadge />
        </div>
        
        {/* Descripción */}
        {showDescription && tab.description && (
          <span 
            id={`${tab.id}-description`}
            className={`opacity-75 truncate max-w-full ${config.description}`}
          >
            {tab.description}
          </span>
        )}
      </div>

      {/* Indicador de estado */}
      <StatusIndicator />

      {/* Efecto de hover */}
      <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </button>
  );
};

// ============================================
// VARIANTES ESPECIALIZADAS
// ============================================

/**
 * Botón de tab compacto para espacios reducidos
 */
export const CompactTabButton: React.FC<Omit<TabButtonProps, 'showDescription' | 'size'>> = (props) => (
  <TabButton 
    {...props} 
    showDescription={false} 
    size="sm"
    className="min-w-0"
  />
);

/**
 * Botón de tab con tooltip para información adicional
 */
export const TabButtonWithTooltip: React.FC<TabButtonProps & { tooltip?: string }> = ({
  tooltip,
  ...props
}) => (
  <div className="relative group">
    <TabButton {...props} />
    {tooltip && (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
        {tooltip}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    )}
  </div>
);

export default TabButton;