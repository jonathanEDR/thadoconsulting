/**
 * ✍️ CommentForm Component
 * Formulario para crear y editar comentarios
 */

import { useState, useEffect } from 'react';
import { Send, X, AlertCircle, User, Mail } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import type { CommentFormData } from '../../../types/blog';

// Estilos configurables desde CMS
export interface CommentFormStyles {
  formBackground?: string;
  formBorder?: string;
  formFocusBorder?: string;
  textareaBackground?: string;
  textareaText?: string;
  footerBackground?: string;
  buttonBackground?: string;
  buttonBorder?: string;
  buttonText?: string;
}

interface CommentFormProps {
  postId?: string; // Opcional, solo para compatibilidad
  parentId?: string;
  initialContent?: string;
  isEditing?: boolean;
  isReply?: boolean;
  onSubmit: (data: CommentFormData) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  className?: string;
  styles?: CommentFormStyles;
}

export default function CommentForm({
  parentId,
  initialContent = '',
  isEditing = false,
  isReply = false,
  onSubmit,
  onCancel,
  placeholder = 'Escribe tu comentario...',
  className = '',
  styles
}: CommentFormProps) {
  
  // Obtener usuario autenticado del contexto
  const { user } = useAuth();
  const isSignedIn = !!user;
  
  const [content, setContent] = useState(initialContent);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(initialContent.length);
  const [isFocused, setIsFocused] = useState(false);

  const MIN_LENGTH = 10;
  const MAX_LENGTH = 2000;

  // Actualizar contador de caracteres
  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  // Validar contenido
  const validateContent = (): boolean => {
    if (content.trim().length < MIN_LENGTH) {
      setError(`El comentario debe tener al menos ${MIN_LENGTH} caracteres`);
      return false;
    }

    if (content.length > MAX_LENGTH) {
      setError(`El comentario no puede exceder ${MAX_LENGTH} caracteres`);
      return false;
    }

    // Si no está autenticado, validar nombre y email
    if (!isSignedIn) {
      if (!guestName.trim()) {
        setError('Por favor ingresa tu nombre');
        return false;
      }
      if (!guestEmail.trim()) {
        setError('Por favor ingresa tu email');
        return false;
      }
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
        setError('Por favor ingresa un email válido');
        return false;
      }
    }

    setError('');
    return true;
  };

  // Manejar envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateContent()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const commentData: CommentFormData = {
        content: content.trim(),
        parentComment: parentId
      };

      // Si no está autenticado, agregar datos de invitado
      if (!isSignedIn) {
        commentData.name = guestName.trim();
        commentData.email = guestEmail.trim();
      }

      await onSubmit(commentData);
      
      // Limpiar formulario si no es edición
      if (!isEditing) {
        setContent('');
        setGuestName('');
        setGuestEmail('');
        setCharCount(0);
      }
      
      // Cerrar formulario si hay callback de cancelar
      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Error al enviar el comentario. Por favor, intenta de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cancelar
  const handleCancel = () => {
    setContent(initialContent);
    setError('');
    if (onCancel) {
      onCancel();
    }
  };

  // Determinar si puede enviar
  const canSubmit = content.trim().length >= MIN_LENGTH && 
                    content.length <= MAX_LENGTH &&
                    !isSubmitting &&
                    (isSignedIn || (guestName.trim() && guestEmail.trim()));

  return (
    <form onSubmit={handleSubmit} className={`comment-form ${className}`}>
      <div 
        className={`
          rounded-lg border-2 transition-colors
          ${error ? 'border-red-500' : ''}
          ${isReply ? 'shadow-sm' : 'shadow-md'}
        `}
        style={{
          background: styles?.formBackground || '#ffffff',
          borderColor: error 
            ? '#ef4444' 
            : isFocused 
              ? (styles?.formFocusBorder || '#3b82f6')
              : (styles?.formBorder || '#d1d5db'),
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {/* Header (si es respuesta o edición) */}
        {(isReply || isEditing) && (
          <div 
            className="flex items-center justify-between px-4 py-2 border-b"
            style={{
              background: styles?.footerBackground || '#f9fafb',
              borderColor: styles?.formBorder || '#e5e7eb'
            }}
          >
            <span 
              className="text-sm font-medium"
              style={{ color: styles?.textareaText || '#374151' }}
            >
              {isEditing ? '✏️ Editando comentario' : '↩️ Respondiendo'}
            </span>
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="p-1 transition-opacity hover:opacity-70"
                style={{ color: styles?.textareaText || '#9ca3af' }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Campos de invitado (solo si no está autenticado) */}
        {!isSignedIn && !isEditing && (
          <div 
            className="p-4 border-b"
            style={{
              background: styles?.footerBackground || '#eff6ff',
              borderColor: styles?.formBorder || '#dbeafe'
            }}
          >
            <p 
              className="text-sm mb-3"
              style={{ color: styles?.textareaText || '#1e40af' }}
            >
              Comentando como invitado
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label 
                  className="flex items-center gap-2 text-sm font-medium mb-1"
                  style={{ color: styles?.textareaText || '#374151' }}
                >
                  <User size={14} />
                  Nombre *
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Tu nombre"
                  required={!isSignedIn}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  style={{
                    borderColor: styles?.formBorder || '#d1d5db',
                    background: styles?.textareaBackground || '#ffffff',
                    color: styles?.textareaText || '#111827'
                  }}
                />
              </div>
              <div>
                <label 
                  className="flex items-center gap-2 text-sm font-medium mb-1"
                  style={{ color: styles?.textareaText || '#374151' }}
                >
                  <Mail size={14} />
                  Email *
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required={!isSignedIn}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  style={{
                    borderColor: styles?.formBorder || '#d1d5db',
                    background: styles?.textareaBackground || '#ffffff',
                    color: styles?.textareaText || '#111827'
                  }}
                />
              </div>
            </div>
            <p 
              className="text-xs mt-2"
              style={{ color: styles?.textareaText ? `${styles.textareaText}88` : '#6b7280' }}
            >
              Tu email no será publicado
            </p>
          </div>
        )}

        {/* Textarea */}
        <div 
          className="p-4"
          style={{ background: styles?.textareaBackground || '#ffffff' }}
        >
          <style>{`
            .comment-textarea::placeholder {
              color: ${styles?.textareaText ? `${styles.textareaText}66` : 'rgb(156, 163, 175)'};
              opacity: 0.6;
            }
          `}</style>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={isReply ? 3 : 4}
            maxLength={MAX_LENGTH}
            className="w-full resize-none border-0 focus:ring-0 bg-transparent comment-textarea"
            style={{ color: styles?.textareaText || '#111827' }}
            disabled={isSubmitting}
          />
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ 
            background: styles?.footerBackground || '#f9fafb',
            borderColor: styles?.formBorder || '#e5e7eb'
          }}
        >
          {/* Contador de caracteres */}
          <div className="text-sm">
            <span className="font-medium" style={{
              color: charCount < MIN_LENGTH ? (styles?.textareaText ? `${styles.textareaText}66` : '#9ca3af') :
                     charCount > MAX_LENGTH * 0.9 ? '#ea580c' :
                     styles?.textareaText || '#4b5563'
            }}>
              {charCount}
            </span>
            <span style={{ color: styles?.textareaText ? `${styles.textareaText}66` : '#9ca3af' }}> / {MAX_LENGTH}</span>
            {charCount < MIN_LENGTH && (
              <span className="ml-2 text-xs" style={{ color: styles?.textareaText ? `${styles.textareaText}66` : '#9ca3af' }}>
                (mínimo {MIN_LENGTH})
              </span>
            )}
          </div>

          {/* Botones */}
          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all hover:opacity-80 disabled:opacity-50"
                style={{ 
                  color: styles?.textareaText || '#374151',
                  background: 'transparent'
                }}
              >
                Cancelar
              </button>
            )}
            
            <button
              type="submit"
              disabled={!canSubmit}
              className={`
                inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                transition-all duration-200
                ${canSubmit ? 'hover:opacity-90 hover:shadow-md' : 'cursor-not-allowed opacity-50'}
                ${styles?.buttonBorder && !styles?.buttonBackground ? 'border-2' : ''}
              `}
              style={canSubmit ? {
                background: styles?.buttonBackground || '#2563eb',
                borderImage: styles?.buttonBorder?.startsWith('linear-gradient') 
                  ? `${styles.buttonBorder} 1` 
                  : undefined,
                borderColor: styles?.buttonBorder && !styles.buttonBorder.startsWith('linear-gradient') 
                  ? styles.buttonBorder 
                  : undefined,
                borderWidth: styles?.buttonBorder ? '2px' : undefined,
                borderStyle: styles?.buttonBorder ? 'solid' : undefined,
                color: styles?.buttonText || '#ffffff',
              } : {
                background: styles?.formBorder || '#d1d5db',
                color: styles?.textareaText ? `${styles.textareaText}66` : '#6b7280'
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isEditing ? 'Actualizar' : 'Comentar'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div 
            className="flex items-start gap-2 px-4 py-3 border-t text-sm"
            style={{
              background: '#fef2f2',
              borderColor: '#fecaca',
              color: '#b91c1c'
            }}
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Nota de políticas (solo en formulario principal) */}
      {!isReply && !isEditing && (
        <p className="mt-2 text-xs" style={{ color: styles?.textareaText ? `${styles.textareaText}88` : '#6b7280' }}>
          Al comentar, aceptas nuestras{' '}
          <a href="/politicas" className="hover:underline" style={{ color: styles?.formFocusBorder || '#2563eb' }}>
            políticas de comunidad
          </a>
          . Los comentarios están sujetos a moderación.
        </p>
      )}
    </form>
  );
}
