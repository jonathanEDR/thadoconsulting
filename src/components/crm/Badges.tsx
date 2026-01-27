import React from 'react';

interface StatusBadgeProps {
  estado: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 🏷️ Badge de estado del lead (solicitud)
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ estado, size = 'md' }) => {
  const colorClasses = {
    // Estados nuevos
    nuevo: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    en_revision: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    contactando: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
    cotizacion: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    aprobado: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    en_desarrollo: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    completado: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rechazado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelado: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    // Estados legacy (mantener compatibilidad)
    contactado: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    calificado: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    propuesta: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    negociacion: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    ganado: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    perdido: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    pausado: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  const labels = {
    // Estados nuevos (con emojis)
    nuevo: '📝 Nueva',
    en_revision: '👀 En Revisión',
    contactando: '📞 Contactando',
    cotizacion: '💰 Cotización',
    aprobado: '✅ Aprobado',
    en_desarrollo: '🚀 En Desarrollo',
    completado: '✨ Completado',
    rechazado: '❌ Rechazado',
    cancelado: '🚫 Cancelado',
    // Estados legacy
    contactado: 'Contactado',
    calificado: 'Calificado',
    propuesta: 'Propuesta',
    negociacion: 'Negociación',
    ganado: 'Ganado',
    perdido: 'Perdido',
    pausado: 'Pausado'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${colorClasses[estado as keyof typeof colorClasses] || colorClasses.nuevo} ${sizeClasses[size]}`}>
      {labels[estado as keyof typeof labels] || estado}
    </span>
  );
};

interface PriorityBadgeProps {
  prioridad: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ⚡ Badge de prioridad del lead
 */
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ prioridad, size = 'md' }) => {
  const colorClasses = {
    baja: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    media: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    alta: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    urgente: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  const icons = {
    baja: '⬇️',
    media: '➡️',
    alta: '⬆️',
    urgente: '🔥'
  };

  const labels = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
    urgente: 'Urgente'
  };

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full ${colorClasses[prioridad as keyof typeof colorClasses] || colorClasses.media} ${sizeClasses[size]}`}>
      <span>{icons[prioridad as keyof typeof icons]}</span>
      {labels[prioridad as keyof typeof labels] || prioridad}
    </span>
  );
};

interface OrigenBadgeProps {
  origen: string;
  size?: 'sm' | 'md';
}

/**
 * 🌐 Badge de origen del lead
 */
export const OrigenBadge: React.FC<OrigenBadgeProps> = ({ origen, size = 'sm' }) => {
  const icons = {
    web: '🌐',
    referido: '👥',
    redes_sociales: '📱',
    email: '📧',
    telefono: '📞',
    evento: '🎯',
    chat: '💬',
    otro: '📌'
  };

  const labels = {
    web: 'Web',
    referido: 'Referido',
    redes_sociales: 'Redes',
    email: 'Email',
    telefono: 'Teléfono',
    evento: 'Evento',
    chat: 'Chat',
    otro: 'Otro'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5'
  };

  return (
    <span className={`inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-full ${sizeClasses[size]}`}>
      <span>{icons[origen as keyof typeof icons] || '📌'}</span>
      {labels[origen as keyof typeof labels] || origen}
    </span>
  );
};

export default { StatusBadge, PriorityBadge, OrigenBadge };
