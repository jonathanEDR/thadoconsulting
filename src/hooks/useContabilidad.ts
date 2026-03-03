import { useState, useEffect, useCallback } from 'react';
import { clientesContablesApi, contabilidadDashboardApi } from '../services/contabilidadService';
import type {
  ClienteContable,
  ClienteFilters,
  CreateClienteData,
  UpdateClienteData,
  SemaforoVencimientos,
  EstadisticasContabilidad,
  PaginationInfo
} from '../types/contabilidad';

/**
 * 🏢 Hook para gestión de clientes contables
 * Maneja estado, filtros, CRUD y carga de datos
 */
export const useContabilidad = () => {
  // Estado
  const [clientes, setClientes] = useState<ClienteContable[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<ClienteContable | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [semaforo, setSemaforo] = useState<SemaforoVencimientos | null>(null);
  const [estadisticas, setEstadisticas] = useState<EstadisticasContabilidad | null>(null);

  // Paginación
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });

  // Filtros
  const [filters, setFilters] = useState<ClienteFilters>({
    search: '',
    page: 1,
    limit: 10
  });

  // Cargar clientes
  const loadClientes = useCallback(async (customFilters?: ClienteFilters) => {
    setLoading(true);
    setError(null);
    try {
      const filtersToUse = customFilters || filters;
      const response = await clientesContablesApi.listar(filtersToUse);
      setClientes(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar clientes';
      setError(message);
      console.error('[useContabilidad] Error cargando clientes:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cargar al montar y cuando cambian filtros
  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: Partial<ClienteFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page || 1 }));
  }, []);

  // Cambiar página
  const changePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // Crear cliente
  const createCliente = useCallback(async (data: CreateClienteData) => {
    try {
      const response = await clientesContablesApi.crear(data);
      if (response.success) {
        await loadClientes();
      }
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear cliente';
      setError(message);
      throw err;
    }
  }, [loadClientes]);

  // Actualizar cliente
  const updateCliente = useCallback(async (id: string, data: UpdateClienteData) => {
    try {
      const response = await clientesContablesApi.actualizar(id, data);
      if (response.success) {
        await loadClientes();
        if (selectedCliente?._id === id) {
          setSelectedCliente(response.data);
        }
      }
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar cliente';
      setError(message);
      throw err;
    }
  }, [loadClientes, selectedCliente]);

  // Dar de baja
  const darDeBaja = useCallback(async (id: string, motivo: string) => {
    try {
      const response = await clientesContablesApi.darDeBaja(id, motivo);
      if (response.success) {
        await loadClientes();
      }
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al dar de baja';
      setError(message);
      throw err;
    }
  }, [loadClientes]);

  // Reactivar
  const reactivar = useCallback(async (id: string) => {
    try {
      const response = await clientesContablesApi.reactivar(id);
      if (response.success) {
        await loadClientes();
      }
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al reactivar';
      setError(message);
      throw err;
    }
  }, [loadClientes]);

  // Cargar semáforo
  const loadSemaforo = useCallback(async () => {
    try {
      const response = await contabilidadDashboardApi.getSemaforo();
      if (response.success) {
        setSemaforo(response.data);
      }
    } catch (err) {
      console.error('[useContabilidad] Error cargando semáforo:', err);
    }
  }, []);

  // Cargar estadísticas
  const loadEstadisticas = useCallback(async () => {
    try {
      const response = await contabilidadDashboardApi.getEstadisticas();
      if (response.success) {
        setEstadisticas(response.data);
      }
    } catch (err) {
      console.error('[useContabilidad] Error cargando estadísticas:', err);
    }
  }, []);

  // Refrescar todo
  const refresh = useCallback(async () => {
    await Promise.all([loadClientes(), loadSemaforo(), loadEstadisticas()]);
  }, [loadClientes, loadSemaforo, loadEstadisticas]);

  return {
    // Data
    clientes,
    selectedCliente,
    setSelectedCliente,
    semaforo,
    estadisticas,
    // Estado
    loading,
    error,
    pagination,
    filters,
    // Acciones
    updateFilters,
    changePage,
    createCliente,
    updateCliente,
    darDeBaja,
    reactivar,
    // Refreshers
    loadClientes,
    loadSemaforo,
    loadEstadisticas,
    refresh
  };
};
