import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Tipos comunes
export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

// Componente Button reutilizable
export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '' 
}: ButtonProps) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl interactive-element gpu-accelerated',
    secondary: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 interactive-element',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl interactive-element gpu-accelerated',
    ghost: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 interactive-element'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base', 
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        )}
        <span>{children}</span>
      </div>
    </button>
  );
};

// Componente Card reutilizable
export const Card = ({ children, className = '', hover = true, gradient = false }: CardProps) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/30 border border-slate-200 dark:border-gray-700 gpu-accelerated';
  const hoverClasses = hover ? 'hover:shadow-2xl dark:hover:shadow-gray-900/50 hover:-translate-y-1 transition-all duration-300' : '';
  const gradientClasses = gradient ? 'bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-gray-900' : '';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}>
      {children}
    </div>
  );
};

// Componente LoadingSpinner mejorado
export const LoadingSpinner = ({ 
  size = 'md', 
  text, 
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg'; 
  text?: string; 
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center gap-3 py-4 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400 ${sizeClasses[size]}`}></div>
      {text && <span className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base">{text}</span>}
    </div>
  );
};

// Componente StatusCard optimizado
export const StatusCard = ({
  icon,
  title,
  subtitle,
  status,
  gradient,
  className = ''
}: {
  icon: string;
  title: string;
  subtitle: string;
  status: string;
  gradient: string;
  className?: string;
}) => (
  <Card className={`${gradient} border-2 p-4 sm:p-6 interactive-element gpu-accelerated ${className}`}>
    <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 transform hover:rotate-12 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg mb-1">{title}</h3>
    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-2 sm:mb-3">{subtitle}</p>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <p className="text-xs text-green-700 dark:text-green-400 font-semibold">{status}</p>
    </div>
  </Card>
);

// Componente Alert reutilizable
export const Alert = ({
  type = 'info',
  children,
  className = '',
  onClose
}: {
  type?: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  className?: string;
  onClose?: () => void;
}) => {
  const variants = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
  };

  const icons = {
    success: '✅',
    error: '❌', 
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`border rounded-xl p-4 ${variants[type]} ${className}`}>
      <div className="flex items-center gap-3">
        <div className="text-lg">{icons[type]}</div>
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-lg hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// Hook para detección de móvil
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isMobile;
};

// Utilidades de formato
export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Constantes de configuración
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    HELLO: '/api/hello',
    INFO: '/api/info',
    USER: '/api/user',
    DASHBOARD_STATUS: '/api/dashboard-status',
    PROJECT_INFO: '/api/project-info',
    HEALTH: '/api/health'
  }
};