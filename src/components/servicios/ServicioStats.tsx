/**
 * 📊 WIDGETS DE ESTADÍSTICAS - ServicioStats
 * Componentes para mostrar métricas y estadísticas de servicios
 */

import React from 'react';
import type { ServicioDashboardStats } from '../../types/servicios';

// ============================================
// COMPONENTE: Card de Estadística
// ============================================

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'yellow';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'purple',
  subtitle,
  trend,
  className = ''
}) => {
  const colorClasses = {
    green: 'from-green-500 to-green-700',
    blue: 'from-blue-500 to-blue-700',
    purple: 'from-purple-500 to-purple-700',
    orange: 'from-orange-500 to-orange-700',
    red: 'from-red-500 to-red-700',
    yellow: 'from-yellow-500 to-yellow-700'
  };

  return (
    <div
      className={`
        bg-gradient-to-br ${colorClasses[color]} 
        p-6 rounded-lg shadow-lg
        ${className}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-white/80 text-sm font-medium">{title}</div>
        <div className="text-3xl">{icon}</div>
      </div>
      
      <div className="text-4xl font-bold text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>

      {subtitle && (
        <div className="text-white/70 text-sm">{subtitle}</div>
      )}

      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-green-200' : 'text-red-200'}`}>
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span className="text-white/60">vs. mes anterior</span>
        </div>
      )}
    </div>
  );
};

// ============================================
// COMPONENTE: Grid de Estadísticas
// ============================================

interface StatsGridProps {
  stats: ServicioDashboardStats;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      <StatCard
        title="Servicios Activos"
        value={stats.resumen.serviciosActivos}
        icon="✓"
        color="green"
      />
      
      <StatCard
        title="En Desarrollo"
        value={stats.resumen.serviciosEnDesarrollo}
        icon="⚙️"
        color="blue"
      />
      
      <StatCard
        title="Ingresos del Mes"
        value={`$${stats.ingresos.mes.toLocaleString()}`}
        icon="💰"
        color="purple"
      />
      
      <StatCard
        title="Ingresos del Año"
        value={`$${stats.ingresos.anio.toLocaleString()}`}
        icon="📈"
        color="orange"
      />
    </div>
  );
};

// ============================================
// COMPONENTE: Top Servicios
// ============================================

interface TopServiciosProps {
  topServicios: ServicioDashboardStats['topServicios'];
  className?: string;
}

export const TopServicios: React.FC<TopServiciosProps> = ({ topServicios, className = '' }) => {
  if (!topServicios || topServicios.length === 0) {
    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6 ${className}`}>
        <h2 className="text-xl font-bold text-white mb-4">
          🏆 Top Servicios Más Vendidos
        </h2>
        <div className="text-center py-8 text-gray-500">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6 ${className}`}>
      <h2 className="text-xl font-bold text-white mb-6">
        🏆 Top 5 Servicios Más Vendidos
      </h2>
      <div className="space-y-4">
        {topServicios.map((item, idx) => (
          <div
            key={item.servicio._id}
            className="flex items-center justify-between bg-gray-700/30 hover:bg-gray-700/50 p-4 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Posición */}
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${idx === 0 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' :
                  idx === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/50' :
                  idx === 2 ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50' :
                  'bg-gray-600/20 text-gray-400 border border-gray-600/50'}
              `}>
                {idx + 1}
              </div>

              {/* Icono y nombre */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-3xl flex-shrink-0">{item.servicio.icono}</span>
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                    {item.servicio.titulo}
                  </div>
                  <div className="text-sm text-gray-400">
                    {item.ventas} ventas
                  </div>
                </div>
              </div>
            </div>

            {/* Ingresos */}
            <div className="text-right flex-shrink-0 ml-4">
              <div className="text-xl font-bold text-green-400">
                ${item.ingresos.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                ${(item.ingresos / item.ventas).toLocaleString()} promedio
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE: Resumen Compacto
// ============================================

interface ResumenCompactoProps {
  stats: ServicioDashboardStats;
  className?: string;
}

export const ResumenCompacto: React.FC<ResumenCompactoProps> = ({ stats, className = '' }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">📊 Resumen General</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total de servicios:</span>
          <span className="text-white font-semibold">{stats.resumen.totalServicios}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Servicios activos:</span>
          <span className="text-green-400 font-semibold">{stats.resumen.serviciosActivos}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">En desarrollo:</span>
          <span className="text-blue-400 font-semibold">{stats.resumen.serviciosEnDesarrollo}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Pausados:</span>
          <span className="text-yellow-400 font-semibold">{stats.resumen.serviciosPausados}</span>
        </div>

        <div className="border-t border-gray-700 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Ingreso promedio:</span>
            <span className="text-purple-400 font-semibold">
              ${stats.ingresos.promedioPorServicio.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EXPORTACIONES POR DEFECTO
// ============================================

export const ServicioStatsComponents = {
  StatCard,
  StatsGrid,
  TopServicios,
  ResumenCompacto
};

export default ServicioStatsComponents;
