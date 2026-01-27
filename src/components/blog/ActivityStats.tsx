/**
 * 📊 ActivityStats Component
 * Muestra estadísticas de actividad del usuario en el blog
 */

import { useUserBlogActivity } from '../../hooks/useUserBlogActivity';
import { 
  MessageSquare, 
  Bookmark, 
  Heart, 
  Clock,
  Trophy,
  Flame
} from 'lucide-react';

export default function ActivityStats() {
  const { stats, loading, error } = useUserBlogActivity();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-800 dark:text-red-200 font-medium">Error al cargar estadísticas</p>
        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">No hay estadísticas disponibles</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Comentarios',
      value: stats.totalComments,
      icon: MessageSquare,
      color: 'blue',
      description: 'Participaciones en el blog'
    },
    {
      title: 'Artículos Guardados',
      value: stats.totalBookmarks,
      icon: Bookmark,
      color: 'purple',
      description: 'Para leer después'
    },
    {
      title: 'Me Gusta',
      value: stats.totalLikes,
      icon: Heart,
      color: 'pink',
      description: 'Artículos que te gustaron'
    },
    {
      title: 'Historial de Lectura',
      value: stats.readingHistory,
      icon: Clock,
      color: 'green',
      description: 'Artículos leídos'
    },
    {
      title: 'Nivel de Actividad',
      value: calculateActivityLevel(stats),
      icon: Trophy,
      color: 'yellow',
      description: getActivityDescription(stats),
      isText: true
    },
    {
      title: 'Racha Actual',
      value: stats.currentStreak || 0,
      icon: Flame,
      color: 'orange',
      description: 'Días consecutivos activo',
      suffix: ' días'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const colorClasses = getColorClasses(card.color);
          
          return (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {card.isText ? card.value : `${card.value}${card.suffix || ''}`}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {card.description}
                  </p>
                </div>
                <div className={`${colorClasses.bg} ${colorClasses.text} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Resumen de Actividad
        </h3>
        <div className="space-y-4">
          <ActivityProgressBar 
            label="Comentarios este mes"
            current={stats.totalComments}
            goal={20}
            color="blue"
          />
          <ActivityProgressBar 
            label="Artículos leídos este mes"
            current={stats.readingHistory}
            goal={10}
            color="green"
          />
          <ActivityProgressBar 
            label="Interacciones totales"
            current={stats.totalComments + stats.totalLikes}
            goal={50}
            color="purple"
          />
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
          Logros Desbloqueados
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getAchievements(stats).map((achievement, index) => (
            <div 
              key={index}
              className={`text-center p-4 rounded-lg ${
                achievement.unlocked 
                  ? 'bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-600' 
                  : 'bg-gray-100 dark:bg-gray-800/50 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{achievement.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ActivityProgressBar({ 
  label, 
  current, 
  goal, 
  color 
}: { 
  label: string; 
  current: number; 
  goal: number; 
  color: string;
}) {
  const percentage = Math.min((current / goal) * 100, 100);
  const colorClasses = getColorClasses(color);

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-gray-600 dark:text-gray-400">{current} / {goal}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className={`${colorClasses.progress} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Helper Functions
function getColorClasses(color: string) {
  const colors = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      progress: 'bg-blue-500'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      progress: 'bg-purple-500'
    },
    pink: {
      bg: 'bg-pink-100',
      text: 'text-pink-600',
      progress: 'bg-pink-500'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      progress: 'bg-green-500'
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      progress: 'bg-yellow-500'
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      progress: 'bg-orange-500'
    }
  };
  return colors[color as keyof typeof colors] || colors.blue;
}

function calculateActivityLevel(stats: any): string {
  const totalActivity = stats.totalComments + stats.totalLikes + stats.readingHistory;
  
  if (totalActivity >= 100) return 'Experto';
  if (totalActivity >= 50) return 'Avanzado';
  if (totalActivity >= 20) return 'Intermedio';
  if (totalActivity >= 5) return 'Principiante';
  return 'Novato';
}

function getActivityDescription(stats: any): string {
  const totalActivity = stats.totalComments + stats.totalLikes + stats.readingHistory;
  
  if (totalActivity >= 100) return '¡Eres muy activo! 🎉';
  if (totalActivity >= 50) return 'Buen progreso';
  if (totalActivity >= 20) return 'Sigue así';
  if (totalActivity >= 5) return 'Comenzando bien';
  return 'Empieza a interactuar';
}

function getAchievements(stats: any) {
  return [
    {
      icon: '💬',
      title: 'Comentarista',
      description: 'Primera comentario',
      unlocked: stats.totalComments >= 1
    },
    {
      icon: '📚',
      title: 'Lector',
      description: '10 artículos leídos',
      unlocked: stats.readingHistory >= 10
    },
    {
      icon: '❤️',
      title: 'Entusiasta',
      description: '25 me gusta',
      unlocked: stats.totalLikes >= 25
    },
    {
      icon: '🔥',
      title: 'Racha',
      description: '7 días seguidos',
      unlocked: (stats.currentStreak || 0) >= 7
    },
    {
      icon: '⭐',
      title: 'Coleccionista',
      description: '20 guardados',
      unlocked: stats.totalBookmarks >= 20
    },
    {
      icon: '🎯',
      title: 'Activo',
      description: '50 interacciones',
      unlocked: (stats.totalComments + stats.totalLikes) >= 50
    },
    {
      icon: '👑',
      title: 'Veterano',
      description: '100 acciones',
      unlocked: (stats.totalComments + stats.totalLikes + stats.readingHistory) >= 100
    },
    {
      icon: '🚀',
      title: 'Experto',
      description: '200 acciones',
      unlocked: (stats.totalComments + stats.totalLikes + stats.readingHistory) >= 200
    }
  ];
}
