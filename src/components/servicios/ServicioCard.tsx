/**
 * 🎴 CARD DE SERVICIO - ServicioCard
 * Componente para mostrar un servicio en formato tarjeta
 * 
 * 🎯 Simplicidad:
 * - Enfoque en visualización y acciones básicas
 * - Services Canvas manejado a nivel global desde toolbar
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { Servicio } from '../../types/servicios';
import { EstadoBadge } from './EstadoBadge';
import { CategoriaBadge } from './CategoriaBadge';

// ============================================
// TIPOS
// ============================================

interface ServicioCardProps {
  servicio: Servicio;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onChangeStatus?: (id: string, estado: string) => void;
  showActions?: boolean;
  viewMode?: 'admin' | 'public' | 'grid' | 'list';
  className?: string;
}

// ============================================
// COMPONENTE
// ============================================

/**
 * Tarjeta de servicio con toda la información relevante
 * 
 * @example
 * ```tsx
 * // Modo público
 * <ServicioCard servicio={servicio} viewMode="public" />
 * 
 * // Modo admin con acciones
 * <ServicioCard 
 *   servicio={servicio}
 *   viewMode="admin"
 *   showActions
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const ServicioCard: React.FC<ServicioCardProps> = ({
  servicio,
  onEdit,
  onDelete,
  onDuplicate,
  showActions = false,
  viewMode = 'public',
  className = ''
}) => {
  // ============================================
  // DEBUG LOGS PARA IMÁGENES
  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  /**
   * Formatear precio según el tipo
   */
  const formatPrice = (): string => {
    // Determinar el símbolo de moneda correcto
    const getCurrencySymbol = (moneda: string): string => {
      switch (moneda?.toUpperCase()) {
        case 'PEN': return 'S/.';
        case 'USD': return '$';
        case 'EUR': return '€';
        default: return moneda || 'S/.';
      }
    };
    
    const symbol = getCurrencySymbol(servicio.moneda);
    
    if (servicio.tipoPrecio === 'paquetes' && servicio.precioMin && servicio.precioMax) {
      return `${symbol} ${servicio.precioMin.toLocaleString()} - ${symbol} ${servicio.precioMax.toLocaleString()}`;
    }
    if (servicio.tipoPrecio === 'fijo' && servicio.precio) {
      return `${symbol} ${servicio.precio.toLocaleString()}`;
    }
    if (servicio.tipoPrecio === 'rango' && servicio.precioMin && servicio.precioMax) {
      return `${symbol} ${servicio.precioMin.toLocaleString()} - ${symbol} ${servicio.precioMax.toLocaleString()}`;
    }
    if (servicio.tipoPrecio === 'personalizado') {
      return 'Precio personalizado';
    }
    if (servicio.tipoPrecio === 'suscripcion') {
      return `Desde ${symbol} ${servicio.precioMin?.toLocaleString() || 0}/mes`;
    }
    return 'Consultar precio';
  };

  /**
   * Formatear duración
   */
  const formatDuration = (): string | null => {
    if (!servicio.duracion) return null;
    const { valor, unidad } = servicio.duracion;
    return `${valor} ${unidad}`;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div
      className={`
        relative rounded-xl border overflow-hidden 
        transition-all duration-300 flex flex-col h-full
        ${viewMode === 'admin' 
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10' 
          : 'bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm'
        }
        ${className}
      `}
    >
      {/* Header con imagen de fondo y overlay con título/badges */}
      <div className="relative h-44 overflow-hidden">
        {/* Imagen de fondo o gradiente con icono */}
        {servicio.imagen ? (
          <img
            src={servicio.imagen}
            alt={servicio.titulo}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${servicio.colorFondo || '#6366f1'}40 0%, ${servicio.colorIcono || '#8b5cf6'}60 100%)`
            }}
          >
            <span className="text-7xl opacity-50">{servicio.icono}</span>
          </div>
        )}
        
        {/* Overlay oscuro para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Contenido superpuesto */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {/* Top: Badges */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <CategoriaBadge categoria={servicio.categoria} size="sm" />
              {viewMode === 'admin' && (
                <EstadoBadge estado={servicio.estado} size="sm" />
              )}
            </div>
            
            {/* Badge destacado */}
            {servicio.destacado && (
              <span className="text-xs bg-yellow-500/90 text-white px-2.5 py-1 rounded-full font-semibold shadow-lg whitespace-nowrap backdrop-blur-sm">
                ★ Destacado
              </span>
            )}
          </div>
          
          {/* Bottom: Título */}
          <div>
            <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug drop-shadow-lg">
              {servicio.titulo}
            </h3>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Descripción - Truncada correctamente */}
        <p className={`line-clamp-2 text-sm leading-snug ${viewMode === 'admin' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300'}`}>
          {servicio.descripcionCorta || servicio.descripcion}
        </p>

        {/* Precio - Más compacto */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-500/30">
          <div className={`text-2xl font-bold ${viewMode === 'admin' ? 'text-purple-600 dark:text-purple-400' : 'text-purple-400'}`}>
            {formatPrice()}
          </div>
          {formatDuration() && (
            <div className={`text-xs mt-1 ${viewMode === 'admin' ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'}`}>
              ⏱️ {formatDuration()}
            </div>
          )}
        </div>

        {/* Características - Compactas */}
        {servicio.caracteristicas && servicio.caracteristicas.length > 0 && (
          <ul className="space-y-1">
            {servicio.caracteristicas.slice(0, 2).map((car, idx) => (
              <li key={idx} className={`flex items-start gap-2 text-xs ${viewMode === 'admin' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300'}`}>
                <span className="text-green-500 dark:text-green-400 flex-shrink-0">✓</span>
                <span className="line-clamp-1">{car}</span>
              </li>
            ))}
            {servicio.caracteristicas.length > 2 && (
              <li className={`text-xs ${viewMode === 'admin' ? 'text-gray-500 dark:text-gray-500' : 'text-gray-500'}`}>
                <span>...</span>
              </li>
            )}
          </ul>
        )}

        {/* Tecnologías/Etiquetas - Compactas */}
        {servicio.etiquetas && servicio.etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {servicio.etiquetas.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                  viewMode === 'admin' 
                    ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600' 
                    : 'bg-gray-700/50 text-gray-400'
                }`}
              >
                #{tag}
              </span>
            ))}
            {servicio.etiquetas.length > 2 && (
              <span className={`text-xs px-2 py-0.5 ${viewMode === 'admin' ? 'text-gray-500 dark:text-gray-500' : 'text-gray-500'}`}>
                ...
              </span>
            )}
          </div>
        )}

        {/* Espaciador flexible - empuja los botones al final */}
        <div className="flex-1" />

        {/* Métricas (solo en admin) - Compactas */}
        {viewMode === 'admin' && (
          <div className="flex items-center gap-2 text-xs pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded border border-blue-200 dark:border-blue-500/30">
              <span className="text-blue-600 dark:text-blue-400">💰</span>
              <span className="font-bold text-blue-700 dark:text-blue-300">{servicio.vecesVendido}</span>
            </div>
            {servicio.rating && (
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded border border-yellow-200 dark:border-yellow-500/30">
                <span className="text-yellow-500">⭐</span>
                <span className="font-bold text-yellow-700 dark:text-yellow-300">{servicio.rating.toFixed(1)}</span>
              </div>
            )}
            {servicio.ingresoTotal > 0 && (
              <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-300">
                <span>💵</span>
                <span className="font-bold">${(servicio.ingresoTotal / 1000).toFixed(1)}k</span>
              </div>
            )}
          </div>
        )}

      {/* Footer - Acciones */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        {/* Acciones */}
        {showActions && viewMode === 'admin' ? (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(servicio._id)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-3 py-2 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
              title="Editar servicio"
            >
              <span>✏️</span>
              <span>Editar</span>
            </button>
            <button
              onClick={() => onDuplicate?.(servicio._id)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md text-sm"
              title="Duplicar servicio"
            >
              📋
            </button>
            <button
              onClick={() => onDelete?.(servicio._id)}
              className="px-3 py-2 bg-red-50 dark:bg-red-600/20 hover:bg-red-100 dark:hover:bg-red-600/30 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/50 rounded-lg transition-colors shadow-sm hover:shadow-md text-sm"
              title="Eliminar servicio"
            >
              🗑️
            </button>
          </div>
        ) : (
          <Link
            to={`/servicios/${servicio.slug || servicio._id}`}
            onClick={() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg transition-all font-semibold shadow-lg hover:shadow-purple-500/50 text-sm"
          >
            Ver detalles →
          </Link>
        )}
      </div>
      </div>

      {/* Overlay de estado no disponible */}
      {!servicio.activo && (
        <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="text-center bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="text-5xl mb-2">🚫</div>
            <div className="text-gray-900 dark:text-white font-bold text-lg">No disponible</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">Servicio desactivado</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicioCard;
