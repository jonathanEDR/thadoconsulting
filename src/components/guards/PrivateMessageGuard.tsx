/**
 * 🔒 PRIVATE MESSAGE GUARD
 * Filtra mensajes privados para usuarios cliente
 */

import { useUser } from '@clerk/clerk-react';
import { UserRole } from '../../types/roles';
import type { LeadMessage } from '../../types/message.types';

interface PrivateMessageGuardProps {
  messages: LeadMessage[];
  children: (filteredMessages: LeadMessage[]) => React.ReactNode;
}

/**
 * Guard que filtra mensajes privados según el rol del usuario
 */
export function PrivateMessageGuard({ messages, children }: PrivateMessageGuardProps) {
  const { user } = useUser();
  const userRole = (user?.publicMetadata?.role as UserRole) || UserRole.USER;

  // Roles que pueden ver mensajes privados
  const canViewPrivate = userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN;

  // Filtrar mensajes según permisos
  const filteredMessages = canViewPrivate
    ? messages // Admin ve todo
    : messages.filter((msg) => !msg.esPrivado); // Cliente solo ve públicos

  return <>{children(filteredMessages)}</>;
}

/**
 * Hook para filtrar mensajes según rol
 */
export function useFilterPrivateMessages(messages: LeadMessage[]): LeadMessage[] {
  const { user } = useUser();
  const userRole = (user?.publicMetadata?.role as UserRole) || UserRole.USER;

  const canViewPrivate = userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN;

  return canViewPrivate
    ? messages
    : messages.filter((msg) => !msg.esPrivado && msg.tipo !== 'nota_interna');
}

/**
 * Verifica si un mensaje específico debe ser visible
 */
export function useCanViewMessage(message: LeadMessage): boolean {
  const { user } = useUser();
  const userRole = (user?.publicMetadata?.role as UserRole) || UserRole.USER;

  // Admin puede ver todo
  if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Cliente no puede ver notas internas ni mensajes privados
  if (message.esPrivado || message.tipo === 'nota_interna') {
    return false;
  }

  return true;
}

export default PrivateMessageGuard;
