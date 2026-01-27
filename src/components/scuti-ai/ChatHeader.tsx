/**
 * ChatHeader Component
 * Header del área de chat mostrando información de la sesión
 * 
 * Features:
 * - Título de la sesión
 * - Estado del sistema
 * - Acciones (exportar, configuración, etc)
 */

import React from 'react';
import {
  Settings,
  Download,
  Trash2,
  MoreVertical,
  Brain,
  PanelRightOpen,
  Share2,
  Check
} from 'lucide-react';
import type { ChatSession, ScutiAIStatus } from '../../types/scutiAI.types';
import { SCUTI_AI_MASCOT } from '../../utils/brandAssets';

interface ChatHeaderProps {
  session: ChatSession | null;
  systemStatus?: ScutiAIStatus | null;
  onExport?: () => void;
  onClear?: () => void;
  onSettings?: () => void;
  onViewDetails?: () => void;
  onShare?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  session,
  systemStatus,
  onExport,
  onClear,
  onSettings,
  onViewDetails,
  onShare
}) => {
  const [showActions, setShowActions] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'operational':
        return 'Operativo';
      case 'degraded':
        return 'Degradado';
      case 'error':
        return 'Error';
      case 'initializing':
        return 'Inicializando';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Left side - Session info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center p-1.5">
          <img
            src={SCUTI_AI_MASCOT.png}
            alt={SCUTI_AI_MASCOT.alt}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <Brain size={20} className="text-purple-600 dark:text-purple-400 hidden" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">
            {session?.title || 'THADO AI'}
          </h1>
          <div className="flex items-center gap-2 text-xs">
            {systemStatus && (
              <>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.status)}`}></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {getStatusLabel(systemStatus.status)}
                  </span>
                </div>
                {systemStatus.activeAgents > 0 && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {systemStatus.activeAgents} agente{systemStatus.activeAgents !== 1 ? 's' : ''} activo{systemStatus.activeAgents !== 1 ? 's' : ''}
                    </span>
                  </>
                )}
              </>
            )}
            {!systemStatus && (
              <span className="text-gray-500 dark:text-gray-400">
                Tu asistente inteligente
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {session && session.messages.length > 0 && (
          <>
            {/* Export */}
            {onExport && (
              <button
                onClick={onExport}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Exportar conversación"
              >
                <Download size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            )}

            {/* Clear */}
            {onClear && (
              <button
                onClick={onClear}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Limpiar conversación"
              >
                <Trash2 size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </>
        )}

        {/* Settings */}
        {onSettings && (
          <button
            onClick={onSettings}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Configuración"
          >
            <Settings size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
        )}

        {/* More actions menu */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
              <button
                onClick={() => {
                  if (onViewDetails) onViewDetails();
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <PanelRightOpen size={16} />
                Ver detalles
              </button>
              <button
                onClick={() => {
                  if (onShare) {
                    onShare();
                  } else {
                    // Fallback: copiar URL de la conversación
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
                {copied ? 'Enlace copiado!' : 'Compartir'}
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <button
                onClick={() => {
                  if (onClear) onClear();
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Eliminar conversación
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
