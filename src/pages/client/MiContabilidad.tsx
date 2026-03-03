import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/UI';
import PageLoader from '../../components/common/PageLoader';
import { portalClienteApi } from '../../services/contabilidadService';
import type { 
  MiCuentaContable, 
  DeclaracionMensual, 
  MiEstadoContable 
} from '../../types/contabilidad';
import { 
  REGIMEN_LABELS, 
  ESTADO_DECLARACION_CONFIG, 
  ESTADO_CLIENTE_CONFIG 
} from '../../types/contabilidad';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/**
 * 👤 Portal Contable para Clientes
 * Permite al cliente ver su estado contable, declaraciones y proyecciones
 * Usado dentro del dashboard del cliente
 */
const MiContabilidad: React.FC = () => {
  const [cuenta, setCuenta] = useState<MiCuentaContable | null>(null);
  const [estado, setEstado] = useState<MiEstadoContable | null>(null);
  const [declaraciones, setDeclaraciones] = useState<DeclaracionMensual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear());
  const [tabActiva, setTabActiva] = useState<'resumen' | 'declaraciones'>('resumen');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cuentaRes, estadoRes, declRes] = await Promise.all([
        portalClienteApi.getMiCuenta(),
        portalClienteApi.getMiEstado(),
        portalClienteApi.getMisDeclaraciones(anioFiltro)
      ]);

      if (cuentaRes.success) setCuenta(cuentaRes.data);
      if (estadoRes.success) setEstado(estadoRes.data);
      if (declRes.success) {
        // Backend devuelve { cliente, declaraciones, pagination } o un array directo
        const declData = declRes.data;
        if (Array.isArray(declData)) {
          setDeclaraciones(declData);
        } else if (declData && Array.isArray(declData.declaraciones)) {
          setDeclaraciones(declData.declaraciones);
        } else {
          setDeclaraciones([]);
        }
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { code?: string; message?: string }; status?: number } };
      if (axiosErr.response?.data?.code === 'NO_ACCOUNTING_ACCOUNT') {
        setError('No tienes una cuenta contable vinculada. Contacta a tu contador.');
      } else if (axiosErr.response?.status === 403) {
        setError('No tienes permisos para acceder al portal contable.');
      } else {
        setError('Error al cargar tus datos contables.');
      }
    } finally {
      setLoading(false);
    }
  }, [anioFiltro]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">🏢</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Portal Contable</h2>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </Card>
      </div>
    );
  }

  if (!cuenta) return null;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header de cuenta */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">🏢 Mi Contabilidad</h1>
            <p className="text-white/80 mt-1 font-mono">{cuenta.ruc}</p>
            <p className="text-white/90 font-medium mt-1">{cuenta.razonSocial}</p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white`}>
              {ESTADO_CLIENTE_CONFIG[cuenta.estado]?.icon} {ESTADO_CLIENTE_CONFIG[cuenta.estado]?.label}
            </span>
            <div className="mt-2">
              <span className="text-sm text-white/70">Régimen:</span>
              <span className="ml-2 text-sm font-medium">{REGIMEN_LABELS[cuenta.regimenTributario]}</span>
            </div>
            {cuenta.contadorAsignado?.nombre && (
              <div className="mt-1">
                <span className="text-sm text-white/70">Contador:</span>
                <span className="ml-2 text-sm">{cuenta.contadorAsignado.nombre}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Estado rápido */}
      {estado && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{estado.declaracionesPendientes ?? estado.pendientes ?? 0}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Declaraciones Pendientes</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{declaraciones.filter(d => d.estado === 'PAGADO').length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Pagadas este año</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-lg font-bold text-blue-600">
              {estado.proximoVencimiento 
                ? new Date(estado.proximoVencimiento).toLocaleDateString('es-PE')
                : 'Sin vencimiento'
              }
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Próximo Vencimiento</div>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setTabActiva('resumen')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tabActiva === 'resumen'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📊 Resumen
        </button>
        <button
          onClick={() => setTabActiva('declaraciones')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tabActiva === 'declaraciones'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📄 Declaraciones {anioFiltro}
        </button>
      </div>

      {/* Tab: Resumen */}
      {tabActiva === 'resumen' && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">📄 Últimas Declaraciones</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {declaraciones.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Sin declaraciones recientes</div>
            ) : (
              declaraciones.slice(0, 5).map((dec) => (
                <div key={dec._id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {MESES[dec.mes - 1]} {dec.anio}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_DECLARACION_CONFIG[dec.estado]?.color}`}>
                      {ESTADO_DECLARACION_CONFIG[dec.estado]?.icon} {ESTADO_DECLARACION_CONFIG[dec.estado]?.label}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                    S/ {(dec.totalAPagar || 0).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Tab: Declaraciones del año */}
      {tabActiva === 'declaraciones' && (
        <>
          <div className="flex justify-end">
            <select
              value={anioFiltro}
              onChange={(e) => setAnioFiltro(parseInt(e.target.value))}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Periodo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">IGV</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Renta</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vencimiento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {declaraciones.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        Sin declaraciones para {anioFiltro}
                      </td>
                    </tr>
                  ) : (
                    declaraciones.map((dec) => (
                      <tr key={dec._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          {MESES[dec.mes - 1]} {dec.anio}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_DECLARACION_CONFIG[dec.estado]?.color}`}>
                            {ESTADO_DECLARACION_CONFIG[dec.estado]?.icon} {ESTADO_DECLARACION_CONFIG[dec.estado]?.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono">
                          S/ {(dec.detalleIGV?.igvAPagar || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono">
                          S/ {(dec.detalleRenta?.rentaAPagar || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono font-bold">
                          S/ {(dec.totalAPagar || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {dec.fechaVencimiento
                            ? new Date(dec.fechaVencimiento).toLocaleDateString('es-PE')
                            : '-'
                          }
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default MiContabilidad;
