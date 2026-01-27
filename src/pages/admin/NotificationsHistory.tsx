/**
 * 📋 NotificationsHistory
 * Página de historial completo de notificaciones para administradores
 * Permite filtrar, buscar y gestionar todas las notificaciones
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useServerNotifications } from '../../contexts/ServerNotificationContext';
import { notificationService, type Notification } from '../../services/notificationService';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';

// Tipos de filtro
type FilterType = 'all' | 'unread' | 'read';
type SortOrder = 'newest' | 'oldest';

export default function NotificationsHistory() {
  const navigate = useNavigate();
  const { canAccessAdmin } = useAuth();
  const { markAsRead, markAllAsRead, getNotificationIcon, formatRelativeTime } = useServerNotifications();

  // Estado
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const ITEMS_PER_PAGE = 20;

  // Cargar notificaciones
  const loadNotifications = useCallback(async (reset = false) => {
    if (!canAccessAdmin) return;

    try {
      setIsLoading(true);
      setError(null);

      const currentPage = reset ? 1 : page;
      
      // Determinar parámetros de filtro
      const params: any = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sortBy: 'createdAt',
        sortOrder: sortOrder === 'newest' ? 'desc' : 'asc'
      };

      if (filter === 'unread') {
        params.leido = false;
      } else if (filter === 'read') {
        params.leido = true;
      }

      const response = await notificationService.getNotifications(params);
      
      // Acceder a data y pagination de la respuesta
      const notificationsList = response.data || [];
      const total = response.pagination?.total || notificationsList.length;

      if (reset) {
        setNotifications(notificationsList);
        setPage(1);
      } else {
        setNotifications(prev => 
          currentPage === 1 ? notificationsList : [...prev, ...notificationsList]
        );
      }

      setTotalCount(total);
      setHasMore(notificationsList.length === ITEMS_PER_PAGE && 
                 (reset ? notificationsList.length : notifications.length + notificationsList.length) < total);
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
      setError('Error al cargar las notificaciones');
    } finally {
      setIsLoading(false);
    }
  }, [canAccessAdmin, page, filter, sortOrder, notifications.length]);

  // Cargar al montar y cuando cambian filtros
  useEffect(() => {
    loadNotifications(true);
  }, [filter, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtrar por búsqueda (local)
  const filteredNotifications = notifications.filter(n => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      n.titulo.toLowerCase().includes(query) ||
      n.mensaje.toLowerCase().includes(query) ||
      n.tipo.toLowerCase().includes(query)
    );
  });

  // Manejar click en notificación
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.leido) {
      await markAsRead(notification._id);
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(n => n._id === notification._id ? { ...n, leido: true } : n)
      );
    }

    if (notification.accion?.url) {
      navigate(notification.accion.url);
    }
  };

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, leido: true })));
  };

  // Eliminar notificación
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      setTotalCount(prev => prev - 1);
    } catch (err) {
      console.error('Error eliminando notificación:', err);
    }
  };

  // Cargar más
  const loadMore = () => {
    setPage(prev => prev + 1);
    loadNotifications(false);
  };

  // Redireccionar si no es admin
  if (!canAccessAdmin) {
    return (
      <SmartDashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <span className="text-6xl mb-4 block">🔒</span>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Acceso Restringido
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              No tienes permisos para ver esta página
            </p>
          </div>
        </div>
      </SmartDashboardLayout>
    );
  }

  // Estadísticas rápidas
  const unreadCount = notifications.filter(n => !n.leido).length;

  return (
    <SmartDashboardLayout>
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔔</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Historial de Notificaciones
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {totalCount} notificaciones en total • {unreadCount} sin leer
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 
                bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors
                dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
            >
              ✓ Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Búsqueda */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar notificaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 
                  rounded-lg bg-gray-50 dark:bg-gray-700 
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Estado:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                rounded-lg bg-gray-50 dark:bg-gray-700 
                text-gray-900 dark:text-white"
            >
              <option value="all">Todas</option>
              <option value="unread">Sin leer</option>
              <option value="read">Leídas</option>
            </select>
          </div>

          {/* Orden */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Orden:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                rounded-lg bg-gray-50 dark:bg-gray-700 
                text-gray-900 dark:text-white"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguas</option>
            </select>
          </div>

          {/* Refrescar */}
          <button
            onClick={() => loadNotifications(true)}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refrescar"
          >
            <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <span className="text-4xl mb-3 block">⚠️</span>
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => loadNotifications(true)}
              className="mt-3 text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              Reintentar
            </button>
          </div>
        ) : isLoading && notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Cargando notificaciones...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-5xl mb-4 block">🔕</span>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {searchQuery ? 'Sin resultados' : 'No hay notificaciones'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {searchQuery 
                ? 'Intenta con otros términos de búsqueda'
                : filter === 'unread' 
                  ? '¡Excelente! No tienes notificaciones pendientes'
                  : 'Las notificaciones aparecerán aquí'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    px-5 py-4 cursor-pointer transition-all duration-150 group
                    hover:bg-gray-50 dark:hover:bg-gray-700/50
                    ${!notification.leido ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}
                  `}
                >
                  <div className="flex items-start gap-4">
                    {/* Icono con indicador */}
                    <div className="relative flex-shrink-0">
                      <span className="text-2xl">{getNotificationIcon(notification.tipo)}</span>
                      {!notification.leido && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800" />
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className={`
                            text-sm font-semibold leading-tight mb-1
                            ${!notification.leido 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-600 dark:text-gray-400'
                            }
                          `}>
                            {notification.titulo}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {notification.mensaje}
                          </p>
                          
                          {/* Metadata */}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span>{formatRelativeTime(notification.createdAt)}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400">
                              {notification.tipo.replace(/_/g, ' ')}
                            </span>
                            {notification.prioridad === 'alta' && (
                              <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span className="text-red-500 font-medium">⚡ Urgente</span>
                              </>
                            )}
                          </div>

                          {/* Acción */}
                          {notification.accion?.url && (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 mt-2 font-medium">
                              {notification.accion.label || 'Ver detalles'}
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          )}
                        </div>

                        {/* Acciones */}
                        <button
                          onClick={(e) => handleDelete(e, notification._id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 
                            hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-all"
                          title="Eliminar notificación"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cargar más */}
            {hasMore && !searchQuery && (
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-center">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-6 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 
                    bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors
                    dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                      Cargando...
                    </span>
                  ) : (
                    'Cargar más notificaciones'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info de paginación */}
      {filteredNotifications.length > 0 && (
        <p className="text-center text-xs text-gray-400 mt-4">
          Mostrando {filteredNotifications.length} de {totalCount} notificaciones
        </p>
      )}
    </div>
    </SmartDashboardLayout>
  );
}
