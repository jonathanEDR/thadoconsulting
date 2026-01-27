/**
 * 📧 Servicio de API para Formulario de Contacto Público
 * Solo maneja el envío de mensajes desde el formulario público (sin autenticación)
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ContactFormData {
  nombre: string;
  celular: string;
  correo: string;
  mensaje: string;
  categoria?: string; // Slug de la categoría seleccionada
}

export interface ContactResponse {
  success: boolean;
  message: string;
  contactId?: string;
  errors?: Array<{
    campo: string;
    mensaje: string;
  }>;
}

export interface CategoriaConTipoServicio {
  _id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  tipoServicio: string; // Valor del enum Lead.tipoServicio
}

export interface CategoriasResponse {
  success: boolean;
  data: {
    categorias: CategoriaConTipoServicio[];
    mapping: Record<string, string>;
    enumValues: string[];
  };
  message?: string;
  error?: string;
}

/**
 * Enviar mensaje de contacto (público o autenticado)
 * Si el usuario está autenticado, incluye el token para vincular automáticamente
 */
export const submitContact = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    // Intentar obtener el token de autenticación de Clerk
    let authToken: string | null = null;
    
    // Verificar si window.Clerk está disponible (autenticación con Clerk)
    if (typeof window !== 'undefined' && (window as any).Clerk) {
      try {
        const session = await (window as any).Clerk.session;
        if (session) {
          authToken = await session.getToken();
        }
      } catch (error) {
        console.warn('No se pudo obtener token de Clerk:', error);
      }
    }

    // Construir headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Agregar token si está disponible
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      // Error de validación o del servidor
      return {
        success: false,
        message: result.message || 'Error al enviar el mensaje',
        errors: result.errors,
      };
    }

    return result;
  } catch (error) {
    console.error('Error al enviar contacto:', error);
    return {
      success: false,
      message: 'Error de conexión. Por favor, verifica tu internet e intenta nuevamente.',
    };
  }
};

/**
 * Obtener categorías con su mapeo a tipos de servicio
 */
export const getCategoriasTipoServicio = async (): Promise<CategoriasResponse> => {
  try {
    const response = await fetch(`${API_URL}/contact/categorias-tipos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: { categorias: [], mapping: {}, enumValues: [] },
        message: result.message || 'Error al obtener categorías',
        error: result.error,
      };
    }

    return result;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return {
      success: false,
      data: { categorias: [], mapping: {}, enumValues: [] },
      message: 'Error de conexión al obtener categorías',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

export default {
  submitContact,
};
