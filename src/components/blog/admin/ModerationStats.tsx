/**
 * 📊 ModerationStats Component
 * Muestra estadísticas de moderación
 */

import { AlertTriangle, Ban, Check, Clock } from 'lucide-react';

interface ModerationStatsProps {
  stats: {
    pending?: number;
    reported?: number;
    spam?: number;
    approved?: number;
    rejected?: number;
  } | null;
  loading?: boolean;
}

export default function ModerationStats({ stats, loading }: ModerationStatsProps) {
  const statsCards = [
    {
      label: 'Pendientes',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/10'
    },
    {
      label: 'Reportados',
      value: stats?.reported || 0,
      icon: AlertTriangle,
      color: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/10'
    },
    {
      label: 'Spam',
      value: stats?.spam || 0,
      icon: Ban,
      color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-800/50'
    },
    {
      label: 'Aprobados',
      value: stats?.approved || 0,
      icon: Check,
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/10'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-12 w-12 rounded-lg mb-4"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-4 w-20 rounded mb-2"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-8 w-16 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-lg p-6 border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
