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
          ${!styles?.formBackground ? 'bg-white dark:bg-gray-800' : ''}
          ${error ? 'border-red-300 dark:border-red-600' : ''}
          ${isReply ? 'shadow-sm' : 'shadow-md'}
        `}
        style={{
          background: styles?.formBackground || undefined,
          borderColor: error 
            ? undefined 
            : isFocused 
              ? (styles?.formFocusBorder || '#3b82f6')
              : (styles?.formBorder || undefined),
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {/* Header (si es respuesta o edición) */}
        {(isReply || isEditing) && (
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isEditing ? '✏️ Editando comentario' : '↩️ Respondiendo'}
            </span>
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Campos de invitado (solo si no está autenticado) */}
        {!isSignedIn && !isEditing && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
              Comentando como invitado
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <User size={14} />
                  Nombre *
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Tu nombre"
                  required={!isSignedIn}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Mail size={14} />
                  Email *
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required={!isSignedIn}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Tu email no será publicado
            </p>
          </div>
        )}

        {/* Textarea */}
        <div 
          className={`p-4 ${!styles?.textareaBackground ? '' : ''}`}
          style={{ background: styles?.textareaBackground || undefined }}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={isReply ? 3 : 4}
            maxLength={MAX_LENGTH}
            className="w-full resize-none border-0 focus:ring-0 bg-transparent placeholder-gray-400 dark:placeholder-gray-500"
            style={{ color: styles?.textareaText || undefined }}
            disabled={isSubmitting}
          />
        </div>

        {/* Footer */}
        <div 
          className={`flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-600 ${!styles?.footerBackground ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
          style={{ background: styles?.footerBackground || undefined }}
        >
          {/* Contador de caracteres */}
          <div className="text-sm">
            <span className={`
              font-medium
              ${charCount < MIN_LENGTH ? 'text-gray-400 dark:text-gray-500' :
                charCount > MAX_LENGTH * 0.9 ? 'text-orange-600 dark:text-orange-400' :
                'text-gray-600 dark:text-gray-300'}
            `}>
              {charCount}
            </span>
            <span className="text-gray-400 dark:text-gray-500"> / {MAX_LENGTH}</span>
            {charCount < MIN_LENGTH && (
              <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
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
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
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
                ${canSubmit
                  ? !styles?.buttonBackground && !styles?.buttonBorder 
                    ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md' 
                    : 'hover:opacity-90 hover:shadow-md'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }
                ${styles?.buttonBorder && !styles?.buttonBackground ? 'border-2' : ''}
              `}
              style={canSubmit ? {
                background: styles?.buttonBackground || (styles?.buttonBorder ? 'transparent' : undefined),
                borderImage: styles?.buttonBorder?.startsWith('linear-gradient') 
                  ? `${styles.buttonBorder} 1` 
                  : undefined,
                borderColor: styles?.buttonBorder && !styles.buttonBorder.startsWith('linear-gradient') 
                  ? styles.buttonBorder 
                  : undefined,
                borderWidth: styles?.buttonBorder ? '2px' : undefined,
                borderStyle: styles?.buttonBorder ? 'solid' : undefined,
                color: styles?.buttonText || undefined,
              } : undefined}
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
          <div className="flex items-start gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Nota de políticas (solo en formulario principal) */}
      {!isReply && !isEditing && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Al comentar, aceptas nuestras{' '}
          <a href="/politicas" className="text-blue-600 dark:text-blue-400 hover:underline">
            políticas de comunidad
          </a>
          . Los comentarios están sujetos a moderación.
        </p>
      )}
    </form>
  );
}
