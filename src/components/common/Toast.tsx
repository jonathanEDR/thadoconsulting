/**
 * 🔔 COMPONENTE TOAST
 * Notificaciones individuales con animaciones y estilos
 */

import { useEffect, useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import type { Notification } from '../../contexts/NotificationContext';

// ============================================
// ICONOS SVG
// ============================================

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ============================================
// ESTILOS POR TIPO
// ============================================

const getTypeStyles = (type: Notification['type']) => {
  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      message: 'text-green-700',
      progress: 'bg-green-500'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-700',
      progress: 'bg-red-500'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      message: 'text-yellow-700',
      progress: 'bg-yellow-500'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      message: 'text-blue-700',
      progress: 'bg-blue-500'
    }
  };
  return styles[type];
};

const getIcon = (type: Notification['type']) => {
  const icons = {
    success: CheckIcon,
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon
  };
  const Icon = icons[type];
  return <Icon />;
};

// ============================================
// COMPONENTE TOAST
// ============================================

interface ToastProps {
  notification: Notification;
}

export const Toast = ({ notification }: ToastProps) => {
  const { hideNotification } = useNotification();
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const { id, type, title, message, duration, action } = notification;
  const styles = getTypeStyles(type);

  // Animación de barra de progreso
  useEffect(() => {
    if (!duration || duration <= 0) return;

    const interval = 50; // Actualizar cada 50ms
    const decrement = (100 / duration) * interval;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - decrement;
        return newProgress > 0 ? newProgress : 0;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      hideNotification(id);
    }, 300); // Duración de animación de salida
  };

  return (
    <div
      className={`
        relative mb-4 w-full max-w-sm overflow-hidden rounded-lg border shadow-lg
        transform transition-all duration-300 ease-out
        ${styles.bg}
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
      role="alert"
    >
      {/* Contenido Principal */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icono */}
          <div className={`flex-shrink-0 ${styles.icon}`}>
            {getIcon(type)}
          </div>

          {/* Texto */}
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm ${styles.title}`}>
              {title}
            </p>
            {message && (
              <p className={`mt-1 text-sm ${styles.message}`}>
                {message}
              </p>
            )}

            {/* Acción opcional */}
            {action && (
              <button
                onClick={() => {
                  action.onClick();
                  handleClose();
                }}
                className={`mt-2 text-sm font-medium underline ${styles.title} hover:opacity-80`}
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className={`flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors ${styles.icon}`}
            aria-label="Cerrar notificación"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Barra de progreso */}
      {duration && duration > 0 && (
        <div className="h-1 bg-black/5">
          <div
            className={`h-full transition-all ease-linear ${styles.progress}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;
