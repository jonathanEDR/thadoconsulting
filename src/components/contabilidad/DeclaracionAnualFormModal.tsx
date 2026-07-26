import React, { useState, useEffect } from 'react';
import { Button } from '../UI';
import { declaracionesAnualesApi } from '../../services/contabilidadService';
import type {
  ClienteContable,
  DeclaracionAnual,
  RegistrarDeclaracionAnualData,
  CalculoRentaAnualResult,
  EstadoDeclaracion
} from '../../types/contabilidad';
import { ESTADO_DECLARACION_CONFIG } from '../../types/contabilidad';

interface DeclaracionAnualFormModalProps {
  cliente: ClienteContable;
  declaracion?: DeclaracionAnual;
  anioInicial?: number;
  onClose: () => void;
  onSubmit: (data: RegistrarDeclaracionAnualData) => Promise<void>;
}

/**
 * 📅 Modal para registrar/editar la Declaración Jurada Anual de Renta (Formulario 710)
 * Solo aplica a clientes en régimen MYPE Tributario o Régimen General.
 */
const DeclaracionAnualFormModal: React.FC<DeclaracionAnualFormModalProps> = ({
  cliente,
  declaracion,
  anioInicial,
  onClose,
  onSubmit
}) => {
  const isEditing = !!declaracion;
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [anio] = useState(declaracion?.anio || anioInicial || new Date().getFullYear());
  const [rentaNetaAnual, setRentaNetaAnual] = useState(declaracion?.rentaNetaAnual || 0);
  const [rentaNetaAnualEditadaManualmente, setRentaNetaAnualEditadaManualmente] = useState(isEditing);
  const [estado, setEstado] = useState<EstadoDeclaracion>(declaracion?.estado || 'PENDIENTE');
  const [numeroOrden, setNumeroOrden] = useState(declaracion?.numeroOrden || '');
  const [observaciones, setObservaciones] = useState(declaracion?.observaciones || '');
  const [fechaVencimiento, setFechaVencimiento] = useState(
    declaracion?.fechaVencimiento ? declaracion.fechaVencimiento.slice(0, 10) : ''
  );

  const [calculo, setCalculo] = useState<CalculoRentaAnualResult | null>(null);

  // ── Auto-cálculo: sugiere renta neta anual (si no se ha editado a mano) y recalcula tramos ──
  useEffect(() => {
    const timer = setTimeout(async () => {
      setCalculating(true);
      try {
        const response = await declaracionesAnualesApi.calcularPreview({
          clienteId: cliente._id,
          anio,
          rentaNetaAnual: rentaNetaAnualEditadaManualmente ? rentaNetaAnual : undefined
        });
        if (response.success) {
          setCalculo(response.data);
          if (!rentaNetaAnualEditadaManualmente) {
            setRentaNetaAnual(response.data.rentaNetaAnual);
          }
        }
      } catch { /* silent */ }
      finally { setCalculating(false); }
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anio, rentaNetaAnual, rentaNetaAnualEditadaManualmente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data: RegistrarDeclaracionAnualData = {
        clienteId: cliente._id,
        anio,
        rentaNetaAnual,
        estado,
        numeroOrden: numeroOrden || undefined,
        fechaVencimiento: fechaVencimiento || undefined,
        observaciones: observaciones || undefined
      };
      await onSubmit(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Error al guardar la Declaración Anual');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {isEditing ? '✏️ Editar' : '📅 Nueva'} Declaración Anual {anio}
            </h2>
            <p className="text-sm text-gray-500">{cliente.ruc} - {cliente.razonSocial} (Formulario Virtual 710)</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Renta Neta Anual (S/) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={rentaNetaAnual}
                onChange={(e) => {
                  setRentaNetaAnualEditadaManualmente(true);
                  setRentaNetaAnual(parseFloat(e.target.value) || 0);
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                step="0.01"
                min="0"
                required
              />
              {calculo && !rentaNetaAnualEditadaManualmente && (
                <p className="text-[11px] text-blue-500 dark:text-blue-400 mt-1">
                  💡 Sugerida automáticamente: suma de ventas gravadas de {calculo.mesesDeclaradosConsiderados} declaración(es) mensual(es) de {anio}. Editable si necesitas ajustarla.
                </p>
              )}
              {calculo && calculo.mesesDeclaradosConsiderados < 12 && (
                <p className="text-[11px] text-amber-500 dark:text-amber-400 mt-1">
                  ⚠️ Solo hay {calculo.mesesDeclaradosConsiderados} de 12 meses declarados en {anio}. Verifica antes de presentar.
                </p>
              )}
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
          </div>

          {/* Preview cálculo por tramos */}
          {calculo && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 space-y-3">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                🧮 Cálculo por Tramos UIT (S/ {calculo.uitAplicada.toLocaleString('es-PE')}) {calculating && <span className="text-xs animate-pulse">recalculando...</span>}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {calculo.regimen === 'MYPE' ? 'Tramo 10% (hasta 15 UIT)' : 'Tasa 29.5% (renta neta total)'}
                </span>
                <span className="text-right font-mono">S/ {calculo.tramos.tramo1Impuesto.toFixed(2)}</span>
                {calculo.regimen === 'MYPE' && calculo.tramos.tramo2Base > 0 && (
                  <>
                    <span className="text-gray-600 dark:text-gray-400">Tramo 29.5% (exceso de 15 UIT)</span>
                    <span className="text-right font-mono">S/ {calculo.tramos.tramo2Impuesto.toFixed(2)}</span>
                  </>
                )}
                <span className="font-semibold text-gray-900 dark:text-white border-t border-blue-200 dark:border-blue-700 pt-1">Impuesto Calculado</span>
                <span className="text-right font-mono font-semibold border-t border-blue-200 dark:border-blue-700 pt-1">S/ {calculo.impuestoCalculado.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-blue-200 dark:border-blue-700">
                <span className="text-gray-600 dark:text-gray-400">Pagos a cuenta del año</span>
                <span className="text-right font-mono">S/ {calculo.totalPagosACuenta.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-blue-300 dark:border-blue-600">
                {calculo.saldoAPagar > 0 ? (
                  <>
                    <span className="text-lg font-bold text-red-700 dark:text-red-400">SALDO A PAGAR</span>
                    <span className="text-lg font-bold font-mono text-red-700 dark:text-red-400">S/ {calculo.saldoAPagar.toFixed(2)}</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">SALDO A FAVOR</span>
                    <span className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-400">S/ {calculo.saldoAFavor.toFixed(2)}</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Vencimiento</label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Varía según el último dígito del RUC (cronograma SUNAT).</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">N° Orden</label>
              <input
                type="text"
                value={numeroOrden}
                onChange={(e) => setNumeroOrden(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
            <input
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Opcional..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button loading={loading} onClick={() => {}}>
              {isEditing ? '💾 Actualizar' : '📅 Registrar Declaración Anual'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeclaracionAnualFormModal;
