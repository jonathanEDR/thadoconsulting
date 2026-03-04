/**
 * 🏢 Servicio API para el Módulo de Contabilidad
 * Gestión de Clientes Contables, Declaraciones y Proyecciones
 */

import axios from 'axios';
import type {
  ClienteContable,
  CreateClienteData,
  UpdateClienteData,
  ClienteFilters,
  DeclaracionMensual,
  RegistrarDeclaracionData,
  CalcularImpuestosRequest,
  CalculoImpuestosResult,
  ResumenAnual,
  ProyeccionPago,
  CalcularProyeccionRequest,
  CronogramaEntry,
  SemaforoVencimientos,
  EstadisticasContabilidad,
  MiCuentaContable,
  MiEstadoContable,
  PaginationInfo,
  PresentacionLibro,
  RegistrarLibroData,
  CatalogoLibros,
  LibrosPorRegimen,
  DetallePlanilla,
  DetalleAFP
} from '../types/contabilidad';

// Declaración de tipo para Clerk en window
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * 🔧 Instancia de axios para contabilidad
 */
const api = axios.create({
  baseURL: `${API_URL}/contabilidad`,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 🔒 Interceptor para agregar token de Clerk
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error obteniendo token de Clerk:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 📝 Interceptor para manejo de errores
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('[Contabilidad] No autenticado');
    } else if (error.response?.status === 403) {
      console.error('[Contabilidad] Sin permisos');
    }
    return Promise.reject(error);
  }
);

// ============================================
// RESPUESTAS TIPADAS
// ============================================

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
}

// ============================================
// 🏢 CLIENTES CONTABLES
// ============================================

export const clientesContablesApi = {
  /**
   * Listar clientes con filtros y paginación
   */
  async listar(filters?: ClienteFilters): Promise<PaginatedResponse<ClienteContable>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.regimenTributario) params.append('regimenTributario', filters.regimenTributario);
    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.order) params.append('order', filters.order);

    const { data } = await api.get(`/clientes?${params.toString()}`);
    return data;
  },

  /**
   * Obtener detalle de un cliente
   */
  async obtener(id: string): Promise<ApiResponse<ClienteContable>> {
    const { data } = await api.get(`/clientes/${id}`);
    return data;
  },

  /**
   * Crear nuevo cliente contable
   */
  async crear(clienteData: CreateClienteData): Promise<ApiResponse<ClienteContable>> {
    const { data } = await api.post('/clientes', clienteData);
    return data;
  },

  /**
   * Actualizar cliente existente
   */
  async actualizar(id: string, clienteData: UpdateClienteData): Promise<ApiResponse<ClienteContable>> {
    const { data } = await api.put(`/clientes/${id}`, clienteData);
    return data;
  },

  /**
   * Dar de baja un cliente (soft delete)
   */
  async darDeBaja(id: string, motivo: string): Promise<ApiResponse<ClienteContable>> {
    const { data } = await api.delete(`/clientes/${id}`, { data: { motivo } });
    return data;
  },

  /**
   * Reactivar un cliente dado de baja
   */
  async reactivar(id: string): Promise<ApiResponse<ClienteContable>> {
    const { data } = await api.patch(`/clientes/${id}/reactivar`);
    return data;
  },

  /**
   * Vincular un usuario del sistema al cliente contable
   */
  async vincularUsuario(id: string, userId: string): Promise<ApiResponse<ClienteContable>> {
    const { data } = await api.post(`/clientes/${id}/vincular-usuario`, { userId });
    return data;
  },

  /**
   * Desvincular usuario del cliente contable
   */
  async desvincularUsuario(id: string): Promise<ApiResponse<ClienteContable>> {
    const { data } = await api.delete(`/clientes/${id}/vincular-usuario`);
    return data;
  },

  /**
   * Obtener usuarios disponibles para vincular (no vinculados a otro cliente)
   */
  async getUsuariosDisponibles(search?: string, page?: number): Promise<ApiResponse<{
    usuarios: Array<{
      _id: string;
      clerkId: string;
      email: string;
      nombre: string;
      firstName?: string;
      lastName?: string;
      profileImage?: string;
      role: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      total: number;
      hasNext: boolean;
    };
  }>> {
    const { data } = await api.get('/clientes/usuarios-disponibles', {
      params: { search, page, limit: 20 }
    });
    return data;
  },

  /**
   * Obtener clientes con ubicación para visualización en mapa
   */
  async getClientesMapa(): Promise<ApiResponse<ClienteContable[]> & { total?: number }> {
    const { data } = await api.get('/clientes/mapa');
    return data;
  },

  /**
   * Agregar nota a un cliente contable
   */
  async agregarNota(clienteId: string, nota: { tipo: string; descripcion: string }): Promise<ApiResponse<ClienteContable>> {
    const { data } = await api.post(`/clientes/${clienteId}/notas`, nota);
    return data;
  },

  /**
   * Eliminar nota de un cliente contable
   */
  async eliminarNota(clienteId: string, notaId: string): Promise<ApiResponse<ClienteContable>> {
    const { data } = await api.delete(`/clientes/${clienteId}/notas/${notaId}`);
    return data;
  },

  // ========================================
  // 📎 DOCUMENTOS
  // ========================================

  /**
   * Agregar documento (link) a un cliente contable
   */
  async agregarDocumento(
    clienteId: string,
    documento: { nombre: string; tipo: string; url: string; periodo?: string; notas?: string }
  ): Promise<ApiResponse<ClienteContable>> {
    const { data } = await api.post(`/clientes/${clienteId}/documentos`, documento);
    return data;
  },

  /**
   * Eliminar documento de un cliente contable
   */
  async eliminarDocumento(clienteId: string, docId: string): Promise<ApiResponse<ClienteContable>> {
    const { data } = await api.delete(`/clientes/${clienteId}/documentos/${docId}`);
    return data;
  }
};

