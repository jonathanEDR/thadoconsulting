import { useTheme } from '../contexts/ThemeContext';
import { useDashboardSidebarConfig } from '../hooks/cms/useDashboardSidebarConfig';
import DynamicIcon from './ui/DynamicIcon';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { globalConfig } = useDashboardSidebarConfig();
  const isDarkMode = theme === 'dark';

  // Obtener configuración del icono de tema
  const iconName = isDarkMode 
    ? (globalConfig.themeToggleIconDark || 'Sun') 
    : (globalConfig.themeToggleIconLight || 'Moon');
  const iconColor = isDarkMode 
    ? (globalConfig.themeToggleColorDark || '#fbbf24') 
    : (globalConfig.themeToggleColorLight || '#f59e0b');

  return (
    <button
      onClick={toggleTheme}
      className={`p-1.5 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 ${className}`}
      title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <DynamicIcon 
        name={iconName}
        color={iconColor}
        size={22}
        strokeWidth={1.5}
      />
    </button>
  );
}
