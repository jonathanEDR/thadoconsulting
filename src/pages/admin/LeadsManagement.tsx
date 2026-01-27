import React, { useState } from 'react';
import { useCRM } from '../../hooks/useCRM';
import { useAuth } from '../../contexts/AuthContext';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import { StatusBadge, PriorityBadge, OrigenBadge } from '../../components/crm/Badges';
import { Button, LoadingSpinner, Card } from '../../components/UI';
import { LeadFormModal } from '../../components/crm/LeadFormModal';
import { LeadDetailModal } from '../../components/crm/LeadDetailModal';
import { LeadFiltersComponent } from '../../components/crm/LeadFilters';
import { CrmStats } from '../../components/crm/CrmStats';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';
import type { Lead, CreateLeadData, UpdateLeadData } from '../../services/crmService';

/**
 * 💼 Página principal de gestión de Leads CRM
 */
const LeadsManagement: React.FC = () => {
  const { hasPermission } = useAuth();
  const { headerGradient } = useDashboardHeaderGradient();
  const {
    leads,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    setSelectedLead,
    selectedLead,
    createLead,
    updateLead,
    deleteLead,
    changeStatus,
    addActivity,
    refresh
  } = useCRM();

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStats, setShowStats] = useState(false); // Toggle para vista de estadísticas

  // ========================================
  // 🔍 BÚSQUEDA Y FILTROS
  // ========================================
  const handleSearch = (value: string) => {
    updateFilters({ search: value });
  };

  const handleFilterChange = (key: string, value: string) => {
    updateFilters({ [key]: value });
  };

  // ========================================
  // 📄 ACCIONES DE LEAD
  // ========================================
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const handleCreateLead = () => {
    setShowCreateModal(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  const handleDeleteLead = async (lead: Lead) => {
    if (!window.confirm(`¿Estás seguro de eliminar el lead "${lead.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }
    
    try {
      const result = await deleteLead(lead._id);
      if (result.success) {
        console.log('Lead eliminado exitosamente');
        // El hook ya actualiza automáticamente la lista local removiendo el lead
      } else {
        alert(result.error || 'Error al eliminar el lead');
      }
    } catch (error) {
      console.error('Error eliminando lead:', error);
      alert('Error inesperado al eliminar el lead');
    }
  };

  // ========================================
  // 💾 HANDLERS DEL FORMULARIO
  // ========================================
  const handleSubmitCreate = async (data: CreateLeadData) => {
    try {
      await createLead(data);
      setShowCreateModal(false);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al crear el lead' };
    }
  };

  const handleSubmitEdit = async (data: UpdateLeadData) => {
    if (!selectedLead) return { success: false, error: 'No hay lead seleccionado' };
    
    try {
      await updateLead(selectedLead._id, data);
      setShowEditModal(false);
      setSelectedLead(null);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al actualizar el lead' };
    }
  };

  // ========================================
  // 🔄 HANDLERS DEL MODAL DE DETALLE
  // ========================================
  const handleEditFromDetail = (lead: Lead) => {
    setShowDetailModal(false);
    setTimeout(() => {
      handleEditLead(lead);
    }, 100);
  };

  const handleChangeStatus = async (leadId: string, nuevoEstado: Lead['estado']) => {
    try {
      await changeStatus(leadId, nuevoEstado);
      await refresh();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleAddActivity = async (leadId: string, tipo: string, descripcion: string) => {
    try {
      await addActivity(leadId, tipo, descripcion);
      await refresh();
    } catch (error) {
      console.error('Error al agregar actividad:', error);
    }
  };

  // ========================================
  // 🎨 RENDERIZADO
  // ========================================
  return (
    <SmartDashboardLayout>
      <div className="space-y-6">
        {/* 🎨 Header con gradiente dinámico del sidebar */}
        <div
          className="rounded-2xl p-6 md:p-8 text-white shadow-xl"
          style={{ background: headerGradient }}
        >
          {/* Título y controles */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">💼</span>
                Gestión de Leads
              </h1>
              <p className="text-white/90 text-lg">
                Administra y da seguimiento a todos tus contactos y oportunidades
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Toggle Vista */}
              <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1">
                <button
                  onClick={() => setShowStats(false)}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    !showStats
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <span className="hidden sm:inline">📋 Lista</span>
                  <span className="sm:hidden">📋</span>
                </button>
                <button
                  onClick={() => setShowStats(true)}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    showStats
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <span className="hidden sm:inline">📊 Estadísticas</span>
                  <span className="sm:hidden">📊</span>
                </button>
              </div>

              {hasPermission('MANAGE_CONTENT') && !showStats && (
                <Button
                  onClick={handleCreateLead}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                  size="sm"
                >
                  <span className="mr-2">➕</span>
                  <span className="hidden sm:inline">Nuevo Lead</span>
                  <span className="sm:hidden">Nuevo</span>
                </Button>
              )}
            </div>
          </div>

          {/* 📊 Estadísticas integradas en el header */}
          {!showStats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/25 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white/80 truncate">Total Leads</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{pagination.totalRecords}</p>
                  </div>
                  <div className="text-3xl sm:text-4xl opacity-80">📊</div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/25 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white/80 truncate">Nuevos</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {leads.filter(l => l.estado === 'nuevo').length}
                    </p>
                  </div>
                  <div className="text-3xl sm:text-4xl opacity-80">🆕</div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/25 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white/80 truncate">En Proceso</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {leads.filter(l => ['contactado', 'calificado', 'propuesta', 'negociacion'].includes(l.estado)).length}
                    </p>
                  </div>
                  <div className="text-3xl sm:text-4xl opacity-80">⚡</div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/25 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white/80 truncate">Ganados</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {leads.filter(l => l.estado === 'ganado').length}
                    </p>
                  </div>
                  <div className="text-3xl sm:text-4xl opacity-80">🎯</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contenido Principal: Vista de Estadísticas o Lista */}
        {showStats ? (
          /* Vista de Estadísticas Completas */
          <CrmStats />
        ) : (
          <>

        {/* Filtros y Búsqueda - Colapsable */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <LeadFiltersComponent
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onRefresh={refresh}
            defaultExpanded={false}
          />
        </div>

        {/* Tabla de Leads */}
        <Card>
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">❌ {error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" text="Cargando leads..." />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No hay leads disponibles
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {filters.search || filters.estado !== 'all' 
                  ? 'Intenta con otros filtros de búsqueda'
                  : 'Comienza creando tu primer lead'}
              </p>
            </div>
          ) : (
            <>
              {/* Tabla Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Servicio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Prioridad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Origen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {leads.map((lead) => (
                      <tr 
                        key={lead._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        onClick={() => handleViewLead(lead)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {/* Avatar: Mostrar imagen si usuario registrado tiene profileImage */}
                            {lead.usuarioRegistrado?.profileImage ? (
                              <img 
                                src={lead.usuarioRegistrado.profileImage}
                                alt={lead.nombre}
                                className="flex-shrink-0 h-10 w-10 rounded-full object-cover"
                                onError={(e) => {
                                  // Fallback a inicial si falla la imagen
                                  e.currentTarget.style.display = 'none';
                                  const fallback = e.currentTarget.nextElementSibling;
                                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                                }}
                              />
                            ) : null}
                            {/* Fallback: Inicial con gradiente */}
                            <div 
                              className={`flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 items-center justify-center text-white font-bold ${
                                lead.usuarioRegistrado?.profileImage ? 'hidden' : 'flex'
                              }`}
                            >
                              {lead.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                {lead.nombre}
                                {/* Indicador de usuario registrado */}
                                {lead.usuarioRegistrado?.userId && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300" title="Usuario registrado">
                                    ✓
                                  </span>
                                )}
                              </div>
                              {lead.empresa && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {lead.empresa}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{lead.correo}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{lead.celular}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                            {getTipoServicioLabel(lead.tipoServicio)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge estado={lead.estado} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PriorityBadge prioridad={lead.prioridad} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <OrigenBadge origen={lead.origen} />
                            {/* 🆕 Badge para usuarios registrados */}
                            {lead.origen === 'web-authenticated' || lead.tags?.includes('usuario-registrado') ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                ✓ Registrado
                              </span>
                            ) : lead.origen === 'web' || lead.tags?.includes('contacto-publico') ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                                📝 Público
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(lead.createdAt).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewLead(lead);
                              }}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Ver detalles"
                            >
                              👁️
                            </button>
                            {hasPermission('MANAGE_CONTENT') && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditLead(lead);
                                  }}
                                  className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteLead(lead);
                                  }}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Eliminar"
                                >
                                  🗑️
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards Mobile */}
              <div className="md:hidden space-y-4">
                {leads.map((lead) => (
                  <div
                    key={lead._id}
                    onClick={() => handleViewLead(lead)}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar móvil: Mostrar imagen si usuario registrado tiene profileImage */}
                        {lead.usuarioRegistrado?.profileImage ? (
                          <img 
                            src={lead.usuarioRegistrado.profileImage}
                            alt={lead.nombre}
                            className="flex-shrink-0 h-10 w-10 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) (fallback as HTMLElement).style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 items-center justify-center text-white font-bold ${
                            lead.usuarioRegistrado?.profileImage ? 'hidden' : 'flex'
                          }`}
                        >
                          {lead.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                            {lead.nombre}
                            {lead.usuarioRegistrado?.userId && (
                              <span className="text-green-500 text-xs" title="Usuario registrado">✓</span>
                            )}
                          </h3>
                          {lead.empresa && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{lead.empresa}</p>
                          )}
                        </div>
                      </div>
                      <StatusBadge estado={lead.estado} size="sm" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>📧</span>
                        <span>{lead.correo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>📞</span>
                        <span>{lead.celular}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <PriorityBadge prioridad={lead.prioridad} size="sm" />
                        <OrigenBadge origen={lead.origen} size="sm" />
                      </div>
                    </div>

                    {/* Botones de acción mobile */}
                    {hasPermission('MANAGE_CONTENT') && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewLead(lead);
                          }}
                          className="flex-1 py-2 px-3 text-xs sm:text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors font-medium"
                        >
                          👁️ Ver
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLead(lead);
                          }}
                          className="flex-1 py-2 px-3 text-xs sm:text-sm text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg transition-colors font-medium"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLead(lead);
                          }}
                          className="flex-1 py-2 px-3 text-xs sm:text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors font-medium"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {pagination.total > 1 && (
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                  {/* Info en móvil centrada */}
                  <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      Mostrando {pagination.count} de {pagination.totalRecords} leads
                    </div>
                  </div>
                  
                  {/* Controles de paginación */}
                  <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2">
                    <Button
                      onClick={() => changePage(pagination.current - 1)}
                      disabled={pagination.current === 1}
                      variant="ghost"
                      size="sm"
                      className="text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <span className="sm:hidden">←</span>
                      <span className="hidden sm:inline">← Anterior</span>
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(3, pagination.total) }, (_, i) => {
                        let page;
                        if (pagination.total <= 3) {
                          page = i + 1;
                        } else {
                          // Lógica para mostrar páginas alrededor de la actual
                          if (pagination.current <= 2) {
                            page = i + 1;
                          } else if (pagination.current >= pagination.total - 1) {
                            page = pagination.total - 2 + i;
                          } else {
                            page = pagination.current - 1 + i;
                          }
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => changePage(page)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded text-xs sm:text-sm font-medium transition-colors ${
                              pagination.current === page
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <Button
                      onClick={() => changePage(pagination.current + 1)}
                      disabled={pagination.current === pagination.total}
                      variant="ghost"
                      size="sm"
                      className="text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <span className="sm:hidden">→</span>
                      <span className="hidden sm:inline">Siguiente →</span>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
          </>
        )}
      </div>

      {/* 📝 Modales */}
      <LeadFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitCreate}
        mode="create"
      />

      <LeadFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedLead(null);
        }}
        onSubmit={handleSubmitEdit}
        lead={selectedLead}
        mode="edit"
      />

      <LeadDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onEdit={handleEditFromDetail}
        onChangeStatus={handleChangeStatus}
        onAddActivity={handleAddActivity}
      />
    </SmartDashboardLayout>
  );
};

/**
 * Helper para obtener label del tipo de servicio
 */
const getTipoServicioLabel = (tipo: string): string => {
  const labels: Record<string, string> = {
    web: 'Sitio Web',
    app: 'App Móvil',
    ecommerce: 'E-commerce',
    sistemas: 'Sistemas',
    consultoria: 'Consultoría',
    diseño: 'Diseño',
    marketing: 'Marketing',
    otro: 'Otro'
  };
  return labels[tipo] || tipo;
};

export default LeadsManagement;
