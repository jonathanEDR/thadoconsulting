/**
 * ✍️ MESSAGE COMPOSER - Compositor de Mensajes
 * Componente para crear y enviar mensajes (internos o a clientes)
 */

import React, { useState, useRef, useEffect } from 'react';
import type {
  MessageTemplate,
  MessagePriority,
  CreateInternalMessageData,
  CreateClientMessageData,
} from '../../../types/message.types';
import {
  MESSAGE_CONSTANTS,
  DEFAULT_TEMPLATE_VARIABLES,
} from '../../../types/message.types';
import { validateMessageContent } from '../../../services/messageService';

interface MessageComposerProps {
  leadId: string;
  leadData?: {
    nombre: string;
    empresa?: string;
    correo: string;
    celular: string;
  };
  messageType: 'internal' | 'client';
  onSend: (data: CreateInternalMessageData | CreateClientMessageData) => Promise<void>;
  onCancel?: () => void;
  templates?: MessageTemplate[];
  defaultContent?: string;
  showSubject?: boolean;
  showPriority?: boolean;
  disabled?: boolean;
}

/**
 * 🎨 Componente MessageComposer
 */
export const MessageComposer: React.FC<MessageComposerProps> = ({
  leadId,
  leadData,
  messageType,
  onSend,
  onCancel,
  templates = [],
  defaultContent = '',
  showSubject = true,
  showPriority = true,
  disabled = false,
}) => {
  const [contenido, setContenido] = useState(defaultContent);
  const [asunto, setAsunto] = useState('');
  const [prioridad, setPrioridad] = useState<MessagePriority>('normal');
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showVariables, setShowVariables] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ========================================
  // 🔄 EFECTOS
  // ========================================

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [contenido]);

  // Reset al cambiar tipo de mensaje
  useEffect(() => {
    setContenido(defaultContent);
    setAsunto('');
    setError(null);
  }, [messageType, defaultContent]);

  // ========================================
  // 🔄 HANDLERS
  // ========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar contenido
    const validation = validateMessageContent(
      contenido,
      MESSAGE_CONSTANTS.MAX_CONTENT_LENGTH
    );
    if (!validation.valid) {
      setError(validation.error || 'Error de validación');
      return;
    }

    setIsSubmitting(true);

    try {
      const baseData = {
        leadId,
        contenido: contenido.trim(),
        asunto: asunto.trim() || undefined,
        prioridad,
      };

      if (messageType === 'internal') {
        await onSend({
          ...baseData,
          etiquetas,
        } as CreateInternalMessageData);
      } else {
        await onSend({
          ...baseData,
          canal: 'sistema',
        } as CreateClientMessageData);
      }

      // Reset formulario después de envío exitoso
      setContenido('');
      setAsunto('');
      setPrioridad('normal');
      setEtiquetas([]);
      setSelectedTemplate('');
      setError(null);
    } catch (err: any) {
      console.error('Error enviando mensaje:', err);
      setError(err.message || 'Error al enviar el mensaje');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setContenido('');
      setAsunto('');
      setError(null);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t._id === templateId);
    if (!template) return;

    setSelectedTemplate(templateId);
    
    // Reemplazar variables si hay datos del lead
    let content = template.contenido;
    if (leadData) {
      content = content
        .replace(/{nombre}/g, leadData.nombre)
        .replace(/{empresa}/g, leadData.empresa || '')
        .replace(/{email}/g, leadData.correo)
        .replace(/{telefono}/g, leadData.celular)
        .replace(/{fecha}/g, new Date().toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }));
    }

    setContenido(content);
    if (template.asunto) {
      setAsunto(template.asunto);
    }
    setShowTemplates(false);
  };

  const handleInsertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = contenido;
    const before = text.substring(0, start);
    const after = text.substring(end);

    setContenido(before + variable + after);
    
    // Reposicionar cursor
    setTimeout(() => {
      textarea.focus();
      const newPos = start + variable.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleAddEtiqueta = () => {
    if (nuevaEtiqueta.trim() && !etiquetas.includes(nuevaEtiqueta.trim())) {
      setEtiquetas([...etiquetas, nuevaEtiqueta.trim()]);
      setNuevaEtiqueta('');
    }
  };

  const handleRemoveEtiqueta = (etiqueta: string) => {
    setEtiquetas(etiquetas.filter((e) => e !== etiqueta));
  };

  // ========================================
  // 📊 HELPERS
  // ========================================

  const caracteresRestantes = MESSAGE_CONSTANTS.MAX_CONTENT_LENGTH - contenido.length;
  const porcentajeUsado = (contenido.length / MESSAGE_CONSTANTS.MAX_CONTENT_LENGTH) * 100;

  const getTipoLabel = () => {
    return messageType === 'internal' ? '📝 Nota Interna' : '💬 Mensaje a Cliente';
  };

  const getTipoDescription = () => {
    return messageType === 'internal'
      ? 'Esta nota solo será visible para el equipo interno'
      : 'Este mensaje será enviado al cliente';
  };

  // Filtrar plantillas por tipo
  const filteredTemplates = templates.filter((t) => {
    // Verificar que esté activa
    if (!t.esActiva) return false;
    
    if (messageType === 'internal') {
      // Solo notas internas
      return t.tipo === 'nota_interna';
    } else {
      // Todos los tipos de mensajes a clientes
      const clientMessageTypes = [
        'bienvenida',
        'seguimiento',
        'cotizacion',
        'propuesta',
        'cierre',
        'agradecimiento',
        'recordatorio',
        'rechazo',
        'mensaje_cliente',
        'email'
      ];
      return clientMessageTypes.includes(t.tipo);
    }
  });

  // ========================================
  // 🎨 RENDER
  // ========================================

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {getTipoLabel()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getTipoDescription()}
          </p>
        </div>

        {/* Tipo de mensaje badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            messageType === 'internal'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
          }`}
        >
          {messageType === 'internal' ? '🔒 Privado' : '📢 Público'}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </p>
        </div>
      )}

      {/* Plantillas */}
      {filteredTemplates.length > 0 && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>📋</span>
            {showTemplates ? 'Ocultar plantillas' : 'Usar plantilla'}
          </button>

          {showTemplates && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              {filteredTemplates.map((template) => (
                <button
                  key={template._id}
                  type="button"
                  onClick={() => handleTemplateSelect(template._id)}
                  className={`p-3 text-left rounded border transition-all ${
                    selectedTemplate === template._id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-white">
                    {template.titulo}
                  </div>
                  {template.descripcion && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {template.descripcion}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Usada {template.vecesUsada} veces
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Asunto (opcional) */}
      {showSubject && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Asunto (opcional)
          </label>
          <input
            type="text"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            maxLength={MESSAGE_CONSTANTS.MAX_SUBJECT_LENGTH}
            placeholder="Ej: Actualización del proyecto"
            disabled={disabled || isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          />
        </div>
      )}

      {/* Contenido */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mensaje *
          </label>
          <button
            type="button"
            onClick={() => setShowVariables(!showVariables)}
            className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {showVariables ? '✖ Cerrar' : '🔧 Variables'}
          </button>
        </div>

        {/* Panel de variables */}
        {showVariables && (
          <div className="mb-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Click para insertar:
            </div>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_TEMPLATE_VARIABLES.map((variable) => (
                <button
                  key={variable.nombre}
                  type="button"
                  onClick={() => handleInsertVariable(variable.variable)}
                  className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  title={variable.descripcion}
                >
                  {variable.variable}
                </button>
              ))}
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Escribe tu mensaje aquí..."
          required
          disabled={disabled || isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none disabled:opacity-50"
          style={{ minHeight: '120px', maxHeight: '400px' }}
        />

        {/* Contador de caracteres */}
        <div className="flex items-center justify-between mt-1">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {contenido.length} / {MESSAGE_CONSTANTS.MAX_CONTENT_LENGTH} caracteres
          </div>
          {porcentajeUsado > 80 && (
            <div
              className={`text-xs font-medium ${
                porcentajeUsado > 95 ? 'text-red-600' : 'text-orange-600'
              }`}
            >
              {caracteresRestantes} restantes
            </div>
          )}
        </div>

        {/* Barra de progreso */}
        <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              porcentajeUsado > 95
                ? 'bg-red-500'
                : porcentajeUsado > 80
                ? 'bg-orange-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(porcentajeUsado, 100)}%` }}
          />
        </div>
      </div>

      {/* Prioridad */}
      {showPriority && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prioridad
          </label>
          <div className="flex gap-2">
            {(['baja', 'normal', 'alta', 'urgente'] as MessagePriority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrioridad(p)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  prioridad === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Etiquetas (solo para mensajes internos) */}
      {messageType === 'internal' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Etiquetas
          </label>
          
          {/* Etiquetas actuales */}
          {etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {etiquetas.map((etiqueta) => (
                <span
                  key={etiqueta}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                >
                  #{etiqueta}
                  <button
                    type="button"
                    onClick={() => handleRemoveEtiqueta(etiqueta)}
                    className="hover:text-red-600"
                  >
                    ✖
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Agregar etiqueta */}
          <div className="flex gap-2">
            <input
              type="text"
              value={nuevaEtiqueta}
              onChange={(e) => setNuevaEtiqueta(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddEtiqueta();
                }
              }}
              placeholder="Agregar etiqueta..."
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddEtiqueta}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
            >
              + Agregar
            </button>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          * Campo requerido
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={disabled || isSubmitting || !contenido.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                Enviando...
              </>
            ) : (
              <>
                <span>📤</span>
                Enviar Mensaje
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MessageComposer;
