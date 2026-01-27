/**
 * 👥 Gestión de Usuarios - Panel Administrativo
 * 
 * Funcionalidades:
 * - Ver lista de usuarios con paginación
 * - Buscar usuarios por nombre/email
 * - Filtrar por rol y estado (activo/inactivo)
 * - Asignar roles (respetando jerarquía)
 * - Activar/Desactivar usuarios
 * - Estadísticas de usuarios
 * 
 * Permisos requeridos: MANAGE_USERS (solo ADMIN y SUPER_ADMIN)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/adminService';
import { useUsersCache } from '../../hooks/useDashboardCache';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import RoleBadge from '../../components/RoleBadge';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';
import {
  UserRole,
  Permission,
  type UserWithRole,
  type UserFilters,
  type UserStats,
  ROLE_INFO,
  getAssignableRoles,
  formatUserName
} from '../../types/roles';

interface UsersManagementData {
  users: UserWithRole[];
  stats: UserStats | null;
  pagination: {
    pages: number;
    total: number;
  };
}

export default function UsersManagement() {
  const { user: currentUser, role: currentRole, hasPermission } = useAuth();
  const { getToken } = useClerkAuth();
  const { headerGradient } = useDashboardHeaderGradient();
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | ''>('');
  const [filterStatus, setFilterStatus] = useState<'active' | 'inactive' | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  // Cache key basado en filtros
  const cacheKey = useMemo(() => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: usersPerPage.toString(),
      ...(searchTerm.trim() && { search: searchTerm.trim() }),
      ...(filterRole && { role: filterRole }),
      ...(filterStatus && { status: filterStatus })
    });
    return `users-${params.toString()}`;
  }, [currentPage, searchTerm, filterRole, filterStatus]);

  // Hook de cache para usuarios
  const {
    data: usersData,
    loading: isLoading,
    error: cacheError,
    refetch: refreshUsers
  } = useUsersCache(
    useCallback(async (): Promise<UsersManagementData> => {
      const token = await getToken();
      if (!token) throw new Error('Token no disponible');

      const filters: UserFilters = {
        page: currentPage,
        limit: usersPerPage,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      if (searchTerm.trim()) filters.search = searchTerm.trim();
      if (filterRole) filters.role = filterRole;
      if (filterStatus === 'active') filters.isActive = true;
      else if (filterStatus === 'inactive') filters.isActive = false;

      // Cargar usuarios y estadísticas en paralelo
      const [usersResponse, statsData] = await Promise.all([
        adminService.getUsers(token, filters),
        adminService.getStats(token).catch(() => null) // No es crítico si falla
      ]);

      return {
        users: usersResponse.users,
        stats: statsData,
        pagination: usersResponse.pagination
      };
    }, [getToken, currentPage, searchTerm, filterRole, filterStatus]),
    cacheKey
  );

  // Estados derivados del cache
  const users = usersData?.users || [];
  const stats = usersData?.stats || null;
  const totalPages = usersData?.pagination?.pages || 1;
  const error = cacheError;
  
  // Modal de asignación de rol
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState<UserRole | ''>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Verificar permisos
  const canManageUsers = hasPermission(Permission.MANAGE_USERS);

  /**
   * Buscar con debounce
   */
  useEffect(() => {
    if (!canManageUsers) return;

    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Resetear a primera página cuando cambie la búsqueda
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, canManageUsers]);

  /**
   * Abrir modal de asignación de rol
   */
  const handleOpenRoleModal = (user: UserWithRole) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleModalOpen(true);
  };

  /**
   * Cerrar modal de asignación de rol
   */
  const handleCloseRoleModal = () => {
    setSelectedUser(null);
    setNewRole('');
    setIsRoleModalOpen(false);
    setIsUpdating(false);
  };

  /**
   * Asignar nuevo rol a usuario
   */
  const handleAssignRole = async () => {
    if (!selectedUser || !newRole || newRole === selectedUser.role) {
      return;
    }

    // Validación: no puedes cambiar tu propio rol
    if (selectedUser._id === currentUser?._id) {
      alert('No puedes cambiar tu propio rol');
      return;
    }

    try {
      setIsUpdating(true);
      const token = await getToken();
      if (!token) throw new Error('Token no disponible');
      
      await adminService.assignRole(token, selectedUser._id, newRole);
      
      // Invalidar cache y recargar datos
      await refreshUsers();
      
      handleCloseRoleModal();
      alert(`Rol actualizado exitosamente a ${ROLE_INFO[newRole].label}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al asignar rol';
      alert(`Error: ${errorMessage}`);
      console.error('Error asignando rol:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Cambiar estado de usuario (activo/inactivo)
   */
  const handleToggleUserStatus = async (user: UserWithRole) => {
    // Validación: no puedes desactivar tu propia cuenta
    if (user._id === currentUser?._id) {
      alert('No puedes desactivar tu propia cuenta');
      return;
    }

    const newStatus = !user.isActive;
    const action = newStatus ? 'activar' : 'desactivar';

    if (!confirm(`¿Estás seguro de ${action} a ${formatUserName(user)}?`)) {
      return;
    }

    try {
      const token = await getToken();
      if (!token) throw new Error('Token no disponible');
      
      await adminService.toggleUserStatus(token, user._id, newStatus);
      
      // Invalidar cache y recargar datos
      await refreshUsers();
      
      alert(`Usuario ${action === 'activar' ? 'activado' : 'desactivado'} exitosamente`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Error al ${action} usuario`;
      alert(`Error: ${errorMessage}`);
      console.error('Error cambiando estado:', err);
    }
  };

  /**
   * Limpiar filtros
   */
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterRole('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  // Si no tiene permisos
  if (!canManageUsers) {
    return (
      <SmartDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Acceso Denegado
            </h2>
            <p className="text-slate-600 dark:text-gray-400">
              No tienes permisos para gestionar usuarios.
            </p>
          </div>
        </div>
      </SmartDashboardLayout>
    );
  }

  return (
    <SmartDashboardLayout>
      <div className="w-full space-y-6">
        {/* Header - 🎨 Usando gradiente dinámico del sidebar */}
        <div 
          className="rounded-xl p-6 text-white shadow-xl"
          style={{ background: headerGradient }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">👥</span>
            <div>
              <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
              <p className="text-white/90">
                Administra usuarios y roles del sistema
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-2xl">
                  👥
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {stats.totalUsers}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-gray-400">Total Usuarios</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-2xl">
                  ✅
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {stats.activeUsers}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-gray-400">Activos</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-2xl">
                  ⚠️
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {stats.inactiveUsers}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-gray-400">Inactivos</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-2xl">
                  ✨
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {stats.recentUsers}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-gray-400">Últimos 30 días</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros y Búsqueda */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-gray-700 w-full overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:items-end">
            {/* Búsqueda */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                🔍 Buscar Usuario
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="w-full px-3 sm:px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Filtro por Rol */}
            <div className="lg:flex-shrink-0 lg:w-40">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                🎭 Rol
              </label>
              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value as UserRole | '');
                  setCurrentPage(1);
                }}
                className="w-full px-3 sm:px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all text-sm"
              >
                <option value="">Todos los roles</option>
                {Object.values(UserRole).map((role) => (
                  <option key={role} value={role}>
                    {ROLE_INFO[role].icon} {ROLE_INFO[role].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Estado */}
            <div className="lg:flex-shrink-0 lg:w-40">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                📊 Estado
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as 'active' | 'inactive' | '');
                  setCurrentPage(1);
                }}
                className="w-full px-3 sm:px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all text-sm"
              >
                <option value="">Todos</option>
                <option value="active">✅ Activos</option>
                <option value="inactive">⚠️ Inactivos</option>
              </select>
            </div>

            {/* Botón Limpiar */}
            {(searchTerm || filterRole || filterStatus) && (
              <div className="flex items-end w-full sm:w-auto">
                <button
                  onClick={handleClearFilters}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-300 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  🔄 Limpiar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-slate-200 dark:border-gray-700 overflow-hidden w-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-500 dark:text-red-400">❌ {error}</p>
              <button
                onClick={refreshUsers}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔄 Reintentar
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-slate-600 dark:text-gray-400">
              <p className="text-4xl mb-2">🔍</p>
              <p>No se encontraron usuarios</p>
            </div>
          ) : (
            <>
              {/* Tabla Desktop */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full">
                  <thead className="bg-slate-100 dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                        Último Login
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
                    {users.map((user: UserWithRole) => {
                      const isCurrentUser = user._id === currentUser?._id;
                      const assignableRoles = currentRole ? getAssignableRoles(currentRole) : [];
                      const canEditThisUser = !isCurrentUser && assignableRoles.length > 0;

                      return (
                        <tr 
                          key={user._id}
                          className={`hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors ${
                            isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          {/* Usuario */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {user.profileImage ? (
                                <img
                                  src={user.profileImage}
                                  alt={formatUserName(user)}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-gray-600"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm border-2 border-slate-200 dark:border-gray-600">
                                  {formatUserName(user).charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-slate-800 dark:text-white">
                                  {formatUserName(user)}
                                  {isCurrentUser && (
                                    <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                                      Tú
                                    </span>
                                  )}
                                </p>
                                {user.username && (
                                  <p className="text-sm text-slate-500 dark:text-gray-400">
                                    @{user.username}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm text-slate-600 dark:text-gray-300">
                              {user.email}
                            </p>
                          </td>

                          {/* Rol */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <RoleBadge role={user.role} size="md" />
                          </td>

                          {/* Estado */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                              user.isActive
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            }`}>
                              {user.isActive ? '✅ Activo' : '⚠️ Inactivo'}
                            </span>
                          </td>

                          {/* Último Login */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-gray-400">
                            {user.lastLogin 
                              ? new Date(user.lastLogin).toLocaleDateString('es-ES', { 
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : 'Nunca'
                            }
                          </td>

                          {/* Acciones */}
                          <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                            {canEditThisUser && (
                              <>
                                <button
                                  onClick={() => handleOpenRoleModal(user)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                                  title="Cambiar rol"
                                >
                                  🎭 Rol
                                </button>
                                <button
                                  onClick={() => handleToggleUserStatus(user)}
                                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-white text-xs rounded-lg transition-colors ${
                                    user.isActive
                                      ? 'bg-orange-500 hover:bg-orange-600'
                                      : 'bg-green-500 hover:bg-green-600'
                                  }`}
                                  title={user.isActive ? 'Desactivar' : 'Activar'}
                                >
                                  {user.isActive ? '⚠️ Desactivar' : '✅ Activar'}
                                </button>
                              </>
                            )}
                            {isCurrentUser && (
                              <span className="text-xs text-slate-500 dark:text-gray-400 italic">
                                No puedes editarte
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Cards Mobile */}
              <div className="md:hidden space-y-3 p-3 sm:p-4">
                {users.map((user: UserWithRole) => {
                  const isCurrentUser = user._id === currentUser?._id;
                  const assignableRoles = currentRole ? getAssignableRoles(currentRole) : [];
                  const canEditThisUser = !isCurrentUser && assignableRoles.length > 0;

                  return (
                    <div
                      key={user._id}
                      className={`p-3 sm:p-4 border rounded-lg text-sm ${
                        isCurrentUser
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={formatUserName(user)}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {formatUserName(user).charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-slate-800 dark:text-white">
                            {formatUserName(user)}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                                Tú
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-gray-400">Rol:</span>
                          <RoleBadge role={user.role} size="sm" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-gray-400">Estado:</span>
                          <span className={`text-xs font-medium ${
                            user.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {user.isActive ? '✅ Activo' : '⚠️ Inactivo'}
                          </span>
                        </div>
                      </div>

                      {canEditThisUser && (
                        <div className="flex gap-2 flex-col sm:flex-row">
                          <button
                            onClick={() => handleOpenRoleModal(user)}
                            className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm rounded-lg transition-colors"
                          >
                            🎭 Cambiar Rol
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user)}
                            className={`flex-1 px-3 py-2 text-white text-xs sm:text-sm rounded-lg transition-colors ${
                              user.isActive
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                          >
                            {user.isActive ? '⚠️ Desactivar' : '✅ Activar'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="px-3 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-gray-900 border-t border-slate-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 text-sm">
                  <p className="text-slate-600 dark:text-gray-400">
                    Página {currentPage} de {totalPages}
                  </p>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-300 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      ← Anterior
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-300 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de Asignación de Rol */}
      {isRoleModalOpen && selectedUser && currentRole && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full my-8 p-4 sm:p-6 border border-slate-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                🎭 Cambiar Rol
              </h3>
              <button
                onClick={handleCloseRoleModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Usuario seleccionado */}
              <div className="p-4 bg-slate-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Usuario:</p>
                <div className="flex items-center gap-3">
                  {selectedUser.profileImage ? (
                    <img
                      src={selectedUser.profileImage}
                      alt={formatUserName(selectedUser)}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {formatUserName(selectedUser).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">
                      {formatUserName(selectedUser)}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-gray-400">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rol actual */}
              <div>
                <p className="text-sm text-slate-600 dark:text-gray-400 mb-2">Rol actual:</p>
                <RoleBadge role={selectedUser.role} size="md" />
              </div>

              {/* Nuevo rol */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Nuevo rol:
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Selecciona un rol</option>
                  {getAssignableRoles(currentRole).map((role) => (
                    <option key={role} value={role}>
                      {ROLE_INFO[role].icon} {ROLE_INFO[role].label} - {ROLE_INFO[role].description}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">
                  ℹ️ Solo puedes asignar roles de menor jerarquía que la tuya.
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseRoleModal}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAssignRole}
                  disabled={isUpdating || !newRole || newRole === selectedUser.role}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isUpdating ? '⏳ Guardando...' : '💾 Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SmartDashboardLayout>
  );
}
