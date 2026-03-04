import React, { useState, useEffect } from 'react';
import { Button } from '../UI';
import { declaracionesApi } from '../../services/contabilidadService';
import type { 
  ClienteContable, 
  DeclaracionMensual, 
  RegistrarDeclaracionData,
  CalculoImpuestosResult,
  EstadoDeclaracion,
  TipoDeclaracion,

  DetalleAFP,
  AFPProvider
} from '../../types/contabilidad';
import { REGIMEN_LABELS, ESTADO_DECLARACION_CONFIG, TIPO_DECLARACION_CONFIG, AFP_PROVIDERS_INFO } from '../../types/contabilidad';

interface DeclaracionFormModalProps {
  cliente: ClienteContable;
  declaracion?: DeclaracionMensual;
  tipoInicial?: TipoDeclaracion;
  onClose: () => void;
  onSubmit: (data: RegistrarDeclaracionData) => Promise<void>;
}

/**
 * 📄 Modal para registrar/editar declaraciones mensuales
 * Soporta IGV/Renta, Planilla (PLAME) y AFP
 */
const DeclaracionFormModal: React.FC<DeclaracionFormModalProps> = ({
  cliente,
  declaracion,
  tipoInicial,
  onClose,
  onSubmit
}) => {
  const isEditing = !!declaracion;
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Tipo de declaración
  const [tipo, setTipo] = useState<TipoDeclaracion>(declaracion?.tipo || tipoInicial || 'IGV_RENTA');
  
  // Periodo y estado común
  const currentDate = new Date();
  const defaultPeriodo = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const [periodo, setPeriodo] = useState(declaracion?.periodo || defaultPeriodo);
  const [estado, setEstado] = useState<EstadoDeclaracion>(declaracion?.estado || 'PENDIENTE');
  const [esRectificatoria, setEsRectificatoria] = useState(declaracion?.esRectificatoria || false);
  const [numeroOrden, setNumeroOrden] = useState(declaracion?.numeroOrden || '');
  const [observaciones, setObservaciones] = useState('');
  
  // ── IGV/Renta State ──
  const [calculo, setCalculo] = useState<CalculoImpuestosResult | null>(null);
  const [ventasGravadas, setVentasGravadas] = useState(declaracion?.detalleIGV?.ventasGravadas || 0);
  const [comprasGravadas, setComprasGravadas] = useState(declaracion?.detalleIGV?.comprasGravadas || 0);
  const [saldoFavor, setSaldoFavor] = useState(declaracion?.detalleIGV?.saldoFavorAnterior || 0);
  
  // ── Planilla State ──
  // ONP workers within PLAME
  const [plCantONP, setPlCantONP] = useState(declaracion?.detallePlanilla?.cantidadTrabajadoresONP || 0);
  const [plTotalRemuONP, setPlTotalRemuONP] = useState(declaracion?.detallePlanilla?.totalRemuneracionesONP || 0);
  // AFP workers within PLAME (referencia; su aporte AFP va a AFPnet aparte)
  const [plCantAFP, setPlCantAFP] = useState(declaracion?.detallePlanilla?.cantidadTrabajadoresAFP || 0);
  const [plTotalRemuAFP, setPlTotalRemuAFP] = useState(declaracion?.detallePlanilla?.totalRemuneracionesAFP || 0);
  // Seguridad social — montos manuales ingresados por el contador
  const [plESSALUD, setPlESSALUD] = useState(declaracion?.detallePlanilla?.essalud || 0);
  const [plSIS, setPlSIS] = useState(declaracion?.detallePlanilla?.sis || 0);
  // Otros campos planilla
  const [plRetenciones5ta, setPlRetenciones5ta] = useState(declaracion?.detallePlanilla?.retenciones5ta || 0);
  const [plCant5ta, setPlCant5ta] = useState(declaracion?.detallePlanilla?.cantidadTrabajadores5ta || 0);
  const [plVidaLey, setPlVidaLey] = useState(declaracion?.detallePlanilla?.vidaLey || 0);
  // Totales y cálculo local (sin llamada al backend)
  const plTotalTrabajadores = plCantONP + plCantAFP;
  const plTotalRemuneraciones = plTotalRemuONP + plTotalRemuAFP;
  const plONPCalculado = Math.round(plTotalRemuONP * 0.13 * 100) / 100;
  const plTotalPlanillaLocal = Math.round((plESSALUD + plSIS + plONPCalculado + plRetenciones5ta + plVidaLey) * 100) / 100;
  const plReferESSALUD = Math.round(plTotalRemuneraciones * 0.09 * 100) / 100;
  
  // ── AFP State ──
  const [calculoAFP, setCalculoAFP] = useState<DetalleAFP | null>(declaracion?.detalleAFP || null);
  const [afpNombre, setAfpNombre] = useState<AFPProvider | ''>(declaracion?.detalleAFP?.afpNombre || (cliente.configuracionTributaria?.configAFP?.afpNombre as AFPProvider) || '');
  const [afpCantAfiliados, setAfpCantAfiliados] = useState(declaracion?.detalleAFP?.cantidadAfiliados || 0);
  const [afpTotalRemuneraciones, setAfpTotalRemuneraciones] = useState(declaracion?.detalleAFP?.totalRemuneraciones || 0);
  const [afpAporteVoluntario, setAfpAporteVoluntario] = useState(declaracion?.detalleAFP?.aporteVoluntario || 0);

  // ── Auto-cálculo IGV/Renta ──
  useEffect(() => {
    if (tipo !== 'IGV_RENTA') return;
    const timer = setTimeout(async () => {
      if (!ventasGravadas && !comprasGravadas && cliente.regimenTributario !== 'RUS') return;
      setCalculating(true);
      try {
        const creditoFiscal = Math.round(comprasGravadas * 0.18 * 100) / 100;
        const response = await declaracionesApi.calcularPreview({
          clienteId: cliente._id,
          periodo,
          ventasGravadas,
          creditoFiscal,
          saldoFavorAnterior: saldoFavor
        });
        if (response.success) setCalculo(response.data);
      } catch { /* silent */ }
      finally { setCalculating(false); }
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ventasGravadas, comprasGravadas, saldoFavor, periodo, tipo]);

  // ── Auto-cálculo AFP ──
  useEffect(() => {
    if (tipo !== 'AFP') return;
    const timer = setTimeout(async () => {
      if (!afpTotalRemuneraciones || !afpNombre) return;
      setCalculating(true);
      try {
        const response = await declaracionesApi.calcularAFPPreview({
          afpNombre,
          cantidadAfiliados: afpCantAfiliados,
          totalRemuneraciones: afpTotalRemuneraciones,
          aporteVoluntario: afpAporteVoluntario
        });
        if (response.success) setCalculoAFP(response.data);
      } catch { /* silent */ }
      finally { setCalculating(false); }
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afpNombre, afpCantAfiliados, afpTotalRemuneraciones, afpAporteVoluntario, tipo]);

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data: RegistrarDeclaracionData = {
        clienteId: cliente._id,
        periodo,
        tipo,
        estado,
        esRectificatoria,
        numeroOrden: numeroOrden || undefined,
        observaciones: observaciones || undefined
      };

      if (tipo === 'IGV_RENTA') {
        const creditoFiscalValue = calculo?.detalleIGV?.creditoFiscal ?? Math.round(comprasGravadas * 0.18 * 100) / 100;
        data.ventasGravadas = ventasGravadas;
        data.creditoFiscal = creditoFiscalValue;
        data.saldoFavorAnterior = saldoFavor;
        data.detalleIGV = calculo?.detalleIGV || { ventasGravadas, comprasGravadas, saldoFavorAnterior: saldoFavor };
        data.detalleRenta = calculo?.detalleRenta;
        data.formulario = cliente.regimenTributario === 'RUS' ? 'NRUS' : 'PDT621';
      } else if (tipo === 'PLANILLA') {
        data.cantidadTrabajadores = plTotalTrabajadores;
        data.totalRemuneraciones = plTotalRemuneraciones;
        data.cantidadTrabajadoresONP = plCantONP;
        data.totalRemuneracionesONP = plTotalRemuONP;
        data.cantidadTrabajadoresAFP = plCantAFP;
        data.totalRemuneracionesAFP = plTotalRemuAFP;
        data.essalud = plESSALUD;
        data.sis = plSIS;
        data.retenciones5ta = plRetenciones5ta;
        data.cantidadTrabajadores5ta = plCant5ta;
        data.vidaLey = plVidaLey;
        data.formulario = 'PLAME';
      } else if (tipo === 'AFP') {
        data.afpNombre = afpNombre;
        data.cantidadAfiliados = afpCantAfiliados;
        data.totalRemuneracionesAFP = afpTotalRemuneraciones;
        data.aporteVoluntario = afpAporteVoluntario;
        data.formulario = 'AFPNET';
      }

      await onSubmit(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Error al guardar declaración');
    } finally {
      setLoading(false);
    }
  };

  // Determine which obligation types are available for this client
  const obligaciones = cliente.configuracionTributaria?.obligaciones;
  const tiposDisponibles: TipoDeclaracion[] = ['IGV_RENTA'];
  if (typeof obligaciones === 'object' && obligaciones !== null && !Array.isArray(obligaciones)) {
    if (obligaciones.planilla) tiposDisponibles.push('PLANILLA');
    if (obligaciones.afp) tiposDisponibles.push('AFP');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {isEditing ? '✏️ Editar' : '📄 Nueva'} Declaración {TIPO_DECLARACION_CONFIG[tipo]?.icon}
            </h2>
            <p className="text-sm text-gray-500">{cliente.ruc} - {cliente.razonSocial} ({REGIMEN_LABELS[cliente.regimenTributario]})</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Tipo de declaración */}
          {!isEditing && tiposDisponibles.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Declaración
              </label>
              <div className="flex flex-wrap gap-2">
                {tiposDisponibles.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      tipo === t
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {TIPO_DECLARACION_CONFIG[t].icon} {TIPO_DECLARACION_CONFIG[t].label}
                  </button>
                ))}
              </div>
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

          {/* ══════════════════════════════════════════════ */}
          {/* ═══ IGV / RENTA FORM ═══ */}
          {/* ══════════════════════════════════════════════ */}
          {tipo === 'IGV_RENTA' && (
            <>
              {cliente.regimenTributario !== 'RUS' ? (
                <fieldset className="space-y-4">
                  <legend className="text-md font-semibold text-gray-900 dark:text-white">💰 Datos del Periodo</legend>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ventas Gravadas (S/)</label>
                      <input type="number" value={ventasGravadas} onChange={(e) => setVentasGravadas(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono" step="0.01" min="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compras Gravadas (S/)</label>
                      <input type="number" value={comprasGravadas} onChange={(e) => setComprasGravadas(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono" step="0.01" min="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Saldo a Favor (S/)</label>
                      <input type="number" value={saldoFavor} onChange={(e) => setSaldoFavor(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono" step="0.01" min="0" />
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

              {/* Preview cálculo IGV/Renta */}
              {calculo && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 space-y-3">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    🧮 Cálculo de Impuestos {calculating && <span className="text-xs animate-pulse">recalculando...</span>}
                  </h4>
                  {calculo.detalleIGV && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Débito Fiscal</span>
                      <span className="text-right font-mono">S/ {(calculo.detalleIGV.debitoFiscal || 0).toFixed(2)}</span>
                      <span className="text-gray-600 dark:text-gray-400">Crédito Fiscal</span>
                      <span className="text-right font-mono">S/ {(calculo.detalleIGV.creditoFiscal || 0).toFixed(2)}</span>
                      <span className="font-semibold text-gray-900 dark:text-white border-t border-blue-200 dark:border-blue-700 pt-1">IGV a Pagar</span>
                      <span className="text-right font-mono font-semibold border-t border-blue-200 dark:border-blue-700 pt-1">S/ {(calculo.detalleIGV.igvAPagar || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-blue-200 dark:border-blue-700">
                    <span className="text-gray-600 dark:text-gray-400">Renta ({calculo.detalleRenta?.regimenAplicado || calculo.regimen})</span>
                    <span className="text-right font-mono">S/ {(calculo.detalleRenta?.rentaAPagar || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-blue-300 dark:border-blue-600">
                    <span className="text-lg font-bold text-blue-900 dark:text-blue-200">TOTAL A PAGAR</span>
                    <span className="text-lg font-bold font-mono text-blue-900 dark:text-blue-200">S/ {(calculo.resumen?.totalAPagar || 0).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══════════════════════════════════════════════ */}
          {/* ═══ PLANILLA (PLAME) FORM ═══ */}
          {/* ══════════════════════════════════════════════ */}
          {tipo === 'PLANILLA' && (
            <>
              <fieldset className="space-y-4">
                <legend className="text-md font-semibold text-gray-900 dark:text-white">👥 Datos de Planilla (PLAME)</legend>

                {/* Resumen total auto-calculado */}
                {(plCantONP > 0 || plCantAFP > 0) && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-2 flex items-center gap-6 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Total planilla:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {plTotalTrabajadores} trabajadores · S/ {plTotalRemuneraciones.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400">(ESSALUD base)</span>
                  </div>
                )}

                {/* ── Sección ONP ── */}
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">🔵 Trabajadores en ONP</span>
                    <span className="text-xs text-blue-500 dark:text-blue-500">SNP — retención 13%</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nº Trabajadores ONP</label>
                      <input type="number" value={plCantONP} onChange={(e) => setPlCantONP(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Remuneraciones ONP (S/)</label>
                      <input type="number" value={plTotalRemuONP} onChange={(e) => setPlTotalRemuONP(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono" step="0.01" min="0" />
                    </div>
                  </div>
                  {plTotalRemuONP > 0 && (
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      ONP (13%): S/ {(plTotalRemuONP * 0.13).toFixed(2)}
                    </div>
                  )}
                </div>

                {/* ── Sección AFP dentro de PLAME ── */}
                <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">🟡 Trabajadores en AFP</span>
                    <span className="text-xs text-amber-500 dark:text-amber-500">incluidos en ESSALUD · aporte AFP va en AFPnet</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nº Trabajadores AFP</label>
                      <input type="number" value={plCantAFP} onChange={(e) => setPlCantAFP(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Remuneraciones AFP (S/)</label>
                      <input type="number" value={plTotalRemuAFP} onChange={(e) => setPlTotalRemuAFP(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono" step="0.01" min="0" />
                    </div>
                  </div>
                  {plTotalRemuAFP > 0 && (
                    <div className="text-xs text-amber-600 dark:text-amber-400">
                      💡 Incluir estas remuneraciones en el cálculo ESSALUD o SIS del campo de abajo
                    </div>
                  )}
                </div>

                {/* ── Seguridad Social: ESSALUD / SIS ── */}
                <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10 p-4 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">🟢 Seguridad Social (ESSALUD / SIS)</span>
                    {plTotalRemuneraciones > 0 && (
                      <span className="text-xs text-green-600 dark:text-green-500">
                        Ref. ESSALUD 9%: S/ {plReferESSALUD.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">ESSALUD (S/)</label>
                      <input type="number" value={plESSALUD} onChange={(e) => setPlESSALUD(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-green-500" step="0.01" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">SIS — MYPE (S/)</label>
                      <input type="number" value={plSIS} onChange={(e) => setPlSIS(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-green-500" step="0.01" min="0" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Ingresar el monto real. ESSALUD = 9% × total remuneraciones (empleador). SIS ≈ S/ 15 por trabajador MYPE.
                  </p>
                </div>

                {/* ── 5ta y Vida Ley ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trabajadores con Ret. 5ta</label>
                    <input type="number" value={plCant5ta} onChange={(e) => setPlCant5ta(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Retenciones 5ta (S/)</label>
                    <input type="number" value={plRetenciones5ta} onChange={(e) => setPlRetenciones5ta(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono" step="0.01" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vida Ley / SCTR (S/)</label>
                    <input type="number" value={plVidaLey} onChange={(e) => setPlVidaLey(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono" step="0.01" min="0" />
                  </div>
                </div>
              </fieldset>

              {/* Resumen Planilla — cálculo local en tiempo real */}
              {(plESSALUD > 0 || plSIS > 0 || plONPCalculado > 0 || plRetenciones5ta > 0) && (
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-5 space-y-3">
                  <h4 className="font-semibold text-teal-800 dark:text-teal-300">
                    🧮 Resumen Planilla
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {plESSALUD > 0 && (
                      <>
                        <span className="text-gray-600 dark:text-gray-400">ESSALUD</span>
                        <span className="text-right font-mono">S/ {plESSALUD.toFixed(2)}</span>
                      </>
                    )}
                    {plSIS > 0 && (
                      <>
                        <span className="text-gray-600 dark:text-gray-400">SIS</span>
                        <span className="text-right font-mono">S/ {plSIS.toFixed(2)}</span>
                      </>
                    )}
                    {plONPCalculado > 0 && (
                      <>
                        <span className="text-gray-600 dark:text-gray-400">ONP (13%)</span>
                        <span className="text-right font-mono">S/ {plONPCalculado.toFixed(2)}</span>
                      </>
                    )}
                    {plRetenciones5ta > 0 && (
                      <>
                        <span className="text-gray-600 dark:text-gray-400">Retenciones 5ta</span>
                        <span className="text-right font-mono">S/ {plRetenciones5ta.toFixed(2)}</span>
                      </>
                    )}
                    {plVidaLey > 0 && (
                      <>
                        <span className="text-gray-600 dark:text-gray-400">Vida Ley / SCTR</span>
                        <span className="text-right font-mono">S/ {plVidaLey.toFixed(2)}</span>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-teal-300 dark:border-teal-600">
                    <span className="text-lg font-bold text-teal-900 dark:text-teal-200">TOTAL PLANILLA</span>
                    <span className="text-lg font-bold font-mono text-teal-900 dark:text-teal-200">S/ {plTotalPlanillaLocal.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══════════════════════════════════════════════ */}
          {/* ═══ AFP FORM ═══ */}
          {/* ══════════════════════════════════════════════ */}
          {tipo === 'AFP' && (
            <>
              <fieldset className="space-y-4">
                <legend className="text-md font-semibold text-gray-900 dark:text-white">🏦 Datos AFP</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AFP <span className="text-red-500">*</span></label>
                    <select
                      value={afpNombre}
                      onChange={(e) => setAfpNombre(e.target.value as AFPProvider)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Seleccionar AFP...</option>
                      {(Object.keys(AFP_PROVIDERS_INFO) as AFPProvider[]).map(afp => (
                        <option key={afp} value={afp}>{AFP_PROVIDERS_INFO[afp].nombre} (Com: {(AFP_PROVIDERS_INFO[afp].comision * 100).toFixed(2)}%)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nº Afiliados</label>
                    <input type="number" value={afpCantAfiliados} onChange={(e) => setAfpCantAfiliados(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" min="0" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Remuneraciones AFP (S/)</label>
                    <input type="number" value={afpTotalRemuneraciones} onChange={(e) => setAfpTotalRemuneraciones(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono" step="0.01" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aporte Voluntario (S/)</label>
                    <input type="number" value={afpAporteVoluntario} onChange={(e) => setAfpAporteVoluntario(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono" step="0.01" min="0" />
                  </div>
                </div>

                {/* Tabla de tasas AFP */}
                {afpNombre && (
                  <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-3 text-xs">
                    <div className="font-medium text-amber-800 dark:text-amber-300 mb-1">{AFP_PROVIDERS_INFO[afpNombre].nombre} — Tasas vigentes:</div>
                    <div className="flex gap-4 text-amber-700 dark:text-amber-400">
                      <span>Aporte: 10%</span>
                      <span>Comisión: {(AFP_PROVIDERS_INFO[afpNombre].comision * 100).toFixed(2)}%</span>
                      <span>Prima Seguro: {(AFP_PROVIDERS_INFO[afpNombre].primaSeguro * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                )}
              </fieldset>

              {/* Preview AFP */}
              {calculoAFP && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 space-y-3">
                  <h4 className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    🧮 Cálculo AFP {calculating && <span className="text-xs animate-pulse">recalculando...</span>}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Aporte Obligatorio (10%)</span>
                    <span className="text-right font-mono">S/ {(calculoAFP.aporteObligatorio || 0).toFixed(2)}</span>
                    <span className="text-gray-600 dark:text-gray-400">Comisión AFP</span>
                    <span className="text-right font-mono">S/ {(calculoAFP.comisionAFP || 0).toFixed(2)}</span>
                    <span className="text-gray-600 dark:text-gray-400">Prima de Seguro</span>
                    <span className="text-right font-mono">S/ {(calculoAFP.primaSeguro || 0).toFixed(2)}</span>
                    {(calculoAFP.aporteVoluntario || 0) > 0 && (
                      <>
                        <span className="text-gray-600 dark:text-gray-400">Aporte Voluntario</span>
                        <span className="text-right font-mono">S/ {(calculoAFP.aporteVoluntario || 0).toFixed(2)}</span>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-amber-300 dark:border-amber-600">
                    <span className="text-lg font-bold text-amber-900 dark:text-amber-200">TOTAL AFP</span>
                    <span className="text-lg font-bold font-mono text-amber-900 dark:text-amber-200">S/ {(calculoAFP.totalAPagar || 0).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* N° Orden y Observaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">N° Orden</label>
              <input type="text" value={numeroOrden} onChange={(e) => setNumeroOrden(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
              <input type="text" value={observaciones} onChange={(e) => setObservaciones(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Opcional..." />
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button loading={loading} onClick={() => {}}>
              {isEditing ? '💾 Actualizar' : `📄 Registrar ${TIPO_DECLARACION_CONFIG[tipo].label}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeclaracionFormModal;
