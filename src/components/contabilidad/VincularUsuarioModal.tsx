import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../UI';
import { clientesContablesApi } from '../../services/contabilidadService';

interface UsuarioDisponible {
  _id: string;
  clerkId: string;
  email: string;
  nombre: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role: string;
}

interface VincularUsuarioModalProps {
  onClose: () => void;
  onVincular: (userId: string) => Promise<void>;
}

const ROLE_LABELS: Record<string, string> = {
  CLIENT: 'Cliente',
  USER: 'Usuario',
  MODERATOR: 'Moderador',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin'
};

const ROLE_COLORS: Record<string, string> = {
  CLIENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  USER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  MODERATOR: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  ADMIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  SUPER_ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

/**
 * 🔗 Modal para vincular un usuario del sistema a un cliente contable
 * Muestra búsqueda con lista de usuarios disponibles (no vinculados a otro cliente)
 */
const VincularUsuarioModal: React.FC<VincularUsuarioModalProps> = ({ onClose, onVincular }) => {
  const [search, setSearch] = useState('');
  const [usuarios, setUsuarios] = useState<UsuarioDisponible[]>([]);
  const [loading, setLoading] = useState(false);
  const [vinculando, setVinculando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UsuarioDisponible | null>(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0, hasNext: false });
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const buscarUsuarios = useCallback(async (searchTerm: string, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientesContablesApi.getUsuariosDisponibles(searchTerm, page);
      if (response.success) {
        setUsuarios(response.data.usuarios);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error buscando usuarios:', err);
      setError('Error al buscar usuarios disponibles');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar usuarios al abrir el modal
  useEffect(() => {
    buscarUsuarios('');
    // Focus en el input de búsqueda
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [buscarUsuarios]);

  // Debounce de búsqueda
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      buscarUsuarios(search);
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search, buscarUsuarios]);

  const handleVincular = async () => {
    if (!selectedUser) return;
    setVinculando(true);
    setError(null);
    try {
      await onVincular(selectedUser._id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al vincular usuario';
      setError(message);
      setVinculando(false);
    }
  };

  const handlePageChange = (page: number) => {
    buscarUsuarios(search, page);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">🔗 Vincular Usuario</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Selecciona un usuario del sistema para vincularlo al cliente contable
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Búsqueda */}
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar por nombre, email o username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
            ⚠️ {error}
          </div>
        )}

        {/* Lista de usuarios */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && usuarios.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <span className="ml-3 text-gray-500 dark:text-gray-400">Buscando usuarios...</span>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">👤</div>
              <div className="text-gray-500 dark:text-gray-400 font-medium">
                {search ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {search ? 'Intenta con otro término de búsqueda' : 'Todos los usuarios ya están vinculados'}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Contador de resultados */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {pagination.total} usuario{pagination.total !== 1 ? 's' : ''} disponible{pagination.total !== 1 ? 's' : ''}
                {search && ` para "${search}"`}
              </div>

              {usuarios.map((usuario) => (
                <button
                  key={usuario._id}
                  onClick={() => setSelectedUser(selectedUser?._id === usuario._id ? null : usuario)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedUser?._id === usuario._id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                      : 'border-transparent bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {usuario.profileImage ? (
                        <img
                          src={usuario.profileImage}
                          alt={usuario.nombre}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {(usuario.nombre || usuario.email)[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {usuario.nombre}
                        </span>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[usuario.role] || ROLE_COLORS.USER}`}>
                          {ROLE_LABELS[usuario.role] || usuario.role}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {usuario.email}
                      </div>
                    </div>

                    {/* Checkmark */}
                    {selectedUser?._id === usuario._id && (
                      <div className="flex-shrink-0 text-blue-600 dark:text-blue-400">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>

        {/* Footer - Usuario seleccionado y botones */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          {selectedUser ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Vincular: <span className="font-semibold text-gray-900 dark:text-white">{selectedUser.nombre}</span>
                  <span className="text-gray-400 dark:text-gray-500 ml-1">({selectedUser.email})</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={onClose} disabled={vinculando}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleVincular} disabled={vinculando}>
                  {vinculando ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Vinculando...
                    </span>
                  ) : (
                    '🔗 Vincular Usuario'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Selecciona un usuario de la lista
              </div>
              <Button variant="secondary" size="sm" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VincularUsuarioModal;
