import React, { useEffect, useState } from 'react';
import { crmService } from '../../services/crmService';
import type { LeadEstadisticas } from '../../services/crmService';
import { Card, LoadingSpinner } from '../UI';
import { StatusBadge, PriorityBadge } from './Badges';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';

/**
 * 📊 Componente de estadísticas del CRM
 */
export const CrmStats: React.FC = () => {
  const [stats, setStats] = useState<LeadEstadisticas | null>(null);
  const [leadsPendientes, setLeadsPendientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { headerGradient } = useDashboardHeaderGradient();

  // ========================================
  // 📥 CARGAR DATOS
  // ========================================
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsResponse, pendientesResponse] = await Promise.all([
        crmService.getStatistics(),
        crmService.getPendingLeads()
      ]);
      
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
      
      if (pendientesResponse.success && pendientesResponse.data) {
        setLeadsPendientes(pendientesResponse.data);
      }
    } catch (err: any) {
      console.error('Error cargando estadísticas:', err);
      setError(err.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Cargando estadísticas..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-800 dark:text-red-200">❌ {error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // ========================================
  // 📊 CALCULAR PORCENTAJES Y HELPERS
  // ========================================
  const calcularPorcentaje = (valor: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((valor / total) * 100);
  };

  // Convertir array a objeto para fácil acceso
  const arrayToObject = (arr: Array<{ _id: string; count: number }>): Record<string, number> => {
    return arr.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);
  };

  // Convertir stats a formato fácil de usar
  const estadoPorNombre = stats ? arrayToObject(stats.porEstado) : {};

  // ========================================
  // 🎨 RENDERIZADO
  // ========================================
  return (
    <div className="space-y-6">
      {/* Header con KPIs - Diseño Glassmorphism */}
      <div
        className="rounded-2xl p-6 md:p-8 text-white shadow-xl"
        style={{ background: headerGradient }}
      >
        {/* Título del header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📊</span>
            Panel de Estadísticas
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Resumen general del rendimiento del CRM
          </p>
        </div>

        {/* KPIs en diseño glassmorphism */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total de Leads */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Total Leads</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="text-3xl opacity-80">📊</div>
            </div>
          </div>

          {/* Leads Nuevos */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Nuevos</p>
                <p className="text-3xl font-bold mt-1">{estadoPorNombre.nuevo || 0}</p>
                <p className="text-white/70 text-xs mt-1">
                  {calcularPorcentaje(estadoPorNombre.nuevo || 0, stats.total)}% del total
                </p>
              </div>
              <div className="text-3xl opacity-80">🆕</div>
            </div>
          </div>

          {/* Leads en Proceso */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-medium uppercase tracking-wide">En Proceso</p>
                <p className="text-3xl font-bold mt-1">
                  {(estadoPorNombre.contactado || 0) + (estadoPorNombre.calificado || 0) + (estadoPorNombre.propuesta || 0)}
                </p>
                <p className="text-white/70 text-xs mt-1">
                  {calcularPorcentaje(
                    (estadoPorNombre.contactado || 0) + (estadoPorNombre.calificado || 0) + (estadoPorNombre.propuesta || 0),
                    stats.total
                  )}% del total
                </p>
              </div>
              <div className="text-3xl opacity-80">⏳</div>
            </div>
          </div>

          {/* Leads Ganados */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Ganados</p>
                <p className="text-3xl font-bold mt-1">{estadoPorNombre.ganado || 0}</p>
                <p className="text-white/70 text-xs mt-1">
                  {calcularPorcentaje(estadoPorNombre.ganado || 0, stats.total)}% conversión
                </p>
              </div>
              <div className="text-3xl opacity-80">🎉</div>
            </div>
          </div>
        </div>
      </div>

      {/* Distribución por Estado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Visual */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📈</span> Pipeline de Ventas
          </h3>
          <div className="space-y-3">
            {stats.porEstado.map(({ _id: estado, count: cantidad }) => {
              const porcentaje = calcularPorcentaje(cantidad, stats.total);
              return (
                <div key={estado}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge estado={estado as any} size="sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{cantidad} leads</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{porcentaje}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Distribución por Prioridad */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Distribución por Prioridad
          </h3>
          <div className="space-y-3">
            {stats.porPrioridad.map(({ _id: prioridad, count: cantidad }) => {
              const porcentaje = calcularPorcentaje(cantidad, stats.total);
              return (
                <div key={prioridad}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <PriorityBadge prioridad={prioridad as any} size="sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{cantidad} leads</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{porcentaje}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        prioridad === 'urgente' ? 'bg-red-500' :
                        prioridad === 'alta' ? 'bg-orange-500' :
                        prioridad === 'media' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Leads Pendientes de Seguimiento */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>⏰</span> Leads Pendientes de Seguimiento
          </h3>
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
            {leadsPendientes.length} pendientes
          </span>
        </div>

        {leadsPendientes.length > 0 ? (
          <div className="space-y-3">
            {leadsPendientes.slice(0, 5).map((lead) => (
              <div
                key={lead._id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {lead.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {lead.nombre}
                      </h4>
                      {lead.empresa && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{lead.empresa}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge estado={lead.estado} size="sm" />
                        <PriorityBadge prioridad={lead.prioridad} size="sm" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Sin actividad desde:
                    </p>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      {new Date(lead.ultimaActividad || lead.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {leadsPendientes.length > 5 && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                Y {leadsPendientes.length - 5} leads más pendientes...
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-4xl mb-2">✅</p>
            <p>¡Excelente! No hay leads pendientes de seguimiento</p>
          </div>
        )}
      </Card>

      {/* Estadísticas Adicionales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tasa de Conversión</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {calcularPorcentaje(estadoPorNombre.ganado || 0, stats.total)}%
            </p>
            <div className="mt-3 flex items-center justify-center gap-1 text-xs">
              {estadoPorNombre.ganado || 0} de {stats.total} leads ganados
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Leads Activos</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.total - (estadoPorNombre.ganado || 0) - (estadoPorNombre.perdido || 0)}
            </p>
            <div className="mt-3 flex items-center justify-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              En pipeline actual
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Leads Perdidos</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {estadoPorNombre.perdido || 0}
            </p>
            <div className="mt-3 flex items-center justify-center gap-1 text-xs text-red-600 dark:text-red-400">
              {calcularPorcentaje(estadoPorNombre.perdido || 0, stats.total)}% del total
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CrmStats;
