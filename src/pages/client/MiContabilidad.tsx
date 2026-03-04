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
  ESTADO_CLIENTE_CONFIG,
  TIPO_DECLARACION_CONFIG,
  ZONA_IGV_LABELS
} from '../../types/contabilidad';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const DOC_TIPO_ICONS: Record<string, string> = {
  pdt: '📋', voucher: '🧾', contrato: '📝', constancia: '📜', declaracion: '📊', otro: '📄'
};

type TabCliente = 'resumen' | 'empresa' | 'declaraciones' | 'documentos';

/**
 * 👤 Portal Contable para Clientes
 * Permite al cliente ver su estado contable, declaraciones, info de empresa y documentos
 * Usado dentro del dashboard del cliente
 */
const MiContabilidad: React.FC = () => {
  const [cuenta, setCuenta] = useState<MiCuentaContable | null>(null);
  const [estado, setEstado] = useState<MiEstadoContable | null>(null);
  const [declaraciones, setDeclaraciones] = useState<DeclaracionMensual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear());
  const [tabActiva, setTabActiva] = useState<TabCliente>('resumen');

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

  const obligaciones = cuenta.configuracionTributaria?.obligaciones;
  const documentos = cuenta.documentos || [];
  const tieneDocumentos = documentos.length > 0;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header de cuenta */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">🏢 Mi Contabilidad</h1>
            <p className="text-white/80 mt-1 font-mono">{cuenta.ruc}</p>
            <p className="text-white/90 font-medium mt-1">{cuenta.razonSocial}</p>
            {cuenta.configuracionTributaria?.actividadEconomica && (
              <p className="text-white/60 text-sm mt-1">{cuenta.configuracionTributaria.actividadEconomica}</p>
            )}
          </div>
          <div className="text-left md:text-right space-y-1">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white`}>
              {ESTADO_CLIENTE_CONFIG[cuenta.estado]?.icon} {ESTADO_CLIENTE_CONFIG[cuenta.estado]?.label}
            </span>
            <div>
              <span className="text-sm text-white/70">Régimen:</span>
              <span className="ml-2 text-sm font-medium">{REGIMEN_LABELS[cuenta.regimenTributario]}</span>
            </div>
            {cuenta.zonaIGV && (
              <div>
                <span className="text-sm text-white/70">Zona IGV:</span>
                <span className="ml-2 text-sm font-medium">{ZONA_IGV_LABELS[cuenta.zonaIGV] || cuenta.zonaIGV}</span>
              </div>
            )}
            {cuenta.contadorAsignado?.nombre && (
              <div>
                <span className="text-sm text-white/70">Contador:</span>
                <span className="ml-2 text-sm">{cuenta.contadorAsignado.nombre}</span>
              </div>
            )}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/20">
          {cuenta.linkDrive && (
            <a
              href={cuenta.linkDrive}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              📁 Abrir Carpeta en Drive
            </a>
          )}
          {cuenta.contadorAsignado?.email && (
            <a
              href={`mailto:${cuenta.contadorAsignado.email}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              ✉️ Contactar Contador
            </a>
          )}
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
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto">
        {([
          { key: 'resumen' as TabCliente, label: '📊 Resumen', show: true },
          { key: 'empresa' as TabCliente, label: '🏢 Mi Empresa', show: true },
          { key: 'declaraciones' as TabCliente, label: `📄 Declaraciones ${anioFiltro}`, show: true },
          { key: 'documentos' as TabCliente, label: `📎 Documentos${tieneDocumentos ? ` (${documentos.length})` : ''}`, show: true },
        ]).filter(t => t.show).map(tab => (
          <button
            key={tab.key}
            onClick={() => setTabActiva(tab.key)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              tabActiva === tab.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================
          Tab: Resumen
          ======================================== */}
      {tabActiva === 'resumen' && (
        <div className="space-y-4">
          {/* Obligaciones activas */}
          {obligaciones && (
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">📋 Mis Obligaciones Tributarias</h3>
              <div className="flex flex-wrap gap-2">
                {obligaciones.igv && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    📊 IGV / Renta
                  </span>
                )}
                {obligaciones.planilla && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400">
                    👥 Planilla (PLAME)
                    {cuenta.configuracionTributaria?.configPlanilla?.cantidadTrabajadores 
                      ? ` · ${cuenta.configuracionTributaria.configPlanilla.cantidadTrabajadores} trabajadores`
                      : ''
                    }
                  </span>
                )}
                {obligaciones.afp && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    🏦 AFP
                    {cuenta.configuracionTributaria?.configAFP?.afpNombre
                      ? ` · ${cuenta.configuracionTributaria.configAFP.afpNombre}`
                      : ''
                    }
                  </span>
                )}
                {obligaciones.librosElectronicos && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    📚 Libros Electrónicos
                  </span>
                )}
              </div>
            </Card>
          )}

          {/* Últimas 5 declaraciones */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">📄 Últimas Declaraciones</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {declaraciones.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Sin declaraciones recientes</div>
              ) : (
                declaraciones.slice(0, 6).map((dec) => {
                  const tipoConf = TIPO_DECLARACION_CONFIG[dec.tipo] || TIPO_DECLARACION_CONFIG.IGV_RENTA;
                  return (
                    <div key={dec._id} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {MESES[dec.mes - 1]} {dec.anio}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tipoConf.color}`}>
                          {tipoConf.icon} {tipoConf.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_DECLARACION_CONFIG[dec.estado]?.color}`}>
                          {ESTADO_DECLARACION_CONFIG[dec.estado]?.icon} {ESTADO_DECLARACION_CONFIG[dec.estado]?.label}
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        S/ {(dec.totalAPagar || 0).toFixed(2)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Acceso rápido a Drive */}
          {cuenta.linkDrive && (
            <Card className="p-5 border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">📁 Carpeta Compartida</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Accede a todos los archivos y documentos de tu empresa
                  </p>
                </div>
                <a
                  href={cuenta.linkDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  📂 Abrir en Google Drive
                </a>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ========================================
          Tab: Mi Empresa
          ======================================== */}
      {tabActiva === 'empresa' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Información fiscal */}
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🏢 Información Fiscal</h3>
            <div className="space-y-2">
              <InfoRow label="RUC" value={cuenta.ruc} />
              <InfoRow label="Razón Social" value={cuenta.razonSocial} />
              {cuenta.nombreComercial && <InfoRow label="Nombre Comercial" value={cuenta.nombreComercial} />}
              <InfoRow label="Régimen" value={REGIMEN_LABELS[cuenta.regimenTributario]} />
              <InfoRow label="Zona IGV" value={cuenta.zonaIGV ? (ZONA_IGV_LABELS[cuenta.zonaIGV] || cuenta.zonaIGV) : '-'} />
              {cuenta.configuracionTributaria?.actividadEconomica && (
                <InfoRow label="Actividad Económica" value={cuenta.configuracionTributaria.actividadEconomica} />
              )}
              {cuenta.direccionFiscal && <InfoRow label="Dirección Fiscal" value={cuenta.direccionFiscal} />}
              {cuenta.ubicacion?.distrito && (
                <InfoRow 
                  label="Ubicación" 
                  value={[cuenta.ubicacion.distrito, cuenta.ubicacion.provincia, cuenta.ubicacion.departamento].filter(Boolean).join(', ')} 
                />
              )}
            </div>
          </Card>

          {/* Representante legal */}
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">👤 Representante Legal</h3>
            <div className="space-y-2">
              <InfoRow label="Nombre" value={cuenta.representante?.nombre} />
              <InfoRow label="DNI" value={cuenta.representante?.dni} />
              <InfoRow label="Cargo" value={cuenta.representante?.cargo} />
            </div>
          </Card>

          {/* Contacto */}
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📞 Contacto</h3>
            <div className="space-y-2">
              <InfoRow label="Email" value={cuenta.contacto?.email} />
              <InfoRow label="Teléfono" value={cuenta.contacto?.telefono} />
              {cuenta.contacto?.celular && <InfoRow label="Celular" value={cuenta.contacto.celular} />}
            </div>
          </Card>

          {/* Servicios contratados */}
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">💼 Servicio Contable</h3>
            <div className="space-y-2">
              <InfoRow label="Contador" value={cuenta.contadorAsignado?.nombre} />
              {cuenta.contadorAsignado?.email && (
                <InfoRow label="Email Contador" value={cuenta.contadorAsignado.email} />
              )}
              {(cuenta.honorarioMensual ?? 0) > 0 && (
                <InfoRow 
                  label="Honorario Mensual" 
                  value={`${cuenta.moneda === 'USD' ? '$' : 'S/'} ${(cuenta.honorarioMensual || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`} 
                />
              )}
            </div>

            {/* Obligaciones */}
            {obligaciones && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Obligaciones activas:</p>
                <div className="flex flex-wrap gap-1.5">
                  {obligaciones.igv && <ObligacionBadge label="IGV / Renta" activo />}
                  {obligaciones.planilla && <ObligacionBadge label="Planilla" activo />}
                  {obligaciones.afp && <ObligacionBadge label="AFP" activo />}
                  {obligaciones.librosElectronicos && <ObligacionBadge label="Libros Elect." activo />}
                </div>
              </div>
            )}
          </Card>

          {/* Carpeta Drive - full width */}
          {cuenta.linkDrive && (
            <Card className="p-5 md:col-span-2 border-2 border-dashed border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">📁 Carpeta de Google Drive</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Tu contador comparte archivos, declaraciones y documentos importantes aquí
                  </p>
                </div>
                <a
                  href={cuenta.linkDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                >
                  📂 Abrir Carpeta
                </a>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ========================================
          Tab: Declaraciones del año
          ======================================== */}
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Detalle</th>
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
                    declaraciones.map((dec) => {
                      const tipoConf = TIPO_DECLARACION_CONFIG[dec.tipo] || TIPO_DECLARACION_CONFIG.IGV_RENTA;
                      return (
                        <tr key={dec._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                            {MESES[dec.mes - 1]} {dec.anio}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tipoConf.color}`}>
                              {tipoConf.icon} {tipoConf.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_DECLARACION_CONFIG[dec.estado]?.color}`}>
                              {ESTADO_DECLARACION_CONFIG[dec.estado]?.icon} {ESTADO_DECLARACION_CONFIG[dec.estado]?.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            {dec.tipo === 'IGV_RENTA' && (
                              <div className="flex flex-col gap-0.5">
                                <span>IGV: <span className="font-mono font-medium">S/ {(dec.detalleIGV?.igvAPagar || 0).toFixed(2)}</span></span>
                                <span>Renta: <span className="font-mono font-medium">S/ {(dec.detalleRenta?.rentaAPagar || 0).toFixed(2)}</span></span>
                              </div>
                            )}
                            {dec.tipo === 'PLANILLA' && (
                              <div className="flex flex-col gap-0.5">
                                <span>{dec.detallePlanilla?.cantidadTrabajadores || 0} trabajadores</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  ESSALUD: S/ {(dec.detallePlanilla?.essalud || 0).toFixed(2)}
                                  {(dec.detallePlanilla?.sis || 0) > 0 && ` · SIS: S/ ${(dec.detallePlanilla?.sis || 0).toFixed(2)}`}
                                  {' · '}ONP: S/ {(dec.detallePlanilla?.onp || 0).toFixed(2)}
                                </span>
                              </div>
                            )}
                            {dec.tipo === 'AFP' && (
                              <div className="flex flex-col gap-0.5">
                                <span>{dec.detalleAFP?.afpNombre || 'AFP'} · {dec.detalleAFP?.cantidadAfiliados || 0} afiliados</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Aporte: S/ {(dec.detalleAFP?.aporteObligatorio || 0).toFixed(2)}
                                  {' · '}Comisión: S/ {(dec.detalleAFP?.comisionAFP || 0).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-mono font-bold whitespace-nowrap">
                            S/ {(dec.totalAPagar || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                            {dec.fechaVencimiento
                              ? new Date(dec.fechaVencimiento).toLocaleDateString('es-PE')
                              : '-'
                            }
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ========================================
          Tab: Documentos
          ======================================== */}
      {tabActiva === 'documentos' && (
        <div className="space-y-4">
          {/* Carpeta Drive */}
          {cuenta.linkDrive && (
            <Card className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-2xl">
                    📁
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Carpeta de Google Drive</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Carpeta compartida con todos tus archivos contables
                    </p>
                  </div>
                </div>
                <a
                  href={cuenta.linkDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                >
                  📂 Abrir en Drive
                </a>
              </div>
            </Card>
          )}

          {/* Lista de documentos */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">📎 Documentos Compartidos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Archivos subidos por tu contador</p>
            </div>
            {documentos.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-500 dark:text-gray-400">No hay documentos compartidos todavía</p>
                {cuenta.linkDrive && (
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Revisa tu{' '}
                    <a href={cuenta.linkDrive} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      carpeta de Drive
                    </a>{' '}
                    para más archivos
                  </p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {documentos.map((doc) => (
                  <a
                    key={doc._id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">
                      {DOC_TIPO_ICONS[doc.tipo] || '📄'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.nombre}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span className="capitalize">{doc.tipo}</span>
                        {doc.periodo && <span>· Periodo: {doc.periodo}</span>}
                        <span>· {new Date(doc.fechaSubida).toLocaleDateString('es-PE')}</span>
                      </div>
                      {doc.notas && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{doc.notas}</p>
                      )}
                    </div>
                    <span className="text-gray-400 flex-shrink-0">↗</span>
                  </a>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

// Componentes auxiliares
const InfoRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-1.5 gap-4">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm text-gray-900 dark:text-white font-medium text-right">{value || '-'}</span>
  </div>
);

const ObligacionBadge: React.FC<{ label: string; activo: boolean }> = ({ label, activo }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
    activo 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
  }`}>
    {activo ? '✅' : '⬜'} {label}
  </span>
);

export default MiContabilidad;
