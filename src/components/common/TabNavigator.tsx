/**
 * 🗂️ TAB NAVIGATOR - Sistema de Navegación por Tabs
 * Componente profesional para navegación entre secciones del formulario
 */

import React from 'react';

// ============================================
// TIPOS
// ============================================

export interface Tab {
  id: string;
  title: string;
  icon: string;
  description?: string;
  isOptional?: boolean;
  isValid?: boolean;
  hasErrors?: boolean;
  isCompleted?: boolean;
}

interface TabNavigatorProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

/**
 * Navegador de tabs profesional con indicadores de estado
 * 
 * @example
 * ```tsx
 * const tabs = [
 *   { id: 'basic', title: 'Información Básica', icon: '📋', isValid: true },
 *   { id: 'pricing', title: 'Precio', icon: '💰', hasErrors: true },
 *   { id: 'advanced', title: 'Contenido Avanzado', icon: '✨', isOptional: true }
 * ];
 * 
 * <TabNavigator 
 *   tabs={tabs}
 *   activeTab={currentTab}
 *   onTabChange={setCurrentTab}
 * />
 * ```
 */
export const TabNavigator: React.FC<TabNavigatorProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}) => {
  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  /**
   * Obtener clases CSS para un tab según su estado
   */
  const getTabClasses = (tab: Tab): string => {
    const isActive = activeTab === tab.id;
    const baseClasses = 'relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer group';
    
    if (isActive) {
      return `${baseClasses} bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg`;
    }
    
    if (tab.hasErrors) {
      return `${baseClasses} bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20`;
    }
    
    if (tab.isCompleted) {
      return `${baseClasses} bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20`;
    }
    
    return `${baseClasses} bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-300/50 dark:border-gray-600/50 hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white`;
  };

  /**
   * Obtener indicador de estado para un tab
   */
  const getStatusIndicator = (tab: Tab): React.ReactNode => {
    if (tab.hasErrors) {
      return (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
      );
    }
    
    if (tab.isCompleted) {
      return (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      );
    }
    
    return null;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`sticky top-16 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab, index) => (
            <div key={tab.id} className="flex items-center gap-2 flex-shrink-0">
              {/* Tab Button */}
              <button
                onClick={() => onTabChange(tab.id)}
                className={getTabClasses(tab)}
                title={tab.description || tab.title}
              >
                {/* Icono */}
                <span className="text-lg flex-shrink-0">{tab.icon}</span>
                
                {/* Contenido */}
                <div className="flex flex-col items-start min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{tab.title}</span>
                    {tab.isOptional && (
                      <span className="text-xs opacity-60 bg-white/10 px-1.5 py-0.5 rounded">
                        opcional
                      </span>
                    )}
                  </div>
                  {tab.description && (
                    <span className="text-xs opacity-75 truncate max-w-32">
                      {tab.description}
                    </span>
                  )}
                </div>

                {/* Indicador de estado */}
                {getStatusIndicator(tab)}
              </button>

              {/* Separador */}
              {index < tabs.length - 1 && (
                <div className="text-gray-600 text-sm">→</div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-700 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-1 rounded-full transition-all duration-300"
            style={{ 
              width: `${((tabs.findIndex(t => t.id === activeTab) + 1) / tabs.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// UTILIDADES
// ============================================

/**
 * Hook para gestionar el estado de los tabs
 */
export const useTabNavigation = (initialTab: string, tabs: Tab[]) => {
  const [activeTab, setActiveTab] = React.useState(initialTab);
  
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  const nextTab = () => {
    const nextIndex = Math.min(currentTabIndex + 1, tabs.length - 1);
    setActiveTab(tabs[nextIndex].id);
  };
  
  const previousTab = () => {
    const prevIndex = Math.max(currentTabIndex - 1, 0);
    setActiveTab(tabs[prevIndex].id);
  };
  
  const goToTab = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)) {
      setActiveTab(tabId);
    }
  };
  
  return {
    activeTab,
    setActiveTab,
    currentTabIndex,
    nextTab,
    previousTab,
    goToTab,
    isFirstTab: currentTabIndex === 0,
    isLastTab: currentTabIndex === tabs.length - 1
  };
};

export default TabNavigator;