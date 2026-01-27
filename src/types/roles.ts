/**
 * 🔐 Sistema de Roles - Tipos TypeScript
 * Debe coincidir con la configuración del backend
 * Backend: backend/config/roles.js
 */

// ============================================
// ENUMS DE ROLES
// ============================================

/**
 * Roles disponibles en el sistema
 * Jerarquía: SUPER_ADMIN (5) > ADMIN (4) > MODERATOR (3) > CLIENT (2) > USER (1)
 */
export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  CLIENT: 'CLIENT',
  USER: 'USER'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// ============================================
// JERARQUÍA DE ROLES
// ============================================

/**
 * Jerarquía numérica de roles
 * Mayor número = Mayor privilegio
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 5,
  [UserRole.ADMIN]: 4,
  [UserRole.MODERATOR]: 3,
  [UserRole.CLIENT]: 2,
  [UserRole.USER]: 1,
};

/**
 * Información visual de los roles
 */
export const ROLE_INFO: Record<UserRole, { icon: string; label: string; color: string; description: string }> = {
  [UserRole.SUPER_ADMIN]: {
    icon: '👑',
    label: 'Super Admin',
    color: 'red',
    description: 'Control total del sistema'
  },
  [UserRole.ADMIN]: {
    icon: '⚡',
    label: 'Administrador',
    color: 'purple',
    description: 'Gestión de usuarios y contenido'
  },
  [UserRole.MODERATOR]: {
    icon: '🛡️',
    label: 'Moderador',
    color: 'blue',
    description: 'Moderación de contenido'
  },
  [UserRole.CLIENT]: {
    icon: '💼',
    label: 'Cliente',
    color: 'green',
    description: 'Acceso a servicios contratados'
  },
  [UserRole.USER]: {
    icon: '👤',
    label: 'Usuario',
    color: 'gray',
    description: 'Acceso básico'
  }
};

// ============================================
// ENUMS DE PERMISOS
// ============================================

/**
 * Permisos específicos del sistema
 */
export const Permission = {
  // Gestión de usuarios
  MANAGE_USERS: 'MANAGE_USERS',
  VIEW_USERS: 'VIEW_USERS',
  
  // Gestión de contenido CMS
  MANAGE_CONTENT: 'MANAGE_CONTENT',
  MODERATE_CONTENT: 'MODERATE_CONTENT',
  VIEW_CONTENT: 'VIEW_CONTENT',
  
  // Gestión de servicios
  MANAGE_SERVICES: 'MANAGE_SERVICES',
  VIEW_SERVICES: 'VIEW_SERVICES',
  
  // Gestión de uploads
  MANAGE_UPLOADS: 'MANAGE_UPLOADS',
  UPLOAD_FILES: 'UPLOAD_FILES',
  
  // Analytics y reportes
  VIEW_ANALYTICS: 'VIEW_ANALYTICS',
  EXPORT_DATA: 'EXPORT_DATA',
  
  // Configuración del sistema
  MANAGE_SYSTEM: 'MANAGE_SYSTEM',
  VIEW_LOGS: 'VIEW_LOGS',
  
  // Gestión de roles
  ASSIGN_ROLES: 'ASSIGN_ROLES',
  VIEW_ROLES: 'VIEW_ROLES'
} as const;

export type Permission = typeof Permission[keyof typeof Permission];

// ============================================
// MATRIZ DE PERMISOS POR ROL
// ============================================

/**
 * Define qué permisos tiene cada rol
 * Debe coincidir con backend/config/roles.js
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // Todos los permisos
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.MANAGE_CONTENT,
    Permission.MODERATE_CONTENT,
    Permission.VIEW_CONTENT,
    Permission.MANAGE_SERVICES,
    Permission.VIEW_SERVICES,
    Permission.MANAGE_UPLOADS,
    Permission.UPLOAD_FILES,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
    Permission.MANAGE_SYSTEM,
    Permission.VIEW_LOGS,
    Permission.ASSIGN_ROLES,
    Permission.VIEW_ROLES
  ],
  
  [UserRole.ADMIN]: [
    // Gestión completa excepto sistema
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.MANAGE_CONTENT,
    Permission.MODERATE_CONTENT,
    Permission.VIEW_CONTENT,
    Permission.MANAGE_SERVICES,
    Permission.VIEW_SERVICES,
    Permission.MANAGE_UPLOADS,
    Permission.UPLOAD_FILES,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
    Permission.VIEW_LOGS,
    Permission.ASSIGN_ROLES,
    Permission.VIEW_ROLES
  ],
  
  [UserRole.MODERATOR]: [
    // Moderación y gestión limitada
    Permission.VIEW_USERS,
    Permission.MODERATE_CONTENT,
    Permission.VIEW_CONTENT,
    Permission.MANAGE_CONTENT,
    Permission.VIEW_SERVICES,
    Permission.MANAGE_UPLOADS,
    Permission.UPLOAD_FILES,
    Permission.VIEW_ANALYTICS
  ],
  
  [UserRole.CLIENT]: [
    // Acceso a servicios y uploads
    Permission.VIEW_CONTENT,
    Permission.VIEW_SERVICES,
    Permission.UPLOAD_FILES
  ],
  
  [UserRole.USER]: [
    // Solo lectura básica
    Permission.VIEW_CONTENT,
    Permission.VIEW_SERVICES
  ]
};

// ============================================
// INTERFACES
// ============================================

/**
 * Usuario completo con rol desde el backend
 */
