/**
 * 📊 AI Analytics Dashboard
 * Panel para visualizar estadísticas de uso de AI
 */

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity, Star, Zap } from 'lucide-react';

interface AIStats {
  general: {
    totalSuggestions: number;
    acceptedSuggestions: number;
    rejectedSuggestions: number;
    averageRating: number;
    acceptanceRate: number;
  };
  performance: {
    averageResponseTime: number;
    cacheHitRate: number;
    totalCacheEntries: number;
  };
  user: {
    userSuggestions: number;
    userAcceptanceRate: number;
    avgUserRating: number;
  };
}

export const AIAnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<AIStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Llamar a las 3 APIs de estadísticas en paralelo
      const [generalResponse, performanceResponse, userResponse] = await Promise.all([
        fetch('/api/analytics/stats/general'),
        fetch('/api/analytics/stats/performance'),
        fetch('/api/analytics/stats/user')
      ]);

      if (!generalResponse.ok || !performanceResponse.ok || !userResponse.ok) {
        throw new Error('Error al cargar estadísticas');
      }

      const [general, performance, user] = await Promise.all([
        generalResponse.json(),
        performanceResponse.json(),
        userResponse.json()
      ]);

      setStats({ general, performance, user });
    } catch (err) {
      console.error('Error loading AI stats:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando estadísticas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-red-800 dark:text-red-200 font-medium">Error al cargar estadísticas</h3>
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        <button
          onClick={loadStats}
          className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics AI</h2>
        <button
          onClick={loadStats}
          className="ml-auto px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sugerencias</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.general.totalSuggestions.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasa Aceptación</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(stats.general.acceptanceRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rating Promedio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.general.averageRating.toFixed(1)}/5
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cache Hit Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(stats.performance.cacheHitRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detalles por Categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tiempo Respuesta Promedio</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.performance.averageResponseTime.toFixed(0)}ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Entradas en Cache</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.performance.totalCacheEntries}
              </span>
            </div>
          </div>
        </div>

        {/* Estadísticas del Usuario */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tu Actividad</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tus Sugerencias</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.user.userSuggestions.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tu Tasa Aceptación</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {(stats.user.userAcceptanceRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tu Rating Promedio</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.user.avgUserRating.toFixed(1)}/5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Totales */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumen de Acciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.general.acceptedSuggestions.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Aceptadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.general.rejectedSuggestions.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Rechazadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {(stats.general.totalSuggestions - stats.general.acceptedSuggestions - stats.general.rejectedSuggestions).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Sin Acción</div>
          </div>
        </div>
      </div>
    </div>
  );
};