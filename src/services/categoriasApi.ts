/**
 * 📁 CATEGORÍAS API SERVICE
 * Servicio para manejar las operaciones CRUD de categorías
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Tipos para TypeScript
export interface Categoria {
  _id: string;
  nombre: string;
  descripcion?: string;
  slug: string;
  icono: string;
  color: string;
  orden: number;
  activo: boolean;
  totalServicios: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoriaData {
  nombre: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  orden?: number;
}

export interface UpdateCategoriaData {
  nombre?: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  orden?: number;
  activo?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface CategoriesListResponse {
  success: boolean;
  data: Categoria[];
  total: number;
  message?: string;
}

class CategoriasApiService {
  private baseURL = `${API_BASE_URL}/categorias`;

  /**
   * Obtener todas las categorías
   */
  async getAll(params?: {
    activas?: boolean;
    conServicios?: boolean;
  }): Promise<CategoriesListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.activas !== undefined) {
        queryParams.append('activas', String(params.activas));
      }
      if (params?.conServicios !== undefined) {
        queryParams.append('conServicios', String(params.conServicios));
      }

      const url = queryParams.toString() 
        ? `${this.baseURL}?${queryParams.toString()}` 
        : this.baseURL;

      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener categorías:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener las categorías');
    }
  }

  /**
   * Obtener categoría por ID
   */
  async getById(id: string): Promise<ApiResponse<Categoria>> {
    try {
      const response = await axios.get(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener categoría:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener la categoría');
    }
  }

  /**
   * Crear nueva categoría
   */
  async create(data: CreateCategoriaData): Promise<ApiResponse<Categoria>> {
    try {
      const response = await axios.post(this.baseURL, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al crear categoría:', error);
      throw new Error(error.response?.data?.message || 'Error al crear la categoría');
    }
  }

  /**
   * Actualizar categoría existente
   */
  async update(id: string, data: UpdateCategoriaData): Promise<ApiResponse<Categoria>> {
    try {
      const response = await axios.put(`${this.baseURL}/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar categoría:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar la categoría');
    }
  }

  /**
   * Eliminar categoría
   */
  async delete(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await axios.delete(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al eliminar categoría:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar la categoría');
    }
  }

  /**
   * Obtener estadísticas de categorías
   */
  async getEstadisticas(): Promise<ApiResponse<any>> {
    try {
      const response = await axios.get(`${this.baseURL}/estadisticas`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener las estadísticas');
    }
  }

  /**
   * Obtener solo categorías activas (helper)
   */
  async getActivas(): Promise<Categoria[]> {
    const response = await this.getAll({ activas: true });
    return response.data;
  }

  /**
   * Obtener categorías con conteo de servicios (helper)
   */
  async getConServicios(): Promise<Categoria[]> {
    const response = await this.getAll({ activas: true, conServicios: true });
    return response.data;
  }
}

// Exportar instancia singleton
export const categoriasApi = new CategoriasApiService();
export default categoriasApi;