export interface UserWithRole {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  fullName?: string;
  profileImage?: string;
  emailVerified: boolean;
  
  // Sistema de roles
  role: UserRole;
  customPermissions?: Permission[];
  isActive: boolean;
  
  // Metadatos de roles
  roleAssignedBy?: string;
  roleAssignedAt?: string;
  lastLogin?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  clerkCreatedAt?: string;
  clerkUpdatedAt?: string;
}

/**
 * Respuesta del backend para getCurrentUser
 */
export interface GetCurrentUserResponse {
  success: boolean;
  user: UserWithRole;
  message?: string;
}

/**
 * Respuesta del backend para syncUser
 */
export interface SyncUserResponse {
  success: boolean;
  user: UserWithRole;
  synced: boolean;
  message?: string;
  leadLinking?: {
    success: boolean;
    message: string;
    leadsLinked: number;
    linkedLeads?: Array<{
      id: string;
      nombre: string;
    }>;
  };
  onboarding?: {
    success: boolean;
    message: string;
    onboarding?: {
      leadCreated: boolean;
      messagesSent: number;
      leadId: string;
      leadName: string;
    };
  };
}

/**
 * Filtros para obtener lista de usuarios (admin)
 */
export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'email' | 'role' | 'lastLogin';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Respuesta paginada de usuarios
 */
export interface UsersListResponse {
  success: boolean;
  data: {
    users: UserWithRole[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
  message?: string;
}

/**
 * Estadísticas de usuarios (admin)
 */
export interface UserStats {
  totalUsers: number;
  usersByRole: Record<UserRole, number>;
  activeUsers: number;
  inactiveUsers: number;
  recentUsers: number;
  growth?: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

/**
 * Respuesta de estadísticas
 */
export interface StatsResponse {
  success: boolean;
  data: UserStats;
  message?: string;
}

/**
 * Request para asignar rol
 */
export interface AssignRoleRequest {
  role: UserRole;
}

/**
 * Request para cambiar estado de usuario
 */
export interface ToggleStatusRequest {
  isActive: boolean;
}

/**
 * Respuesta genérica de operaciones admin
 */
export interface AdminOperationResponse {
  success: boolean;
  data?: any;
  message: string;
}

/**
 * Información de roles disponibles
 */
export interface RoleInfoResponse {
  success: boolean;
  data: {
    roles: Array<{
      name: UserRole;
      level: number;
      permissions: Permission[];
      icon: string;
      label: string;
      description: string;
    }>;
  };
  message?: string;
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Verifica si un rol puede gestionar otro rol (por jerarquía)
 */
export function canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole];
}

/**
 * Obtiene todos los permisos de un rol
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Verifica si un usuario tiene múltiples permisos
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  const rolePermissions = getRolePermissions(role);
  return permissions.every(permission => rolePermissions.includes(permission));
}

/**
 * Verifica si un usuario tiene al menos uno de los permisos
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  const rolePermissions = getRolePermissions(role);
  return permissions.some(permission => rolePermissions.includes(permission));
}

/**
 * Obtiene roles que puede asignar un usuario
 */
export function getAssignableRoles(currentRole: UserRole): UserRole[] {
  const currentLevel = ROLE_HIERARCHY[currentRole];
  return Object.entries(ROLE_HIERARCHY)
    .filter(([_, level]) => level < currentLevel)
    .map(([role]) => role as UserRole);
}

/**
 * Formatea el nombre completo de un usuario
 */
export function formatUserName(user: UserWithRole): string {
  if (user.fullName) return user.fullName;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  if (user.lastName) return user.lastName;
  if (user.username) return user.username;
  return user.email.split('@')[0];
}

/**
 * Obtiene el color del badge según el rol
 */
export function getRoleBadgeColor(role: UserRole): string {
  return ROLE_INFO[role]?.color || 'gray';
}

/**
 * Verifica si el usuario es administrador (ADMIN o SUPER_ADMIN)
 */
export function isAdmin(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
}

/**
 * Normaliza un rol a formato estándar (UPPERCASE)
 * @param role - Rol a normalizar
 * @returns Rol normalizado o null si es inválido
 */
export function normalizeRole(role: any): UserRole | null {
  if (!role || typeof role !== 'string') {
    return null;
  }

  const normalized = role.toUpperCase().trim() as UserRole;
  const validRoles = Object.values(UserRole);
  
  return validRoles.includes(normalized) ? normalized : null;
}

/**
 * Verifica si el usuario puede acceder al dashboard administrativo (case-insensitive)
 */
export function canAccessAdminDashboard(role: UserRole | string): boolean {
  const normalizedRole = normalizeRole(role);
  if (!normalizedRole) return false;

  const adminRoles: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR];
  return adminRoles.includes(normalizedRole);
}

/**
 * Verifica si el usuario debe usar el dashboard de cliente (case-insensitive)
 */
export function shouldUseClientDashboard(role: UserRole | string): boolean {
  const normalizedRole = normalizeRole(role);
  if (!normalizedRole) return false;

  const clientRoles: UserRole[] = [UserRole.USER, UserRole.CLIENT];
  return clientRoles.includes(normalizedRole);
}
