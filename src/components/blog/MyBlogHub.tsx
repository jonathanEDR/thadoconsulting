/**
 * 🎯 MyBlogHub Component
 * Dashboard central para toda la actividad del usuario en el blog
 */

import { useState } from 'react';
import { useUserBlogActivity } from '../../hooks/useUserBlogActivity';
import { 
  Bookmark, 
  Heart, 
  MessageSquare, 
  Clock,
  BarChart3 
} from 'lucide-react';
import SmartDashboardLayout from '../SmartDashboardLayout';
import ActivityStats from './ActivityStats';
import MyComments from './MyComments';
import MyBookmarks from './MyBookmarks';
import MyLikes from './MyLikes';
import ReadingHistory from './ReadingHistory';

type TabType = 'stats' | 'comments' | 'bookmarks' | 'likes' | 'history';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

export default function MyBlogHub() {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const { stats, loading } = useUserBlogActivity();

  const tabs: Tab[] = [
    {
      id: 'stats',
      label: 'Resumen',
      icon: BarChart3
    },
    {
      id: 'comments',
      label: 'Comentarios',
      icon: MessageSquare,
      count: stats?.totalComments
    },
    {
      id: 'bookmarks',
      label: 'Guardados',
      icon: Bookmark,
      count: stats?.totalBookmarks
    },
    {
      id: 'likes',
      label: 'Me Gusta',
      icon: Heart,
      count: stats?.totalLikes
    },
    {
      id: 'history',
      label: 'Historial',
      icon: Clock,
      count: stats?.readingHistory
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stats':
        return <ActivityStats />;
      case 'comments':
        return <MyComments />;
      case 'bookmarks':
        return <MyBookmarks />;
      case 'likes':
        return <MyLikes />;
      case 'history':
        return <ReadingHistory />;
      default:
        return <ActivityStats />;
    }
  };

  return (
    <SmartDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mi Actividad en el Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus comentarios, artículos guardados y tu historial de lectura
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group inline-flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm
                      transition-colors whitespace-nowrap
                      ${isActive
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'}`} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && !loading && (
                      <span className={`
                        px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${isActive 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }
                      `}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300 ease-in-out">
          {renderTabContent()}
        </div>
      </div>
    </SmartDashboardLayout>
  );
}
