/**
 * 🎨 EnhancedEditorAISidebar Component
 * Sidebar de Chat IA para el editor de blog
 * Simplificado: Solo Chat IA (removidos Análisis y Generación)
 */

import React from 'react';
import { X, MessageSquare } from 'lucide-react';
import { ChatWithBlogAgent } from './ChatWithBlogAgent';
import { type ChatContext } from '../../../hooks/ai/useAIChat';
import { useDashboardSidebarConfig } from '../../../hooks/cms/useDashboardSidebarConfig';
import { useTheme } from '../../../contexts/ThemeContext';

interface EnhancedEditorAISidebarProps {
  postId?: string;
  title: string;
  content: string;
  excerpt: string;
  category?: string;
  isOpen: boolean;
  onClose: () => void;
  onTagsGenerated?: (tags: string[]) => void;
  onSEOSuggestions?: (suggestions: any) => void;
  onContentInsert?: (content: string) => void;
}

export const EnhancedEditorAISidebar: React.FC<EnhancedEditorAISidebarProps> = ({
  title,
  content,
  excerpt: _excerpt,
  category,
  isOpen,
  onClose,
  onContentInsert
}) => {
  // 🎨 Usar configuración del sidebar del dashboard
  const { adminConfig } = useDashboardSidebarConfig();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Estilos dinámicos basados en la configuración del CMS (igual que el Sidebar)
  const headerGradient = isDarkMode
    ? `linear-gradient(to right, ${adminConfig.headerGradientFromDark}, ${adminConfig.headerGradientViaDark}, ${adminConfig.headerGradientToDark})`
    : `linear-gradient(to right, ${adminConfig.headerGradientFrom}, ${adminConfig.headerGradientVia}, ${adminConfig.headerGradientTo})`;

  const sidebarBg = isDarkMode ? adminConfig.sidebarBgDark : adminConfig.sidebarBgLight;

  if (!isOpen) return null;

  const chatContext: ChatContext = {
    title,
    content,
    category,
    tags: []
  };

  return (
    <div 
      className="fixed right-0 top-0 h-screen w-[420px] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-200 dark:border-gray-700"
      style={{ background: sidebarBg }}
    >
      {/* Header con gradiente del sidebar */}
      <div 
        className="p-4"
        style={{ background: headerGradient }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat IA - Asistente Blog
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-white/80 text-sm mt-1">
          Pregunta, pide sugerencias o mejora tu contenido
        </p>
      </div>

      {/* Chat Area - Ocupa todo el espacio disponible */}
      <div className="flex-1 overflow-hidden">
        <ChatWithBlogAgent
          context={chatContext}
          onApplyContent={onContentInsert}
        />
      </div>
    </div>
  );
};

export default EnhancedEditorAISidebar;
