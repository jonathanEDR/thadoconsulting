/**
 * Tipos para el sistema SCUTI AI
 */

export type CategoryType = 'blog' | 'servicios' | 'seo' | 'agenda';

export interface QuickAction {
  icon: string;
  label: string;
  prompt: string;
  color?: string;
}

export interface CategoryConfig {
  id: CategoryType;
  title: string;
  description: string;
  emoji: string;
  bgColor: string;
  actions: QuickAction[];
}

export const CATEGORY_CONFIGS: Record<CategoryType, CategoryConfig> = {
  blog: {
    id: 'blog',
    title: 'Contenido & Blog',
    description: 'Consulta y analiza tus artículos publicados',
    emoji: '📝',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    actions: [
      { 
        icon: '📝', 
        label: 'Ver blogs publicados', 
        prompt: 'mostrar blog',
        color: 'bg-blue-100 dark:bg-blue-800/30 hover:bg-blue-200 dark:hover:bg-blue-800/50'
      },
      { 
        icon: '🔍', 
        label: 'Analizar SEO de un blog', 
        prompt: 'analizar seo del blog',
        color: 'bg-green-100 dark:bg-green-800/30 hover:bg-green-200 dark:hover:bg-green-800/50'
      },
      { 
        icon: '📊', 
        label: 'Estadísticas del blog', 
        prompt: 'mostrar estadísticas del blog',
        color: 'bg-purple-100 dark:bg-purple-800/30 hover:bg-purple-200 dark:hover:bg-purple-800/50'
      },
      { 
        icon: '🏷️', 
        label: 'Sugerir mejoras', 
        prompt: 'sugerir mejoras para el blog',
        color: 'bg-orange-100 dark:bg-orange-800/30 hover:bg-orange-200 dark:hover:bg-orange-800/50'
      }
    ]
  },
  
  servicios: {
    id: 'servicios',
    title: 'Servicios',
    description: 'Consulta información de nuestros servicios',
    emoji: '💼',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    actions: [
      { 
        icon: '📋', 
        label: 'Ver catálogo de servicios', 
        prompt: 'qué servicios ofrecen',
        color: 'bg-purple-100 dark:bg-purple-800/30 hover:bg-purple-200 dark:hover:bg-purple-800/50'
      },
      { 
        icon: '💰', 
        label: 'Consultar precios', 
        prompt: 'cuáles son los precios de los servicios',
        color: 'bg-green-100 dark:bg-green-800/30 hover:bg-green-200 dark:hover:bg-green-800/50'
      },
      { 
        icon: '🔍', 
        label: 'Detalles de un servicio', 
        prompt: 'qué incluye el servicio de diseño web',
        color: 'bg-blue-100 dark:bg-blue-800/30 hover:bg-blue-200 dark:hover:bg-blue-800/50'
      },
      { 
        icon: '💡', 
        label: 'Recomendación de servicio', 
        prompt: 'qué servicio me recomiendas para mi negocio',
        color: 'bg-pink-100 dark:bg-pink-800/30 hover:bg-pink-200 dark:hover:bg-pink-800/50'
      }
    ]
  },
  
  seo: {
    id: 'seo',
    title: 'SEO',
    description: 'Optimiza tu presencia en buscadores',
    emoji: '🔍',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    actions: [
      { 
        icon: '🔍', 
        label: 'Auditoría SEO completa', 
        prompt: 'realizar auditoría seo completa',
        color: 'bg-green-100 dark:bg-green-800/30 hover:bg-green-200 dark:hover:bg-green-800/50'
      },
      { 
        icon: '📈', 
        label: 'Analizar keywords', 
        prompt: 'analizar keywords de mi sitio',
        color: 'bg-blue-100 dark:bg-blue-800/30 hover:bg-blue-200 dark:hover:bg-blue-800/50'
      },
      { 
        icon: '🎯', 
        label: 'Optimizar página', 
        prompt: 'optimizar seo de una página',
        color: 'bg-purple-100 dark:bg-purple-800/30 hover:bg-purple-200 dark:hover:bg-purple-800/50'
      },
      { 
        icon: '📊', 
        label: 'Métricas SEO', 
        prompt: 'mostrar métricas seo',
        color: 'bg-orange-100 dark:bg-orange-800/30 hover:bg-orange-200 dark:hover:bg-orange-800/50'
      },
      { 
        icon: '🔗', 
        label: 'Análisis de enlaces', 
        prompt: 'analizar estructura de enlaces',
        color: 'bg-teal-100 dark:bg-teal-800/30 hover:bg-teal-200 dark:hover:bg-teal-800/50'
      }
    ]
  },
  
  agenda: {
    id: 'agenda',
    title: 'Agenda',
    description: 'Organiza eventos y reuniones',
    emoji: '📅',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    actions: [
      { 
        icon: '📅', 
        label: 'Ver mis eventos', 
        prompt: 'mostrar eventos',
        color: 'bg-pink-100 dark:bg-pink-800/30 hover:bg-pink-200 dark:hover:bg-pink-800/50'
      },
      { 
        icon: '📆', 
        label: 'Eventos de hoy', 
        prompt: 'mostrar eventos de hoy',
        color: 'bg-blue-100 dark:bg-blue-800/30 hover:bg-blue-200 dark:hover:bg-blue-800/50'
      },
      { 
        icon: '🗓️', 
        label: 'Próximos eventos', 
        prompt: 'mostrar próximos eventos',
        color: 'bg-purple-100 dark:bg-purple-800/30 hover:bg-purple-200 dark:hover:bg-purple-800/50'
      }
    ]
  }
};
