import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContabilidad } from '../../hooks/useContabilidad';
import { Button, Card } from '../../components/UI';
import PageLoader from '../../components/common/PageLoader';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';
import ClienteFormModal from '../../components/contabilidad/ClienteFormModal';
import ClientesMapView from '../../components/contabilidad/ClientesMapView';
import type { 
  ClienteContable, 
  CreateClienteData,
  RegimenTributario, 
  EstadoCliente 
} from '../../types/contabilidad';
import { 
  REGIMEN_LABELS, 
  REGIMEN_COLORS, 
  ESTADO_CLIENTE_CONFIG,
  ZONA_IGV_COLORS
} from '../../types/contabilidad';

/**
 * 🏢 Página principal de Gestión de Clientes Contables
 * Incluye semáforo de vencimientos, lista filtrable y stats
 */
const ContabilidadManagement: React.FC = () => {
  const { headerGradient } = useDashboardHeaderGradient();
  const navigate = useNavigate();

  const {
    clientes,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    semaforo,
    estadisticas,
    createCliente,
    darDeBaja,
    reactivar,
    loadSemaforo,
    loadEstadisticas,
    refresh
  } = useContabilidad();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [vistaActiva, setVistaActiva] = useState<'lista' | 'semaforo'>('lista');
  const [showFilters, setShowFilters] = useState(false);

  // Cargar semáforo y estadísticas al montar
  useEffect(() => {
    loadSemaforo();
    loadEstadisticas();
  }, [loadSemaforo, loadEstadisticas]);

  // Handlers
  const handleSearch = (value: string) => {
    updateFilters({ search: value });
  };

  const handleFilterRegimen = (regimen: string) => {
    updateFilters({ regimenTributario: regimen as RegimenTributario || undefined });
  };

  const handleFilterEstado = (estado: string) => {
    updateFilters({ estado: estado as EstadoCliente || undefined });
  };

  const handleViewCliente = (cliente: ClienteContable) => {
    navigate(`/dashboard/contabilidad/clientes/${cliente._id}`);
  };

  const handleCreateCliente = async (data: CreateClienteData) => {
    try {
      await createCliente(data);
      setShowCreateModal(false);
    } catch {
      // Error manejado en el hook
    }
  };

  const handleDarDeBaja = async (cliente: ClienteContable) => {
    const motivo = window.prompt(`¿Motivo de baja para "${cliente.razonSocial}"?`);
    if (!motivo) return;
    
    if (!window.confirm(`¿Confirmas dar de baja a "${cliente.razonSocial}"?\nMotivo: ${motivo}`)) return;
    
    try {
      await darDeBaja(cliente._id, motivo);
    } catch {
      // Error manejado en el hook
    }
  };

  const handleReactivar = async (cliente: ClienteContable) => {
    if (!window.confirm(`¿Reactivar a "${cliente.razonSocial}"?`)) return;
    try {
      await reactivar(cliente._id);
    } catch {
      // Error manejado en el hook
    }
  };

  if (loading && clientes.length === 0) {
    return <PageLoader />;
  }

  return (
      <div className="space-y-4">
        {/* Header */}
        <div 
          className="rounded-2xl p-4 md:p-5 text-white"
          style={{ background: headerGradient || 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)' }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold truncate">🏢 Gestión de Clientes Contables</h1>
              <p className="text-white/80 text-xs md:text-sm mt-0.5">
                {estadisticas 
                  ? `${estadisticas.clientesActivos} activos · ${estadisticas.declaracionesPendientes} pendientes`
                  : 'Cargando...'
                }
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex bg-white/20 rounded-lg p-0.5">
                <button
                  onClick={() => setVistaActiva('lista')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    vistaActiva === 'lista'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📋 Lista
                </button>
                <button
                  onClick={() => setVistaActiva('semaforo')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    vistaActiva === 'semaforo'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🚦 Semáforo
                </button>
              </div>
              <Button onClick={() => setShowCreateModal(true)} className="text-xs md:text-sm !px-3 !py-1.5">
                ➕ <span className="hidden sm:inline">Nuevo Cliente</span><span className="sm:hidden">Nuevo</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas - compactas */}
        {estadisticas && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{estadisticas.totalClientes}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Clientes</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{estadisticas.clientesActivos}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Activos</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">{estadisticas.declaracionesPendientes}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Pendientes</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">
                S/ {(estadisticas.montoTotalMes || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Tributos Mes</div>
            </Card>
          </div>
        )}

        {/* Mapa de clientes - siempre visible, colapsable */}
        <ClientesMapView onViewCliente={handleViewCliente} />

        {/* Vista: Semáforo o Lista (debajo del mapa) */}
        {vistaActiva === 'semaforo' ? (
          <SemaforoView semaforo={semaforo} onViewCliente={handleViewCliente} />
        ) : (
          <>
            {/* Búsqueda y Filtros */}
            <Card className="p-3">
              <div className="flex gap-2 items-center">
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    placeholder="🔍 Buscar por RUC, razón social..."
                    value={filters.search || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    showFilters || filters.regimenTributario || filters.estado
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  title="Filtros"
                >
                  <span>⚙️</span>
                  <span className="hidden sm:inline">Filtros</span>
                  {(filters.regimenTributario || filters.estado) && (
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  )}
                </button>
                <button
                  onClick={() => refresh()}
                  className="p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Refrescar"
                >
                  🔄
                </button>
              </div>
              {/* Filtros desplegables */}
              {showFilters && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <select
                    value={filters.regimenTributario || ''}
                    onChange={(e) => handleFilterRegimen(e.target.value)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Todos los regímenes</option>
                    <option value="RUS">Nuevo RUS</option>
                    <option value="RER">RER</option>
                    <option value="MYPE">MYPE</option>
                    <option value="GENERAL">General</option>
                  </select>
                  <select
                    value={filters.estado || ''}
                    onChange={(e) => handleFilterEstado(e.target.value)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Todos los estados</option>
                    <option value="ACTIVO">Activo</option>
                    <option value="SUSPENDIDO">Suspendido</option>
                    <option value="BAJA">Baja</option>
                  </select>
                  {(filters.regimenTributario || filters.estado) && (
                    <button
                      onClick={() => { handleFilterRegimen(''); handleFilterEstado(''); }}
                      className="px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                      ✕ Limpiar filtros
                    </button>
                  )}
                </div>
              )}
            </Card>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            {/* Clientes - Vista Cards (móvil) */}
            <div className="md:hidden space-y-3">
              {clientes.length === 0 ? (
                <Card className="p-8 text-center text-gray-500 dark:text-gray-400">
                  {loading ? '⏳ Cargando...' : '📭 No se encontraron clientes'}
                </Card>
              ) : (
                clientes.map((cliente) => (
                  <div 
                    key={cliente._id}
                    role="button"
                    tabIndex={0}
                    className="p-4 cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all active:scale-[0.99] bg-white/5 dark:bg-gray-800/60 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                    onClick={() => handleViewCliente(cliente)}
                    onKeyDown={(e) => e.key === 'Enter' && handleViewCliente(cliente)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white truncate">
                          {cliente.razonSocial}
                        </div>
                        <div className="font-mono text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          RUC: {cliente.ruc}
                        </div>
                        {cliente.representante?.nombre && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            👤 {cliente.representante.nombre}
                          </div>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${ESTADO_CLIENTE_CONFIG[cliente.estado]?.color}`}>
                        {ESTADO_CLIENTE_CONFIG[cliente.estado]?.icon} {ESTADO_CLIENTE_CONFIG[cliente.estado]?.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${REGIMEN_COLORS[cliente.regimenTributario]}`}>
                        {REGIMEN_LABELS[cliente.regimenTributario]}
                      </span>
                      {cliente.zonaIGV && cliente.zonaIGV !== 'GRAVADA' && (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${ZONA_IGV_COLORS[cliente.zonaIGV]}`}>
                          {cliente.zonaIGV === 'EXONERADA' ? '🌿 Exonerada' : '📋 Inafecta'}
                        </span>
                      )}
                      {cliente.honorarioMensual ? (
                        <span className="text-xs text-gray-600 dark:text-gray-300 ml-auto">
                          S/ {cliente.honorarioMensual.toLocaleString('es-PE')}
                        </span>
                      ) : null}
                      {cliente.usuarioVinculado ? (
                        <span className="text-[10px] text-green-600 dark:text-green-400">🔗 Vinculado</span>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleViewCliente(cliente)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 text-xs"
                      >
                        👁️ Ver
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/contabilidad/clientes/${cliente._id}/declaraciones`)}
                        className="p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 text-xs"
                      >
                        📄 Declar.
                      </button>
                      {cliente.estado === 'ACTIVO' ? (
                        <button
                          onClick={() => handleDarDeBaja(cliente)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 text-xs"
                        >
                          ⛔ Baja
                        </button>
                      ) : cliente.estado === 'BAJA' ? (
                        <button
                          onClick={() => handleReactivar(cliente)}
                          className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 text-xs"
                        >
                          ♻️ Reactivar
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Clientes - Vista Tabla (desktop) */}
            <Card className="overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">RUC</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Razón Social</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Régimen</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Honorario</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Portal</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {clientes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                          {loading ? '⏳ Cargando...' : '📭 No se encontraron clientes contables'}
                        </td>
                      </tr>
                    ) : (
                      clientes.map((cliente) => (
                        <tr 
                          key={cliente._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
                          onClick={() => handleViewCliente(cliente)}
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                              {cliente.ruc}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {cliente.razonSocial}
                              </div>
                              {cliente.representante?.nombre && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  👤 {cliente.representante.nombre}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${REGIMEN_COLORS[cliente.regimenTributario]}`}>
                                {REGIMEN_LABELS[cliente.regimenTributario]}
                              </span>
                              {cliente.zonaIGV && cliente.zonaIGV !== 'GRAVADA' && (
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${ZONA_IGV_COLORS[cliente.zonaIGV]}`}>
                                  {cliente.zonaIGV === 'EXONERADA' ? '🌿 Exonerada IGV' : '📋 Inafecta IGV'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${ESTADO_CLIENTE_CONFIG[cliente.estado]?.color}`}>
                              {ESTADO_CLIENTE_CONFIG[cliente.estado]?.icon} {ESTADO_CLIENTE_CONFIG[cliente.estado]?.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                            {cliente.honorarioMensual 
                              ? `S/ ${cliente.honorarioMensual.toLocaleString('es-PE')}`
                              : '-'
                            }
                          </td>
                          <td className="px-4 py-3">
                            {cliente.usuarioVinculado ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                🔗 Vinculado
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">Sin vincular</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleViewCliente(cliente)}
                                className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors"
                                title="Ver detalle"
                              >
                                👁️
                              </button>
                              <button
                                onClick={() => navigate(`/dashboard/contabilidad/clientes/${cliente._id}/declaraciones`)}
                                className="p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 transition-colors"
                                title="Declaraciones"
                              >
                                📄
                              </button>
                              {cliente.estado === 'ACTIVO' ? (
                                <button
                                  onClick={() => handleDarDeBaja(cliente)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                                  title="Dar de baja"
                                >
                                  ⛔
                                </button>
                              ) : cliente.estado === 'BAJA' ? (
                                <button
                                  onClick={() => handleReactivar(cliente)}
                                  className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 transition-colors"
                                  title="Reactivar"
                                >
                                  ♻️
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => changePage(pagination.page - 1)}
                    >
                      ← Anterior
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => changePage(pagination.page + 1)}
                    >
                      Siguiente →
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </>
        )}

        {/* Modal Crear Cliente */}
        {showCreateModal && (
          <ClienteFormModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateCliente}
          />
        )}
      </div>
  );
};

// ============================================
// 🚦 COMPONENTE SEMÁFORO
// ============================================

interface SemaforoViewProps {
  semaforo: SemaforoVencimientos | null;
  onViewCliente: (cliente: ClienteContable) => void;
}

import type { SemaforoVencimientos, ClienteSemaforo } from '../../types/contabilidad';

const SemaforoView: React.FC<SemaforoViewProps> = ({ semaforo, onViewCliente }) => {
  if (!semaforo) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">⏳ Cargando semáforo de vencimientos...</div>
      </Card>
    );
  }

  const sections = [
    { title: '🔴 Vencidos', cat: semaforo.vencidos, color: 'border-red-500 bg-red-50 dark:bg-red-900/10' },
    { title: '🟡 Próximos a vencer', cat: semaforo.proximos, color: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' },
    { title: '🟢 Al día', cat: semaforo.alDia, color: 'border-green-500 bg-green-50 dark:bg-green-900/10' },
    { title: '⚪ Pendientes', cat: semaforo.pendientes, color: 'border-gray-400 bg-gray-50 dark:bg-gray-900/10' }
  ];

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center border-l-4 border-red-500">
          <div className="text-2xl font-bold text-red-600">{semaforo.vencidos?.count ?? 0}</div>
          <div className="text-sm text-gray-500">Vencidos</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-600">{semaforo.proximos?.count ?? 0}</div>
          <div className="text-sm text-gray-500">Próximos</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{semaforo.alDia?.count ?? 0}</div>
          <div className="text-sm text-gray-500">Al día</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-gray-400">
          <div className="text-2xl font-bold text-gray-600">{semaforo.pendientes?.count ?? 0}</div>
          <div className="text-sm text-gray-500">Pendientes</div>
        </Card>
      </div>

      {/* Secciones del semáforo */}
      {sections.map((section) => (
        section.cat.clientes.length > 0 && (
          <Card key={section.title} className={`border-l-4 ${section.color} overflow-hidden`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {section.title} ({section.cat.count})
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {section.cat.clientes.map((item: ClienteSemaforo) => (
                <div
                  key={item._id}
                  className="px-4 py-3 flex items-center justify-between hover:bg-white/50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
                  onClick={() => onViewCliente(item as unknown as ClienteContable)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{item.ruc}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.razonSocial}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${REGIMEN_COLORS[item.regimen]}`}>
                      {item.regimen}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.diasRestantes !== undefined && (
                      <span>
                        {item.diasRestantes < 0 
                          ? `⚠️ Venció hace ${Math.abs(item.diasRestantes)} días`
                          : item.diasRestantes === 0 
                            ? '⏰ Vence HOY'
                            : `📅 Vence en ${item.diasRestantes} días`
                        }
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )
      ))}
    </div>
  );
};

export default ContabilidadManagement;
