/**
 * 🔀 Dashboard Router
 * Redirige al dashboard correcto según el rol del usuario
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente que redirige al dashboard correcto según el rol del usuario
 * - USER/CLIENT → /dashboard/client
 * - ADMIN/MODERATOR/SUPER_ADMIN → /dashboard/admin
 */
export default function DashboardRouter() {
  const { role, isLoading, shouldUseClientDashboard, canAccessAdmin } = useAuth();

  // Mostrar loading mientras carga el rol
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-t-4 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Cargando dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Si no hay rol, redirigir al login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir según el tipo de dashboard que debe usar
  if (shouldUseClientDashboard) {
    return <Navigate to="/dashboard/client" replace />;
  }

  if (canAccessAdmin) {
    return <Navigate to="/dashboard/admin" replace />;
  }

  // Fallback: redirigir a client dashboard
  return <Navigate to="/dashboard/client" replace />;
}
