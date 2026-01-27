/**
 * 📋 LISTA DE SERVICIOS - ServicioList
 * Componente para mostrar servicios en grid o tabla
 */

import React from 'react';
import type { Servicio } from '../../types/servicios';
import { ServicioCard } from './ServicioCard';

// ============================================
// TIPOS
// ============================================

interface ServicioListProps {
  servicios: Servicio[];
  loading?: boolean;
  error?: string | null;
  viewMode?: 'grid' | 'table';
  cardMode?: 'admin' | 'public';
  showActions?: boolean;
  emptyMessage?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onChangeStatus?: (id: string, estado: string) => void;
  className?: string;
}

// ============================================
// COMPONENTE
// ============================================

/**
 * Lista de servicios con soporte para grid y tabla
 * 
 * @example
 * ```tsx
 * <ServicioList
 *   servicios={servicios}
 *   loading={loading}
 *   viewMode="grid"
 *   cardMode="admin"
 *   showActions
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const ServicioList: React.FC<ServicioListProps> = ({
  servicios,
  loading = false,
  error = null,
  viewMode = 'grid',
  cardMode = 'public',
  showActions = false,
  emptyMessage = 'No se encontraron servicios',
  onEdit,
  onDelete,
  onDuplicate,
  onChangeStatus,
  className = ''
}) => {
  // ============================================
  // ESTADOS DE CARGA Y ERROR
  // ============================================

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-20 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">❌</div>
          <h3 className="text-xl font-semibold text-red-300 mb-2">Error al cargar servicios</h3>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (servicios.length === 0) {
    return (
      <div className={`py-20 ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Sin resultados</h3>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER GRID VIEW
  // ============================================

  if (viewMode === 'grid') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {servicios.map((servicio) => (
          <ServicioCard
            key={servicio._id}
            servicio={servicio}
            viewMode={cardMode}
            showActions={showActions}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onChangeStatus={onChangeStatus}
          />
        ))}
      </div>
    );
  }

  // ============================================
  // RENDER TABLE VIEW
  // ============================================

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Servicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Precio
              </th>
              {cardMode === 'admin' && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ventas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ingresos
                  </th>
                </>
              )}
              {showActions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {servicios.map((servicio) => (
              <tr
                key={servicio._id}
                className="hover:bg-gray-700/30 transition-colors"
              >
                {/* Servicio */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{servicio.icono}</span>
                    <div>
                      <div className="text-white font-medium">{servicio.titulo}</div>
                      {servicio.destacado && (
                        <span className="text-xs text-yellow-400">★ Destacado</span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Categoría */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-300 capitalize">
                    {typeof servicio.categoria === 'string' ? servicio.categoria : servicio.categoria?.nombre || 'Sin categoría'}
                  </span>
                </td>

                {/* Estado */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-300 capitalize">{servicio.estado}</span>
                </td>

                {/* Precio */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-purple-400 font-semibold">
                    {servicio.precio
                      ? `$${servicio.precio.toLocaleString()}`
                      : servicio.precioMin
                      ? `$${servicio.precioMin.toLocaleString()}`
                      : 'Consultar'}
                  </span>
                </td>

                {/* Ventas (admin) */}
                {cardMode === 'admin' && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-300">{servicio.vecesVendido}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-400 font-semibold">
                        ${servicio.ingresoTotal.toLocaleString()}
                      </span>
                    </td>
                  </>
                )}

                {/* Acciones */}
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit?.(servicio._id)}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-2"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDuplicate?.(servicio._id)}
                        className="text-green-400 hover:text-green-300 transition-colors p-2"
                        title="Duplicar"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => onDelete?.(servicio._id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicioList;
