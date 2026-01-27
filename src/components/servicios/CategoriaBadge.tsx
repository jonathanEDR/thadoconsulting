/**
 * 🏷️ BADGE DE CATEGORÍA - CategoriaBadge  
 * Componente para mostrar la categoría de un servicio con iconos y colores dinámicos
 */

import React from 'react';

// ============================================
// TIPOS
// ============================================

// Interfaz para categoría (objeto completo de la base de datos)
interface CategoriaObject {
  _id: string;
  nombre: string;
  descripcion?: string;
  slug: string;
  icono: string;
  color: string;
  orden: number;
  activo: boolean;
  totalServicios: number;
}

// Configuración de fallback para categorías legacy (string)
interface CategoriaConfig {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}

const categoriaConfigFallback: Record<string, CategoriaConfig> = {
  desarrollo: {
    label: 'Desarrollo',
    icon: '💻',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-600/20 border-blue-500/50'
  },
  diseño: {
    label: 'Diseño',
    icon: '🎨',
    color: 'text-pink-700 dark:text-pink-300',
    bgColor: 'bg-pink-600/20 border-pink-500/50'
  },
  marketing: {
    label: 'Marketing',
    icon: '📊',
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-600/20 border-green-500/50'
  },
  consultoría: {
    label: 'Consultoría',
    icon: '💼',
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-600/20 border-purple-500/50'
  },
  mantenimiento: {
    label: 'Mantenimiento',
    icon: '🔧',
    color: 'text-orange-700 dark:text-orange-300',
    bgColor: 'bg-orange-600/20 border-orange-500/50'
  },
  otro: {
    label: 'Otro',
    icon: '📦',
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-600/20 border-gray-500/50'
  }
};

// ============================================
// PROPS INTERFACE
// ============================================

interface CategoriaBadgeProps {
  categoria: CategoriaObject | string; // Puede ser objeto completo o string legacy
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ============================================
// COMPONENTE
// ============================================

/**
 * Badge para mostrar la categoría de un servicio
 * Soporta tanto categorías dinámicas (objetos) como legacy (strings)
 * 
 * @example
 * ```tsx
 * <CategoriaBadge categoria={categoriaObject} />
 * <CategoriaBadge categoria="desarrollo" showIcon={false} />
 * ```
 */
export const CategoriaBadge: React.FC<CategoriaBadgeProps> = ({
  categoria,
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  // Si no hay categoría, usar default
  if (!categoria) {
    categoria = 'otro';
  }
  
  // Determinar si es objeto o string
  const isObject = typeof categoria === 'object' && categoria !== null;
  
  let label: string;
  let icon: string;
  let color: string;
  let bgColor: string;

  if (isObject && (categoria as any).nombre) {
    // Categoría dinámica (objeto de la base de datos poblado)
    const cat = categoria as CategoriaObject;
    label = cat.nombre;
    icon = cat.icono;
    
    // Convertir color hex a clases de Tailwind
    const hexToTailwind = (hexColor: string) => {
      // Para simplicidad, usar el color como background con opacidad
      return {
        color: 'text-white',
        bgColor: 'border-opacity-50',
        style: {
          backgroundColor: `${hexColor}40`, // 40 = 25% opacity
          borderColor: `${hexColor}80`,     // 80 = 50% opacity
        }
      };
    };
    
    const colorConfig = hexToTailwind(cat.color);
    color = colorConfig.color;
    bgColor = colorConfig.bgColor;
  } else {
    // Categoría legacy (string) o ObjectId no poblado - usar configuración de fallback
    let categoriaStr: string;
    
    if (isObject) {
      // Si es un objeto pero no tiene nombre, probablemente es un ObjectId no poblado
      categoriaStr = 'otro'; // Default fallback
      // Objeto sin propiedades de categoría
    } else {
      categoriaStr = categoria as string;
    }
    
    const config = categoriaConfigFallback[categoriaStr.toLowerCase()] || categoriaConfigFallback.otro;
    label = config.label;
    icon = config.icon;
    color = config.color;
    bgColor = config.bgColor;
  }

  // Tamaños
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const badgeProps: React.HTMLAttributes<HTMLSpanElement> = {
    className: `
      inline-flex items-center gap-1.5 
      ${sizeClasses[size]}
      ${color}
      ${bgColor}
      border rounded-full font-semibold
      ${className}
    `.trim(),
    title: `Categoría: ${label}`
  };

  // Si es objeto, agregar estilos inline para el color
  if (isObject) {
    const cat = categoria as CategoriaObject;
    badgeProps.style = {
      backgroundColor: `${cat.color}25`, // 25% opacity
      borderColor: `${cat.color}60`,     // 60% opacity
    };
    badgeProps.className = `
      inline-flex items-center gap-1.5 
      ${sizeClasses[size]}
      text-gray-800 dark:text-white
      border rounded-full font-semibold
      ${className}
    `.trim();
  }

  return (
    <span {...badgeProps}>
      {showIcon && <span className="text-sm">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};

export default CategoriaBadge;
