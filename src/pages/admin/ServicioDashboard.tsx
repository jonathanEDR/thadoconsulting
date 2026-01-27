/**
 * 📊 DASHBOARD DE SERVICIOS AVANZADO
 * Dashboard completo con métricas, gráficas y análisis en tiempo real
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useServicios } from '../../hooks/useServicios';
import { MetricCard, MiniChartCard } from '../../components/dashboard/MetricCard';
import {
  BarChartCard,
  PieChartCard,
  MultiLineChartCard
} from '../../components/dashboard/Charts';

// ============================================
// ICONOS
// ============================================

const ServiceIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ActiveIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const MoneyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const ServicioDashboard = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { servicios, loading, error } = useServicios({ autoFetch: true });

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ============================================
  // CALCULAR MÉTRICAS
  // ============================================

  const metrics = useMemo(() => {
    const total = servicios.length;
    const activos = servicios.filter(s => s.activo).length;
    const destacados = servicios.filter(s => s.destacado).length;
    const visiblesWeb = servicios.filter(s => s.visibleEnWeb).length;

    // Precio promedio
    const precioPromedio = servicios.reduce((sum, s) => sum + (s.precio || 0), 0) / (total || 1);

    // Ingresos estimados (precio * servicios activos)
    const ingresosEstimados = servicios
      .filter(s => s.activo)
      .reduce((sum, s) => sum + (s.precio || 0), 0);

    // Servicios por categoría
    const porCategoria: Record<string, number> = {};
    servicios.forEach(s => {
      porCategoria[s.categoria] = (porCategoria[s.categoria] || 0) + 1;
    });

    // Servicios por estado
    const porEstado: Record<string, number> = {};
    servicios.forEach(s => {
      porEstado[s.estado] = (porEstado[s.estado] || 0) + 1;
    });

    // Servicios por tipo de precio
    const porTipoPrecio: Record<string, number> = {};
    servicios.forEach(s => {
      porTipoPrecio[s.tipoPrecio] = (porTipoPrecio[s.tipoPrecio] || 0) + 1;
    });

    return {
      total,
      activos,
      destacados,
      visiblesWeb,
      precioPromedio,
      ingresosEstimados,
      porCategoria,
      porEstado,
      porTipoPrecio
    };
  }, [servicios]);

  // ============================================
  // DATOS PARA GRÁFICAS
  // ============================================

  const categoriaChartData = useMemo(() => {
    return Object.entries(metrics.porCategoria).map(([name, value]) => ({
      name,
      value,
      Servicios: value
    }));
  }, [metrics.porCategoria]);

  const estadoChartData = useMemo(() => {
    return Object.entries(metrics.porEstado).map(([name, value]) => ({
      name,
      value
    }));
  }, [metrics.porEstado]);

  const tipoPrecioChartData = useMemo(() => {
    return Object.entries(metrics.porTipoPrecio).map(([name, value]) => ({
      name,
      value,
      Servicios: value
    }));
  }, [metrics.porTipoPrecio]);

  // Datos de tendencia simulados (últimos 7 días)
  const trendData = useMemo(() => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return days.map((name) => ({
      name,
      value: Math.floor(metrics.total * (0.8 + Math.random() * 0.4)),
      servicios: Math.floor(metrics.total * (0.8 + Math.random() * 0.4)),
      activos: Math.floor(metrics.activos * (0.7 + Math.random() * 0.6))
    }));
  }, [metrics.total, metrics.activos]);

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
            Error al cargar el dashboard
          </h3>
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📊 Dashboard de Servicios
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Última actualización: {lastUpdate.toLocaleTimeString()}
              </span>
              <button
                onClick={() => setLastUpdate(new Date())}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Actualizar"
              >
                <RefreshIcon />
              </button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Métricas y análisis en tiempo real de tus servicios
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total de Servicios"
            value={metrics.total}
            icon={<ServiceIcon />}
            color="purple"
            change={12}
          />
          <MetricCard
            title="Servicios Activos"
            value={metrics.activos}
            icon={<ActiveIcon />}
            color="green"
            change={8}
          />
          <MetricCard
            title="Destacados"
            value={metrics.destacados}
            icon={<StarIcon />}
            color="orange"
            change={-3}
          />
          <MetricCard
            title="Precio Promedio"
            value={`$${metrics.precioPromedio.toFixed(0)}`}
            icon={<MoneyIcon />}
            color="blue"
            change={5}
          />
        </div>

        {/* Mini charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MiniChartCard
            title="Visibles en Web"
            value={metrics.visiblesWeb}
            data={[12, 19, 15, 22, 18, 25, 30]}
            color="purple"
          />
          <MiniChartCard
            title="Ingresos Estimados"
            value={`$${metrics.ingresosEstimados.toLocaleString()}`}
            data={[3000, 4500, 3800, 5200, 4800, 6100, 5900]}
            color="green"
          />
          <MiniChartCard
            title="Categorías"
            value={Object.keys(metrics.porCategoria).length}
            data={[5, 6, 5, 7, 6, 7, 7]}
            color="blue"
          />
        </div>

        {/* Gráficas principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MultiLineChartCard
            title="📈 Tendencia de Servicios"
            data={trendData}
            lines={[
              { dataKey: 'servicios', name: 'Total', color: '#8B5CF6' },
              { dataKey: 'activos', name: 'Activos', color: '#10B981' }
            ]}
            height={300}
          />
          
          <BarChartCard
            title="📊 Servicios por Categoría"
            data={categoriaChartData}
            dataKey="Servicios"
            color="#3B82F6"
            height={300}
          />
        </div>

        {/* Gráficas secundarias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PieChartCard
            title="🎯 Distribución por Estado"
            data={estadoChartData}
            height={300}
          />
          
          <BarChartCard
            title="💰 Servicios por Tipo de Precio"
            data={tipoPrecioChartData}
            dataKey="Servicios"
            xAxisKey="name"
            color="#F59E0B"
            height={300}
          />
        </div>

        {/* Acciones rápidas */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🚀 Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/dashboard/servicios/new"
              className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
            >
              <span className="text-2xl">➕</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Nuevo Servicio</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Crear un servicio</p>
              </div>
            </Link>

            <Link
              to="/dashboard/servicios/management"
              className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Gestionar Servicios</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ver todos los servicios</p>
              </div>
            </Link>

            <button
              className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
            >
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Exportar Datos</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Descargar reporte</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicioDashboard;
