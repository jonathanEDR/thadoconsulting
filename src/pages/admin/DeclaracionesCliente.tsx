import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Card } from '../../components/UI';
import PageLoader from '../../components/common/PageLoader';
import { clientesContablesApi, declaracionesApi, librosElectronicosApi } from '../../services/contabilidadService';
import DeclaracionFormModal from '../../components/contabilidad/DeclaracionFormModal';
import LibroFormModal from '../../components/contabilidad/LibroFormModal';
import type { 
  ClienteContable, 
  DeclaracionMensual, 
  RegistrarDeclaracionData,
  EstadoDeclaracion,
  PresentacionLibro,
  RegistrarLibroData,
  CatalogoLibros
} from '../../types/contabilidad';
import { ESTADO_DECLARACION_CONFIG, REGIMEN_LABELS, ESTADO_LIBRO_CONFIG } from '../../types/contabilidad';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

/**
 * 📄 Página de Declaraciones Mensuales de un Cliente
 * CRUD completo de declaraciones con cálculo de impuestos
 */
const DeclaracionesCliente: React.FC = () => {
  const { clienteId } = useParams<{ clienteId: string }>();

  const [cliente, setCliente] = useState<ClienteContable | null>(null);
  const [declaraciones, setDeclaraciones] = useState<DeclaracionMensual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDeclaracion, setEditingDeclaracion] = useState<DeclaracionMensual | null>(null);
  const [anioFiltro, setAnioFiltro] = useState<number>(new Date().getFullYear());

  // Libros Electrónicos
  const [libros, setLibros] = useState<PresentacionLibro[]>([]);
  const [catalogo, setCatalogo] = useState<CatalogoLibros>({});
  const [librosConfigurados, setLibrosConfigurados] = useState<string[]>([]);
  const [showLibroModal, setShowLibroModal] = useState(false);
  const [editingLibro, setEditingLibro] = useState<PresentacionLibro | null>(null);
  const [libroMesSel, setLibroMesSel] = useState<string>('');

  // Cargar datos
  const loadData = useCallback(async () => {
    if (!clienteId) return;
    setLoading(true);
    try {
      const [clienteRes, declRes] = await Promise.all([
        clientesContablesApi.obtener(clienteId),
        declaracionesApi.getHistorial(clienteId, anioFiltro)
      ]);
      if (clienteRes.success) setCliente(clienteRes.data);
      if (declRes.success) setDeclaraciones(declRes.data);

      // Cargar libros
      try {
        const [librosRes, catalogoRes] = await Promise.all([
          librosElectronicosApi.getByCliente(clienteId, { anio: anioFiltro }),
          librosElectronicosApi.getCatalogo()
        ]);
        if (librosRes.success) {
          setLibros(librosRes.data.presentaciones);
          setLibrosConfigurados(librosRes.data.cliente?.librosConfigurados || []);
        }
        if (catalogoRes.success) {
          setCatalogo(catalogoRes.data.catalogo);
        }
      } catch {
        // Libros module may not be available yet - silently skip
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error cargando datos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clienteId, anioFiltro]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Registrar nueva declaración
  const handleRegistrar = async (data: RegistrarDeclaracionData) => {
    try {
      const response = await declaracionesApi.registrar(data);
      if (response.success) {
        setShowCreateModal(false);
        await loadData();
      }
    } catch (err) {
      throw err;
    }
  };

  // Actualizar declaración
  const handleActualizar = async (data: RegistrarDeclaracionData) => {
    if (!editingDeclaracion) return;
    try {
      const response = await declaracionesApi.actualizar(editingDeclaracion._id, data);
      if (response.success) {
        setEditingDeclaracion(null);
        await loadData();
      }
    } catch (err) {
      throw err;
    }
  };

  // Cambiar estado
  const handleCambiarEstado = async (declaracion: DeclaracionMensual, nuevoEstado: EstadoDeclaracion) => {
    try {
      let pago;
      if (nuevoEstado === 'PAGADO') {
        const monto = window.prompt('Monto pagado:', String(declaracion.totalAPagar));
        if (!monto) return;
        pago = { montoPagado: parseFloat(monto), fechaPago: new Date().toISOString() };
      }
      await declaracionesApi.cambiarEstado(declaracion._id, nuevoEstado, pago);
      await loadData();
    } catch (err) {
      console.error('Error cambiando estado:', err);
    }
  };

  // Registrar libro electrónico
  const handleRegistrarLibro = async (data: RegistrarLibroData) => {
    try {
      const response = await librosElectronicosApi.registrar(data);
      if (response.success) {
        setShowLibroModal(false);
        setEditingLibro(null);
        await loadData();
      }
    } catch (err) {
      throw err;
    }
  };

  // Abrir modal para registrar libro de un mes específico
  const openLibroModal = (mesIdx: number) => {
    const periodo = `${anioFiltro}-${String(mesIdx + 1).padStart(2, '0')}`;
    setLibroMesSel(periodo);
    setEditingLibro(null);
    setShowLibroModal(true);
  };

  // Obtener libros de un mes específico
  const getLibrosMes = (mesIdx: number) => {
    const periodo = `${anioFiltro}-${String(mesIdx + 1).padStart(2, '0')}`;
    return libros.filter(l => l.periodo === periodo);
  };

  // Años disponibles para filtro
  const aniosDisponibles = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  // Resumen del año
  const resumen = declaraciones.reduce(
    (acc, d) => ({
      totalIGV: acc.totalIGV + (d.detalleIGV?.igvAPagar || 0),
      totalRenta: acc.totalRenta + (d.detalleRenta?.rentaAPagar || 0),
      totalGeneral: acc.totalGeneral + (d.totalAPagar || 0),
      pagadas: acc.pagadas + (d.estado === 'PAGADO' ? 1 : 0),
      pendientes: acc.pendientes + (d.estado === 'PENDIENTE' ? 1 : 0),
      vencidas: acc.vencidas + (d.estado === 'VENCIDO' ? 1 : 0)
    }),
    { totalIGV: 0, totalRenta: 0, totalGeneral: 0, pagadas: 0, pendientes: 0, vencidas: 0 }
  );

  if (loading && !cliente) return <PageLoader />;

  return (
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
          <span className="text-gray-900 dark:text-white font-medium">Declaraciones</span>
        </div>

        {/* Header */}
        <Card className="p-5">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                📄 Declaraciones Mensuales - {anioFiltro}
              </h1>
              {cliente && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {cliente.ruc} · {cliente.razonSocial} · {REGIMEN_LABELS[cliente.regimenTributario]}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <select
                value={anioFiltro}
                onChange={(e) => setAnioFiltro(parseInt(e.target.value))}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                {aniosDisponibles.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <Button onClick={() => setShowCreateModal(true)}>
                ➕ Nueva Declaración
              </Button>
            </div>
          </div>
        </Card>

        {/* Resumen anual */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-blue-600">S/ {resumen.totalIGV.toFixed(2)}</div>
            <div className="text-xs text-gray-500">IGV Total</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-purple-600">S/ {resumen.totalRenta.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Renta Total</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">S/ {resumen.totalGeneral.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Total Tributos</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-green-600">{resumen.pagadas}</div>
            <div className="text-xs text-gray-500">Pagadas</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-yellow-600">{resumen.pendientes}</div>
            <div className="text-xs text-gray-500">Pendientes</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-red-600">{resumen.vencidas}</div>
            <div className="text-xs text-gray-500">Vencidas</div>
          </Card>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {/* Grid visual de meses */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {MESES.map((mes, idx) => {
            const declaracion = declaraciones.find(d => d.mes === idx + 1);
            const librosMes = getLibrosMes(idx);
            const tieneLibros = librosConfigurados.length > 0;
            const librosPresentados = librosMes.filter(l => l.estado === 'PRESENTADO').length;
            const librosPendientes = tieneLibros ? librosConfigurados.length - librosPresentados : 0;
            
            return (
              <div 
                key={idx}
                className="transition-all hover:shadow-lg"
              >
              <Card 
                className={`p-4 ${
                  declaracion 
                    ? 'border-l-4 ' + getBorderColor(declaracion.estado)
                    : 'border-l-4 border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => declaracion ? setEditingDeclaracion(declaracion) : undefined}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{mes}</span>
                    {declaracion && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${ESTADO_DECLARACION_CONFIG[declaracion.estado]?.color}`}>
                        {ESTADO_DECLARACION_CONFIG[declaracion.estado]?.icon} {ESTADO_DECLARACION_CONFIG[declaracion.estado]?.label}
                      </span>
                    )}
                  </div>
                
                  {declaracion ? (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>IGV</span>
                        <span className="font-mono">S/ {(declaracion.detalleIGV?.igvAPagar || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>Renta</span>
                        <span className="font-mono">S/ {(declaracion.detalleRenta?.rentaAPagar || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-1 border-t border-gray-200 dark:border-gray-600">
                        <span>Total</span>
                        <span className="font-mono">S/ {(declaracion.totalAPagar || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 dark:text-gray-500">
                      Sin declaración
                    </div>
                  )}
                </div>
                    
                {/* Acciones rápidas de declaración */}
                {declaracion && (
                  <div className="flex gap-1 pt-2" onClick={(e) => e.stopPropagation()}>
                    {declaracion.estado === 'PENDIENTE' && (
                      <>
                        <button
                          onClick={() => handleCambiarEstado(declaracion, 'PRESENTADO')}
                          className="flex-1 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 transition-colors"
                        >
                          📄 Presentar
                        </button>
                        <button
                          onClick={() => handleCambiarEstado(declaracion, 'PAGADO')}
                          className="flex-1 text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded hover:bg-green-200 transition-colors"
                        >
                          ✅ Pagar
                        </button>
                      </>
                    )}
                    {declaracion.estado === 'PRESENTADO' && (
                      <button
                        onClick={() => handleCambiarEstado(declaracion, 'PAGADO')}
                        className="flex-1 text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded hover:bg-green-200 transition-colors"
                      >
                        ✅ Registrar Pago
                      </button>
                    )}
                  </div>
                )}

                {/* Sección de Libros Electrónicos */}
                {tieneLibros && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        📚 Libros
                      </span>
                      {librosPendientes > 0 ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                          {librosPendientes} pendiente{librosPendientes > 1 ? 's' : ''}
                        </span>
                      ) : librosMes.length > 0 ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          ✅ Completo
                        </span>
                      ) : null}
                    </div>
                    
                    {/* Lista compacta de libros */}
                    <div className="space-y-1">
                      {librosConfigurados.map(codigo => {
                        const libroExistente = librosMes.find(l => l.codigoLibro === codigo);
                        const info = catalogo[codigo];
                        return (
                          <div 
                            key={codigo}
                            className="flex items-center justify-between gap-1 text-[11px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded px-1 py-0.5 -mx-1"
                            onClick={() => {
                              if (libroExistente) {
                                setEditingLibro(libroExistente);
                                setLibroMesSel(libroExistente.periodo);
                                setShowLibroModal(true);
                              } else {
                                openLibroModal(idx);
                              }
                            }}
                          >
                            <span className="text-gray-600 dark:text-gray-400 truncate flex-1" title={info?.nombre}>
                              {info?.nombre || `Libro ${codigo}`}
                            </span>
                            {libroExistente ? (
                              <span className={`flex-shrink-0 ${ESTADO_LIBRO_CONFIG[libroExistente.estado]?.color} px-1 py-0.5 rounded text-[9px] font-medium`}>
                                {ESTADO_LIBRO_CONFIG[libroExistente.estado]?.icon}
                              </span>
                            ) : (
                              <span className="flex-shrink-0 text-gray-300 dark:text-gray-600 text-[9px]">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Botón registrar libro */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLibroModal(idx);
                      }}
                      className="w-full mt-1.5 text-[10px] px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors font-medium"
                    >
                      📚 Registrar Libro
                    </button>
                  </div>
                )}
              </Card>
              </div>
            );
          })}
        </div>

        {/* Modal crear/editar declaración */}
        {(showCreateModal || editingDeclaracion) && cliente && (
          <DeclaracionFormModal
            cliente={cliente}
            declaracion={editingDeclaracion || undefined}
            onClose={() => {
              setShowCreateModal(false);
              setEditingDeclaracion(null);
            }}
            onSubmit={editingDeclaracion ? handleActualizar : handleRegistrar}
          />
        )}

        {/* Modal registrar/editar libro electrónico */}
        {showLibroModal && libroMesSel && clienteId && (
          <LibroFormModal
            clienteId={clienteId}
            periodo={libroMesSel}
            libro={editingLibro || undefined}
            catalogo={catalogo}
            librosDisponibles={librosConfigurados}
            onClose={() => {
              setShowLibroModal(false);
              setEditingLibro(null);
            }}
            onSubmit={handleRegistrarLibro}
          />
        )}
      </div>
  );
};

function getBorderColor(estado: EstadoDeclaracion): string {
  const map: Record<EstadoDeclaracion, string> = {
    PENDIENTE: 'border-yellow-500',
    PRESENTADO: 'border-blue-500',
    PAGADO: 'border-green-500',
    VENCIDO: 'border-red-500',
    RECTIFICADO: 'border-purple-500'
  };
  return map[estado] || 'border-gray-300';
}

export default DeclaracionesCliente;
