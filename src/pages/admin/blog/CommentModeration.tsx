/**
 * 🛡️ Comment Moderation Page
 * Página administrativa para moderar comentarios del blog
 */

import { useState } from 'react';
import { Shield, MessageCircle, AlertTriangle, Ban, Check, X } from 'lucide-react';
import { useModerationQueue } from '../../../hooks/blog';
import ModerationQueue from '../../../components/blog/admin/ModerationQueue';
import ModerationStats from '../../../components/blog/admin/ModerationStats';
import type { CommentStatus } from '../../../types/blog';

type TabType = 'all' | 'pending' | 'reported' | 'spam' | 'approved';

export default function CommentModeration() {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());

  // Determinar filtro según tab activo
  const getFilters = () => {
    switch (activeTab) {
      case 'pending':
        return { status: 'pending' as CommentStatus };
      case 'reported':
        return { status: 'pending' as CommentStatus, isReported: true };
      case 'spam':
        return { status: 'spam' as CommentStatus };
      case 'approved':
        return { status: 'approved' as CommentStatus };
      default:
        return {};
    }
  };

  const {
    comments,
    loading,
    error,
    pagination,
    stats,
    moderateComment,
    moderateMultiple,
    refetch
  } = useModerationQueue(getFilters());

  // Handlers
  const handleSelectComment = (commentId: string) => {
    const newSelected = new Set(selectedComments);
    if (newSelected.has(commentId)) {
      newSelected.delete(commentId);
    } else {
      newSelected.add(commentId);
    }
    setSelectedComments(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedComments.size === comments.length) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(comments.map(c => c._id)));
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'spam') => {
    if (selectedComments.size === 0) return;

    try {
      await moderateMultiple(Array.from(selectedComments), action);
      setSelectedComments(new Set());
      await refetch();
    } catch (err) {
      console.error('Error en acción masiva:', err);
    }
  };

  // Tabs configuration
  const tabs = [
    {
      id: 'pending' as TabType,
      label: 'Pendientes',
      icon: MessageCircle,
      count: stats?.pending || 0,
      color: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      id: 'reported' as TabType,
      label: 'Reportados',
      icon: AlertTriangle,
      count: stats?.reported || 0,
      color: 'text-red-600 dark:text-red-400'
    },
    {
      id: 'spam' as TabType,
      label: 'Spam',
      icon: Ban,
      count: stats?.spam || 0,
      color: 'text-gray-600 dark:text-gray-400'
    },
    {
      id: 'approved' as TabType,
      label: 'Aprobados',
      icon: Check,
      count: stats?.approved || 0,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'all' as TabType,
      label: 'Todos',
      icon: Shield,
      count: (stats?.pending || 0) + (stats?.reported || 0) + (stats?.spam || 0) + (stats?.approved || 0),
      color: 'text-blue-600 dark:text-blue-400'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Moderación de Comentarios
        </h1>
      </div>
      <p className="text-gray-600 dark:text-gray-400">
        Revisa y gestiona los comentarios del blog
      </p>
    </div>

    {/* Stats Cards */}
    <ModerationStats stats={stats} loading={loading} />

    {/* Tabs */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedComments(new Set());
              }}
              className={`
                flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap
                ${isActive
                  ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <Icon size={18} className={isActive ? tab.color : ''} />
              <span className="font-medium">{tab.label}</span>
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-semibold
                ${isActive
                  ? 'bg-blue-600 dark:bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }
              `}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>

    {/* Bulk Actions */}
    {selectedComments.size > 0 && (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-blue-900 dark:text-blue-300 font-medium">
            {selectedComments.size} comentario(s) seleccionado(s)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('approve')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Check size={16} />
              Aprobar todos
            </button>
            <button
              onClick={() => handleBulkAction('reject')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <X size={16} />
              Rechazar todos
            </button>
            <button
              onClick={() => handleBulkAction('spam')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <Ban size={16} />
              Marcar spam
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Moderation Queue */}
    <ModerationQueue
      comments={comments}
      loading={loading}
      error={error}
      selectedComments={selectedComments}
      onSelectComment={handleSelectComment}
      onSelectAll={handleSelectAll}
      onModerate={moderateComment}
      onRefetch={refetch}
    />

    {/* Pagination */}
    {pagination && pagination.pages > 1 && (
      <div className="mt-6 flex justify-center items-center gap-2">
        <button
          onClick={() => {/* TODO: Implement pagination */}}
          disabled={pagination.page === 1}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        
        <span className="text-gray-600 dark:text-gray-400">
          Página {pagination.page} de {pagination.pages}
        </span>

        <button
          onClick={() => {/* TODO: Implement pagination */}}
          disabled={pagination.page === pagination.pages}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    )}
  </div>
  );
}