// ============================================
// 📊 DASHBOARD Y ESTADÍSTICAS
// ============================================

export const contabilidadDashboardApi = {
  /**
   * Obtener semáforo de vencimientos
   */
  async getSemaforo(): Promise<ApiResponse<SemaforoVencimientos>> {
    const { data } = await api.get('/alertas/semaforo');
    return data;
  },

  /**
   * Obtener estadísticas generales
   */
  async getEstadisticas(): Promise<ApiResponse<EstadisticasContabilidad>> {
    const { data } = await api.get('/estadisticas');
    return data;
  }
};

// ============================================
// 📄 DECLARACIONES MENSUALES
// ============================================

export const declaracionesApi = {
  /**
   * Registrar nueva declaración
   */
  async registrar(declaracionData: RegistrarDeclaracionData): Promise<ApiResponse<DeclaracionMensual>> {
    const { data } = await api.post('/declaraciones', declaracionData);
    return data;
  },

  /**
   * Calcular impuestos (preview sin guardar)
   */
  async calcularPreview(params: CalcularImpuestosRequest): Promise<ApiResponse<CalculoImpuestosResult>> {
    const { data } = await api.post('/declaraciones/calcular', params);
    return data;
  },

  /**
   * Obtener historial de declaraciones de un cliente
   */
  async getHistorial(clienteId: string, anio?: number): Promise<ApiResponse<DeclaracionMensual[]>> {
    const params = anio ? `?anio=${anio}` : '';
    const { data } = await api.get(`/declaraciones/cliente/${clienteId}${params}`);
    return data;
  },

  /**
   * Obtener resumen anual de un cliente
   */
  async getResumenAnual(clienteId: string, anio?: number): Promise<ApiResponse<ResumenAnual>> {
    const params = anio ? `?anio=${anio}` : '';
    const { data } = await api.get(`/declaraciones/resumen-anual/${clienteId}${params}`);
    return data;
  },

  /**
   * Actualizar una declaración
   */
  async actualizar(id: string, updateData: Partial<RegistrarDeclaracionData>): Promise<ApiResponse<DeclaracionMensual>> {
    const { data } = await api.put(`/declaraciones/${id}`, updateData);
    return data;
  },

  /**
   * Cambiar estado de una declaración
   */
  async cambiarEstado(id: string, estado: string, pago?: Record<string, unknown>): Promise<ApiResponse<DeclaracionMensual>> {
    const { data } = await api.patch(`/declaraciones/${id}/estado`, { estado, pago });
    return data;
  },

  /**
   * Eliminar una declaración (soft delete)
   */
  async eliminar(id: string, motivo?: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete(`/declaraciones/${id}`, { data: { motivo } });
    return data;
  },

  /**
   * Calcular planilla (preview sin guardar)
   */
  async calcularPlanillaPreview(params: {
    cantidadTrabajadores?: number;
    totalRemuneraciones?: number;
    cantidadTrabajadoresONP?: number;
    totalRemuneracionesONP?: number;
    cantidadTrabajadoresAFP?: number;
    totalRemuneracionesAFP?: number;
    retenciones5ta?: number;
    cantidadTrabajadores5ta?: number;
    vidaLey?: number;
  }): Promise<ApiResponse<DetallePlanilla>> {
    const { data } = await api.post('/declaraciones/calcular-planilla', params);
    return data;
  },

  /**
   * Calcular AFP (preview sin guardar)
   */
  async calcularAFPPreview(params: {
    afpNombre?: string;
    cantidadAfiliados?: number;
    totalRemuneraciones?: number;
    aporteVoluntario?: number;
  }): Promise<ApiResponse<DetalleAFP>> {
    const { data } = await api.post('/declaraciones/calcular-afp', params);
    return data;
  },

  /**
   * Obtener proveedores AFP y sus tasas
   */
  async getAFPProviders(): Promise<ApiResponse<Record<string, { nombre: string; comision: number; primaSeguro: number }>>> {
    const { data } = await api.get('/declaraciones/afp-providers');
    return data;
  }
};

// ============================================
// 📊 PROYECCIONES
// ============================================

