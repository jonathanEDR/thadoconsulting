import React, { useState, useEffect } from 'react';
import { ActivityTimeline } from './ActivityTimeline';
import { StatusBadge, PriorityBadge, OrigenBadge } from './Badges';
import { MessageTimeline } from './messages/MessageTimeline';
import { MessageComposer } from './messages/MessageComposer';
import type { Lead } from '../../services/crmService';
import type { LeadMessage, MessageTemplate } from '../../types/message.types';
import { messageService, templateService } from '../../services/messageService';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onEdit?: (lead: Lead) => void;
  onChangeStatus?: (leadId: string, nuevoEstado: Lead['estado']) => Promise<void>;
  onAddActivity?: (leadId: string, tipo: string, descripcion: string) => Promise<void>;
}

type TabType = 'general' | 'activities' | 'messages' | 'history';

/**
 * 🔍 Modal de vista detallada del Lead
 */
export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  isOpen,
  onClose,
  lead,
  onEdit,
  onChangeStatus,
  onAddActivity
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [newActivity, setNewActivity] = useState({ tipo: 'nota', descripcion: '' });
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  // ========================================
  // 📩 MENSAJERÍA STATE
  // ========================================
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showComposer, setShowComposer] = useState(false);
  const [composerType, setComposerType] = useState<'internal' | 'client'>('internal');

  // ========================================
  // 🔄 EFFECTS - Cargar mensajes cuando se abre el modal
  // ========================================
  useEffect(() => {
    if (isOpen && lead) {
      loadMessages();
      loadTemplates();
    }
  }, [isOpen, lead]);

  if (!isOpen || !lead) return null;

  // ========================================
  // 📩 MENSAJERÍA FUNCTIONS
  // ========================================

  /**
   * Cargar mensajes del lead
   */
  const loadMessages = async () => {
    if (!lead) return;
    
    setIsLoadingMessages(true);
    try {
      const response = await messageService.getLeadMessages(lead._id);
      if (response.success && response.data) {
        setMessages(response.data.mensajes || []);
        // Contar no leídos
        const unread = (response.data.mensajes || []).filter(
          (msg: LeadMessage) => !msg.leido && msg.tipo !== 'nota_interna'
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  /**
   * Cargar plantillas disponibles
   */
  const loadTemplates = async () => {
    try {
      const response = await templateService.getTemplates();
      if (response.success && response.data) {
        setTemplates(response.data.plantillas || []);
      }
    } catch (error) {
      console.error('Error al cargar plantillas:', error);
    }
  };

  /**
   * Enviar mensaje
   */
  const handleSendMessage = async (data: {
    contenido: string;
    prioridad?: string;
    etiquetas?: string[];
  }) => {
    if (!lead) return;

    try {
      let response;
      
      if (composerType === 'internal') {
        response = await messageService.sendInternalMessage({
          leadId: lead._id,
          contenido: data.contenido,
          prioridad: (data.prioridad as any) || 'normal',
          etiquetas: data.etiquetas || [],
        });
      } else {
        response = await messageService.sendClientMessage({
          leadId: lead._id,
          contenido: data.contenido,
          prioridad: (data.prioridad as any) || 'normal',
        });
      }

      if (response.success) {
        setShowComposer(false);
        await loadMessages(); // Recargar mensajes
      } else {
        alert(response.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar el mensaje');
    }
  };



  /**
   * Iniciar respuesta a un mensaje (solo para el timeline)
   */
  const handleInitReply = (messageId: string) => {
    // El MessageTimeline manejará internamente el formulario de respuesta
    console.log('Iniciar respuesta a mensaje:', messageId);
  };

  /**
   * Marcar mensaje como leído
   */
  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await messageService.markAsRead(messageId);
      if (response.success) {
        await loadMessages();
      }
    } catch (error) {
      console.error('Error al marcar como leído:', error);
    }
  };

  /**
   * Eliminar mensaje
   */
  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este mensaje?')) {
      return;
    }

    try {
      const response = await messageService.deleteMessage(messageId);
      if (response.success) {
        await loadMessages();
      } else {
        alert(response.message || 'Error al eliminar el mensaje');
      }
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      alert('Error al eliminar el mensaje');
    }
  };

  /**
   * Refrescar mensajes
   */
  const handleRefreshMessages = async () => {
    await loadMessages();
  };

  // ========================================
  // 🔄 HANDLERS
  // ========================================
  const handleChangeStatus = async (nuevoEstado: Lead['estado']) => {
    if (onChangeStatus && window.confirm(`¿Cambiar el estado del lead a "${nuevoEstado}"?`)) {
      await onChangeStatus(lead._id, nuevoEstado);
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.descripcion.trim()) {
      alert('Por favor ingresa una descripción para la actividad');
      return;
    }

    setIsAddingActivity(true);
    try {
      if (onAddActivity) {
        await onAddActivity(lead._id, newActivity.tipo, newActivity.descripcion);
        setNewActivity({ tipo: 'nota', descripcion: '' });
      }
    } catch (error) {
      console.error('Error al agregar actividad:', error);
      alert('Error al agregar la actividad');
    } finally {
      setIsAddingActivity(false);
    }
  };

  // ========================================
  // 📊 HELPERS
  // ========================================
  const getTipoServicioLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      web: '🌐 Sitio Web',
      app: '📱 App Móvil',
      ecommerce: '🛒 E-commerce',
      sistemas: '💻 Sistemas',
      consultoria: '👨‍💼 Consultoría',
      diseño: '🎨 Diseño',
      marketing: '📢 Marketing',
      otro: '📌 Otro'
    };
    return labels[tipo] || tipo;
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'No especificado';
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // ========================================
  // 🎨 RENDERIZADO
  // ========================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-2xl font-bold">
                {lead.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{lead.nombre}</h2>
                {lead.empresa && (
                  <p className="text-blue-100">{lead.empresa}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge estado={lead.estado} />
                  <PriorityBadge prioridad={lead.prioridad} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-3 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'general'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              📋 Información General
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-3 px-4 font-medium transition-colors border-b-2 relative ${
                activeTab === 'messages'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              💬 Mensajes
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`py-3 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'activities'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              📝 Actividades {lead.actividades && `(${lead.actividades.length})`}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              📜 Historial
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB: Información General */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Acciones Rápidas */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  ⚡ Acciones Rápidas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(lead)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm"
                    >
                      ✏️ Editar Lead
                    </button>
                  )}
                  
                  {/* Botones de cambio de estado según el estado actual */}
                  {onChangeStatus && (
                    <>
                      {/* FLUJO NUEVO: nuevo → en_revision → contactando → cotizacion → aprobado → en_desarrollo → completado */}
                      
                      {/* Si es nuevo, mostrar En Revisión */}
                      {lead.estado === 'nuevo' && (
                        <button
                          onClick={() => handleChangeStatus('en_revision')}
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm"
                        >
                          👀 Marcar en Revisión
                        </button>
                      )}

                      {/* Si está en revisión, mostrar Contactando */}
                      {lead.estado === 'en_revision' && (
                        <button
                          onClick={() => handleChangeStatus('contactando')}
                          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-sm"
                        >
                          📞 Comenzar a Contactar
                        </button>
                      )}

                      {/* Si está contactando, mostrar Enviar Cotización */}
                      {lead.estado === 'contactando' && (
                        <button
                          onClick={() => handleChangeStatus('cotizacion')}
                          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
                        >
                          💰 Enviar Cotización
                        </button>
                      )}

                      {/* Si hay cotización, mostrar Aprobar/Rechazar */}
                      {lead.estado === 'cotizacion' && (
                        <>
                          <button
                            onClick={() => handleChangeStatus('aprobado')}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm"
                          >
                            ✅ Marcar como Aprobado
                          </button>
                          <button
                            onClick={() => handleChangeStatus('rechazado')}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                          >
                            ❌ Marcar como Rechazado
                          </button>
                        </>
                      )}

                      {/* Si está aprobado, mostrar Iniciar Desarrollo */}
                      {lead.estado === 'aprobado' && (
                        <button
                          onClick={() => handleChangeStatus('en_desarrollo')}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
                        >
                          🚀 Iniciar Desarrollo
                        </button>
                      )}

                      {/* Si está en desarrollo, mostrar Completar */}
                      {lead.estado === 'en_desarrollo' && (
                        <button
                          onClick={() => handleChangeStatus('completado')}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                        >
                          ✨ Marcar como Completado
                        </button>
                      )}

                      {/* Botón para cancelar (excepto si ya está completado, rechazado o cancelado) */}
                      {!['completado', 'rechazado', 'cancelado'].includes(lead.estado) && (
                        <button
                          onClick={() => handleChangeStatus('cancelado')}
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                        >
                          🚫 Cancelar Solicitud
                        </button>
                      )}

                      {/* Si está rechazado o cancelado, permitir reactivar */}
                      {(lead.estado === 'rechazado' || lead.estado === 'cancelado') && (
                        <button
                          onClick={() => handleChangeStatus('en_revision')}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                        >
                          🔄 Reactivar Solicitud
                        </button>
                      )}

                      {/* COMPATIBILIDAD CON ESTADOS LEGACY */}
                      {lead.estado === 'contactado' && (
                        <button
                          onClick={() => handleChangeStatus('calificado')}
                          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
                        >
                          ✅ Marcar como Calificado
                        </button>
                      )}

                      {lead.estado === 'calificado' && (
                        <button
                          onClick={() => handleChangeStatus('propuesta')}
                          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm"
                        >
                          📋 Enviar Propuesta
                        </button>
                      )}

                      {lead.estado === 'propuesta' && (
                        <button
                          onClick={() => handleChangeStatus('negociacion')}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
                        >
                          💰 Iniciar Negociación
                        </button>
                      )}

                      {!['ganado', 'perdido', 'pausado', 'completado', 'rechazado', 'cancelado'].includes(lead.estado) && (
                        <>
                          <button
                            onClick={() => handleChangeStatus('ganado')}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                          >
                            🎉 Cerrar como Ganado
                          </button>
                          <button
                            onClick={() => handleChangeStatus('perdido')}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                          >
                            ❌ Marcar como Perdido
                          </button>
                        </>
                      )}

                      {lead.estado === 'pausado' && (
                        <button
                          onClick={() => handleChangeStatus('contactado')}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                        >
                          ▶️ Reactivar Lead
                        </button>
                      )}

                      {lead.estado === 'perdido' && (
                        <button
                          onClick={() => handleChangeStatus('contactado')}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                        >
                          🔄 Reabrir Lead
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Información del Cliente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>👤</span> Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Nombre Completo" value={lead.nombre} icon="👤" />
                  <InfoField label="Empresa" value={lead.empresa || 'No especificada'} icon="🏢" />
                  <InfoField label="Correo Electrónico" value={lead.correo} icon="📧" />
                  <InfoField label="Celular" value={lead.celular} icon="📞" />
                </div>
              </div>

              {/* Información del Proyecto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>💼</span> Información del Proyecto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Tipo de Servicio" value={getTipoServicioLabel(lead.tipoServicio)} icon="🛠️" />
                  <InfoField label="Presupuesto Estimado" value={formatCurrency(lead.presupuestoEstimado)} icon="💰" />
                  <InfoField label="Fecha Deseada" value={formatDate(lead.fechaDeseada)} icon="📅" />
                  <div className="flex items-start gap-2">
                    <span className="text-xl">🎯</span>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Prioridad</label>
                      <div className="mt-1">
                        <PriorityBadge prioridad={lead.prioridad} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xl">🌐</span>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Origen</label>
                      <div className="mt-1">
                        <OrigenBadge origen={lead.origen} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descripción del Proyecto */}
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">📝 Descripción del Proyecto</label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {lead.descripcionProyecto}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {lead.tags && lead.tags.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">🏷️ Etiquetas</label>
                    <div className="flex flex-wrap gap-2">
                      {lead.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Información del Sistema */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>⚙️</span> Información del Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Fecha de Creación" value={formatDate(lead.createdAt)} icon="📆" />
                  <InfoField label="Última Actualización" value={formatDate(lead.updatedAt)} icon="🔄" />
                  <InfoField label="ID del Lead" value={lead._id} icon="🆔" />
                </div>
              </div>
            </div>
          )}

          {/* TAB: Mensajes */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              {/* Botones de acción */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setComposerType('internal');
                    setShowComposer(!showComposer);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  📝 {showComposer && composerType === 'internal' ? 'Cancelar' : 'Nueva Nota Interna'}
                </button>
                <button
                  onClick={() => {
                    setComposerType('client');
                    setShowComposer(!showComposer);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  💬 {showComposer && composerType === 'client' ? 'Cancelar' : 'Mensaje a Cliente'}
                </button>
                <button
                  onClick={handleRefreshMessages}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  🔄 Actualizar
                </button>
              </div>

              {/* Compositor de mensajes */}
              {showComposer && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <MessageComposer
                    leadId={lead._id}
                    messageType={composerType}
                    onSend={handleSendMessage}
                    templates={templates}
                    onCancel={() => setShowComposer(false)}
                  />
                </div>
              )}

              {/* Timeline de mensajes */}
              {isLoadingMessages ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin text-4xl mb-2">⏳</div>
                    <p className="text-gray-600 dark:text-gray-400">Cargando mensajes...</p>
                  </div>
                </div>
              ) : messages.length > 0 ? (
                <MessageTimeline
                  leadId={lead._id}
                  messages={messages}
                  onRefresh={handleRefreshMessages}
                  onReply={handleInitReply}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteMessage}
                  canReply={true}
                  canDelete={true}
                  canViewPrivate={true}
                />
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-4xl mb-2">💬</p>
                  <p className="text-lg font-medium mb-2">No hay mensajes aún</p>
                  <p className="text-sm">Crea el primer mensaje para este lead</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: Actividades */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              {/* Formulario para agregar actividad */}
              {onAddActivity && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    ➕ Agregar Nueva Actividad
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                      value={newActivity.tipo}
                      onChange={(e) => setNewActivity({ ...newActivity, tipo: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="nota">📝 Nota</option>
                      <option value="llamada">📞 Llamada</option>
                      <option value="email">📧 Email</option>
                      <option value="reunion">🤝 Reunión</option>
                      <option value="propuesta">📄 Propuesta</option>
                    </select>
                    <input
                      type="text"
                      value={newActivity.descripcion}
                      onChange={(e) => setNewActivity({ ...newActivity, descripcion: e.target.value })}
                      placeholder="Descripción de la actividad..."
                      className="md:col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={handleAddActivity}
                      disabled={isAddingActivity}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isAddingActivity ? 'Agregando...' : 'Agregar'}
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline de actividades */}
              {lead.actividades && lead.actividades.length > 0 ? (
                <ActivityTimeline actividades={lead.actividades} />
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-4xl mb-2">📭</p>
                  <p>No hay actividades registradas</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: Historial */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📜 Historial de Cambios
              </h3>
              {lead.actividades && lead.actividades.length > 0 ? (
                <div className="space-y-3">
                  {lead.actividades
                    .filter(act => act.tipo === 'cambio_estado')
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    .map((activity, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-start gap-3"
                      >
                        <span className="text-2xl">🔄</span>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white font-medium">
                            {activity.descripcion}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(activity.fecha).toLocaleString('es-ES')}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-4xl mb-2">📋</p>
                  <p>No hay historial de cambios</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 📋 Componente auxiliar para mostrar información
 */
const InfoField: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="flex items-start gap-2">
    <span className="text-xl">{icon}</span>
    <div>
      <label className="text-sm text-gray-500 dark:text-gray-400">{label}</label>
      <p className="text-gray-900 dark:text-white font-medium">{value}</p>
    </div>
  </div>
);

export default LeadDetailModal;
