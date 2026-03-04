import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Card } from '../../components/UI';
import PageLoader from '../../components/common/PageLoader';
import { clientesContablesApi } from '../../services/contabilidadService';
import { declaracionesApi } from '../../services/contabilidadService';
import ClienteFormModal from '../../components/contabilidad/ClienteFormModal';
import VincularUsuarioModal from '../../components/contabilidad/VincularUsuarioModal';
import type { 
  ClienteContable, 
  CreateClienteData, 
  DeclaracionMensual,
  TipoNota,
  TipoDocumento
} from '../../types/contabilidad';
import { 
  REGIMEN_LABELS, 
  REGIMEN_COLORS, 
  ESTADO_CLIENTE_CONFIG, 
  ESTADO_DECLARACION_CONFIG,
  TIPO_DECLARACION_CONFIG,
  ZONA_IGV_LABELS,
  ZONA_IGV_COLORS
} from '../../types/contabilidad';

/**
 * 📋 Ficha detallada del Cliente Contable
 * Muestra toda la información, notas, documentos y últimas declaraciones
 */
const FichaCliente: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<ClienteContable | null>(null);
  const [declaraciones, setDeclaraciones] = useState<DeclaracionMensual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVincularModal, setShowVincularModal] = useState(false);
  const [tabActiva, setTabActiva] = useState<'info' | 'declaraciones' | 'notas' | 'documentos'>('info');

  // Estado para notas
  const [notaTipo, setNotaTipo] = useState<TipoNota>('nota');
  const [notaDescripcion, setNotaDescripcion] = useState('');
  const [notaGuardando, setNotaGuardando] = useState(false);
  const [showNotaForm, setShowNotaForm] = useState(false);

  // Estado para documentos
  const [docNombre, setDocNombre] = useState('');
  const [docTipo, setDocTipo] = useState<TipoDocumento>('otro');
  const [docUrl, setDocUrl] = useState('');
  const [docNotas, setDocNotas] = useState('');
  const [docPeriodo, setDocPeriodo] = useState('');
  const [docGuardando, setDocGuardando] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [showDocForm, setShowDocForm] = useState(false);

  const loadCliente = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await clientesContablesApi.obtener(id);
      if (response.success) {
        setCliente(response.data);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar cliente';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadDeclaraciones = useCallback(async () => {
    if (!id) return;
    try {
      const response = await declaracionesApi.getHistorial(id);
      if (response.success) {
        setDeclaraciones(response.data);
      }
    } catch (err) {
      console.error('Error cargando declaraciones:', err);
    }
  }, [id]);

  useEffect(() => {
    loadCliente();
    loadDeclaraciones();
  }, [loadCliente, loadDeclaraciones]);

  const handleEditSubmit = async (data: CreateClienteData) => {
    if (!id) return;
    try {
      const response = await clientesContablesApi.actualizar(id, data);
      if (response.success) {
        setCliente(response.data);
        setShowEditModal(false);
      }
    } catch (err: unknown) {
      throw err;
    }
  };

  const handleVincularUsuario = async (userId: string) => {
    if (!id) return;
    try {
      const response = await clientesContablesApi.vincularUsuario(id, userId);
      if (response.success) {
        setCliente(response.data);
        setShowVincularModal(false);
      }
    } catch (err) {
      console.error('Error vinculando usuario:', err);
      throw err;
    }
  };

  const handleDesvincularUsuario = async () => {
    if (!id || !window.confirm('¿Desvincular el usuario del portal?')) return;
    try {
      const response = await clientesContablesApi.desvincularUsuario(id);
      if (response.success) {
        setCliente(response.data);
      }
    } catch (err) {
      console.error('Error desvinculando usuario:', err);
    }
  };

  if (loading) return <PageLoader />;
  if (error || !cliente) {
    return (
        <div className="p-8 text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error || 'Cliente no encontrado'}</div>
          <Button onClick={() => navigate('/dashboard/contabilidad')}>← Volver</Button>
        </div>
    );
  }

  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  return (
      <div className="space-y-6">
        {/* Header con breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/dashboard/contabilidad" className="hover:text-blue-600 transition-colors">
            🏢 Contabilidad
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">{cliente.razonSocial}</span>
        </div>

        {/* Cabecera del cliente */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {cliente.razonSocial}
                </h1>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${ESTADO_CLIENTE_CONFIG[cliente.estado]?.color}`}>
                  {ESTADO_CLIENTE_CONFIG[cliente.estado]?.icon} {ESTADO_CLIENTE_CONFIG[cliente.estado]?.label}
                </span>
              </div>
              {cliente.nombreComercial && (
                <p className="text-gray-500 dark:text-gray-400 mb-1">📌 {cliente.nombreComercial}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-2">
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  RUC: {cliente.ruc}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${REGIMEN_COLORS[cliente.regimenTributario]}`}>
                  {REGIMEN_LABELS[cliente.regimenTributario]}
                </span>
                {cliente.zonaIGV && cliente.zonaIGV !== 'GRAVADA' && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${ZONA_IGV_COLORS[cliente.zonaIGV]}`}>
                    {ZONA_IGV_LABELS[cliente.zonaIGV]}
                  </span>
                )}
                {cliente.honorarioMensual && (
                  <span>💰 S/ {cliente.honorarioMensual.toLocaleString('es-PE')}/mes</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(true)}>
                ✏️ Editar
              </Button>
              <Button 
                onClick={() => navigate(`/dashboard/contabilidad/clientes/${cliente._id}/declaraciones`)}
              >
                📄 Declaraciones
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {(['info', 'declaraciones', 'notas', 'documentos'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setTabActiva(tab)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tabActiva === tab 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab === 'info' && '📋 Información'}
              {tab === 'declaraciones' && `📄 Declaraciones (${declaraciones.length})`}
              {tab === 'notas' && `📝 Notas (${cliente.notas?.length || 0})`}
              {tab === 'documentos' && `📎 Documentos (${cliente.documentos?.length || 0})`}
            </button>
          ))}
        </div>

        {/* Tab: Información */}
        {tabActiva === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Representante Legal */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">👤 Representante Legal</h3>
              <div className="space-y-2 text-sm">
                <InfoRow label="Nombre" value={cliente.representante?.nombre} />
                <InfoRow label="Cargo" value={cliente.representante?.cargo} />
                <InfoRow label="DNI" value={cliente.representante?.dni} />
                <InfoRow label="Teléfono" value={cliente.representante?.telefono} />
              </div>
            </Card>

            {/* Datos de contacto */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📞 Contacto</h3>
              <div className="space-y-2 text-sm">
                <InfoRow label="Email" value={cliente.contacto?.email} />
                <InfoRow label="Teléfono" value={cliente.contacto?.telefono} />
                <InfoRow label="Dirección" value={cliente.contacto?.direccion} />
                <InfoRow label="Ubicación" value={[cliente.contacto?.distrito, cliente.contacto?.provincia, cliente.contacto?.departamento].filter(Boolean).join(', ')} />
              </div>
            </Card>

            {/* Configuración tributaria */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">⚙️ Configuración Tributaria</h3>
              <div className="space-y-2 text-sm">
                <InfoRow label="Régimen" value={REGIMEN_LABELS[cliente.regimenTributario]} />
                <InfoRow label="Zona IGV" value={ZONA_IGV_LABELS[cliente.zonaIGV || 'GRAVADA']} />
                {cliente.regimenTributario === 'RUS' && (
                  <InfoRow label="Categoría RUS" value={`Categoría ${cliente.configuracionTributaria?.categoriaRUS || 1}`} />
                )}
                {cliente.configuracionTributaria?.coeficienteRenta && (
                  <InfoRow label="Coeficiente" value={String(cliente.configuracionTributaria.coeficienteRenta)} />
                )}
                {(() => {
                  const obl = cliente.configuracionTributaria?.obligaciones;
                  if (!obl) return null;
                  const activas = [
                    obl.igv && 'IGV/Renta',
                    obl.renta && 'Renta',
                    obl.planilla && 'Planilla',
                    obl.afp && 'AFP',
                    obl.librosElectronicos && 'Libros Elect.'
                  ].filter(Boolean) as string[];
                  return activas.length ? <InfoRow label="Obligaciones" value={activas.join(', ')} /> : null;
                })()}
                {cliente.linkDrive && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500 dark:text-gray-400">Google Drive</span>
                    <a href={cliente.linkDrive} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      📁 Abrir carpeta
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Portal Cliente */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🔗 Portal Cliente</h3>
              {cliente.usuarioVinculado?.clerkId ? (
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="text-sm font-medium text-green-800 dark:text-green-400">✅ Usuario vinculado</div>
                    <div className="text-sm text-green-600 dark:text-green-300 mt-1">
                      {cliente.usuarioVinculado.nombre || cliente.usuarioVinculado.email}
                    </div>
                    <div className="text-xs text-green-500/80 mt-0.5">
                      {cliente.usuarioVinculado.email}
                    </div>
                    {cliente.usuarioVinculado.vinculadoEn && (
                      <div className="text-xs text-green-500 mt-1">
                        Vinculado: {new Date(cliente.usuarioVinculado.vinculadoEn).toLocaleDateString('es-PE')}
                      </div>
                    )}
                  </div>
                  <Button variant="danger" size="sm" onClick={handleDesvincularUsuario}>
                    🔓 Desvincular
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm text-gray-500 dark:text-gray-400">
                    Sin usuario vinculado. El cliente no puede acceder al portal.
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setShowVincularModal(true)}>
                    🔗 Vincular Usuario
                  </Button>
                </div>
              )}
            </Card>

            {/* Contador asignado */}
            {cliente.contadorAsignado?.nombre && (
              <Card className="p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🧑‍💼 Contador Asignado</h3>
                <div className="space-y-2 text-sm">
                  <InfoRow label="Nombre" value={cliente.contadorAsignado.nombre} />
                  <InfoRow label="Email" value={cliente.contadorAsignado.email} />
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Tab: Declaraciones recientes */}
        {tabActiva === 'declaraciones' && (
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">📄 Últimas Declaraciones</h3>
              <Button 
                size="sm" 
                onClick={() => navigate(`/dashboard/contabilidad/clientes/${cliente._id}/declaraciones`)}
              >
                Ver todas →
              </Button>
            </div>
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
                        Sin declaraciones registradas
                      </td>
                    </tr>
                  ) : (
                    declaraciones.slice(0, 12).map((dec) => {
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
        )}

        {/* Tab: Notas */}
        {tabActiva === 'notas' && (
          <div className="space-y-4">
            {/* Botón para abrir formulario */}
            {!showNotaForm && (
              <div className="flex justify-end">
                <Button size="sm" onClick={() => setShowNotaForm(true)}>
                  ➕ Agregar Nota
                </Button>
              </div>
            )}

            {/* Formulario colapsable */}
            {showNotaForm && (
              <Card className="p-5 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">✏️ Nueva Nota</h3>
                  <button
                    onClick={() => {
                      setShowNotaForm(false);
                      setNotaDescripcion('');
                      setNotaTipo('nota');
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg leading-none"
                    title="Cancelar"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <select
                      value={notaTipo}
                      onChange={(e) => setNotaTipo(e.target.value as TipoNota)}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="nota">🗒️ Nota</option>
                      <option value="llamada">📞 Llamada</option>
                      <option value="email">📧 Email</option>
                      <option value="reunion">👥 Reunión</option>
                      <option value="recordatorio">⏰ Recordatorio</option>
                    </select>
                    <Button
                      size="sm"
                      onClick={async () => {
                        if (!id || !notaDescripcion.trim()) return;
                        setNotaGuardando(true);
                        try {
                          const res = await clientesContablesApi.agregarNota(id, {
                            tipo: notaTipo,
                            descripcion: notaDescripcion.trim()
                          });
                          if (res.success) {
                            setCliente(res.data);
                            setNotaDescripcion('');
                            setNotaTipo('nota');
                            setShowNotaForm(false);
                          }
                        } catch (err) {
                          console.error('Error agregando nota:', err);
                        } finally {
                          setNotaGuardando(false);
                        }
                      }}
                      disabled={!notaDescripcion.trim() || notaGuardando}
                      className="whitespace-nowrap"
                    >
                      {notaGuardando ? '⏳ Guardando...' : '💾 Guardar'}
                    </Button>
                  </div>
                  <textarea
                    autoFocus
                    value={notaDescripcion}
                    onChange={(e) => setNotaDescripcion(e.target.value)}
                    placeholder="Escribe una nota, registra una llamada, email o reunión..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </Card>
            )}

            {/* Lista de notas existentes */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📝 Historial de Notas</h3>
              {cliente.notas && cliente.notas.length > 0 ? (
                <div className="space-y-3">
                  {[...cliente.notas].reverse().map((nota, i) => {
                    const tipoConfig: Record<string, { icon: string; label: string; color: string }> = {
                      nota: { icon: '🗒️', label: 'Nota', color: 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300' },
                      llamada: { icon: '📞', label: 'Llamada', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
                      email: { icon: '📧', label: 'Email', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
                      reunion: { icon: '👥', label: 'Reunión', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
                      recordatorio: { icon: '⏰', label: 'Recordatorio', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
                      cambio_estado: { icon: '🔄', label: 'Cambio de estado', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
                    };
                    const conf = tipoConfig[nota.tipo || 'nota'] || tipoConfig.nota;
                    return (
                      <div key={nota._id || i} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 group">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${conf.color}`}>
                                {conf.icon} {conf.label}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(nota.fecha).toLocaleDateString('es-PE', {
                                  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                              {nota.descripcion || nota.texto || ''}
                            </p>
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              👤 {nota.creadoPor?.nombre || nota.autor || 'Sistema'}
                            </div>
                          </div>
                          {nota._id && (
                            <button
                              onClick={async () => {
                                if (!id || !nota._id) return;
                                if (!window.confirm('¿Eliminar esta nota?')) return;
                                try {
                                  const res = await clientesContablesApi.eliminarNota(id, nota._id);
                                  if (res.success) {
                                    setCliente(res.data);
                                  }
                                } catch (err) {
                                  console.error('Error eliminando nota:', err);
                                }
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1"
                              title="Eliminar nota"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Sin notas registradas</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Usa el botón ➕ Agregar Nota para registrar la primera nota</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Tab: Documentos */}
        {tabActiva === 'documentos' && (
          <div className="space-y-4">
            {/* Link a Drive */}
            {cliente.linkDrive && (
              <Card className="p-4">
                <a
                  href={cliente.linkDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  📁 Abrir carpeta de Google Drive del cliente
                  <span className="text-xs">↗</span>
                </a>
              </Card>
            )}

            {/* Botón para abrir formulario de documento */}
            {!showDocForm && (
              <div className="flex justify-end">
                <Button size="sm" onClick={() => setShowDocForm(true)}>
                  ➕ Agregar Documento
                </Button>
              </div>
            )}

            {/* Formulario colapsable */}
            {showDocForm && (
              <Card className="p-5 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">📎 Nuevo Documento</h3>
                  <button
                    onClick={() => {
                      setShowDocForm(false);
                      setDocNombre(''); setDocTipo('otro'); setDocUrl('');
                      setDocNotas(''); setDocPeriodo(''); setDocError(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg leading-none"
                    title="Cancelar"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nombre *</label>
                      <input
                        autoFocus
                        type="text"
                        value={docNombre}
                        onChange={(e) => setDocNombre(e.target.value)}
                        placeholder="Ej: Contrato de servicios 2024"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tipo</label>
                      <select
                        value={docTipo}
                        onChange={(e) => setDocTipo(e.target.value as TipoDocumento)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="contrato">📋 Contrato</option>
                        <option value="constancia">📜 Constancia</option>
                        <option value="declaracion">📄 Declaración</option>
                        <option value="pdt">🧾 PDT</option>
                        <option value="voucher">🧾 Voucher</option>
                        <option value="otro">📎 Otro</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">URL (Google Drive u otro enlace) *</label>
                    <input
                      type="url"
                      value={docUrl}
                      onChange={(e) => setDocUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Periodo (opcional)</label>
                      <input
                        type="month"
                        value={docPeriodo}
                        onChange={(e) => setDocPeriodo(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Descripción (opcional)</label>
                      <input
                        type="text"
                        value={docNotas}
                        onChange={(e) => setDocNotas(e.target.value)}
                        placeholder="Breve descripción del documento"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setShowDocForm(false);
                        setDocNombre(''); setDocTipo('otro'); setDocUrl('');
                        setDocNotas(''); setDocPeriodo(''); setDocError(null);
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Cancelar
                    </button>
                    <div className="flex flex-col items-end gap-1">
                      <Button
                        onClick={async () => {
                          if (!docNombre.trim() || !docUrl.trim() || !id) return;
                          setDocGuardando(true);
                          setDocError(null);
                          try {
                            const res = await clientesContablesApi.agregarDocumento(id, {
                              nombre: docNombre.trim(),
                              tipo: docTipo,
                              url: docUrl.trim(),
                              periodo: docPeriodo || undefined,
                              notas: docNotas.trim() || undefined
                            });
                            setCliente(res.data);
                            setDocNombre(''); setDocTipo('otro'); setDocUrl('');
                            setDocNotas(''); setDocPeriodo(''); setDocError(null);
                            setShowDocForm(false);
                          } catch (err: unknown) {
                            const msg =
                              (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                              'Error al agregar documento. Intenta nuevamente.';
                            setDocError(msg);
                          } finally {
                            setDocGuardando(false);
                          }
                        }}
                        disabled={docGuardando || !docNombre.trim() || !docUrl.trim()}
                        className="text-sm"
                      >
                        {docGuardando ? '⏳ Guardando...' : '📎 Guardar Documento'}
                      </Button>
                      {docError && (
                        <p className="text-red-500 dark:text-red-400 text-xs">
                          ⚠️ {docError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Lista de documentos */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📎 Documentos ({cliente.documentos?.length || 0})</h3>
              {cliente.documentos && cliente.documentos.length > 0 ? (
                <div className="space-y-2">
                  {[...cliente.documentos].reverse().map((doc, i) => {
                    const iconMap: Record<string, string> = {
                      contrato: '📋', constancia: '📜', declaracion: '📄',
                      pdt: '🧾', voucher: '🧾', otro: '📎'
                    };
                    return (
                      <div
                        key={doc._id || i}
                        className="group flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-xl mt-0.5">{iconMap[doc.tipo] || '📎'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate"
                            >
                              {doc.nombre}
                            </a>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 uppercase flex-shrink-0">
                              {doc.tipo}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(doc.fechaSubida).toLocaleDateString('es-PE')}
                            </span>
                            {doc.periodo && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">· Periodo: {doc.periodo}</span>
                            )}
                            {doc.subidoPor?.nombre && (
                              <span className="text-xs text-gray-400 dark:text-gray-500">· por {doc.subidoPor.nombre}</span>
                            )}
                          </div>
                          {doc.notas && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{doc.notas}</p>
                          )}
                        </div>
                        <button
                          onClick={async () => {
                            if (!doc._id || !id) return;
                            if (!window.confirm('¿Eliminar este documento?')) return;
                            try {
                              const res = await clientesContablesApi.eliminarDocumento(id, doc._id);
                              setCliente(res.data);
                            } catch (err) {
                              console.error('Error eliminando documento:', err);
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs transition-opacity flex-shrink-0 mt-1"
                          title="Eliminar documento"
                        >
                          🗑️
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                  <span className="text-3xl block mb-2">📎</span>
                  <p className="text-sm">Sin documentos registrados</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Agrega enlaces a documentos en Google Drive u otros servicios</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Modal de edición */}
        {showEditModal && (
          <ClienteFormModal
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEditSubmit}
            initialData={cliente}
            isEditing
          />
        )}

        {/* Modal de vincular usuario */}
        {showVincularModal && (
          <VincularUsuarioModal
            onClose={() => setShowVincularModal(false)}
            onVincular={handleVincularUsuario}
          />
        )}
      </div>
  );
};

// Componente auxiliar para filas de información
const InfoRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-gray-900 dark:text-white font-medium">{value || '-'}</span>
  </div>
);

export default FichaCliente;
