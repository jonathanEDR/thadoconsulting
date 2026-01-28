/**
 * 📦 TIPOS TYPESCRIPT - MÓDULO DE SERVICIOS
 * Tipos completos para el sistema de gestión de servicios
 */

// ============================================
// TIPOS PRINCIPALES
// ============================================

/**
 * Servicio - Modelo principal
 */
export interface Servicio {
  _id: string;
  titulo: string;
  descripcion: string;
  descripcionCorta?: string;
  
  // Visual
  icono: string;
  iconoType: 'emoji' | 'url' | 'icon-name';
  colorIcono: string;
  colorFondo: string;
  colorPrimario?: string; // Color principal del servicio
  colorSecundario?: string; // Color secundario del servicio
  orden: number;
  
  // Imágenes
  imagen?: string; // Imagen principal individual
  imagenPrincipal?: string;
  imagenes?: string[];
  
  // Pricing
  precio?: number;
  precioMin?: number;
  precioMax?: number;
  tipoPrecio: 'fijo' | 'rango' | 'paquetes' | 'personalizado' | 'suscripcion' | 'desde' | 'consultar';
  moneda: 'USD' | 'MXN' | 'EUR' | 'COP' | 'PEN';
  descuento?: number; // Porcentaje de descuento
  fechaPromocion?: string; // Fecha límite de promoción
  etiquetaPromocion?: string; // Texto promocional personalizado
  
  // Duración
  duracion?: {
    valor: number;
    unidad: 'horas' | 'días' | 'semanas' | 'meses' | 'años';
  };
  
  // Estado y categoría
  estado: 'activo' | 'desarrollo' | 'pausado' | 'descontinuado' | 'agotado';
  categoria: any; // Puede ser string (ObjectId) o objeto poblado con categoría completa
  
  // Features
  caracteristicas: string[];
  beneficios?: string[]; // Beneficios clave del servicio
  incluye?: string[]; // Lista de lo que incluye el servicio
  noIncluye?: string[]; // Lista de lo que NO incluye el servicio
  faq?: { // Preguntas frecuentes
    pregunta: string;
    respuesta: string;
  }[];
  tecnologias?: string[];
  etiquetas: string[];
  
  // Gestión
  destacado: boolean;
  activo: boolean;
  visibleEnWeb: boolean;
  requiereContacto: boolean;
  esPlantilla: boolean;
  
  // Relaciones
  responsable?: string; // User ID
  departamento?: string;
  
  // Métricas
  vecesVendido: number;
  ingresoTotal: number;
  rating?: number;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
  seo?: {
    titulo: string;
    descripcion: string;
    palabraClavePrincipal: string; // Focus Keyword - palabra clave principal
    palabrasClave: string;
  };
  
  // Contenido Avanzado - Personalización de detalles
  descripcionRica?: string; // HTML/Markdown del editor WYSIWYG
  videoUrl?: string; // URL de video (YouTube, Vimeo, etc.)
  galeriaImagenes?: string[]; // Array adicional de URLs de imágenes para galería
  contenidoAdicional?: string; // Sección extra personalizable
  
  // Configuraciones de Servicio
  tiempoEntrega?: string; // Tiempo estimado de entrega
  garantia?: string; // Garantía ofrecida
  soporte?: 'basico' | 'premium' | 'dedicado' | '24x7'; // Nivel de soporte
  
  // Campos flexibles
  camposPersonalizados?: {
    nombre: string;
    valor: any;
    tipo: 'texto' | 'numero' | 'boolean' | 'fecha';
  }[];
  
  // Plantillas
  plantillaId?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  
  // Relación virtual con paquetes
  paquetes?: PaqueteServicio[];
}

/**
 * Paquete de Servicio - Planes/Opciones de un servicio
 */
export interface PaqueteServicio {
  _id: string;
  servicioId: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  precioOriginal?: number;
  moneda: 'USD' | 'MXN' | 'EUR' | 'PEN';
  tipoFacturacion: 'unico' | 'mensual' | 'trimestral' | 'anual';
  
  // Características incluidas
  caracteristicas: {
    texto: string;
    incluido: boolean;
    descripcion?: string;
    icono?: string;
  }[];
  
