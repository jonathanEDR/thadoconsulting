/**
 * 🏷️ Componente para mostrar badges de roles
 * Muestra visualmente el rol de un usuario con colores y estilos
 */

import type { UserRole } from '../types/roles';
import { ROLE_INFO } from '../types/roles';

// ============================================
// ROLE BADGE
// ============================================

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

/**
 * Badge visual para mostrar el rol de un usuario
 * 
 * @param role - Rol del usuario
 * @param size - Tamaño del badge ('sm' | 'md' | 'lg')
 * @param showIcon - Mostrar icono del rol
 * @param className - Clases CSS adicionales
 * 
 * @example
 * ```typescript
 * <RoleBadge role={UserRole.ADMIN} />
 * ```
 * 
 * @example Grande con icono
 * ```typescript
 * <RoleBadge role={UserRole.SUPER_ADMIN} size="lg" showIcon />
 * ```
 */
export default function RoleBadge({ 
  role, 
  size = 'md',
  showIcon = true,
  className = ''
}: RoleBadgeProps) {
  const roleInfo = ROLE_INFO[role];

  if (!roleInfo) {
    return null;
  }

  // Estilos según el tamaño
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // Colores según el rol
  const colorStyles = {
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-700',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-700',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-700',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-700',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600'
  };

  const colorClass = colorStyles[roleInfo.color as keyof typeof colorStyles] || colorStyles.gray;

  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 
        ${sizeStyles[size]} 
        ${colorClass}
        font-semibold rounded-full border
        transition-all duration-200
        ${className}
      `}
      title={roleInfo.description}
    >
      {showIcon && (
        <span className={size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'}>
          {roleInfo.icon}
        </span>
      )}
      <span>{roleInfo.label}</span>
    </span>
  );
}

// ============================================
// ROLE BADGE SIMPLE (solo icono)
// ============================================

interface RoleBadgeIconProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Badge de rol solo con icono (sin texto)
 * 
 * @param role - Rol del usuario
 * @param size - Tamaño del icono
 * @param className - Clases CSS adicionales
 * 
 * @example
 * ```typescript
 * <RoleBadgeIcon role={UserRole.ADMIN} size="lg" />
 * ```
 */
export function RoleBadgeIcon({ 
  role, 
  size = 'md',
  className = ''
}: RoleBadgeIconProps) {
  const roleInfo = ROLE_INFO[role];

  if (!roleInfo) {
    return null;
  }

  const sizeStyles = {
    sm: 'text-sm w-6 h-6',
    md: 'text-base w-8 h-8',
    lg: 'text-2xl w-12 h-12'
  };

  const colorStyles = {
    red: 'bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-700',
    purple: 'bg-purple-100 dark:bg-purple-900 border-purple-200 dark:border-purple-700',
    blue: 'bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700',
    green: 'bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-700',
    gray: 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
  };

  const colorClass = colorStyles[roleInfo.color as keyof typeof colorStyles] || colorStyles.gray;

  return (
    <div
      className={`
        inline-flex items-center justify-center
        ${sizeStyles[size]}
        ${colorClass}
        rounded-full border
        transition-all duration-200
        ${className}
      `}
      title={`${roleInfo.label} - ${roleInfo.description}`}
    >
      {roleInfo.icon}
    </div>
  );
}

// ============================================
// ROLE BADGE LIST (para mostrar múltiples roles)
// ============================================

interface RoleBadgeListProps {
  roles: UserRole[];
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

/**
 * Lista de badges de roles
 * 
 * @param roles - Array de roles
 * @param size - Tamaño de los badges
 * @param showIcon - Mostrar iconos
 * @param className - Clases CSS adicionales
 * 
 * @example
 * ```typescript
 * <RoleBadgeList 
 *   roles={[UserRole.ADMIN, UserRole.MODERATOR]} 
 *   size="sm"
 * />
 * ```
 */
export function RoleBadgeList({ 
  roles, 
  size = 'sm',
  showIcon = true,
  className = ''
}: RoleBadgeListProps) {
  if (!roles || roles.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {roles.map((role) => (
        <RoleBadge 
          key={role} 
          role={role} 
          size={size} 
          showIcon={showIcon}
        />
      ))}
    </div>
  );
}
