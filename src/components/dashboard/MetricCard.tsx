/**
 * 📊 TARJETAS DE MÉTRICAS
 * Componentes para mostrar estadísticas clave del dashboard
 */

import type { ReactNode } from 'react';

// ============================================
// TIPOS
// ============================================

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'gray';
  loading?: boolean;
}

// ============================================
// ICONOS
// ============================================

const TrendUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

// ============================================
// COMPONENTE
// ============================================

export const MetricCard = ({
  title,
  value,
  change,
  changeLabel = 'vs mes anterior',
  icon,
  color = 'purple',
  loading = false
}: MetricCardProps) => {
  const colorClasses = {
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    gray: 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {value}
            </p>
          )}

          {change !== undefined && !loading && (
            <div className="flex items-center gap-1">
              <span className={`flex items-center gap-1 text-sm font-medium ${
                change >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {change >= 0 ? <TrendUpIcon /> : <TrendDownIcon />}
                {change >= 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {changeLabel}
              </span>
            </div>
          )}
        </div>

        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// VARIANTE: CARD CON MINI GRÁFICA
// ============================================

interface MiniChartCardProps {
  title: string;
  value: string | number;
  data: number[];
  color?: 'purple' | 'blue' | 'green' | 'orange';
}

export const MiniChartCard = ({
  title,
  value,
  data,
  color = 'purple'
}: MiniChartCardProps) => {
  const colorMap = {
    purple: '#8B5CF6',
    blue: '#3B82F6',
    green: '#10B981',
    orange: '#F59E0B'
  };

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>

      {/* Mini gráfica */}
      <div className="flex items-end gap-1 h-16">
        {data.map((point, index) => {
          const height = ((point - min) / range) * 100;
          return (
            <div
              key={index}
              className="flex-1 rounded-t transition-all hover:opacity-75"
              style={{
                backgroundColor: colorMap[color],
                height: `${height}%`,
                minHeight: '4px'
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MetricCard;