  // Limitaciones
  limitaciones?: {
    tipo: 'cantidad' | 'tiempo' | 'feature' | 'otro';
    descripcion: string;
    valor?: any;
  }[];
  
  // Extras opcionales
  addons?: {
    nombre: string;
    descripcion?: string;
    precio: number;
    obligatorio: boolean;
  }[];
  
  // Ordenamiento y display
  orden: number;
  destacado: boolean;
  disponible: boolean;
  
  // Métricas
  vecesVendido: number;
  ingresoTotal: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============================================
// FILTROS Y BÚSQUEDA
// ============================================

/**
 * Filtros para buscar servicios
 */
export interface ServicioFilters {
  categoria?: string;
  estado?: string;
  destacado?: boolean;
  activo?: boolean;
  visibleEnWeb?: boolean;
  etiqueta?: string;
  precioMin?: number;
  precioMax?: number;
  tipoPrecio?: string;
  departamento?: string;
  responsable?: string;
  search?: string;
  includeDeleted?: boolean;
  // Parámetros de paginación opcionales
  page?: number;
  limit?: number;
  sort?: string;
}

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

// ============================================
// RESPUESTAS DE LA API
// ============================================

/**
 * Respuesta estándar de la API
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Respuesta de lista de servicios con paginación
 */
export interface ServiciosResponse {
  success: boolean;
  data: Servicio[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  // Formato alternativo (propiedades directas en root)
  total?: number;
  page?: number;
  pages?: number;
  limit?: number;
  count?: number;
}

/**
 * Respuesta de un solo servicio
 */
export interface ServicioResponse {
  success: boolean;
  data: Servicio;
  message?: string;
}

/**
 * Respuesta de paquetes
 */
export interface PaquetesResponse {
  success: boolean;
  data: PaqueteServicio[];
}

/**
 * Respuesta de un solo paquete
 */
export interface PaqueteResponse {
  success: boolean;
  data: PaqueteServicio;
  message?: string;
}

// ============================================
// ESTADÍSTICAS Y DASHBOARD
// ============================================

/**
 * Estadísticas del dashboard de servicios
 */
export interface ServicioDashboardStats {
  resumen: {
    serviciosActivos: number;
    serviciosEnDesarrollo: number;
    serviciosPausados: number;
    serviciosDescontinuados: number;
    totalServicios: number;
  };
  ingresos: {
    mes: number;
    anio: number;
    promedioPorServicio: number;
    total: number;
  };
  topServicios: {
    servicio: Servicio;
    ventas: number;
    ingresos: number;
  }[];
  ventasPorMes: {
    mes: string;
    ventas: number;
    ingresos: number;
  }[];
  paquetesMasPopulares: {
    paquete: PaqueteServicio;
    servicio: Servicio;
    ventas: number;
  }[];
}

/**
 * Estadísticas generales
 */
export interface ServicioStats {
  totalServicios: number;
  serviciosActivos: number;
  serviciosPorCategoria: Record<string, number>;
  ventasTotales: number;
  ingresosTotales: number;
}

/**
 * Estadísticas de ventas
 */
export interface VentasStats {
  ventasMes: number;
  ventasAnio: number;
  ingresosMes: number;
  ingresosAnio: number;
  promedioVenta: number;
  tasaCrecimiento: number;
}

/**
 * Métricas de conversión
 */
export interface ConversionMetrics {
  vistasServicios: number;
  contactosSolicitudes: number;
  ventasCerradas: number;
  tasaConversion: number;
  tiempoPromedioCierre: number;
}

// ============================================
// FORMULARIOS Y REQUESTS
// ============================================

/**
 * Datos para crear un servicio
 */
export interface CreateServicioRequest {
  titulo: string;
  descripcion: string;
  descripcionCorta?: string;
  icono?: string;
  iconoType?: 'emoji' | 'url' | 'icon-name';
  colorIcono?: string;
  colorFondo?: string;
  precio?: number;
  precioMin?: number;
  precioMax?: number;
  tipoPrecio: 'fijo' | 'desde' | 'rango' | 'paquetes' | 'personalizado' | 'consultar' | 'suscripcion';
  moneda?: 'USD' | 'MXN' | 'EUR' | 'PEN';
  duracion?: {
    valor: number;
    unidad: 'horas' | 'días' | 'semanas' | 'meses' | 'años';
  };
  estado?: 'activo' | 'desarrollo' | 'pausado' | 'descontinuado' | 'agotado';
  categoria: string; // ObjectId de la categoría
  caracteristicas?: string[];
  incluye?: string[];
  noIncluye?: string[];
  faq?: {
    pregunta: string;
    respuesta: string;
  }[];
  tecnologias?: string[];
  etiquetas?: string[];
  destacado?: boolean;
  activo?: boolean;
  visibleEnWeb?: boolean;
  requiereContacto?: boolean;
  departamento?: string;
  
