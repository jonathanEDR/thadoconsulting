/**
 * 🔔 CONTENEDOR DE TOASTS
 * Renderiza todas las notificaciones activas en una posición fija
 */

import { useNotification } from '../../contexts/NotificationContext';
import Toast from './Toast';

// ============================================
// TIPOS
// ============================================

type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

interface ToastContainerProps {
  position?: ToastPosition;
}

// ============================================
// ESTILOS DE POSICIÓN
// ============================================

const getPositionStyles = (position: ToastPosition): string => {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };
  return positions[position];
};

// ============================================
// COMPONENTE
// ============================================

export const ToastContainer = ({ position = 'top-right' }: ToastContainerProps) => {
  const { notifications } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div
      className={`
        fixed z-[9999] flex flex-col items-end pointer-events-none
        ${getPositionStyles(position)}
      `}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="pointer-events-auto space-y-0">
        {notifications.map(notification => (
          <Toast key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
