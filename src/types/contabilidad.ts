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

export type TipoDeclaracion = 'IGV_RENTA' | 'PLANILLA' | 'AFP';

export type AFPProvider = 'HABITAT' | 'INTEGRA' | 'PRIMA' | 'PROFUTURO';

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

export const TIPO_DECLARACION_CONFIG: Record<TipoDeclaracion, { label: string; color: string; icon: string }> = {
  IGV_RENTA: { label: 'IGV / Renta', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: '📊' },
  PLANILLA: { label: 'Planilla', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400', icon: '👥' },
  AFP: { label: 'AFP', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: '🏦' }
};

export const AFP_PROVIDERS_INFO: Record<AFPProvider, { nombre: string; comision: number; primaSeguro: number }> = {
  HABITAT: { nombre: 'AFP Habitat', comision: 0.0138, primaSeguro: 0.0186 },
  INTEGRA: { nombre: 'AFP Integra', comision: 0.0155, primaSeguro: 0.0186 },
  PRIMA: { nombre: 'AFP Prima', comision: 0.0155, primaSeguro: 0.0186 },
  PROFUTURO: { nombre: 'AFP Profuturo', comision: 0.0169, primaSeguro: 0.0186 }
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
  obligaciones?: {
    igv?: boolean;
    renta?: boolean;
    planilla?: boolean;
    afp?: boolean;
    librosElectronicos?: boolean;
  };
  configPlanilla?: {
    cantidadTrabajadores?: number;
    tieneONP?: boolean;
    tieneAFP?: boolean;
    afpNombrePlanilla?: AFPProvider | '';
    tiene5ta?: boolean;
  };
  configAFP?: {
    afpNombre?: AFPProvider | '';
    cantidadAfiliados?: number;
  };
  librosElectronicos?: string[];
}

export interface ContadorAsignado {
  nombre: string;
  email?: string;
}

export type TipoDocumento = 'pdt' | 'voucher' | 'contrato' | 'constancia' | 'declaracion' | 'otro';

export interface DocumentoAdjunto {
  _id?: string;
  nombre: string;
  tipo: TipoDocumento;
  url: string;
  periodo?: string | null;
  notas?: string;
  subidoPor?: {
    userId?: string;
    nombre?: string;
  };
  fechaSubida: string;
}

export type TipoNota = 'nota' | 'llamada' | 'email' | 'reunion' | 'recordatorio' | 'cambio_estado';

export interface NotaCliente {
  _id?: string;
  tipo: TipoNota;
  descripcion: string;
  creadoPor?: {
    userId?: string;
    nombre?: string;
  };
  fecha: string;
  // Legacy fields (backward compat)
  texto?: string;
  autor?: string;
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

export interface DetallePlanilla {
  cantidadTrabajadores: number;
  totalRemuneraciones: number;
  essalud: number;
  sis?: number;
  onp: number;
  cantidadTrabajadoresONP: number;
  totalRemuneracionesONP?: number;
  // Trabajadores AFP dentro de la misma planilla PLAME
  cantidadTrabajadoresAFP?: number;
  totalRemuneracionesAFP?: number;
  retenciones5ta: number;
  cantidadTrabajadores5ta: number;
  vidaLey: number;
  totalAPagar: number;
}

export interface DetalleAFP {
  afpNombre: AFPProvider | '';
  cantidadAfiliados: number;
  totalRemuneraciones: number;
  aporteObligatorio: number;
  comisionAFP: number;
  primaSeguro: number;
  aporteVoluntario: number;
  totalAPagar: number;
}

export interface DeclaracionMensual {
  _id: string;
  clienteId: string | ClienteContable;
  periodo: string; // YYYY-MM
  anio: number;
  mes: number;
  tipo: TipoDeclaracion;
  detalleIGV?: DetalleIGV;
  detalleRenta?: DetalleRenta;
  detallePlanilla?: DetallePlanilla;
  detalleAFP?: DetalleAFP;
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
  tipo?: TipoDeclaracion;
  // Flat fields used by backend for recalculation
  ventasGravadas?: number;
  creditoFiscal?: number;
  saldoFavorAnterior?: number;
  coeficiente?: number;
  categoriaRUS?: number;
  // Nested detail objects
  detalleIGV?: Partial<DetalleIGV>;
  detalleRenta?: Partial<DetalleRenta>;
  // Planilla fields
  essalud?: number;
  sis?: number;
  cantidadTrabajadores?: number;
  totalRemuneraciones?: number;
  cantidadTrabajadoresONP?: number;
  totalRemuneracionesONP?: number;
  cantidadTrabajadoresAFP?: number;  // AFP dentro de PLAME
  retenciones5ta?: number;
  cantidadTrabajadores5ta?: number;
  vidaLey?: number;
  // AFP (AFPnet) fields
  afpNombre?: AFPProvider | '';
  cantidadAfiliados?: number;
  totalRemuneracionesAFP?: number;   // Rem. AFP (PLAME y/o AFPnet)
  aporteVoluntario?: number;
  // Common fields
  formulario?: string;
  numeroOrden?: string;
  pago?: Partial<PagoDeclaracion>;
  estado?: EstadoDeclaracion;
  fechaPresentacion?: string;
  esRectificatoria?: boolean;
  observaciones?: string;
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
// LIBROS ELECTRÓNICOS
// ============================================

export type EstadoLibro = 'PENDIENTE' | 'PRESENTADO';

export type SistemaLibro = 'PLE' | 'SIRE';

export interface CatalogoLibroInfo {
  nombre: string;
  sistema: SistemaLibro;
  obligatorioDesde: string;
}

export type CatalogoLibros = Record<string, CatalogoLibroInfo>;

export type LibrosPorRegimen = Record<RegimenTributario, string[]>;

export interface PresentacionLibro {
  _id: string;
  clienteId: string;
  periodo: string;
  anio: number;
  mes: number;
  codigoLibro: string;
  nombreLibro: string;
  sistema: SistemaLibro;
  estado: EstadoLibro;
  codigoConstancia: string;
  fechaPresentacion?: string;
  observaciones: string;
  registradoPor: {
    userId: string;
    nombre: string;
  };
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrarLibroData {
  clienteId: string;
  periodo: string;
  codigoLibro: string;
  codigoConstancia?: string;
  observaciones?: string;
}

export const ESTADO_LIBRO_CONFIG: Record<EstadoLibro, { label: string; color: string; icon: string }> = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: '⏳' },
  PRESENTADO: { label: 'Presentado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: '✅' }
};

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
  zonaIGV?: 'GRAVADA' | 'EXONERADA' | 'INAFECTA';
  estado: EstadoCliente;
  // Contacto y representante
  contacto?: {
    email?: string;
    telefono?: string;
    celular?: string;
  };
  representante?: {
    nombre?: string;
    dni?: string;
    cargo?: string;
  };
  direccionFiscal?: string;
  ubicacion?: {
    direccion?: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
  };
  // Honorarios
  honorarioMensual?: number;
  moneda?: string;
  // Google Drive
  linkDrive?: string;
  // Configuración tributaria
  configuracionTributaria?: {
    actividadEconomica?: string;
    obligaciones?: {
      igv?: boolean;
      renta?: boolean;
      planilla?: boolean;
      afp?: boolean;
      librosElectronicos?: boolean;
    };
    configPlanilla?: {
      cantidadTrabajadores?: number;
      tieneONP?: boolean;
      tiene5ta?: boolean;
    };
    configAFP?: {
      afpNombre?: string;
      cantidadAfiliados?: number;
    };
  };
  // Documentos compartidos
  documentos?: Array<{
    _id: string;
    nombre: string;
    tipo: string;
    url: string;
    periodo?: string;
    notas?: string;
    fechaSubida: string;
  }>;
  contadorAsignado: {
    nombre: string;
    email?: string;
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
