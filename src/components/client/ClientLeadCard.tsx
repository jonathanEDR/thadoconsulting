/**
 * 🎴 CLIENT LEAD CARD - Tarjeta de Proyecto del Cliente
 * Componente reutilizable para mostrar información de un lead/proyecto
 */

import { useNavigate } from 'react-router-dom';
import type { Lead } from '../../services/crmService';

interface ClientLeadCardProps {
  lead: Lead;
  unreadCount?: number;
  showActions?: boolean;
  compact?: boolean;
}

export default function ClientLeadCard({
  lead,
  unreadCount = 0,
  showActions = true,
  compact = false,
}: ClientLeadCardProps) {
  const navigate = useNavigate();

  // Helper para obtener icono según tipo de servicio
  const getTipoServicioIcon = (tipo: string): string => {
    const iconMap: Record<string, string> = {
      'Desarrollo Web': '💻',
      'Diseño Gráfico': '🎨',
      'Marketing Digital': '📱',
      'Consultoría': '💼',
      'SEO': '🔍',
      'E-commerce': '🛒',
      'App Móvil': '📲',
      'Soporte Técnico': '🔧',
    };
    return iconMap[tipo] || '📋';
  };

  // Helper para obtener color según estado
  const getEstadoColor = (estado: string): string => {
    const colors: Record<string, string> = {
      nuevo: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      contactado: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      calificado: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      propuesta: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      negociacion: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      ganado: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      perdido: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      pausado: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    };
    return colors[estado] || colors.nuevo;
  };

  // Helper para obtener color según prioridad
  const getPrioridadColor = (prioridad: string): string => {
    const colors: Record<string, string> = {
      baja: 'text-green-500',
      media: 'text-yellow-500',
      alta: 'text-orange-500',
      urgente: 'text-red-500',
    };
    return colors[prioridad] || colors.media;
  };

  // Helper para formatear fecha
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleViewDetails = () => {
    navigate('/dashboard/client/solicitudes', { state: { selectedLeadId: lead._id } });
  };

  if (compact) {
    return (
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleViewDetails}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getTipoServicioIcon(lead.tipoServicio)}</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{lead.nombre}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{lead.empresa}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getEstadoColor(lead.estado)}`}>
              {lead.estado}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getTipoServicioIcon(lead.tipoServicio)}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{lead.nombre}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{lead.tipoServicio}</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center space-x-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            <span>💬</span>
            <span>{unreadCount}</span>
          </div>
        )}
      </div>

      {/* Estado y Prioridad */}
      <div className="flex items-center space-x-2 mb-3">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getEstadoColor(lead.estado)}`}>
          {lead.estado}
        </span>
        <span className={`text-xs font-medium ${getPrioridadColor(lead.prioridad)}`}>
          ⭐ {lead.prioridad}
        </span>
      </div>

      {/* Descripción */}
      {lead.descripcionProyecto && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {lead.descripcionProyecto}
        </p>
      )}

      {/* Información de Contacto */}
      <div className="space-y-2 mb-4 text-sm">
        {lead.empresa && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <span className="mr-2">🏢</span>
            <span>{lead.empresa}</span>
          </div>
        )}
        {lead.correo && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <span className="mr-2">📧</span>
            <span className="truncate">{lead.correo}</span>
          </div>
        )}
        {lead.celular && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <span className="mr-2">📱</span>
            <span>{lead.celular}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          📅 {formatDate(lead.createdAt)}
        </span>
        {showActions && (
          <button
            onClick={handleViewDetails}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Ver Detalles →
          </button>
        )}
      </div>
    </div>
  );
}
