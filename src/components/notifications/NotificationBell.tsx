/**
 * 🔔 NotificationBell
 * Componente de campana de notificaciones con dropdown compacto y responsivo
 * - Admins: Ver todas → página de historial
 * - Clientes: Solo modal con máx 10 notificaciones, sin link a historial
 * - Usa los colores del tema del sidebar para consistencia visual
 */

import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useServerNotifications } from '../../contexts/ServerNotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';
import type { Notification } from '../../services/notificationService';

interface NotificationBellProps {
  className?: string;
  iconClassName?: string;
  isCollapsed?: boolean; // Para el sidebar colapsado
}

// Constantes
const MAX_NOTIFICATIONS_IN_DROPDOWN = 10;

export default function NotificationBell({ 
  className: _className = '', 
  iconClassName = 'w-5 h-5',
  isCollapsed = false 
}: NotificationBellProps) {
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  
  // Auth para verificar si es admin
  const { canAccessAdmin } = useAuth();
  
  // 🎨 Hook para obtener colores del tema del dashboard
  const { headerGradient, isDarkMode } = useDashboardHeaderGradient();

  const {
    notifications,
    unreadCount,
    urgentCount,
    isLoading,
    isDropdownOpen,
    setIsDropdownOpen,
    soundEnabled,
    toggleSound,
    markAsRead,
    markAllAsRead,
    getNotificationIcon,
    getPriorityBgColor: _getPriorityBgColor,
    formatRelativeTime
  } = useServerNotifications();

  // Calcular posición del dropdown
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 320; // Ancho fijo del dropdown
      const windowWidth = window.innerWidth;
      
      // Calcular posición horizontal
      let left = rect.left;
      // Si se sale por la derecha, ajustar
      if (left + dropdownWidth > windowWidth - 16) {
        left = windowWidth - dropdownWidth - 16;
      }
      // Si se sale por la izquierda, ajustar
      if (left < 16) {
        left = 16;
      }
      
      setDropdownPosition({
        top: rect.bottom + 8,
        left: left
      });
    }
  }, [isDropdownOpen]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, setIsDropdownOpen]);

  // Cerrar con Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen, setIsDropdownOpen]);

  // Manejar click en notificación
  const handleNotificationClick = async (notification: Notification) => {
    // Marcar como leída si no lo está
    if (!notification.leido) {
      await markAsRead(notification._id);
    }

    // Cerrar el dropdown
    setIsDropdownOpen(false);

    // Determinar la URL de navegación según el rol del usuario
    let targetUrl = notification.accion?.url;
    
    // 🔒 Para usuarios sin acceso admin (USER/CLIENT), redirigir a sus páginas
    if (!canAccessAdmin) {
      const metadata = notification.metadata as Record<string, any> || {};
      
      switch (notification.tipo) {
        case 'mensaje_cliente':
        case 'respuesta_cliente':
        case 'mensaje_interno':
        case 'respuesta_equipo':
          // Clientes van a su página de mensajes
          targetUrl = '/dashboard/client/messages';
          break;
        case 'lead_asignado':
        case 'lead_estado_cambio':
        case 'usuario_vinculado':
          // Clientes van a su página de solicitudes
          targetUrl = '/dashboard/client/solicitudes';
          break;
        case 'comentario_nuevo':
        case 'comentario_aprobado':
        case 'comentario_rechazado':
        case 'comentario_respuesta':
          // Clientes van a su actividad del blog
          if (metadata.postSlug) {
            targetUrl = `/blog/${metadata.postSlug}`;
          } else {
            targetUrl = '/dashboard/mi-blog';
          }
          break;
        default:
          // Por defecto ir a la página principal del dashboard de cliente
          targetUrl = '/dashboard/client';
      }
    } else {
      // 🔓 Para admins, usar la lógica original
      if (!targetUrl) {
        const metadata = notification.metadata as Record<string, any> || {};
        
        switch (notification.tipo) {
          case 'mensaje_cliente':
          case 'respuesta_cliente':
          case 'mensaje_interno':
            // Si es de mensajes, ir a la página de mensajes
            if (metadata.leadId) {
              targetUrl = `/dashboard/crm/messages?leadId=${metadata.leadId}`;
            } else {
              targetUrl = '/dashboard/crm/messages';
            }
            break;
          case 'lead_asignado':
          case 'lead_estado_cambio':
          case 'usuario_vinculado':
            // Si es de leads/solicitudes
            if (metadata.leadId) {
              targetUrl = `/dashboard/crm/leads/${metadata.leadId}`;
            } else {
              targetUrl = '/dashboard/crm/leads';
            }
            break;
          case 'comentario_nuevo':
          case 'comentario_aprobado':
          case 'comentario_rechazado':
          case 'comentario_respuesta':
            // Si es de comentarios del blog
            if (metadata.postId) {
              targetUrl = `/dashboard/admin/blog/posts/${metadata.postId}`;
            } else {
              targetUrl = '/dashboard/admin/blog';
            }
            break;
          case 'recordatorio':
          case 'tarea':
            // Si es de eventos/recordatorios
            if (metadata.eventoId) {
              targetUrl = `/dashboard/agenda?evento=${metadata.eventoId}`;
            } else {
              targetUrl = '/dashboard/agenda';
            }
            break;
          default:
            // Por defecto ir a la página de mensajes o al historial
            targetUrl = '/dashboard/crm/messages';
        }
      }
    }
    
    // Navegar a la URL determinada
    if (targetUrl) {
      navigate(targetUrl);
    } else {
      // Fallback al historial de notificaciones
      navigate('/dashboard/notifications');
    }
  };

  // Renderizar badge de contador
  const renderBadge = () => {
    if (unreadCount === 0) return null;

    const displayCount = unreadCount > 99 ? '99+' : unreadCount;
    const isUrgent = urgentCount > 0;

    return (
      <span 
        className={`
          absolute -top-1 -right-1 min-w-[16px] h-[16px] 
          flex items-center justify-center 
          text-[9px] font-bold text-white rounded-full
          ${isUrgent ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}
          ${unreadCount > 9 ? 'px-1' : ''}
        `}
      >
        {displayCount}
      </span>
    );
  };

  // Renderizar item de notificación compacto
  const renderNotificationItem = (notification: Notification) => {
    const icon = getNotificationIcon(notification.tipo);
    const timeAgo = formatRelativeTime(notification.createdAt);

    return (
      <div
        key={notification._id}
        onClick={() => handleNotificationClick(notification)}
        className={`
          px-3 py-2.5 cursor-pointer transition-all duration-150
          ${isDarkMode 
            ? `hover:bg-gray-700/50 ${!notification.leido ? 'bg-blue-900/20' : ''}` 
            : `hover:bg-gray-100 ${!notification.leido ? 'bg-blue-50/50' : ''}`
          }
          ${notification.accion?.url ? 'hover:translate-x-0.5' : ''}
        `}
      >
        <div className="flex items-start gap-2.5">
          {/* Indicador de no leído + Icono */}
          <div className="relative flex-shrink-0 mt-0.5">
            <span className="text-base">{icon}</span>
            {!notification.leido && (
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>
          
          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <h4 className={`
                text-xs font-medium truncate leading-tight
                ${!notification.leido 
                  ? (isDarkMode ? 'text-white' : 'text-gray-900') 
                  : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
                }
              `}>
                {notification.titulo}
              </h4>
              <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">
                {timeAgo}
              </span>
            </div>
            <p className={`text-[11px] mt-0.5 line-clamp-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {notification.mensaje}
            </p>
            {/* Link de acción */}
            {notification.accion?.url && (
              <span className="inline-flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-600 mt-1 font-medium">
                {notification.accion.label || 'Ver detalles'}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Dropdown renderizado con portal para posicionamiento correcto
  const renderDropdown = () => {
    if (!isDropdownOpen || isCollapsed) return null;

    const dropdownContent = (
      <div 
        ref={dropdownRef}
        className={`fixed z-[9999] w-80 max-w-[calc(100vw-32px)]
          rounded-lg shadow-xl 
          overflow-hidden
          animate-fadeIn
          ${isDarkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
          }
        `}
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
        }}
      >
        {/* Header compacto - Usa el gradiente del sidebar */}
        <div 
          className="px-3 py-2.5 text-white"
          style={{ background: headerGradient }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">🔔</span>
              <h3 className="text-sm font-semibold">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Toggle de sonido */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSound();
                }}
                className="text-[10px] text-white/80 hover:text-white transition-colors flex items-center gap-1"
                title={soundEnabled ? 'Desactivar sonido' : 'Activar sonido'}
              >
                <span className="text-sm">{soundEnabled ? '🔊' : '🔇'}</span>
              </button>
              {/* Marcar todas como leídas */}
              {unreadCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  className="text-[10px] text-white/80 hover:text-white transition-colors"
                >
                  Marcar leídas
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className={`max-h-[280px] overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center">
              <span className="text-3xl mb-1 block">🔕</span>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No tienes notificaciones
              </p>
            </div>
          ) : (
            <div className={`divide-y ${isDarkMode ? 'divide-gray-700/50' : 'divide-gray-100'}`}>
              {notifications.slice(0, MAX_NOTIFICATIONS_IN_DROPDOWN).map(renderNotificationItem)}
            </div>
          )}
        </div>

        {/* Footer compacto - Solo visible para admins */}
        {notifications.length > 0 && canAccessAdmin && (
          <div className={`px-3 py-2 border-t ${
            isDarkMode 
              ? 'bg-gray-900/50 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                navigate('/dashboard/notifications');
              }}
              className="w-full text-center text-xs text-blue-500 hover:text-blue-600 font-medium"
            >
              Ver todas →
            </button>
          </div>
        )}
      </div>
    );

    // Usar portal para renderizar fuera del sidebar
    return createPortal(dropdownContent, document.body);
  };

  return (
    <>
      {/* Botón de campana */}
      <button
        ref={buttonRef}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`
          relative p-1.5 rounded-lg transition-all duration-200
          text-white/80 hover:text-white hover:bg-white/20
          ${isDropdownOpen ? 'bg-white/20 text-white' : ''}
        `}
        title={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
      >
        <svg 
          className={`${iconClassName} ${unreadCount > 0 ? 'animate-wiggle' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        {renderBadge()}
      </button>

      {/* Dropdown con portal */}
      {renderDropdown()}

      {/* Styles para animaciones */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
      `}</style>
    </>
  );
}
