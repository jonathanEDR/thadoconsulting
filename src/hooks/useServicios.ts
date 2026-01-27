/**
 * 🎣 HOOK PRINCIPAL - useServicios
 * Hook personalizado para gestionar servicios con estado y operaciones CRUD
 */

import { useState, useEffect, useCallback } from 'react';
import { serviciosApi } from '../services/serviciosApi';
import type {
  Servicio,
  ServicioFilters,
  PaginationParams,
  CreateServicioRequest,
  UpdateServicioRequest
} from '../types/servicios';

// ============================================
// TIPOS DEL HOOK
// ============================================

interface UseServiciosOptions {
  initialFilters?: ServicioFilters;
  initialPagination?: PaginationParams;
  autoFetch?: boolean; // Si debe cargar automáticamente al montar
  fetchAll?: boolean; // Si debe cargar TODOS los servicios (sin paginación del servidor)
}

interface UseServiciosReturn {
  // Estado
  servicios: Servicio[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  filters: ServicioFilters;
  
  // Setters
  setFilters: (filters: ServicioFilters) => void;
  setPage: (page: number) => void;
  
  // Operaciones CRUD
  createServicio: (data: CreateServicioRequest) => Promise<OperationResult>;
  updateServicio: (id: string, data: UpdateServicioRequest) => Promise<OperationResult>;
  deleteServicio: (id: string, soft?: boolean) => Promise<OperationResult>;
  
  // Operaciones especiales
  duplicateServicio: (id: string) => Promise<OperationResult>;
  changeStatus: (id: string, estado: string) => Promise<OperationResult>;
  bulkChangeStatus: (ids: string[], estado: string) => Promise<OperationResult>;
  
  // Utilidades
  refresh: () => Promise<void>;
  clearError: () => void;
}

interface OperationResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

// ============================================
// HOOK
// ============================================

/**
 * Hook principal para gestionar servicios
 * 
 * @example
 * ```tsx
 * const { servicios, loading, createServicio } = useServicios({
 *   initialFilters: { categoria: 'desarrollo' },
 *   autoFetch: true
 * });
 * ```
 */
export const useServicios = (options: UseServiciosOptions = {}): UseServiciosReturn => {
  const {
    initialFilters = {},
    initialPagination = { page: 1, limit: 10 },
    autoFetch = true,
    fetchAll = false // Nueva opción para traer todos los servicios
  } = options;

  // ============================================
  // ESTADO
  // ============================================

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ServicioFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    total: 0,
    page: initialPagination.page || 1,
    limit: initialPagination.limit || 10,
    pages: 0
  });

  // ============================================
  // FUNCIONES DE CARGA
  // ============================================

  /**
   * Cargar servicios desde la API
   */
  const fetchServicios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Si fetchAll es true, traer todos los servicios con un límite alto
      const paginationParams = fetchAll 
        ? { page: 1, limit: 1000, sort: initialPagination.sort } // Traer todos
        : { page: pagination.page, limit: pagination.limit, sort: initialPagination.sort };

      const response = await serviciosApi.getAll(filters, paginationParams);

      setServicios(response.data || []);
      
      // Asegurar que pagination siempre tenga valores válidos
      // El backend puede devolver pagination como objeto anidado o propiedades en el root
      let paginationData;
      if (response.pagination) {
        paginationData = response.pagination;
      } else if (response.page !== undefined) {
        // Si viene en el formato antiguo (page, pages, total en root)
        paginationData = {
          page: response.page || 1,
          pages: response.pages || 1,
          total: response.total || 0,
          limit: pagination.limit
        };
      } else {
        // Si no hay paginación en la respuesta, mantener los valores actuales
        paginationData = {
          ...pagination,
          total: response.data?.length || 0,
          pages: 1
        };
      }

      setPagination(paginationData);

    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar servicios';
      setError(errorMessage);
      console.error('[useServicios] Error fetching:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit, initialPagination.sort, fetchAll]);

  /**
   * Efecto para cargar datos cuando cambien filtros o paginación
   */
  useEffect(() => {
    if (autoFetch) {
      fetchServicios();
    }
  }, [fetchServicios, autoFetch]);

  // ============================================
  // OPERACIONES CRUD
  // ============================================

  /**
   * Crear un nuevo servicio
   */
  const createServicio = async (data: CreateServicioRequest): Promise<OperationResult> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await serviciosApi.create(data);
      
      // Recargar lista después de crear
      await fetchServicios();
      
      return {
        success: true,
        message: response.message || 'Servicio creado exitosamente',
        data: response.data
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear servicio';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar un servicio existente
   */
  const updateServicio = async (
    id: string,
    data: UpdateServicioRequest
  ): Promise<OperationResult> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await serviciosApi.update(id, data);
      
      // Actualizar en la lista local sin recargar todo
      setServicios(prev =>
        prev.map(s => s._id === id ? response.data : s)
      );
      
      return {
        success: true,
        message: response.message || 'Servicio actualizado exitosamente',
        data: response.data
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar servicio';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar un servicio
   */
  const deleteServicio = async (id: string, soft = false): Promise<OperationResult> => {
    try {
      setLoading(true);
      setError(null);
      
      if (soft) {
        await serviciosApi.softDelete(id);
      } else {
        await serviciosApi.delete(id);
      }
      
      // Remover de la lista local
      setServicios(prev => prev.filter(s => s._id !== id));
      
      return {
        success: true,
        message: 'Servicio eliminado exitosamente'
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar servicio';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // OPERACIONES ESPECIALES
  // ============================================

  /**
   * Duplicar un servicio existente
   */
  const duplicateServicio = async (id: string): Promise<OperationResult> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await serviciosApi.duplicate(id);
      
      // Recargar lista para incluir el duplicado
      await fetchServicios();
      
      return {
        success: true,
        message: 'Servicio duplicado exitosamente',
        data: response.data
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al duplicar servicio';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambiar estado de un servicio
   */
  const changeStatus = async (id: string, estado: string): Promise<OperationResult> => {
    try {
      setError(null);
      
      const response = await serviciosApi.changeStatus(id, estado);
      
      // Actualizar en la lista local
      setServicios(prev =>
        prev.map(s => s._id === id ? response.data : s)
      );
      
      return {
        success: true,
        message: 'Estado actualizado exitosamente',
        data: response.data
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cambiar estado';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  /**
   * Cambiar estado de múltiples servicios
   */
  const bulkChangeStatus = async (ids: string[], estado: string): Promise<OperationResult> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await serviciosApi.bulkChangeStatus(ids, estado);
      
      // Recargar lista después del cambio masivo
      await fetchServicios();
      
      return {
        success: true,
        message: `${response.data?.updated || 0} servicios actualizados`,
        data: response.data
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cambiar estados';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // UTILIDADES
  // ============================================

  /**
   * Cambiar página
   */
  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refrescar datos
   */
  const refresh = useCallback(async () => {
    await fetchServicios();
  }, [fetchServicios]);

  // ============================================
  // RETORNO
  // ============================================

  return {
    // Estado
    servicios,
    loading,
    error,
    pagination,
    filters,
    
    // Setters
    setFilters,
    setPage,
    
    // Operaciones CRUD
    createServicio,
    updateServicio,
    deleteServicio,
    
    // Operaciones especiales
    duplicateServicio,
    changeStatus,
    bulkChangeStatus,
    
    // Utilidades
    refresh,
    clearError
  };
};

export default useServicios;
