/**
 * 📋 SectionHeader - Cabecera de sección expandible
 * Componente reutilizable para secciones colapsables en el CMS
 */

import React from 'react';

interface SectionHeaderProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  id, 
  icon, 
  title, 
  description, 
  isExpanded,
  onToggle 
}) => (
  <button
    onClick={() => onToggle(id)}
    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
  >
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div className="text-left">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
    <span className={`text-xl transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
      ▼
    </span>
  </button>
);

export default SectionHeader;
