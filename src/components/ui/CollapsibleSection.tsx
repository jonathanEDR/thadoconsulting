import React from 'react';

export interface CollapsibleSectionProps {
  title: string;
  icon: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
}

/**
 * Componente de sección colapsable reutilizable con animaciones
 */
const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon, 
  isOpen, 
  onToggle, 
  children, 
  badge
}) => (
  <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className={`w-full px-3 py-2 text-left transition-all duration-200 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
        isOpen 
          ? 'bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600' 
          : 'bg-white dark:bg-gray-800/50'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{title}</span>
        {badge && (
          <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
    
    <div className={`transition-all duration-300 ease-in-out ${
      isOpen 
        ? 'max-h-[2000px] opacity-100' 
        : 'max-h-0 opacity-0 overflow-hidden'
    }`}>
      <div className="p-3 bg-white dark:bg-gray-800/30">
        {children}
      </div>
    </div>
  </div>
);

export default CollapsibleSection;