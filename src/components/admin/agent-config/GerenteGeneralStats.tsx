import React, { useState } from 'react';
import { 
  BarChart3, 
  Activity, 
  Clock, 
  Target,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import type { GerenteGeneralConfigData } from '../../../services/gerenteGeneralService';

interface GerenteGeneralStatsProps {
  config: GerenteGeneralConfigData | null;
  isLoading: boolean;
}

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export const GerenteGeneralStats: React.FC<GerenteGeneralStatsProps> = ({
  config,
  isLoading
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando estadísticas...</span>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No hay configuración disponible
      </div>
    );
  }

  // Extraer estadísticas del config (pueden venir del backend o calcularse)
  const statistics = config.statistics || {
    totalCoordinations: 0,
    successfulCoordinations: 0,
    failedCoordinations: 0,
    averageCoordinationTime: 0,
    routingAccuracy: 0,
    lastUsed: null
  };

  const successRate = statistics.totalCoordinations > 0 
    ? ((statistics.successfulCoordinations / statistics.totalCoordinations) * 100).toFixed(1)
    : '0.0';

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}min`;
  };

  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'Nunca';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const stats: StatCard[] = [
    {
      label: 'Total Coordinaciones',
      value: statistics.totalCoordinations || 0,
      icon: <Activity size={24} />,
      color: 'blue',
      subtitle: 'Desde el inicio'
    },
    {
      label: 'Exitosas',
      value: statistics.successfulCoordinations || 0,
      icon: <CheckCircle size={24} />,
      color: 'green',
      trend: statistics.totalCoordinations > 0 ? {
        value: parseFloat(successRate),
        isPositive: parseFloat(successRate) >= 80
      } : undefined
    },
    {
      label: 'Fallidas',
      value: statistics.failedCoordinations || 0,
      icon: <XCircle size={24} />,
      color: 'red',
      subtitle: 'Requieren atención'
    },
    {
      label: 'Tiempo Promedio',
      value: formatTime(statistics.averageCoordinationTime || 0),
      icon: <Clock size={24} />,
      color: 'amber',
      trend: statistics.averageCoordinationTime > 0 ? {
        value: statistics.averageCoordinationTime < 2000 ? 15 : -10,
        isPositive: statistics.averageCoordinationTime < 2000
      } : undefined
    },
    {
      label: 'Precisión de Routing',
      value: `${(statistics.routingAccuracy || 0).toFixed(1)}%`,
      icon: <Target size={24} />,
      color: 'purple',
      trend: {
        value: statistics.routingAccuracy || 0,
        isPositive: (statistics.routingAccuracy || 0) >= 85
      }
    },
    {
      label: 'Último Uso',
      value: formatDate(statistics.lastUsed),
      icon: <Calendar size={24} />,
      color: 'indigo',
      subtitle: statistics.lastUsed ? 'Activo recientemente' : 'Sin actividad'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
        icon: 'text-blue-600 dark:text-blue-400'
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
        icon: 'text-green-600 dark:text-green-400'
      },
      red: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-600 dark:text-red-400',
        icon: 'text-red-600 dark:text-red-400'
      },
      amber: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-600 dark:text-amber-400',
        icon: 'text-amber-600 dark:text-amber-400'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-600 dark:text-purple-400',
        icon: 'text-purple-600 dark:text-purple-400'
      },
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        text: 'text-indigo-600 dark:text-indigo-400',
        icon: 'text-indigo-600 dark:text-indigo-400'
      }
    };
    return colors[color] || colors.blue;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Aquí se podría llamar a una API para refrescar las estadísticas
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Estadísticas del Coordinador
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Métricas de rendimiento y uso del Gerente General
            </p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const colorClasses = getColorClasses(stat.color);
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl ${colorClasses.bg}`}>
                  <div className={colorClasses.icon}>{stat.icon}</div>
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend.isPositive ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                    {Math.abs(stat.trend.value).toFixed(1)}%
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </h4>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {stat.subtitle}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="text-amber-500" size={24} />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Resumen de Rendimiento
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Success Rate Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tasa de Éxito
              </span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {successRate}%
              </span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>

          {/* Routing Accuracy Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Precisión de Routing
              </span>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {(statistics.routingAccuracy || 0).toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${statistics.routingAccuracy || 0}%` }}
              />
            </div>
          </div>

          {/* Response Time */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Velocidad de Respuesta
              </span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {statistics.averageCoordinationTime < 2000 ? 'Excelente' : 
                 statistics.averageCoordinationTime < 5000 ? 'Buena' : 'Mejorable'}
              </span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.max(10, 100 - (statistics.averageCoordinationTime / 100))}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Note */}
      {statistics.totalCoordinations === 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <Activity className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium mb-1">Sin datos de coordinación</p>
            <p>
              Las estadísticas se actualizarán automáticamente cuando el Gerente General 
              procese coordinaciones de agentes. Usa SCUTI AI para comenzar a generar métricas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenteGeneralStats;