  // SEO - Usar objeto seo preferentemente
  /** @deprecated Usar seo.titulo */
  metaTitle?: string;
  /** @deprecated Usar seo.descripcion */
  metaDescription?: string;
  seo?: {
    titulo?: string;
    descripcion?: string;
    palabraClavePrincipal?: string;
    palabrasClave?: string;
  };
  
  // Contenido Avanzado
  descripcionRica?: string;
  videoUrl?: string;
  galeriaImagenes?: string[];
  contenidoAdicional?: string;
}

/**
 * Datos para actualizar un servicio
 */
export interface UpdateServicioRequest extends Partial<CreateServicioRequest> {}

/**
 * Datos para crear un paquete
 */
export interface CreatePaqueteRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  precioOriginal?: number;
  moneda?: 'USD' | 'MXN' | 'EUR' | 'PEN';
  tipoFacturacion?: 'unico' | 'mensual' | 'trimestral' | 'anual';
  caracteristicas: {
    texto: string;
    incluido: boolean;
    descripcion?: string;
    icono?: string;
  }[];
  limitaciones?: {
    tipo: 'cantidad' | 'tiempo' | 'feature' | 'otro';
    descripcion: string;
    valor?: any;
  }[];
  orden?: number;
  destacado?: boolean;
  disponible?: boolean;
}

/**
 * Datos para actualizar un paquete
 */
export interface UpdatePaqueteRequest extends Partial<CreatePaqueteRequest> {}

/**
 * Cambio de estado
 */
export interface ChangeStatusRequest {
  estado: 'activo' | 'desarrollo' | 'pausado' | 'descontinuado' | 'agotado';
}

/**
 * Cambio de estado masivo
 */
export interface BulkChangeStatusRequest {
  ids: string[];
  estado: 'activo' | 'desarrollo' | 'pausado' | 'descontinuado' | 'agotado';
}

// ============================================
// TIPOS AUXILIARES
// ============================================

/**
 * Estados posibles de un servicio
 */
export const EstadoServicio = {
  ACTIVO: 'activo' as const,
  DESARROLLO: 'desarrollo' as const,
  PAUSADO: 'pausado' as const,
  DESCONTINUADO: 'descontinuado' as const,
  AGOTADO: 'agotado' as const
};

export type EstadoServicioType = typeof EstadoServicio[keyof typeof EstadoServicio];

// CategoriaServicio eliminado - ahora se gestionan dinámicamente desde la base de datos

/**
 * Tipos de precio
 */
export const TipoPrecio = {
  FIJO: 'fijo' as const,
  RANGO: 'rango' as const,
  PAQUETES: 'paquetes' as const,
  PERSONALIZADO: 'personalizado' as const,
  SUSCRIPCION: 'suscripcion' as const
};

export type TipoPrecioType = typeof TipoPrecio[keyof typeof TipoPrecio];

/**
 * Monedas soportadas
 */
export const Moneda = {
  USD: 'USD' as const,
  MXN: 'MXN' as const,
  EUR: 'EUR' as const,
  PEN: 'PEN' as const
};

export type MonedaType = typeof Moneda[keyof typeof Moneda];

/**
 * Tipos de facturación
 */
export const TipoFacturacion = {
  UNICO: 'unico' as const,
  MENSUAL: 'mensual' as const,
  TRIMESTRAL: 'trimestral' as const,
  ANUAL: 'anual' as const
};

export type TipoFacturacionType = typeof TipoFacturacion[keyof typeof TipoFacturacion];

// ============================================
// TIPOS DE UTILIDAD
// ============================================

/**
 * Estado de carga
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Resultado de operación
 */
export interface OperationResult {
  success: boolean;
  message?: string;
  error?: string;
}
