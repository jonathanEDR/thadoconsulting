/**
 * ⚡ Admin Dashboard
 * Dashboard completo para roles ADMIN, MODERATOR y SUPER_ADMIN
 * Incluye estadísticas, gestión y accesos administrativos
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import SmartDashboardLayout from '../components/SmartDashboardLayout';
import RoleBadge from '../components/RoleBadge';
import { Permission, type UserStats, formatUserName } from '../types/roles';
import { LoadingSpinner } from '../components/UI';
import { useDashboardHeaderGradient } from '../hooks/cms/useDashboardHeaderGradient';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, role, hasPermission } = useAuth();
  const { getToken } = useClerkAuth();
  const { headerGradient } = useDashboardHeaderGradient();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // ⚡ Optimización: Memoizar valores que no cambian
  const userName = useMemo(() => {
    return user ? formatUserName(user) : '';
  }, [user]);

  const canViewAnalytics = useMemo(() => {
    return hasPermission(Permission.VIEW_ANALYTICS);
  }, [hasPermission]);

  const canManageUsers = useMemo(() => {
    return hasPermission(Permission.MANAGE_USERS);
  }, [hasPermission]);

  const canManageContent = useMemo(() => {
    return hasPermission(Permission.MANAGE_CONTENT);
  }, [hasPermission]);

  const canManageUploads = useMemo(() => {
    return hasPermission(Permission.MANAGE_UPLOADS);
  }, [hasPermission]);

  const canManageSystem = useMemo(() => {
    return hasPermission(Permission.MANAGE_SYSTEM);
  }, [hasPermission]);

  // ⚡ Optimización: useCallback para evitar recreación de función
  const loadStats = useCallback(async () => {
    if (!user || !canViewAnalytics) {
      setStats(null);
      setIsLoadingStats(false);
      return;
    }

    try {
      setIsLoadingStats(true);
      setStatsError(null);

      const token = await getToken();
      
      if (token) {
        // ✅ Ahora usa cache de 8 horas
        const statsData = await adminService.getStats(token);
        setStats(statsData);
      }
    } catch (error) {
      console.error('[AdminDashboard] Error cargando estadísticas:', error);
      setStatsError('No se pudieron cargar las estadísticas');
    } finally {
      setIsLoadingStats(false);
    }
  }, [user, canViewAnalytics, getToken]);

  // ⚡ useEffect simplificado
  useEffect(() => {
    loadStats();
    document.title = 'Panel Administrativo | Web Scuti';
  }, [loadStats]);

  if (!user || !role) {
    return null;
  }

  return (
    <SmartDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header de Bienvenida Administrativo - 🎨 Usando gradiente dinámico del sidebar */}
        <div 
          className="rounded-2xl p-8 mb-8 text-white shadow-xl"
          style={{ background: headerGradient }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">⚡</span>
                Panel Administrativo
              </h1>
              <p className="text-white/90 text-lg">
                Bienvenido, {userName} - Gestiona el sistema desde aquí
              </p>
            </div>
            <div className="hidden md:block">
              <RoleBadge role={role} size="lg" />
            </div>
          </div>
        </div>

        {/* Estadísticas Generales */}
        {canViewAnalytics && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              Estadísticas del Sistema
            </h2>

            {isLoadingStats ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : statsError ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <p className="text-red-700 dark:text-red-300">{statsError}</p>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Usuarios */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                      👥
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats.totalUsers}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Usuarios
                      </p>
                    </div>
                  </div>
                </div>

                {/* Usuarios Activos */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-2xl">
                      ✓
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats.activeUsers}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Activos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Usuarios Inactivos */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-2xl">
                      ⚠
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats.inactiveUsers}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Inactivos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Usuarios Recientes */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                      ✨
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats.recentUsers}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Últimos 30 días
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Accesos Rápidos Administrativos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            Gestión del Sistema
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Gestión de Usuarios */}
            {canManageUsers && (
              <button
                onClick={() => navigate('/dashboard/admin/users')}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 group text-left w-full"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    👥
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Gestión de Usuarios
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Administrar usuarios y roles
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Visualiza, edita y asigna roles a los usuarios del sistema.
                </p>
              </button>
            )}

            {/* CMS */}
            {canManageContent && (
              <button
                onClick={() => navigate('/dashboard/cms')}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 group text-left w-full"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    📝
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Gestor de Contenido
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      CMS del sitio web
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Edita el contenido, SEO, temas y tarjetas del sitio.
                </p>
              </button>
            )}

            {/* Media Library */}
            {canManageUploads && (
              <button
                onClick={() => navigate('/dashboard/media')}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 group text-left w-full"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🖼️
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Biblioteca de Medios
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Gestión de imágenes
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Sube, organiza y gestiona imágenes del sistema.
                </p>
              </button>
            )}

            {/* Sistema de Agentes IA */}
            {canManageSystem && (
              <button
                onClick={() => navigate('/dashboard/ai-agents')}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 group border-2 border-purple-300 dark:border-purple-600 text-left w-full"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Agentes IA
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                      Sistema Inteligente
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Configura y monitorea el sistema de análisis AI, métricas y recomendaciones inteligentes.
                </p>
              </button>
            )}

            {/* Perfil */}
            <button
              onClick={() => navigate('/dashboard/profile')}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 group text-left w-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  👤
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Mi Perfil
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Información personal
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Gestiona tu información personal y preferencias.
              </p>
            </button>

          </div>
        </div>

        {/* Información del Administrador */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">📋</span>
            Tu Información
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                Email
              </span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {user.email}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                Nombre
              </span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {userName}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                Rol
              </span>
              <RoleBadge role={role} size="md" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                Miembro desde
              </span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {new Date(user.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SmartDashboardLayout>
  );
}
