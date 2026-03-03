/**
 * 🏢 Tipos TypeScript para el Módulo de Contabilidad
 * Gestión de Clientes Contables, Declaraciones y Proyecciones
 */

// ============================================
// ENUMS Y CONSTANTES
// ============================================

export type RegimenTributario = 'RUS' | 'RER' | 'MYPE' | 'GENERAL';

export type EstadoCliente = 'ACTIVO' | 'SUSPENDIDO' | 'BAJA';

export type EstadoDeclaracion = 'PENDIENTE' | 'PRESENTADO' | 'PAGADO' | 'VENCIDO' | 'RECTIFICADO';

export type MedioPago = 'EFECTIVO' | 'TRANSFERENCIA' | 'DEPOSITO' | 'TARJETA' | 'OTRO';

export type CategoriaRUS = 1 | 2;

export type ZonaIGV = 'GRAVADA' | 'EXONERADA' | 'INAFECTA';

export const ZONA_IGV_LABELS: Record<ZonaIGV, string> = {
  GRAVADA: 'Zona Gravada con IGV',
  EXONERADA: 'Zona Exonerada de IGV (Amazonía)',
  INAFECTA: 'Zona Inafecta de IGV'
};

export const ZONA_IGV_COLORS: Record<ZonaIGV, string> = {
  GRAVADA: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  EXONERADA: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  INAFECTA: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
};

export const REGIMEN_LABELS: Record<RegimenTributario, string> = {
  RUS: 'Nuevo RUS',
  RER: 'Régimen Especial (RER)',
  MYPE: 'Régimen MYPE Tributario',
  GENERAL: 'Régimen General'
};

export const REGIMEN_COLORS: Record<RegimenTributario, string> = {
  RUS: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  RER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  MYPE: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  GENERAL: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
};

export const ESTADO_DECLARACION_CONFIG: Record<EstadoDeclaracion, { label: string; color: string; icon: string }> = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: '⏳' },
  PRESENTADO: { label: 'Presentado', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: '📄' },
  PAGADO: { label: 'Pagado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: '✅' },
  VENCIDO: { label: 'Vencido', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: '🔴' },
  RECTIFICADO: { label: 'Rectificado', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: '🔄' }
};

export const ESTADO_CLIENTE_CONFIG: Record<EstadoCliente, { label: string; color: string; icon: string }> = {
  ACTIVO: { label: 'Activo', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: '🟢' },
  SUSPENDIDO: { label: 'Suspendido', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: '🟡' },
  BAJA: { label: 'Baja', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: '🔴' }
};

// ============================================
// INTERFACES PRINCIPALES
// ============================================

export interface Representante {
  nombre: string;
  cargo?: string;
  dni?: string;
  telefono?: string;
}

export interface Contacto {
  email?: string;
  telefono?: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
}

export interface Coordenadas {
  lat: number | null;
  lng: number | null;
}

export interface Ubicacion {
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  coordenadas: Coordenadas;
}

export interface ConfiguracionTributaria {
  categoriaRUS?: CategoriaRUS;
  coeficienteRenta?: number;
  obligaciones?: string[];
}

export interface ContadorAsignado {
  nombre: string;
  email?: string;
}

export interface DocumentoAdjunto {
  _id?: string;
  nombre: string;
  tipo: string;
  url: string;
  fechaSubida: string;
}

export interface NotaCliente {
  _id?: string;
  texto: string;
  fecha: string;
  autor: string;
}

export interface ClienteContable {
  _id: string;
  ruc: string;
  razonSocial: string;
  nombreComercial?: string;
  regimenTributario: RegimenTributario;
  zonaIGV: ZonaIGV;
  representante: Representante;
  contacto: Contacto;
  ubicacion?: Ubicacion;
  honorarioMensual?: number;
  linkDrive?: string;
  usuarioVinculado?: {
    userId?: string;
    clerkId: string;
    email: string;
    nombre: string;
    vinculadoEn: string;
  };
  configuracionTributaria: ConfiguracionTributaria;
  documentos: DocumentoAdjunto[];
  notas: NotaCliente[];
  contadorAsignado?: ContadorAsignado;
  activo: boolean;
  estado: EstadoCliente;
  motivoBaja?: string;
  fechaBaja?: string;
  createdAt: string;
  updatedAt: string;
  // Virtuals
  digitoRuc?: string;
  displayName?: string;
}

export interface CreateClienteData {
  ruc: string;
  razonSocial: string;
  nombreComercial?: string;
  regimenTributario: RegimenTributario;
  zonaIGV?: ZonaIGV;
  representante: Representante;
  contacto?: Contacto;
  ubicacion?: Ubicacion;
  honorarioMensual?: number;
  linkDrive?: string;
  configuracionTributaria?: ConfiguracionTributaria;
  contadorAsignado?: ContadorAsignado;
}

export interface UpdateClienteData extends Partial<CreateClienteData> {
  notas?: NotaCliente[];
}

// ============================================
// DECLARACIONES
// ============================================

export interface DetalleIGV {
  ventasGravadas: number;
  debitoFiscal: number;
  comprasGravadas: number;
  creditoFiscal: number;
  igvResultante: number;
  saldoFavorAnterior?: number;
  igvAPagar: number;
}

export interface DetalleRenta {
  regimenAplicado: string;
  baseImponible: number;
  coeficienteAplicado?: number;
  categoriaRUS?: CategoriaRUS;
  cuotaFijaRUS?: number;
  rentaCalculada: number;
  rentaAPagar: number;
  excedeLimiteCategoria?: boolean;
  nota?: string | null;
}

export interface PagoDeclaracion {
  montoPagado: number;
  fechaPago?: string;
  medioPago?: MedioPago;
  numeroOperacion?: string;
}

