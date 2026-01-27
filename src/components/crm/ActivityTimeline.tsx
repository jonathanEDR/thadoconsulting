import React from 'react';
import type { LeadActivity } from '../../services/crmService';
import { getActividadIcon, formatearFechaRelativa } from '../../services/crmService';

interface ActivityTimelineProps {
  actividades: LeadActivity[];
  maxItems?: number;
}

/**
 * 📜 Timeline de actividades del lead
 */
export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ 
  actividades, 
  maxItems 
}) => {
  const actividadesAMostrar = maxItems 
    ? actividades.slice(-maxItems).reverse() 
    : [...actividades].reverse();

  if (actividadesAMostrar.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No hay actividades registradas</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {actividadesAMostrar.map((actividad, idx) => (
          <li key={actividad._id}>
            <div className="relative pb-8">
              {idx !== actividadesAMostrar.length - 1 && (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                    {getActividadIcon(actividad.tipo)}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {actividad.usuarioNombre}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                      {formatearFechaRelativa(actividad.fecha)}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="inline-flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800">
                        {getTipoLabel(actividad.tipo)}
                      </span>
                    </div>
                    <p className="mt-2">{actividad.descripcion}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Helper para obtener label del tipo de actividad
 */
const getTipoLabel = (tipo: string): string => {
  const labels: Record<string, string> = {
    nota: 'Nota',
    llamada: 'Llamada',
    email: 'Email',
    reunion: 'Reunión',
    propuesta: 'Propuesta',
    cambio_estado: 'Cambio de Estado'
  };
  return labels[tipo] || tipo;
};

export default ActivityTimeline;
