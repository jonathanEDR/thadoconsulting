import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import { Button, Card } from '../../components/UI';
import PageLoader from '../../components/common/PageLoader';
import { clientesContablesApi } from '../../services/contabilidadService';
import { declaracionesApi } from '../../services/contabilidadService';
import ClienteFormModal from '../../components/contabilidad/ClienteFormModal';
import type { 
  ClienteContable, 
  CreateClienteData, 
  DeclaracionMensual 
} from '../../types/contabilidad';
import { 
  REGIMEN_LABELS, 
  REGIMEN_COLORS, 
  ESTADO_CLIENTE_CONFIG, 
  ESTADO_DECLARACION_CONFIG 
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
  const [tabActiva, setTabActiva] = useState<'info' | 'declaraciones' | 'notas' | 'documentos'>('info');

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

  const handleVincularUsuario = async () => {
    const clerkId = window.prompt('Ingresa el Clerk ID del usuario a vincular:');
    if (!clerkId || !id) return;
    try {
      const response = await clientesContablesApi.vincularUsuario(id, clerkId);
      if (response.success) {
        setCliente(response.data);
      }
    } catch (err) {
      console.error('Error vinculando usuario:', err);
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
      <SmartDashboardLayout>
        <div className="p-8 text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error || 'Cliente no encontrado'}</div>
          <Button onClick={() => navigate('/dashboard/contabilidad')}>← Volver</Button>
        </div>
      </SmartDashboardLayout>
    );
  }

  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  return (
    <SmartDashboardLayout>
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
                {cliente.regimenTributario === 'RUS' && (
                  <InfoRow label="Categoría RUS" value={`Categoría ${cliente.configuracionTributaria?.categoriaRUS || 1}`} />
                )}
                {cliente.configuracionTributaria?.coeficienteRenta && (
                  <InfoRow label="Coeficiente" value={String(cliente.configuracionTributaria.coeficienteRenta)} />
                )}
                {cliente.configuracionTributaria?.obligaciones?.length ? (
                  <InfoRow label="Obligaciones" value={cliente.configuracionTributaria.obligaciones.join(', ')} />
                ) : null}
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
              {cliente.usuarioVinculado ? (
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="text-sm font-medium text-green-800 dark:text-green-400">✅ Usuario vinculado</div>
                    <div className="text-sm text-green-600 dark:text-green-300 mt-1">
                      {cliente.usuarioVinculado.nombre} ({cliente.usuarioVinculado.email})
                    </div>
                    <div className="text-xs text-green-500 mt-1">
                      Vinculado: {new Date(cliente.usuarioVinculado.vinculadoEn).toLocaleDateString('es-PE')}
                    </div>
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
                  <Button variant="secondary" size="sm" onClick={handleVincularUsuario}>
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
                        Sin declaraciones registradas
                      </td>
                    </tr>
                  ) : (
                    declaraciones.slice(0, 12).map((dec) => (
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
        )}

        {/* Tab: Notas */}
        {tabActiva === 'notas' && (
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📝 Notas</h3>
            {cliente.notas && cliente.notas.length > 0 ? (
              <div className="space-y-3">
                {cliente.notas.map((nota, i) => (
                  <div key={nota._id || i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-900 dark:text-white">{nota.texto}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>👤 {nota.autor}</span>
                      <span>📅 {new Date(nota.fecha).toLocaleDateString('es-PE')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Sin notas registradas</p>
            )}
          </Card>
        )}

        {/* Tab: Documentos */}
        {tabActiva === 'documentos' && (
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📎 Documentos Adjuntos</h3>
            {cliente.documentos && cliente.documentos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cliente.documentos.map((doc, i) => (
                  <a
                    key={doc._id || i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-2xl">📄</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{doc.nombre}</div>
                      <div className="text-xs text-gray-500">{doc.tipo} · {new Date(doc.fechaSubida).toLocaleDateString('es-PE')}</div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Sin documentos adjuntos</p>
            )}
          </Card>
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
      </div>
    </SmartDashboardLayout>
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
