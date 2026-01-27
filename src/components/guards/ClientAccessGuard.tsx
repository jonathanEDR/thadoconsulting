/**
 * 🚪 CLIENT ACCESS GUARD
 * Verifica permisos de acceso para funcionalidades cliente
 */

import { useUser } from '@clerk/clerk-react';
import { UserRole } from '../../types/roles';

/**
 * Hook para verificar si el usuario tiene permisos de admin
 */
export function useIsAdmin(): boolean {
  const { user } = useUser();
  const userRole = (user?.publicMetadata?.role as UserRole) || UserRole.USER;

  return userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MODERATOR;
}

/**
 * Hook para verificar si el usuario es cliente
 */
export function useIsClient(): boolean {
  const { user } = useUser();
  const userRole = (user?.publicMetadata?.role as UserRole) || UserRole.USER;

  return userRole === UserRole.CLIENT || userRole === UserRole.USER;
}

/**
 * Hook para verificar permisos específicos del cliente
 */
export function useClientPermissions() {
  const { user } = useUser();
  const userRole = (user?.publicMetadata?.role as UserRole) || UserRole.USER;
  const isAdmin = userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MODERATOR;

  return {
    // Permisos de visualización
    canViewPrivateMessages: isAdmin,
    canViewAllLeads: isAdmin,
    canViewInternalNotes: isAdmin,
    canViewTemplates: isAdmin,
    canViewStats: true, // Todos pueden ver stats básicas
    
    // Permisos de acción
    canDeleteMessages: isAdmin,
    canEditLeads: isAdmin,
    canAssignLeads: isAdmin,
    canCreateTemplates: isAdmin,
    canSendInternalNotes: isAdmin,
    canReplyToMessages: true, // Cliente puede responder
    canCreateMessages: true, // Cliente puede enviar mensajes
    canMarkAsRead: true, // Cliente puede marcar como leído
    
    // Info del rol
    userRole,
    isAdmin,
    isClient: !isAdmin,
  };
}

/**
 * Componente Guard para restringir acceso a funcionalidades
 */
interface ClientAccessGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireClient?: boolean;
  fallback?: React.ReactNode;
}

export function ClientAccessGuard({
  children,
  requireAdmin = false,
  requireClient = false,
  fallback = null,
}: ClientAccessGuardProps) {
  const { user } = useUser();
  const userRole = (user?.publicMetadata?.role as UserRole) || UserRole.USER;
  
  const isAdmin = userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MODERATOR;
  const isClient = userRole === UserRole.CLIENT || userRole === UserRole.USER;

  // Verificar permisos
  if (requireAdmin && !isAdmin) {
    return <>{fallback}</>;
  }

  if (requireClient && !isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook para ocultar elementos según permisos
 */
export function useHideForClient() {
  const { isClient } = useClientPermissions();
  return isClient;
}

/**
 * Hook para ocultar elementos según permisos de admin
 */
export function useShowOnlyForAdmin() {
  const { isAdmin } = useClientPermissions();
  return isAdmin;
}

export default ClientAccessGuard;
