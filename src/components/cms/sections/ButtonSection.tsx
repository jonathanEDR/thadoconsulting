import React from 'react';
import CollapsibleSection from '../../ui/CollapsibleSection';
import type { ContactFormSectionProps } from '../types/ContactFormTypes';

interface ButtonSectionProps extends ContactFormSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Sección de configuración del botón del formulario
 */
const ButtonSection: React.FC<ButtonSectionProps> = ({
  contactForm,
  updateContent,
  isOpen,
  onToggle
}) => {
  return (
    <CollapsibleSection
      title="Configuración del Botón"
      icon="🔘"
      isOpen={isOpen}
      onToggle={onToggle}
      badge="Botón"
    >
      
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
              Texto del botón
            </label>
            <input
              type="text"
              value={contactForm.button?.text || ''}
              onChange={(e) => updateContent('contactForm.button.text', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              placeholder="ENVIAR"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
              Texto mientras envía
            </label>
            <input
              type="text"
              value={contactForm.button?.loadingText || ''}
              onChange={(e) => updateContent('contactForm.button.loadingText', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              placeholder="Enviando..."
            />
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default ButtonSection;