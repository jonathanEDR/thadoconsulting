/**
 * 🔒 Componente para mostrar/ocultar elementos según permisos
 * Verifica permisos a nivel de UI sin redireccionar
 */

import { useAuth } from '../contexts/AuthContext';
import type { Permission, UserRole } from '../types/roles';

// ============================================
// PERMISSION GUARD
// ============================================

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Componente para mostrar contenido solo si tiene el permiso
 * 
 * @param children - Contenido a mostrar si tiene permiso
 * @param permission - Permiso único requerido
 * @param permissions - Array de permisos
 * @param requireAll - Si es true, requiere TODOS los permisos. Si es false, requiere AL MENOS UNO
 * @param fallback - Contenido alternativo si no tiene permiso
 * 
 * @example Con un permiso
 * ```typescript
 * <PermissionGuard permission={Permission.MANAGE_USERS}>
 *   <button>Gestionar Usuarios</button>
 * </PermissionGuard>
 * ```
 * 
 * @example Con múltiples permisos (requiere al menos uno)
 * ```typescript
 * <PermissionGuard 
 *   permissions={[Permission.MANAGE_CONTENT, Permission.MODERATE_CONTENT]}
 * >
 *   <EditButton />
 * </PermissionGuard>
 * ```
 * 
 * @example Con múltiples permisos (requiere todos)
 * ```typescript
 * <PermissionGuard 
 *   permissions={[Permission.MANAGE_USERS, Permission.ASSIGN_ROLES]}
 *   requireAll
 * >
 *   <AdminPanel />
 * </PermissionGuard>
 * ```
 */
export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  let hasAccess = false;

  // Si se especificó un permiso único
  if (permission) {
    hasAccess = hasPermission(permission);
  }
  // Si se especificaron múltiples permisos
  else if (permissions && permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }
  // Si no se especificó ningún permiso, denegar acceso
  else {
    console.warn('[PermissionGuard] No se especificó ningún permiso');
    return <>{fallback}</>;
  }

  // Si no tiene acceso, mostrar fallback
  if (!hasAccess) {
    return <>{fallback}</>;
  }

  // Si tiene acceso, mostrar contenido
  return <>{children}</>;
}

// ============================================
// ROLE GUARD
// ============================================

interface RoleGuardProps {
  children: React.ReactNode;
  role?: UserRole;
  roles?: UserRole[];
  fallback?: React.ReactNode;
}

/**
 * Componente para mostrar contenido solo si tiene el rol
 * 
 * @param children - Contenido a mostrar si tiene el rol
 * @param role - Rol único requerido
 * @param roles - Array de roles permitidos
 * @param fallback - Contenido alternativo si no tiene el rol
 * 
 * @example
 * ```typescript
 * <RoleGuard role={UserRole.ADMIN}>
 *   <AdminButton />
 * </RoleGuard>
 * ```
 * 
 * @example Con múltiples roles
 * ```typescript
 * <RoleGuard roles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
 *   <ManagementPanel />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({
  children,
  role,
  roles,
  fallback = null
}: RoleGuardProps) {
  const { hasRole } = useAuth();

  let hasAccess = false;

  // Si se especificó un rol único
  if (role) {
    hasAccess = hasRole(role);
  }
  // Si se especificaron múltiples roles
  else if (roles && roles.length > 0) {
    hasAccess = hasRole(roles);
  }
  // Si no se especificó ningún rol, denegar acceso
  else {
    console.warn('[RoleGuard] No se especificó ningún rol');
    return <>{fallback}</>;
  }

  // Si no tiene acceso, mostrar fallback
  if (!hasAccess) {
    return <>{fallback}</>;
  }

  // Si tiene acceso, mostrar contenido
  return <>{children}</>;
}

// ============================================
// EXPORTS
// ============================================

export default PermissionGuard;
