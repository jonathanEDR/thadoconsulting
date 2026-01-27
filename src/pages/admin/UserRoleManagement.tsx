/**
 * 🎯 GESTIÓN DE ROLES DE USUARIOS
 * Panel de administración para promover usuarios de USER a CLIENT
 */

import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import { getEligibleUsers, promoteUserToClient, getRoleStatistics, type UserEligible } from '../../services/roleManagementService';
import { CheckCircle, XCircle, Clock, TrendingUp, Users, Award, UserCheck } from 'lucide-react';

export default function UserRoleManagement() {
  // const navigate = useNavigate();

  // ========================================
  // 📊 STATE
  // ========================================
  const [users, setUsers] = useState<UserEligible[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserEligible[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPromoting, setIsPromoting] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserEligible | null>(null);
  const [promotionNotes, setPromotionNotes] = useState('');
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ========================================
  // 🔄 EFFECTS
  // ========================================
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  // ========================================
  // 📊 FUNCIONES DE CARGA
  // ========================================
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersResult, statsResult] = await Promise.all([
        getEligibleUsers(),
        getRoleStatistics()
      ]);

      if (usersResult.success) {
        setUsers(usersResult.users);
        setFilteredUsers(usersResult.users);
      }

      if (statsResult.success) {
        setStatistics(statsResult.statistics);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setErrorMessage('Error cargando datos de usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(term) ||
      user.fullName.toLowerCase().includes(term) ||
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term)
    );

    setFilteredUsers(filtered);
  };

  // ========================================
  // 🎯 FUNCIONES DE PROMOCIÓN
  // ========================================
  const handlePromoteClick = (user: UserEligible) => {
    setSelectedUser(user);
    setPromotionNotes('');
    setShowPromotionModal(true);
  };

  const handleConfirmPromotion = async () => {
    if (!selectedUser) return;

    setIsPromoting(selectedUser.clerkId);
    setShowPromotionModal(false);

    try {
      const result = await promoteUserToClient(selectedUser.clerkId, promotionNotes);

      if (result.success) {
        setSuccessMessage(`✅ ${selectedUser.fullName} ha sido promovido a CLIENT exitosamente`);
        
        // Remover usuario de la lista
        setUsers(prev => prev.filter(u => u.clerkId !== selectedUser.clerkId));
        
        // Recargar estadísticas
        const statsResult = await getRoleStatistics();
        if (statsResult.success) {
          setStatistics(statsResult.statistics);
        }

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setErrorMessage(result.error || 'Error en la promoción');
        setTimeout(() => setErrorMessage(null), 5000);
      }
    } catch (error) {
      console.error('Error promoviendo usuario:', error);
      setErrorMessage('Error inesperado al promover usuario');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsPromoting(null);
      setSelectedUser(null);
      setPromotionNotes('');
    }
  };

  // ========================================
  // 🎨 RENDER
  // ========================================
  return (
    <SmartDashboardLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestión de Roles de Usuarios</h1>
              <p className="text-indigo-100">Promueve usuarios USER a CLIENT y gestiona roles</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Award className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Mensajes de éxito/error */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Estadísticas */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Usuarios</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{statistics.total}</p>
                </div>
                <Users className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            {statistics.byRole.map((stat: any) => (
              <div key={stat.role} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.role}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.count}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-indigo-500" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Búsqueda */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="text-sm text-gray-600">
              {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Lista de usuarios */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Cargando usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay usuarios elegibles
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'No se encontraron usuarios con ese criterio de búsqueda' : 'Todos los usuarios USER han sido procesados'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Leads
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Mensajes
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Registrado
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.clerkId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.fullName}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold">
                                {user.firstName?.[0] || user.email[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{user.fullName}</p>
                            {user.username && (
                              <p className="text-sm text-gray-500">@{user.username}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{user.email}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {user.leadCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {user.messageCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handlePromoteClick(user)}
                          disabled={isPromoting === user.clerkId}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isPromoting === user.clerkId ? (
                            <>
                              <Clock className="w-4 h-4 animate-spin" />
                              Promoviendo...
                            </>
                          ) : (
                            <>
                              <Award className="w-4 h-4" />
                              Promover a CLIENT
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de confirmación */}
        {showPromotionModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Promover a CLIENT
                </h3>
                <p className="text-gray-600">
                  ¿Estás seguro de promover a <span className="font-semibold">{selectedUser.fullName}</span> al rol de CLIENT?
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={promotionNotes}
                  onChange={(e) => setPromotionNotes(e.target.value)}
                  placeholder="Razón de la promoción, comentarios adicionales..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>El usuario recibirá:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>✓ Rol actualizado a CLIENT</li>
                  <li>✓ Mensaje de bienvenida especial</li>
                  <li>✓ Acceso a funciones premium</li>
                  <li>✓ Actualización en sus leads</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPromotionModal(false);
                    setSelectedUser(null);
                    setPromotionNotes('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmPromotion}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Confirmar Promoción
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SmartDashboardLayout>
  );
}
