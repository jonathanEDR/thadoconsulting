import React from 'react';
import CollapsibleSection from '../../ui/CollapsibleSection';
import type { ContactFormSectionProps } from '../types/ContactFormTypes';

interface TextsSectionProps extends ContactFormSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Utilidad para limpiar HTML de texto
 */
const stripHtml = (html: string): string => {
  if (!html) return '';
  // Remover etiquetas HTML
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Sección de configuración de textos principales del formulario
 */
const TextsSection: React.FC<TextsSectionProps> = ({
  contactForm,
  updateContent,
  isOpen,
  onToggle
}) => {
  // Limpiar valores si contienen HTML
  React.useEffect(() => {
    if (contactForm.title && contactForm.title.includes('<')) {
      updateContent('contactForm.title', stripHtml(contactForm.title));
    }
    if (contactForm.subtitle && contactForm.subtitle.includes('<')) {
      updateContent('contactForm.subtitle', stripHtml(contactForm.subtitle));
    }
    if (contactForm.description && contactForm.description.includes('<')) {
      updateContent('contactForm.description', stripHtml(contactForm.description));
    }
  }, []);

  return (
    <CollapsibleSection
      title="Textos Principales"
      icon="📋"
      isOpen={isOpen}
      onToggle={onToggle}
      badge="Básico"
    >
      <div className="space-y-4">
        {/* Layout compacto con grid para pantallas grandes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Título Principal */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <label className="block font-medium text-gray-800 dark:text-gray-100 mb-2 text-sm">
              ✏️ Título Principal
            </label>
            <input
              type="text"
              value={stripHtml(contactForm.title || '')}
              onChange={(e) => updateContent('contactForm.title', e.target.value)}
              placeholder="Contáctanos"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          {/* Subtítulo */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <label className="block font-medium text-gray-800 dark:text-gray-100 mb-2 text-sm">
              🏷️ Subtítulo
            </label>
            <input
              type="text"
              value={stripHtml(contactForm.subtitle || '')}
              onChange={(e) => updateContent('contactForm.subtitle', e.target.value)}
              placeholder="Estamos aquí para ayudarte"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        
        {/* Descripción - textarea para texto más largo */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <label className="block font-medium text-gray-800 dark:text-gray-100 mb-2 text-sm">
            📝 Descripción
          </label>
          <textarea
            value={stripHtml(contactForm.description || '')}
            onChange={(e) => updateContent('contactForm.description', e.target.value)}
            placeholder="¿Tienes un proyecto en mente? Cuéntanos sobre él y te responderemos pronto."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default TextsSection;