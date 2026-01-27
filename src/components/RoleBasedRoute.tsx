/**
 * 🛡️ Componente para proteger rutas según roles
 * Verifica que el usuario tenga uno de los roles permitidos
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/roles';

// ============================================
// COMPONENTE DE LOADING
// ============================================

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center">
      <div className="relative inline-block">
        {/* Spinner animado */}
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-t-4 border-purple-600 dark:border-purple-400"></div>
        {/* Centro del spinner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
        Verificando permisos...
      </p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Un momento por favor
      </p>
    </div>
  </div>
);

// ============================================
// COMPONENTE DE ACCESO DENEGADO
// ============================================

interface AccessDeniedProps {
  requiredRoles: UserRole[];
  currentRole: UserRole | null;
}

const AccessDenied = ({ requiredRoles, currentRole }: AccessDeniedProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
      {/* Icono de error */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
        <svg 
          className="w-10 h-10 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>

      {/* Mensaje */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Acceso Denegado
      </h2>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        No tienes permisos para acceder a esta sección.
      </p>

      {/* Detalles */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-semibold">Tu rol actual:</span>{' '}
          <span className="inline-block px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">
            {currentRole || 'Sin rol'}
          </span>
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Roles requeridos:</span>{' '}
          {requiredRoles.map((role) => (
            <span 
              key={role}
              className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs mr-1 mt-1"
            >
              {role}
            </span>
          ))}
        </p>
      </div>

      {/* Botón para volver */}
      <button
        onClick={() => window.history.back()}
        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Volver atrás
      </button>

      {/* Link al dashboard */}
      <a
        href="/dashboard"
        className="inline-block mt-4 text-sm text-purple-600 dark:text-purple-400 hover:underline"
      >
        Ir al Dashboard
      </a>
    </div>
  </div>
);

// ============================================
// ROLE-BASED ROUTE
// ============================================

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
  showAccessDenied?: boolean;
}

/**
 * Componente para proteger rutas según roles
 * 
 * @param children - Contenido a mostrar si tiene permisos
 * @param allowedRoles - Array de roles que pueden acceder
 * @param redirectTo - Ruta a la que redirigir si no tiene permisos (por defecto: /dashboard)
 * @param fallback - Componente personalizado para mostrar si no tiene permisos
 * @param showAccessDenied - Mostrar pantalla de acceso denegado (por defecto: true)
 * 
 * @example
 * ```typescript
 * <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
 *   <AdminPanel />
 * </RoleBasedRoute>
 * ```
 * 
 * @example Con redirección personalizada
 * ```typescript
 * <RoleBasedRoute 
 *   allowedRoles={[UserRole.MODERATOR]} 
 *   redirectTo="/dashboard/client"
 * >
 *   <ModeratorPanel />
 * </RoleBasedRoute>
 * ```
 */
export default function RoleBasedRoute({ 
  children, 
  allowedRoles,
  redirectTo = '/dashboard',
  fallback,
  showAccessDenied = true
}: RoleBasedRouteProps) {
  const { role, isLoading, user } = useAuth();

  // Mostrar loading mientras carga
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si no hay rol asignado, redirigir
  if (!role) {
    console.warn('[RoleBasedRoute] Usuario sin rol asignado');
    return <Navigate to={redirectTo} replace />;
  }

  // Verificar si tiene uno de los roles permitidos
  const hasAccess = allowedRoles.includes(role);

  // Si no tiene acceso
  if (!hasAccess) {
    console.warn('[RoleBasedRoute] Acceso denegado:', {
      currentRole: role,
      requiredRoles: allowedRoles
    });

    // Si hay fallback personalizado, mostrarlo
    if (fallback) {
      return <>{fallback}</>;
    }

    // Si está configurado para mostrar pantalla de acceso denegado
    if (showAccessDenied) {
      return <AccessDenied requiredRoles={allowedRoles} currentRole={role} />;
    }

    // Por defecto, redirigir
    return <Navigate to={redirectTo} replace />;
  }

  // Si tiene acceso, mostrar el contenido
  return <>{children}</>;
}

// ============================================
// EXPORT ADICIONALES
// ============================================

/**
 * HOC (Higher Order Component) para proteger componentes por rol
 * 
 * @param Component - Componente a proteger
 * @param allowedRoles - Roles que pueden acceder
 * @returns Componente protegido
 * 
 * @example
 * ```typescript
 * const ProtectedAdmin = withRoleProtection(AdminPanel, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
 * 
 * function App() {
 *   return <ProtectedAdmin />;
 * }
 * ```
 */
export function withRoleProtection<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[],
  options?: Omit<RoleBasedRouteProps, 'children' | 'allowedRoles'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <RoleBasedRoute allowedRoles={allowedRoles} {...options}>
        <Component {...props} />
      </RoleBasedRoute>
    );
  };
}