export const proyeccionesApi = {
  /**
   * Calcular proyección (preview)
   */
  async calcular(params: CalcularProyeccionRequest): Promise<ApiResponse<ProyeccionPago>> {
    const { data } = await api.post('/proyecciones/calcular', params);
    return data;
  },

  /**
   * Guardar proyección
   */
  async guardar(proyeccion: CalcularProyeccionRequest): Promise<ApiResponse<ProyeccionPago>> {
    const { data } = await api.post('/proyecciones', proyeccion);
    return data;
  },

  /**
   * Obtener proyecciones de un cliente
   */
  async getByCliente(clienteId: string): Promise<ApiResponse<ProyeccionPago[]>> {
    const { data } = await api.get(`/proyecciones/cliente/${clienteId}`);
    return data;
  },

  /**
   * Comparar proyección con declaración real
   */
  async comparar(id: string): Promise<ApiResponse<ProyeccionPago>> {
    const { data } = await api.post(`/proyecciones/${id}/comparar`);
    return data;
  }
};

// ============================================
// 📅 CRONOGRAMA SUNAT
// ============================================

export const cronogramaApi = {
  /**
   * Obtener cronograma de un periodo
   */
  async getPeriodo(periodo: string): Promise<ApiResponse<CronogramaEntry[]>> {
    const { data } = await api.get(`/cronograma/${periodo}`);
    return data;
  },

  /**
   * Generar cronograma para un año
   */
  async generar(anio: number): Promise<ApiResponse<{ message: string }>> {
    const { data } = await api.post('/cronograma/generar', { anio });
    return data;
  }
};

// ============================================
// 👤 PORTAL CLIENTE
// ============================================

export const portalClienteApi = {
  /**
   * Obtener mi cuenta contable (para rol CLIENT)
   */
  async getMiCuenta(): Promise<ApiResponse<MiCuentaContable>> {
    const { data } = await api.get('/mi-cuenta');
    return data;
  },

  /**
   * Obtener mis declaraciones (para rol CLIENT)
   */
  async getMisDeclaraciones(anio?: number): Promise<ApiResponse<DeclaracionMensual[] | { declaraciones: DeclaracionMensual[]; cliente?: unknown; pagination?: unknown }>> {
    const params = anio ? `?anio=${anio}` : '';
    const { data } = await api.get(`/mis-declaraciones${params}`);
    return data;
  },

  /**
   * Obtener mi estado actual (para rol CLIENT)
   */
  async getMiEstado(): Promise<ApiResponse<MiEstadoContable>> {
    const { data } = await api.get('/mi-estado');
    return data;
  }
};

// ============================================
// 📚 LIBROS ELECTRÓNICOS
// ============================================

export const librosElectronicosApi = {
  /**
   * Obtener catálogo de libros y configuración por régimen
   */
  async getCatalogo(): Promise<ApiResponse<{ catalogo: CatalogoLibros; librosPorRegimen: LibrosPorRegimen }>> {
    const { data } = await api.get('/libros/catalogo');
    return data;
  },

  /**
   * Obtener libros configurados de un cliente + presentaciones
   */
  async getByCliente(clienteId: string, params?: { periodo?: string; anio?: number }): Promise<ApiResponse<{
    cliente: { _id: string; ruc: string; razonSocial: string; regimenTributario: string; librosConfigurados: string[] };
    presentaciones: PresentacionLibro[];
    catalogo: CatalogoLibros;
  }>> {
    const queryParams = new URLSearchParams();
    if (params?.periodo) queryParams.set('periodo', params.periodo);
    if (params?.anio) queryParams.set('anio', String(params.anio));
    const qs = queryParams.toString();
    const { data } = await api.get(`/libros/cliente/${clienteId}${qs ? '?' + qs : ''}`);
    return data;
  },

  /**
   * Obtener libros de un periodo específico (auto-crea pendientes)
   */
  async getByPeriodo(clienteId: string, periodo: string): Promise<ApiResponse<{
    presentaciones: PresentacionLibro[];
    librosConfigurados: string[];
  }>> {
    const { data } = await api.get(`/libros/cliente/${clienteId}/periodo/${periodo}`);
    return data;
  },

  /**
   * Registrar presentación de un libro electrónico
   */
  async registrar(libroData: RegistrarLibroData): Promise<ApiResponse<PresentacionLibro>> {
    const { data } = await api.post('/libros', libroData);
    return data;
  },

  /**
   * Actualizar presentación de un libro
   */
  async actualizar(id: string, updates: Partial<{ estado: string; codigoConstancia: string; observaciones: string }>): Promise<ApiResponse<PresentacionLibro>> {
    const { data } = await api.put(`/libros/${id}`, updates);
    return data;
  },

  /**
   * Configurar qué libros debe llevar un cliente
   */
  async configurarLibros(clienteId: string, libros: string[]): Promise<ApiResponse<ClienteContable>> {
    const { data } = await api.put(`/libros/cliente/${clienteId}/configurar`, { libros });
    return data;
  }
};

// Export default agrupado
const contabilidadService = {
  clientes: clientesContablesApi,
  dashboard: contabilidadDashboardApi,
  declaraciones: declaracionesApi,
  proyecciones: proyeccionesApi,
  cronograma: cronogramaApi,
  portal: portalClienteApi,
  libros: librosElectronicosApi
};

export default contabilidadService;
