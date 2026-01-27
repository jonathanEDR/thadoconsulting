/**
 * 🏠 PORTAL CLIENTE - Dashboard Principal
 * Vista simplificada para clientes registrados
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { Lead } from '../../services/crmService';
import type { LeadMessage } from '../../types/message.types';
import { crmService } from '../../services/crmService';
import { messageService } from '../../services/messageService';
import { useFilterPrivateMessages } from '../../components/guards/PrivateMessageGuard';

interface ClientStats {
  totalLeads: number;
  activeLeads: number;
  unreadMessages: number;
  lastUpdate?: string;
}

export default function ClientPortal() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ========================================
  // 📊 STATE
  // ========================================
  const [leads, setLeads] = useState<Lead[]>([]);
  const [recentMessages, setRecentMessages] = useState<LeadMessage[]>([]);
  const [stats, setStats] = useState<ClientStats>({
    totalLeads: 0,
    activeLeads: 0,
    unreadMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // 🔄 EFFECTS
  // ========================================
  useEffect(() => {
    loadClientData();
  }, []);

  // ========================================
  // 📊 FUNCIONES DE CARGA
  // ========================================

  const loadClientData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Cargar leads del cliente
      const leadsResponse = await crmService.getClientLeads();
      const clientLeads = leadsResponse.data?.leads || [];
      setLeads(clientLeads);

      // Cargar mensajes no leídos
      const unreadResponse = await messageService.getUnreadMessages();
      const unreadTotal = unreadResponse.data?.total || 0;

      // Calcular estadísticas
      const activeCount = clientLeads.filter(
        (lead: Lead) => 
          lead.estado === 'nuevo' || 
          lead.estado === 'contactado' || 
          lead.estado === 'calificado' ||
          lead.estado === 'propuesta' ||
          lead.estado === 'negociacion'
      ).length;

      setStats({
        totalLeads: clientLeads.length,
        activeLeads: activeCount,
        unreadMessages: unreadTotal,
        lastUpdate: new Date().toISOString(),
      });

      // Cargar mensajes recientes (últimos 5)
      if (clientLeads.length > 0) {
        const firstLeadId = clientLeads[0]._id;
        const messagesResponse = await messageService.getLeadMessages(firstLeadId, {
          limit: 5,
          incluirPrivados: false, // Solo mensajes públicos
        });
        setRecentMessages(messagesResponse.data?.mensajes || []);
      }
    } catch (err: any) {
      console.error('Error cargando datos del cliente:', err);
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // 🎨 RENDER
  // ========================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando tu portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error al Cargar
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadClientData}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  // 🔒 Filtrar mensajes privados para clientes (capa de seguridad adicional)
  const secureMessages = useFilterPrivateMessages(recentMessages);

  return (
    <div className="w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 dark:from-green-700 dark:via-blue-700 dark:to-purple-700 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">👋</span>
                ¡Bienvenido de vuelta, {user?.firstName || 'Cliente'}!
              </h1>
              <p className="text-green-100 dark:text-blue-100 text-lg">
                Aquí está el resumen de tus proyectos y actualizaciones
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Total Solicitudes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">📋</div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalLeads}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Solicitudes</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/client/solicitudes')}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
            >
              Ver todos →
            </button>
          </div>

          {/* Solicitudes Activas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">⚡</div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.activeLeads}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Solicitudes Activas</div>
              </div>
            </div>
            <div className="text-green-600 dark:text-green-400 text-sm font-medium">
              En progreso
            </div>
          </div>

          {/* Mensajes Sin Leer */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">💬</div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.unreadMessages}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Mensajes Nuevos</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/client/messages')}
              className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline"
            >
              Leer mensajes →
            </button>
          </div>
        </div>

        {/* Grid de Contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mis Solicitudes Recientes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                📋 Mis Solicitudes Recientes
              </h2>
              <button
                onClick={() => navigate('/dashboard/client/solicitudes')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ver todas
              </button>
            </div>

            {leads.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💭</div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No tienes solicitudes activas
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Las solicitudes aparecerán aquí cuando el equipo las cree
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.slice(0, 4).map((lead) => {
                  const estadoColor: Record<string, string> = {
                    nuevo: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                    contactado: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                    calificado: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
                    propuesta: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
                    negociacion: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
                    ganado: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                    perdido: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                    pausado: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
                  };

                  return (
                    <div
                      key={lead._id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/dashboard/client/lead/${lead._id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {lead.nombre}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {lead.tipoServicio || 'Sin servicio especificado'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoColor[lead.estado] || estadoColor.nuevo}`}>
                          {lead.estado.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>📧 {lead.correo}</span>
                        <span>📞 {lead.celular}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mensajes Recientes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                💬 Mensajes Recientes
              </h2>
              <button
                onClick={() => navigate('/dashboard/client/messages')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ver todos
              </button>
            </div>

            {secureMessages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💌</div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  No hay mensajes recientes
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Los mensajes del equipo aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {secureMessages.slice(0, 5).map((message) => (
                  <div
                    key={message._id}
                    className={`border-l-4 ${
                      message.leido
                        ? 'border-gray-300 dark:border-gray-600'
                        : 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    } rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer`}
                    onClick={() => navigate('/dashboard/client/messages')}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                          {message.autor.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900 dark:text-white">
                            {message.autor.nombre}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {!message.leido && (
                        <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-semibold">
                          NUEVO
                        </span>
                      )}
                    </div>
                    {message.asunto && (
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                        {message.asunto}
                      </div>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {message.contenido}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">🚀 Accesos Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/dashboard/client/solicitudes')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition-all text-left"
            >
              <div className="text-3xl mb-2">📋</div>
              <div className="font-semibold">Mis Solicitudes</div>
              <div className="text-sm text-white/80">Ver todas las solicitudes</div>
            </button>

            <button
              onClick={() => navigate('/dashboard/client/messages')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition-all text-left"
            >
              <div className="text-3xl mb-2">💬</div>
              <div className="font-semibold">Mensajes</div>
              <div className="text-sm text-white/80">Comunicación con el equipo</div>
            </button>

            <button
              onClick={() => navigate('/dashboard/profile')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition-all text-left"
            >
              <div className="text-3xl mb-2">⚙️</div>
              <div className="font-semibold">Configuración</div>
              <div className="text-sm text-white/80">Actualizar tu perfil</div>
            </button>
          </div>
        </div>
      </div>
  );
}
