import React from 'react';

interface TimelineStep {
  estado: string;
  label: string;
  icon: string;
  color: string;
  completado: boolean;
  actual: boolean;
}

interface SolicitudTimelineProps {
  estadoActual: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 📊 Componente Timeline Visual para Solicitudes
 * Muestra el progreso de una solicitud a través de sus estados
 */
export const SolicitudTimeline: React.FC<SolicitudTimelineProps> = ({ estadoActual, size = 'md' }) => {
  
  // Definir el flujo principal de estados
  const flujoPrincipal: TimelineStep[] = [
    { estado: 'nuevo', label: 'Recibida', icon: '📝', color: 'blue', completado: false, actual: false },
    { estado: 'en_revision', label: 'En Revisión', icon: '👀', color: 'yellow', completado: false, actual: false },
    { estado: 'contactando', label: 'Contactando', icon: '📞', color: 'sky', completado: false, actual: false },
    { estado: 'cotizacion', label: 'Cotización', icon: '💰', color: 'purple', completado: false, actual: false },
    { estado: 'aprobado', label: 'Aprobado', icon: '✅', color: 'emerald', completado: false, actual: false },
    { estado: 'en_desarrollo', label: 'En Desarrollo', icon: '🚀', color: 'orange', completado: false, actual: false },
    { estado: 'completado', label: 'Completado', icon: '✨', color: 'green', completado: false, actual: false }
  ];

  // Estados especiales (rechazado, cancelado)
  const estadosEspeciales = ['rechazado', 'cancelado'];
  const esEstadoEspecial = estadosEspeciales.includes(estadoActual);

  // Mapeo de estados legacy a nuevos
  const estadoMapping: Record<string, string> = {
    'contactado': 'contactando',
    'calificado': 'en_revision',
    'propuesta': 'cotizacion',
    'negociacion': 'cotizacion',
    'ganado': 'aprobado',
    'perdido': 'rechazado',
    'pausado': 'en_revision'
  };

  // Convertir estado legacy si es necesario
  const estadoNormalizado = estadoMapping[estadoActual] || estadoActual;

  // Calcular progreso
  const estadoActualIndex = flujoPrincipal.findIndex(step => step.estado === estadoNormalizado);
  
  const steps = flujoPrincipal.map((step, index) => ({
    ...step,
    completado: index < estadoActualIndex,
    actual: step.estado === estadoNormalizado
  }));

  // Configuración de tamaños
  const sizeConfig = {
    sm: {
      iconSize: 'w-8 h-8 text-sm',
      labelSize: 'text-xs',
      lineHeight: 'h-0.5',
      containerPadding: 'p-2'
    },
    md: {
      iconSize: 'w-10 h-10 text-base',
      labelSize: 'text-sm',
      lineHeight: 'h-1',
      containerPadding: 'p-4'
    },
    lg: {
      iconSize: 'w-12 h-12 text-lg',
      labelSize: 'text-base',
      lineHeight: 'h-1',
      containerPadding: 'p-6'
    }
  };

  const config = sizeConfig[size];

  // Si es estado especial, mostrar mensaje específico
  if (esEstadoEspecial) {
    return (
      <div className={`${config.containerPadding} bg-gradient-to-r ${
        estadoActual === 'rechazado' 
          ? 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20' 
          : 'from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20'
      } rounded-lg border ${
        estadoActual === 'rechazado'
          ? 'border-red-200 dark:border-red-700'
          : 'border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl">{estadoActual === 'rechazado' ? '❌' : '🚫'}</span>
          <div>
            <p className={`font-semibold ${
              estadoActual === 'rechazado' 
                ? 'text-red-800 dark:text-red-300' 
                : 'text-gray-800 dark:text-gray-300'
            }`}>
              Solicitud {estadoActual === 'rechazado' ? 'Rechazada' : 'Cancelada'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {estadoActual === 'rechazado' 
                ? 'No fue posible proceder con esta solicitud'
                : 'Esta solicitud ha sido cancelada'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${config.containerPadding} bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700`}>
      {/* Timeline Horizontal */}
      <div className="relative">
        {/* Línea de progreso de fondo */}
        <div className={`absolute top-5 left-0 right-0 ${config.lineHeight} bg-gray-200 dark:bg-gray-700`}></div>
        
        {/* Línea de progreso completada */}
        <div 
          className={`absolute top-5 left-0 ${config.lineHeight} bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500`}
          style={{ 
            width: estadoActualIndex >= 0 
              ? `${(estadoActualIndex / (steps.length - 1)) * 100}%` 
              : '0%' 
          }}
        ></div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = step.completado;
            const isCurrent = step.actual;

            return (
              <div key={step.estado} className="flex flex-col items-center" style={{ flex: 1 }}>
                {/* Icono del paso */}
                <div className={`
                  ${config.iconSize}
                  rounded-full 
                  flex items-center justify-center 
                  font-bold
                  transition-all duration-300
                  ${isCompleted 
                    ? 'bg-green-500 text-white shadow-lg scale-100' 
                    : isCurrent
                    ? `bg-${step.color}-500 text-white shadow-xl scale-110 ring-4 ring-${step.color}-200 dark:ring-${step.color}-800 animate-pulse`
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 scale-90'
                  }
                `}>
                  {isCompleted ? '✓' : step.icon}
                </div>

                {/* Label del paso */}
                <div className={`
                  mt-2 text-center ${config.labelSize}
                  transition-all duration-300
                  ${isCompleted 
                    ? 'text-green-600 dark:text-green-400 font-semibold' 
                    : isCurrent
                    ? `text-${step.color}-600 dark:text-${step.color}-400 font-bold`
                    : 'text-gray-400 dark:text-gray-600 font-normal'
                  }
                `}>
                  {step.label}
                </div>

                {/* Indicador de estado actual */}
                {isCurrent && (
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full bg-${step.color}-500 animate-ping`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mensaje de progreso */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {steps.find(s => s.actual)?.icon}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Estado actual: <span className="text-blue-600 dark:text-blue-400">
                  {steps.find(s => s.actual)?.label}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Paso {estadoActualIndex + 1} de {steps.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round((estadoActualIndex / (steps.length - 1)) * 100)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Completado</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 📜 Componente Timeline Vertical para Actividades
 * Muestra el historial de actividades de una solicitud
 */
interface Activity {
  _id: string;
  fecha: string;
  tipo: string;
  descripcion: string;
  usuarioNombre: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const activityIcons: Record<string, string> = {
    'nota': '📝',
    'llamada': '📞',
    'email': '📧',
    'reunion': '👥',
    'propuesta': '📋',
    'cambio_estado': '🔄',
    'mensaje_cliente': '💬',
    'mensaje_admin': '💼'
  };

  const activityColors: Record<string, string> = {
    'nota': 'blue',
    'llamada': 'green',
    'email': 'purple',
    'reunion': 'orange',
    'propuesta': 'indigo',
    'cambio_estado': 'yellow',
    'mensaje_cliente': 'sky',
    'mensaje_admin': 'gray'
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-4xl mb-2">📭</p>
        <p className="text-sm">No hay actividades registradas aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const icon = activityIcons[activity.tipo] || '📌';
        const color = activityColors[activity.tipo] || 'gray';
        const isLast = index === activities.length - 1;

        return (
          <div key={activity._id} className="relative pl-8">
            {/* Línea vertical */}
            {!isLast && (
              <div className={`absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700`}></div>
            )}

            {/* Icono */}
            <div className={`
              absolute left-0 top-0
              w-8 h-8 rounded-full 
              flex items-center justify-center
              bg-${color}-100 dark:bg-${color}-900/30
              border-2 border-${color}-500
              text-sm
            `}>
              {icon}
            </div>

            {/* Contenido */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.descripcion}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Por {activity.usuarioNombre}
                  </p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(activity.fecha).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
