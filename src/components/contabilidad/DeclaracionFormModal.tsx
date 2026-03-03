import React, { useState, useEffect } from 'react';
import { Button } from '../UI';
import { declaracionesApi } from '../../services/contabilidadService';
import type { 
  ClienteContable, 
  DeclaracionMensual, 
  RegistrarDeclaracionData,
  CalculoImpuestosResult,
  EstadoDeclaracion 
} from '../../types/contabilidad';
import { REGIMEN_LABELS, ESTADO_DECLARACION_CONFIG } from '../../types/contabilidad';

interface DeclaracionFormModalProps {
  cliente: ClienteContable;
  declaracion?: DeclaracionMensual;
  onClose: () => void;
  onSubmit: (data: RegistrarDeclaracionData) => Promise<void>;
}

/**
 * 📄 Modal para registrar/editar declaraciones mensuales
 * Incluye calculadora de impuestos integrada
 */
const DeclaracionFormModal: React.FC<DeclaracionFormModalProps> = ({
  cliente,
  declaracion,
  onClose,
  onSubmit
}) => {
  const isEditing = !!declaracion;
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculo, setCalculo] = useState<CalculoImpuestosResult | null>(null);

  // Periodo
  const currentDate = new Date();
  const defaultPeriodo = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const [periodo, setPeriodo] = useState(declaracion?.periodo || defaultPeriodo);
  const [ventasGravadas, setVentasGravadas] = useState(declaracion?.detalleIGV?.ventasGravadas || 0);
  const [comprasGravadas, setComprasGravadas] = useState(declaracion?.detalleIGV?.comprasGravadas || 0);
  const [saldoFavor, setSaldoFavor] = useState(declaracion?.detalleIGV?.saldoFavorAnterior || 0);
  const [formulario, setFormulario] = useState(declaracion?.formulario || (cliente.regimenTributario === 'RUS' ? 'NRUS' : 'PDT621'));
  const [numeroOrden, setNumeroOrden] = useState(declaracion?.numeroOrden || '');
  const [estado, setEstado] = useState<EstadoDeclaracion>(declaracion?.estado || 'PENDIENTE');
  const [esRectificatoria, setEsRectificatoria] = useState(declaracion?.esRectificatoria || false);

  // Calcular preview automáticamente
  const handleCalcular = async () => {
    if (!ventasGravadas && !comprasGravadas && cliente.regimenTributario !== 'RUS') return;
    setCalculating(true);
    try {
      // Backend expects creditoFiscal (IGV of purchases), not comprasGravadas
      const creditoFiscal = Math.round(comprasGravadas * 0.18 * 100) / 100;
      const response = await declaracionesApi.calcularPreview({
        clienteId: cliente._id,
        periodo,
        ventasGravadas,
        creditoFiscal,
        saldoFavorAnterior: saldoFavor
      });
      if (response.success) {
        setCalculo(response.data);
      }
    } catch (err) {
      console.error('Error calculando:', err);
    } finally {
      setCalculating(false);
    }
  };

  // Auto-calcular cuando cambian montos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (ventasGravadas || comprasGravadas || cliente.regimenTributario === 'RUS') {
        handleCalcular();
      }
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ventasGravadas, comprasGravadas, saldoFavor, periodo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const creditoFiscalValue = calculo?.detalleIGV?.creditoFiscal
        ?? Math.round(comprasGravadas * 0.18 * 100) / 100;

      const data: RegistrarDeclaracionData = {
        clienteId: cliente._id,
        periodo,
        // Flat fields — required by backend to recalculate
        ventasGravadas,
        creditoFiscal: creditoFiscalValue,
        saldoFavorAnterior: saldoFavor,
        detalleIGV: calculo?.detalleIGV || {
          ventasGravadas,
          comprasGravadas,
          saldoFavorAnterior: saldoFavor
        },
        detalleRenta: calculo?.detalleRenta,
        formulario: formulario || undefined,
        numeroOrden: numeroOrden || undefined,
        estado,
        esRectificatoria
      };

      await onSubmit(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Error al guardar declaración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {isEditing ? '✏️ Editar Declaración' : '📄 Nueva Declaración'}
            </h2>
            <p className="text-sm text-gray-500">{cliente.ruc} - {cliente.razonSocial} ({REGIMEN_LABELS[cliente.regimenTributario]})</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Periodo y estado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Periodo <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                disabled={isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoDeclaracion)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Object.entries(ESTADO_DECLARACION_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.icon} {cfg.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={esRectificatoria}
                  onChange={(e) => setEsRectificatoria(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Rectificatoria</span>
              </label>
            </div>
          </div>

          {/* Montos - Solo para regímenes que NO son RUS */}
          {cliente.regimenTributario !== 'RUS' ? (
            <fieldset className="space-y-4">
              <legend className="text-md font-semibold text-gray-900 dark:text-white">💰 Datos del Periodo</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ventas Gravadas (S/)
                  </label>
                  <input
                    type="number"
                    value={ventasGravadas}
                    onChange={(e) => setVentasGravadas(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Compras Gravadas (S/)
                  </label>
                  <input
                    type="number"
                    value={comprasGravadas}
                    onChange={(e) => setComprasGravadas(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Saldo a Favor (S/)
                  </label>
                  <input
                    type="number"
                    value={saldoFavor}
                    onChange={(e) => setSaldoFavor(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </fieldset>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-sm">
              <span className="font-medium text-green-800 dark:text-green-400">
                🟢 Nuevo RUS - Categoría {cliente.configuracionTributaria?.categoriaRUS || 1}
              </span>
              <p className="text-green-600 dark:text-green-300 mt-1">
                Cuota fija mensual. No requiere detalle de ventas/compras.
              </p>
            </div>
          )}

          {/* Preview de cálculo */}
          {calculo && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 space-y-3">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                🧮 Cálculo de Impuestos
                {calculating && <span className="text-xs animate-pulse">recalculando...</span>}
              </h4>
              
              {/* IGV exoneration notice */}
              {calculo.resumen?.esExoneradoIGV && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-700 dark:text-green-400">
                  🌿 {calculo.detalleIGV?.nota || 'Cliente en zona exonerada/inafecta de IGV — IGV = S/ 0.00'}
                </div>
              )}

              {/* IGV - solo si no es RUS */}
              {calculo.detalleIGV && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Débito Fiscal (IGV Ventas)</span>
                  <span className="text-right font-mono">S/ {(calculo.detalleIGV.debitoFiscal || 0).toFixed(2)}</span>
                  
                  <span className="text-gray-600 dark:text-gray-400">Crédito Fiscal (IGV Compras)</span>
                  <span className="text-right font-mono">S/ {(calculo.detalleIGV.creditoFiscal || 0).toFixed(2)}</span>
                  
                  {(calculo.detalleIGV.saldoFavorAnterior || 0) > 0 && (
                    <>
                      <span className="text-gray-600 dark:text-gray-400">Saldo a Favor Anterior</span>
                      <span className="text-right font-mono">- S/ {(calculo.detalleIGV.saldoFavorAnterior || 0).toFixed(2)}</span>
                    </>
                  )}
                  
                  <span className="text-gray-900 dark:text-white font-semibold border-t border-blue-200 dark:border-blue-700 pt-1">IGV a Pagar</span>
                  <span className="text-right font-mono font-semibold border-t border-blue-200 dark:border-blue-700 pt-1">
                    S/ {(calculo.detalleIGV.igvAPagar || 0).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Renta */}
              <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-blue-200 dark:border-blue-700">
                <span className="text-gray-600 dark:text-gray-400">Renta ({calculo.detalleRenta?.regimenAplicado || calculo.regimen})</span>
                <span className="text-right font-mono">S/ {(calculo.detalleRenta?.rentaAPagar || 0).toFixed(2)}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-3 border-t-2 border-blue-300 dark:border-blue-600">
                <span className="text-lg font-bold text-blue-900 dark:text-blue-200">TOTAL A PAGAR</span>
                <span className="text-lg font-bold font-mono text-blue-900 dark:text-blue-200">
                  S/ {(calculo.resumen?.totalAPagar || 0).toFixed(2)}
                </span>
              </div>

              {calculo.fechaVencimiento && (
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  📅 Fecha de vencimiento: {new Date(calculo.fechaVencimiento).toLocaleDateString('es-PE')}
                </div>
              )}
            </div>
          )}

          {/* Datos adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo Formulario
              </label>
              <select
                value={formulario}
                onChange={(e) => setFormulario(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="PDT621">PDT 621</option>
                <option value="PDT621_SIMPLIFICADO">PDT 621 Simplificado</option>
                <option value="FORMULARIO_VIRTUAL">Formulario Virtual</option>
                <option value="NRUS">NRUS (Nuevo RUS)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                N° Orden
              </label>
              <input
                type="text"
                value={numeroOrden}
                onChange={(e) => setNumeroOrden(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button loading={loading} onClick={() => {}}>
              {isEditing ? '💾 Actualizar' : '📄 Registrar Declaración'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeclaracionFormModal;
