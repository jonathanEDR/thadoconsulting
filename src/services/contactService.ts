/**
 * 📞 CONTACT SERVICE
 * Servicios relacionados con el formulario de contacto
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Tipos para TypeScript
export interface CategoriaMapeo {
  _id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  tipoServicio: string; // Valor del enum de Lead
}

export interface CategoriasMapeoResponse {
  success: boolean;
  data: {
    categorias: CategoriaMapeo[];
    mapping: Record<string, string>;
    enumValues: string[];
  };
}

export interface ContactFormData {
  nombre: string;
  celular: string;
  correo: string;
  mensaje: string;
  categoria?: string;
  acceptTerms?: boolean;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  leadId?: string;
  canAccessPanel?: boolean;
  userType?: 'registered' | 'public';
}

class ContactService {
  private baseURL = `${API_BASE_URL}/api/contact`;

  /**
   * Obtener mapeo de categorías a tipos de servicio
   */
  async getCategoriasTipoServicio(): Promise<CategoriasMapeoResponse> {
    try {
      const response = await axios.get(`${this.baseURL}/categorias-tipos`);
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo mapeo de categorías:', error);
      throw new Error(error.response?.data?.message || 'Error obteniendo categorías');
    }
  }

  /**
   * Enviar formulario de contacto
   */
  async enviarFormulario(data: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await axios.post(this.baseURL, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error enviando formulario:', error);
      throw new Error(error.response?.data?.message || 'Error enviando formulario');
    }
  }
}

// Instancia única del servicio
export const contactService = new ContactService();
export default contactService;