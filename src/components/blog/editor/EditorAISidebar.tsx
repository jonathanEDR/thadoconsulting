/**
 * Editor AI Sidebar - VERSION MEJORADA
 * Panel lateral con herramientas avanzadas de IA usando el sistema de agentes
 */

import React from 'react';
import { X } from 'lucide-react';
import { AIAnalysisPanel } from '../AIAnalysisPanel';

interface EditorAISidebarProps {
  postId?: string;
  title: string;
  content: string;
  excerpt: string;
  category?: string;
  isOpen: boolean;
  onClose: () => void;
  onTagsGenerated?: (tags: string[]) => void;
  onSEOSuggestions?: (suggestions: any) => void;
}

export const EditorAISidebar: React.FC<EditorAISidebarProps> = ({
  postId,
  title,
  content,
  category,
  isOpen,
  onClose,
  onTagsGenerated,
  onSEOSuggestions
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right">
      <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Asistente IA</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <AIAnalysisPanel
          postId={postId}
          content={content}
          title={title}
          category={category}
          onTagsGenerated={onTagsGenerated}
          onSEOSuggestions={onSEOSuggestions}
          autoAnalyze={false}
        />
      </div>
    </div>
  );
};

export default EditorAISidebar;
