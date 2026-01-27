/**
 * 📊 AI Quick Stats Component
 * Componente compacto para mostrar métricas rápidas de IA
 * Ideal para mostrar en headers o toolbars
 */

import { Brain, Zap, TrendingUp, Clock } from 'lucide-react';
import { useAgentAnalysis } from '../../hooks/ai/useAgentAnalysis';

interface AIQuickStatsProps {
  compact?: boolean;
  showLabels?: boolean;
}

export const AIQuickStats: React.FC<AIQuickStatsProps> = ({ 
  compact = false,
  showLabels = true 
}) => {
  const { analysisData } = useAgentAnalysis();

  if (!analysisData) {
    return null;
  }

  const stats = [
    {
      icon: Brain,
      label: 'Score',
      value: analysisData.scores?.overall || 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      icon: TrendingUp,
      label: 'SEO',
      value: analysisData.scores?.seo || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      icon: Zap,
      label: 'Contenido',
      value: analysisData.scores?.readability || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      icon: Clock,
      label: 'Engagement',
      value: analysisData.scores?.engagement || 0,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${stat.bgColor}`}
              title={stat.label}
            >
              <Icon className={`w-4 h-4 ${stat.color}`} />
              <span className={`text-sm font-bold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`flex flex-col items-center p-3 rounded-lg ${stat.bgColor} transition-all hover:shadow-md`}
          >
            <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
            {showLabels && (
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </span>
            )}
            <span className={`text-xl font-bold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AIQuickStats;
