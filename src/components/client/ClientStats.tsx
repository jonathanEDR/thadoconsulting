/**
 * 📊 CLIENT STATS - Widget de Estadísticas del Cliente
 * Componente reutilizable para mostrar estadísticas del portal cliente
 */

import { useNavigate } from 'react-router-dom';

export interface ClientStatsData {
  totalLeads: number;
  activeLeads: number;
  unreadMessages: number;
  completedLeads?: number;
}

interface ClientStatsProps {
  stats: ClientStatsData;
  isLoading?: boolean;
  className?: string;
}

export default function ClientStats({ stats, isLoading, className = '' }: ClientStatsProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-gray-300 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="text-right flex-1 ml-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      icon: '📋',
      label: 'Total Solicitudes',
      value: stats.totalLeads,
      color: 'border-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      action: () => navigate('/dashboard/client/solicitudes'),
      actionLabel: 'Ver todas',
    },
    {
      icon: '⚡',
      label: 'Solicitudes Activas',
      value: stats.activeLeads,
      color: 'border-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      action: () => navigate('/dashboard/client/solicitudes'),
      actionLabel: 'En progreso',
    },
    {
      icon: '💬',
      label: 'Mensajes Nuevos',
      value: stats.unreadMessages,
      color: 'border-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      action: () => navigate('/dashboard/client/messages'),
      actionLabel: 'Leer mensajes',
      highlight: stats.unreadMessages > 0,
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {statsConfig.map((stat, index) => (
        <div
          key={index}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 ${stat.color} ${
            stat.highlight ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
          } hover:shadow-xl transition-all cursor-pointer`}
          onClick={stat.action}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`text-3xl p-3 ${stat.bgColor} rounded-lg`}>{stat.icon}</div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          </div>
          <button className={`${stat.textColor} text-sm font-medium hover:underline`}>
            {stat.actionLabel} →
          </button>
        </div>
      ))}
    </div>
  );
}