export interface DeclaracionMensual {
  _id: string;
  clienteId: string | ClienteContable;
  periodo: string; // YYYY-MM
  anio: number;
  mes: number;
  detalleIGV: DetalleIGV;
  detalleRenta: DetalleRenta;
  totalAPagar: number;
  formulario?: string;
  numeroOrden?: string;
  pago: PagoDeclaracion;
  estado: EstadoDeclaracion;
  fechaPresentacion?: string;
  fechaVencimiento?: string;
  esRectificatoria: boolean;
  registradoPor: {
    clerkId: string;
    nombre: string;
  };
  createdAt: string;
  updatedAt: string;
  // Virtuals
  estaVencida?: boolean;
  diasRestantes?: number;
  periodoFormateado?: string;
}

export interface RegistrarDeclaracionData {
  clienteId: string;
  periodo: string;
  // Flat fields used by backend for recalculation
  ventasGravadas?: number;
  creditoFiscal?: number;
  saldoFavorAnterior?: number;
  coeficiente?: number;
  categoriaRUS?: number;
  // Nested detail objects
  detalleIGV: Partial<DetalleIGV>;
  detalleRenta?: Partial<DetalleRenta>;
  formulario?: string;
  numeroOrden?: string;
  pago?: Partial<PagoDeclaracion>;
  estado?: EstadoDeclaracion;
  fechaPresentacion?: string;
  esRectificatoria?: boolean;
}

export interface CalcularImpuestosRequest {
  clienteId: string;
  periodo?: string;
  ventasGravadas?: number;
  creditoFiscal?: number;
  comprasGravadas?: number;
  saldoFavorAnterior?: number;
  coeficiente?: number;
  categoriaRUS?: number;
  regimen?: string;
}

export interface CalculoImpuestosResult {
  regimen: string;
  zonaIGV?: ZonaIGV;
  detalleIGV: (DetalleIGV & { zonaIGV?: string; nota?: string }) | null;
  detalleRenta: DetalleRenta;
  resumen: {
    igvAPagar: number;
    rentaAPagar: number;
    totalAPagar: number;
    esExoneradoIGV?: boolean;
  };
  fechaVencimiento?: string;
}

export interface ResumenAnual {
  anio: number;
  clienteId: string;
  totalIGV: number;
  totalRenta: number;
  totalPagado: number;
  declaracionesPorMes: Array<{
    mes: number;
    count: number;
    totalAPagar: number;
    totalPagado: number;
  }>;
}

// ============================================
// PROYECCIONES
// ============================================

export interface ProyeccionPago {
  _id: string;
  clienteId: string | ClienteContable;
  periodo: string;
  ingresosEstimados: number;
  comprasEstimadas: number;
  igvEstimado: {
    debito: number;
    credito: number;
    neto: number;
  };
  rentaEstimada: {
    base: number;
    coeficiente: number;
    monto: number;
  };
  totalEstimado: number;
  fechaVencimiento?: string;
  declaracionRealId?: string;
  comparacion?: {
    diferenciaIGV: number;
    diferenciaRenta: number;
    diferenciaTotal: number;
    precision: number;
  };
  compartidoConCliente: boolean;
  creadoPor: {
    clerkId: string;
    nombre: string;
  };
  createdAt: string;
}

export interface CalcularProyeccionRequest {
  clienteId: string;
  periodo: string;
  ingresosEstimados: number;
  comprasEstimadas: number;
}

// ============================================
// CRONOGRAMA SUNAT
// ============================================

export interface CronogramaEntry {
  _id: string;
  anio: number;
  mesTributario: number;
  digitoRuc: string;
  fechaVencimiento: string;
  tipo: 'MENSUAL' | 'ANUAL';
}

// ============================================
// SEMÁFORO Y ESTADÍSTICAS
// ============================================

export interface ClienteSemaforo {
  _id: string;
  ruc: string;
  razonSocial: string;
  regimen: RegimenTributario;
  regimenTributario?: RegimenTributario;
  linkDrive?: string | null;
  estado: string;
  totalAPagar?: number;
  diasRestantes?: number;
  fechaVencimiento?: string;
  fechaPresentacion?: string;
}

export interface SemaforoCategoria {
  count: number;
  clientes: ClienteSemaforo[];
}

export interface SemaforoVencimientos {
  periodo: string;
  totalClientes: number;
  vencidos: SemaforoCategoria;
  proximos: SemaforoCategoria;
  alDia: SemaforoCategoria;
  pendientes: SemaforoCategoria;
}

export interface EstadisticasContabilidad {
  totalClientes: number;
  clientesActivos: number;
  clientesSuspendidos: number;
  clientesBaja: number;
  porRegimen: Array<{ _id: RegimenTributario; count: number }>;
  declaracionesMes: number;
  declaracionesPendientes: number;
  montoTotalMes: number;
}

// ============================================
// FILTROS Y PAGINACIÓN
// ============================================

export interface ClienteFilters {
  search?: string;
  regimenTributario?: RegimenTributario;
  estado?: EstadoCliente;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface DeclaracionFilters {
  periodo?: string;
  estado?: EstadoDeclaracion;
  anio?: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// PORTAL CLIENTE
// ============================================

export interface MiCuentaContable {
  _id: string;
  ruc: string;
  razonSocial: string;
  nombreComercial?: string;
  regimenTributario: RegimenTributario;
  estado: EstadoCliente;
  contadorAsignado: {
    nombre: string;
  };
}

export interface MiEstadoContable {
  estadoGeneral: string;
  ultimaDeclaracion?: DeclaracionMensual | null;
  ultimasDeclaraciones?: DeclaracionMensual[];
  declaracionesPendientes?: number;
  pendientes?: number;
  proximoVencimiento?: string;
  periodoActual?: string;
}
