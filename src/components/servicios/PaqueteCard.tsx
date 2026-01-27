/**
 * 📦 TARJETA DE PAQUETE DE SERVICIO
 * Componente para mostrar un paquete de servicio
 */

import React from 'react';
import type { PaqueteServicio } from '../../types/servicios';

// ============================================
// TYPES & INTERFACES
// ============================================

interface PaqueteCardProps {
  paquete: PaqueteServicio;
  onEdit?: (paquete: PaqueteServicio) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  showActions?: boolean;
  viewMode?: 'admin' | 'public';
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatPrice = (precio: number, moneda: string = 'USD') => {
  const simbolos: Record<string, string> = {
    USD: '$',
    MXN: '$',
    EUR: '€',
  };
  
  return `${simbolos[moneda] || '$'}${precio.toLocaleString()}`;
};

const calculateDiscount = (precio: number, precioOriginal?: number) => {
  if (!precioOriginal || precioOriginal <= precio) return null;
  return Math.round(((precioOriginal - precio) / precioOriginal) * 100);
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const PaqueteCard: React.FC<PaqueteCardProps> = ({
  paquete,
  onEdit,
  onDelete,
  onDuplicate,
  showActions = false,
  viewMode = 'public',
}) => {
  const discount = calculateDiscount(paquete.precio, paquete.precioOriginal);

  return (
    <div
      className={`
        relative rounded-xl overflow-hidden transition-all duration-300
        ${paquete.destacado
          ? 'ring-2 ring-purple-500 shadow-2xl shadow-purple-500/20 scale-105'
          : 'border border-gray-700 hover:border-purple-500/50'
        }
        ${!paquete.disponible && viewMode === 'admin' ? 'opacity-60' : ''}
      `}
    >
      {/* Badge de Destacado */}
      {paquete.destacado && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
          ✨ DESTACADO
        </div>
      )}

      {/* Badge de Inactivo (solo en admin) */}
      {!paquete.disponible && viewMode === 'admin' && (
        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
          INACTIVO
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-6 border-b border-gray-700/50">
        {/* Nombre del paquete */}
        <h3 className="text-2xl font-bold text-white mb-2">
          {paquete.nombre}
        </h3>

        {/* Precio */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold text-purple-400">
            {formatPrice(paquete.precio, paquete.moneda)}
          </span>
          {paquete.precioOriginal && paquete.precioOriginal > paquete.precio && (
            <>
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(paquete.precioOriginal, paquete.moneda)}
              </span>
              {discount && (
                <span className="text-sm bg-green-500 text-white px-2 py-1 rounded-full font-bold">
                  -{discount}%
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Descripción */}
        <p className="text-gray-300 mb-6 text-sm leading-relaxed">
          {paquete.descripcion}
        </p>

        {/* Características */}
        {paquete.caracteristicas && paquete.caracteristicas.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Incluye:
            </h4>
            <ul className="space-y-2">
              {paquete.caracteristicas.map((caracteristica, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-300"
                >
                  <span className={`text-lg leading-none ${caracteristica.incluido ? 'text-green-400' : 'text-gray-500'}`}>
                    {caracteristica.incluido ? '✓' : '✕'}
                  </span>
                  <div className="flex-1">
                    <span className={caracteristica.incluido ? '' : 'line-through opacity-60'}>
                      {caracteristica.icono && `${caracteristica.icono} `}
                      {caracteristica.texto}
                    </span>
                    {caracteristica.descripcion && (
                      <p className="text-xs text-gray-400 mt-1">{caracteristica.descripcion}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Acciones */}
        {showActions && viewMode === 'admin' ? (
          <div className="flex gap-2 pt-4 border-t border-gray-700">
            <button
              onClick={() => onEdit?.(paquete)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => onDuplicate?.(paquete._id)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              title="Duplicar"
            >
              📋
            </button>
            <button
              onClick={() => onDelete?.(paquete._id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        ) : (
          <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-purple-500/50">
            Seleccionar Plan
          </button>
        )}
      </div>
    </div>
  );
};

export default PaqueteCard;
