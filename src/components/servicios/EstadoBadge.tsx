/**
 * 🏷️ BADGE DE ESTADO - EstadoBadge
 * Componente para mostrar el estado de un servicio con colores y estilos específicos
 */

import React from 'react';

// ============================================
// CONFIGURACIÓN DE ESTADOS
// ============================================

interface EstadoConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

const estadoConfig: Record<string, EstadoConfig> = {
  activo: {
    label: 'Activo',
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-500/20 border-green-500/50',
    icon: '✓'
  },
  desarrollo: {
    label: 'En desarrollo',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-500/20 border-blue-500/50',
    icon: '⚙️'
  },
  pausado: {
    label: 'Pausado',
    color: 'text-yellow-700 dark:text-yellow-300',
    bgColor: 'bg-yellow-500/20 border-yellow-500/50',
    icon: '⏸️'
  },
  descontinuado: {
    label: 'Descontinuado',
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-500/20 border-red-500/50',
    icon: '❌'
  },
  agotado: {
    label: 'Agotado',
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-500/20 border-gray-500/50',
    icon: '🚫'
  }
};

// ============================================
// TIPOS
// ============================================

interface EstadoBadgeProps {
  estado: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ============================================
// COMPONENTE
// ============================================

/**
 * Badge para mostrar el estado de un servicio
 * 
 * @example
 * ```tsx
 * <EstadoBadge estado="activo" />
 * <EstadoBadge estado="pausado" showIcon size="lg" />
 * ```
 */
export const EstadoBadge: React.FC<EstadoBadgeProps> = ({
  estado,
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  // Obtener configuración del estado
  const config = estadoConfig[estado.toLowerCase()] || estadoConfig.activo;

  // Tamaños
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 
        ${sizeClasses[size]}
        ${config.color}
        ${config.bgColor}
        border rounded-full font-semibold
        ${className}
      `}
      title={`Estado: ${config.label}`}
    >
      {showIcon && <span className="text-sm">{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  );
};

export default EstadoBadge;
