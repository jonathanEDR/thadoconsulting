import React from 'react';
import CollapsibleSection from '../../ui/CollapsibleSection';
import type { ContactFormSectionProps } from '../types/ContactFormTypes';

interface MessagesSectionProps extends ContactFormSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Sección de configuración de mensajes de respuesta del formulario
 */
const MessagesSection: React.FC<MessagesSectionProps> = ({
  contactForm,
  updateContent,
  isOpen,
  onToggle
}) => {
  return (
    <CollapsibleSection
      title="Mensajes de Respuesta"
      icon="💬"
      isOpen={isOpen}
      onToggle={onToggle}
      badge="Mensajes"
    >
      
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Mensaje de éxito
          </label>
          <textarea
            value={contactForm.messages?.success || ''}
            onChange={(e) => updateContent('contactForm.messages.success', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
            placeholder="¡Gracias por contactarnos! Te responderemos pronto."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Mensaje de error
          </label>
          <textarea
            value={contactForm.messages?.error || ''}
            onChange={(e) => updateContent('contactForm.messages.error', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
            placeholder="Hubo un error al enviar el mensaje. Por favor, intenta nuevamente."
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default MessagesSection;