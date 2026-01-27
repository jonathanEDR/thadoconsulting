/**
 * 🔔 CONTEXTO DE NOTIFICACIONES
 * Sistema global de toast notifications con contexto React
 */

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// ============================================
// TIPOS
// ============================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
  clearAll: () => void;
  // Helpers
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
}

// ============================================
// CONTEXTO
// ============================================

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateId = () => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-hide después de la duración especificada
    const duration = newNotification.duration || 5000;
    if (duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, duration);
    }
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helpers para tipos comunes
  const success = useCallback((title: string, message?: string, duration?: number) => {
    showNotification({ type: 'success', title, message, duration });
  }, [showNotification]);

  const error = useCallback((title: string, message?: string, duration?: number) => {
    showNotification({ type: 'error', title, message, duration: duration || 7000 });
  }, [showNotification]);

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    showNotification({ type: 'warning', title, message, duration });
  }, [showNotification]);

  const info = useCallback((title: string, message?: string, duration?: number) => {
    showNotification({ type: 'info', title, message, duration });
  }, [showNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        hideNotification,
        clearAll,
        success,
        error,
        warning,
        info
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de NotificationProvider');
  }
  return context;
};

export default NotificationContext;
