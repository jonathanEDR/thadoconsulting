/**
 * 🎨 DynamicIcon Component
 * Renderiza iconos de Lucide dinámicamente por nombre
 * Permite configurar color y tamaño
 */

import React from 'react';
import * as LucideIcons from 'lucide-react';

// Lista de iconos disponibles para el selector del sidebar
export const AVAILABLE_SIDEBAR_ICONS = [
  // Navegación y Dashboard
  { name: 'LayoutDashboard', label: 'Dashboard' },
  { name: 'Home', label: 'Inicio' },
  { name: 'Grid3X3', label: 'Grid' },
  { name: 'Layers', label: 'Capas' },
  
  // Usuario y Perfil
  { name: 'User', label: 'Usuario' },
  { name: 'Users', label: 'Usuarios' },
  { name: 'UserCircle', label: 'Usuario Círculo' },
  { name: 'UserCog', label: 'Usuario Config' },
  
  // Contenido y Edición
  { name: 'FileEdit', label: 'Editar Archivo' },
  { name: 'PenTool', label: 'Pluma' },
  { name: 'Edit3', label: 'Editar' },
  { name: 'FileText', label: 'Documento' },
  { name: 'Files', label: 'Archivos' },
  
  // Comunicación
  { name: 'MessageSquare', label: 'Mensaje' },
  { name: 'MessageCircle', label: 'Chat' },
  { name: 'Mail', label: 'Correo' },
  { name: 'Send', label: 'Enviar' },
  { name: 'Bell', label: 'Notificación' },
  
  // Calendario y Tiempo
  { name: 'Calendar', label: 'Calendario' },
  { name: 'CalendarDays', label: 'Días' },
  { name: 'Clock', label: 'Reloj' },
  { name: 'Timer', label: 'Timer' },
  
  // Media
  { name: 'Image', label: 'Imagen' },
  { name: 'ImagePlus', label: 'Añadir Imagen' },
  { name: 'Camera', label: 'Cámara' },
  { name: 'Video', label: 'Video' },
  { name: 'Film', label: 'Película' },
  
  // Tecnología e IA
  { name: 'Bot', label: 'Bot' },
  { name: 'Cpu', label: 'CPU' },
  { name: 'Brain', label: 'Cerebro' },
  { name: 'Sparkles', label: 'Brillos' },
  { name: 'Wand2', label: 'Varita' },
  { name: 'Zap', label: 'Rayo' },
  
  // Servicios y Negocio
  { name: 'Rocket', label: 'Cohete' },
  { name: 'Briefcase', label: 'Maletín' },
  { name: 'Building2', label: 'Edificio' },
  { name: 'Target', label: 'Objetivo' },
  { name: 'TrendingUp', label: 'Tendencia' },
  
  // Listas y Organización
  { name: 'ClipboardList', label: 'Lista' },
  { name: 'ListTodo', label: 'Tareas' },
  { name: 'CheckSquare', label: 'Check' },
  { name: 'Bookmark', label: 'Marcador' },
  { name: 'Tag', label: 'Etiqueta' },
  
  // Configuración
  { name: 'Settings', label: 'Configuración' },
  { name: 'Settings2', label: 'Ajustes' },
  { name: 'Cog', label: 'Engranaje' },
  { name: 'Wrench', label: 'Llave' },
  { name: 'Tool', label: 'Herramienta' },
  
  // Analytics y Datos
  { name: 'Activity', label: 'Actividad' },
  { name: 'BarChart3', label: 'Gráfico' },
  { name: 'PieChart', label: 'Pastel' },
  { name: 'LineChart', label: 'Líneas' },
  { name: 'Database', label: 'Base de Datos' },
  
  // Otros útiles
  { name: 'Star', label: 'Estrella' },
  { name: 'Heart', label: 'Corazón' },
  { name: 'Award', label: 'Premio' },
  { name: 'Gift', label: 'Regalo' },
  { name: 'Shield', label: 'Escudo' },
  { name: 'Lock', label: 'Candado' },
  { name: 'Key', label: 'Llave' },
  { name: 'Globe', label: 'Globo' },
  { name: 'Link', label: 'Enlace' },
  { name: 'ExternalLink', label: 'Link Externo' },
  { name: 'Download', label: 'Descargar' },
  { name: 'Upload', label: 'Subir' },
  { name: 'Folder', label: 'Carpeta' },
  { name: 'FolderOpen', label: 'Carpeta Abierta' },
  { name: 'Search', label: 'Buscar' },
  { name: 'Filter', label: 'Filtrar' },
  { name: 'SlidersHorizontal', label: 'Sliders' },
  { name: 'MoreHorizontal', label: 'Más' },
  { name: 'Plus', label: 'Más' },
  { name: 'Minus', label: 'Menos' },
  { name: 'Circle', label: 'Círculo' },
  { name: 'Square', label: 'Cuadrado' },
  { name: 'Triangle', label: 'Triángulo' },
  { name: 'Hexagon', label: 'Hexágono' },
  
  // Tema (Sol/Luna)
  { name: 'Sun', label: 'Sol' },
  { name: 'Moon', label: 'Luna' },
  { name: 'SunMoon', label: 'Sol y Luna' },
  { name: 'CloudSun', label: 'Nube Sol' },
  { name: 'CloudMoon', label: 'Nube Luna' },
  
  // Dashboard y Blog
  { name: 'Newspaper', label: 'Periódico' },
  { name: 'BookOpen', label: 'Libro Abierto' },
  { name: 'FileStack', label: 'Archivos Apilados' },
  { name: 'RefreshCw', label: 'Actualizar' },
  { name: 'ArrowRight', label: 'Flecha Derecha' },
  { name: 'ArrowLeft', label: 'Flecha Izquierda' },
  { name: 'ChevronRight', label: 'Chevron Derecha' },
  { name: 'ChevronLeft', label: 'Chevron Izquierda' },
  { name: 'MailX', label: 'Correo X' },
  { name: 'Inbox', label: 'Bandeja' },
  { name: 'Eye', label: 'Ojo' },
  { name: 'EyeOff', label: 'Ojo Cerrado' },
  { name: 'ThumbsUp', label: 'Pulgar Arriba' },
  { name: 'MessageSquareMore', label: 'Mensaje Más' },
] as const;

// Tipo para los nombres de iconos disponibles
export type IconName = typeof AVAILABLE_SIDEBAR_ICONS[number]['name'];

interface DynamicIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

/**
 * Componente que renderiza un icono de Lucide por nombre
 */
const DynamicIcon: React.FC<DynamicIconProps> = ({ 
  name, 
  size = 20, 
  color, 
  className = '',
  strokeWidth = 2,
  style,
}) => {
  // Obtener el componente del icono de Lucide
  const IconComponent = (LucideIcons as any)[name] as React.ComponentType<LucideIcons.LucideProps> | undefined;
  
  // Si no existe el icono, mostrar un círculo como fallback
  if (!IconComponent) {
    const FallbackIcon = LucideIcons.Circle;
    return (
      <FallbackIcon 
        size={size} 
        color={color} 
        className={className}
        strokeWidth={strokeWidth}
        style={style}
      />
    );
  }

  return (
    <IconComponent 
      size={size} 
      color={color} 
      className={className}
      strokeWidth={strokeWidth}
      style={style}
    />
  );
};

export default DynamicIcon;
