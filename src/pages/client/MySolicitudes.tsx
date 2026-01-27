import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { crmService, type Lead } from '../../services/crmService';
import { SolicitudTimeline, ActivityTimeline } from '../../components/crm/SolicitudTimeline';
import { StatusBadge, PriorityBadge } from '../../components/crm/Badges';

/**
 * 📋 Panel de Solicitudes del Cliente
 * Muestra todas las solicitudes del cliente con seguimiento visual de progreso
 * Integrado con el módulo de Mensajes
 */
const MySolicitudes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [solicitudes, setSolicitudes] = useState<Lead[]>([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'todas' | 'activas' | 'completadas'>('todas');

  useEffect(() => {
    loadSolicitudes();
  }, []);

  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener todas las solicitudes del cliente actual
      const response = await crmService.getClientLeads();
      setSolicitudes(response.data?.leads || []);
      
    } catch (error: any) {
      console.error('Error al cargar solicitudes:', error);
      setError(error.response?.data?.message || 'Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar solicitudes según el filtro activo
  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    if (filter === 'activas') {
      return !['completado', 'rechazado', 'cancelado', 'ganado', 'perdido'].includes(solicitud.estado);
    } else if (filter === 'completadas') {
      return ['completado', 'ganado'].includes(solicitud.estado);
    }
    return true; // 'todas'
  });

  // Estadísticas rápidas
  const estadisticas = {
    total: solicitudes.length,
    activas: solicitudes.filter(s => !['completado', 'rechazado', 'cancelado', 'ganado', 'perdido'].includes(s.estado)).length,
    completadas: solicitudes.filter(s => ['completado', 'ganado'].includes(s.estado)).length,
    rechazadas: solicitudes.filter(s => ['rechazado', 'perdido', 'cancelado'].includes(s.estado)).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando solicitudes...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-300">❌ {error}</p>
            <button
              onClick={loadSolicitudes}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 md:py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 mb-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                📋 Comunicación y Solicitudes
              </h1>
              <p className="text-green-100 text-sm md:text-lg">
                Seguimiento completo de todas tus solicitudes
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/client')}
              className="px-4 md:px-6 py-2 md:py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-all border border-white/30 text-sm md:text-base"
            >
              ← Volver
            </button>
          </div>
        </div>

        {/* Pestañas de navegación */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              onClick={() => navigate('/dashboard/client/messages')}
              className={`px-4 md:px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${
                location.pathname === '/dashboard/client/messages'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              💬 Mensajes
              {location.pathname === '/dashboard/client/messages' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
            <button
              onClick={() => navigate('/dashboard/client/solicitudes')}
              className={`px-4 md:px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${
                location.pathname === '/dashboard/client/solicitudes'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              📋 Mis Solicitudes
              {location.pathname === '/dashboard/client/solicitudes' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          </div>
        </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{estadisticas.total}</p>
            </div>
            <span className="text-4xl">📊</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Activas</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{estadisticas.activas}</p>
            </div>
            <span className="text-4xl">🚀</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completadas</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{estadisticas.completadas}</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">No Concretadas</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{estadisticas.rechazadas}</p>
            </div>
            <span className="text-4xl">❌</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('todas')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'todas'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          📊 Todas ({solicitudes.length})
        </button>
        <button
          onClick={() => setFilter('activas')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'activas'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          🚀 Activas ({estadisticas.activas})
        </button>
        <button
          onClick={() => setFilter('completadas')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'completadas'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          ✅ Completadas ({estadisticas.completadas})
        </button>
      </div>

      {/* Lista de Solicitudes */}
      {solicitudesFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-6xl mb-4">📭</p>
          <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No tienes solicitudes {filter !== 'todas' ? filter : ''}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {filter === 'todas' 
              ? 'Cuando realices una solicitud, aparecerá aquí'
              : `No hay solicitudes en la categoría "${filter}"`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {solicitudesFiltradas.map((solicitud) => (
            <div
              key={solicitud._id}
              onClick={() => setSelectedSolicitud(solicitud)}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group"
            >
              {/* Header de la Card */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {solicitud.tipoServicio.charAt(0).toUpperCase() + solicitud.tipoServicio.slice(1)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                      {solicitud.descripcionProyecto}
                    </p>
                  </div>
                  <StatusBadge estado={solicitud.estado} size="sm" />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <PriorityBadge prioridad={solicitud.prioridad} size="sm" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Creada: {new Date(solicitud.createdAt).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Timeline Mini */}
              <div className="p-4">
                <SolicitudTimeline estadoActual={solicitud.estado} size="sm" />
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>💬</span>
                  <span>{solicitud.actividades?.length || 0} actividades</span>
                </div>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
                  Ver detalles →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalle */}
      {selectedSolicitud && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Solicitud de {selectedSolicitud.tipoServicio.charAt(0).toUpperCase() + selectedSolicitud.tipoServicio.slice(1)}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge estado={selectedSolicitud.estado} />
                  <PriorityBadge prioridad={selectedSolicitud.prioridad} />
                </div>
              </div>
              <button
                onClick={() => setSelectedSolicitud(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              {/* Timeline Completo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📊</span> Progreso de la Solicitud
                </h3>
                <SolicitudTimeline estadoActual={selectedSolicitud.estado} size="md" />
              </div>

              {/* Información del Proyecto */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📝</span> Descripción del Proyecto
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedSolicitud.descripcionProyecto}
                  </p>
                </div>
              </div>

              {/* Detalles */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>ℹ️</span> Información Adicional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Presupuesto Estimado</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedSolicitud.presupuestoEstimado 
                        ? `$${selectedSolicitud.presupuestoEstimado.toLocaleString('es-MX')}`
                        : 'No especificado'
                      }
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fecha Deseada</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedSolicitud.fechaDeseada
                        ? new Date(selectedSolicitud.fechaDeseada).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'Flexible'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Historial de Actividades */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📜</span> Historial de Actividades
                </h3>
                <ActivityTimeline activities={selectedSolicitud.actividades || []} />
              </div>

              {/* Información de Contacto */}
              {selectedSolicitud.asignadoA && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>👤</span> Asesor Asignado
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedSolicitud.asignadoA.nombre}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📧 {selectedSolicitud.asignadoA.email}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer del Modal */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 p-6">
              <button
                onClick={() => setSelectedSolicitud(null)}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySolicitudes;
