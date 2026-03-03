import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import { Button, Card } from '../../components/UI';
import PageLoader from '../../components/common/PageLoader';
import { clientesContablesApi, proyeccionesApi } from '../../services/contabilidadService';
import type { 
  ClienteContable, 
  ProyeccionPago, 
  CalcularProyeccionRequest 
} from '../../types/contabilidad';
import { REGIMEN_LABELS } from '../../types/contabilidad';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/**
 * 📊 Página de Proyecciones de Pago
 * Permite estimar impuestos futuros y compararlos vs. reales
 */
const ProyeccionesCliente: React.FC = () => {
  const { clienteId } = useParams<{ clienteId: string }>();

  const [cliente, setCliente] = useState<ClienteContable | null>(null);
  const [proyecciones, setProyecciones] = useState<ProyeccionPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCalcular, setShowCalcular] = useState(false);

  // Form inputs
  const currentDate = new Date();
  const defaultPeriodo = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const [periodo, setPeriodo] = useState(defaultPeriodo);
  const [ingresosEstimados, setIngresosEstimados] = useState(0);
  const [comprasEstimadas, setComprasEstimadas] = useState(0);
  const [calculoResult, setCalculoResult] = useState<ProyeccionPago | null>(null);
  const [calculating, setCalculating] = useState(false);

  const loadData = useCallback(async () => {
    if (!clienteId) return;
    setLoading(true);
    try {
      const [clienteRes, proyRes] = await Promise.all([
        clientesContablesApi.obtener(clienteId),
        proyeccionesApi.getByCliente(clienteId)
      ]);
      if (clienteRes.success) setCliente(clienteRes.data);
      if (proyRes.success) setProyecciones(proyRes.data);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCalcular = async () => {
    if (!clienteId) return;
    setCalculating(true);
    try {
      const params: CalcularProyeccionRequest = {
        clienteId,
        periodo,
        ingresosEstimados,
        comprasEstimadas
      };
      const response = await proyeccionesApi.calcular(params);
      if (response.success) {
        setCalculoResult(response.data);
      }
    } catch (err) {
      console.error('Error calculando proyección:', err);
    } finally {
      setCalculating(false);
    }
  };

  const handleGuardar = async () => {
    if (!clienteId) return;
    try {
      const params: CalcularProyeccionRequest = {
        clienteId,
        periodo,
        ingresosEstimados,
        comprasEstimadas
      };
      await proyeccionesApi.guardar(params);
      setShowCalcular(false);
      setCalculoResult(null);
      await loadData();
    } catch (err) {
      console.error('Error guardando proyección:', err);
    }
  };

  const handleComparar = async (proyeccion: ProyeccionPago) => {
    try {
      const response = await proyeccionesApi.comparar(proyeccion._id);
      if (response.success) {
        await loadData();
      }
    } catch (err) {
      console.error('Error comparando:', err);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <SmartDashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/dashboard/contabilidad" className="hover:text-blue-600 transition-colors">
            🏢 Contabilidad
          </Link>
          <span>/</span>
          <Link to={`/dashboard/contabilidad/clientes/${clienteId}`} className="hover:text-blue-600 transition-colors">
            {cliente?.razonSocial || '...'}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">Proyecciones</span>
        </div>

        {/* Header */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                📊 Proyecciones de Pago
              </h1>
              {cliente && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {cliente.ruc} · {cliente.razonSocial} · {REGIMEN_LABELS[cliente.regimenTributario]}
                </p>
              )}
            </div>
            <Button onClick={() => setShowCalcular(!showCalcular)}>
              {showCalcular ? '✕ Cerrar' : '🧮 Nueva Proyección'}
            </Button>
          </div>
        </Card>

        {/* Formulario de cálculo */}
        {showCalcular && (
          <Card className="p-5 border-2 border-blue-200 dark:border-blue-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🧮 Calcular Proyección</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Periodo</label>
                <input
                  type="month"
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ingresos Estimados (S/)</label>
                <input
                  type="number"
                  value={ingresosEstimados}
                  onChange={(e) => setIngresosEstimados(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compras Estimadas (S/)</label>
                <input
                  type="number"
                  value={comprasEstimadas}
                  onChange={(e) => setComprasEstimadas(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleCalcular} loading={calculating}>
                🧮 Calcular
              </Button>
              {calculoResult && (
                <Button variant="secondary" onClick={handleGuardar}>
                  💾 Guardar Proyección
                </Button>
              )}
            </div>

            {/* Resultado del cálculo */}
            {calculoResult && (
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 space-y-2">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300">📋 Resultado Estimado</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">IGV Estimado</span>
                  <span className="text-right font-mono">S/ {(calculoResult.igvEstimado?.neto || 0).toFixed(2)}</span>
                  <span className="text-gray-600 dark:text-gray-400">Renta Estimada</span>
                  <span className="text-right font-mono">S/ {(calculoResult.rentaEstimada?.monto || 0).toFixed(2)}</span>
                  <span className="font-bold text-gray-900 dark:text-white border-t pt-1">Total Estimado</span>
                  <span className="text-right font-mono font-bold border-t pt-1">S/ {(calculoResult.totalEstimado || 0).toFixed(2)}</span>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Lista de proyecciones guardadas */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">📋 Historial de Proyecciones</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Periodo</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Ingresos Est.</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">IGV Est.</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Renta Est.</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total Est.</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Precisión</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {proyecciones.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Sin proyecciones registradas
                    </td>
                  </tr>
                ) : (
                  proyecciones.map((proy) => {
                    const [anio, mes] = proy.periodo.split('-');
                    return (
                      <tr key={proy._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          {MESES[parseInt(mes) - 1]} {anio}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono">
                          S/ {(proy.ingresosEstimados || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono">
                          S/ {(proy.igvEstimado?.neto || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono">
                          S/ {(proy.rentaEstimada?.monto || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono font-bold">
                          S/ {(proy.totalEstimado || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {proy.comparacion ? (
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              proy.comparacion.precision >= 90 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : proy.comparacion.precision >= 70
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {proy.comparacion.precision.toFixed(0)}%
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {!proy.comparacion && (
                            <button
                              onClick={() => handleComparar(proy)}
                              className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 transition-colors"
                              title="Comparar con declaración real"
                            >
                              🔄 Comparar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </SmartDashboardLayout>
  );
};

export default ProyeccionesCliente;
