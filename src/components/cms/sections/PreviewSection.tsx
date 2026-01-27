import React from 'react';
import CollapsibleSection from '../../ui/CollapsibleSection';
import type { ContactFormSectionProps } from '../types/ContactFormTypes';

interface PreviewSectionProps extends ContactFormSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Sección de vista previa del formulario de contacto
 */
const PreviewSection: React.FC<PreviewSectionProps> = ({
  contactForm,
  isOpen,
  onToggle
}) => {
  return (
    <CollapsibleSection
      title="Vista Previa del Formulario"
      icon="👀"
      isOpen={isOpen}
      onToggle={onToggle}
      badge="Demo"
    >
      <div className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {contactForm.title || 'Título del formulario'}
            </h4>
            <h5 className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              {contactForm.subtitle || 'Subtítulo del formulario'}
            </h5>
            <p className="text-gray-600 dark:text-gray-400">
              {contactForm.description || 'Descripción del formulario'}
            </p>
          </div>
          
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {contactForm.fields?.nombreLabel || 'Nombre'} 
                {contactForm.fields?.nombreRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                disabled
                placeholder={contactForm.fields?.nombrePlaceholder || 'Placeholder del nombre'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {contactForm.fields?.celularLabel || 'Celular'}
                {contactForm.fields?.celularRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                disabled
                placeholder={contactForm.fields?.celularPlaceholder || 'Placeholder del celular'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {contactForm.fields?.correoLabel || 'Correo'}
                {contactForm.fields?.correoRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                type="email"
                disabled
                placeholder={contactForm.fields?.correoPlaceholder || 'Placeholder del correo'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {contactForm.fields?.mensajeLabel || 'Mensaje'}
                {contactForm.fields?.mensajeRequired && <span className="text-red-500">*</span>}
              </label>
              <textarea
                disabled
                rows={contactForm.fields?.mensajeRows || 5}
                placeholder={contactForm.fields?.mensajePlaceholder || 'Placeholder del mensaje'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 resize-none"
              />
            </div>
            
            {contactForm.fields?.termsRequired && (
              <div>
                <label className="flex items-start text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    disabled
                    className="mr-2 h-4 w-4 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span>
                    {contactForm.fields?.termsText || 'Acepto los términos y condiciones'}
                  </span>
                </label>
              </div>
            )}
            
            <button
              disabled
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors cursor-not-allowed opacity-75"
            >
              {contactForm.button?.text || 'Texto del botón'}
            </button>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default PreviewSection;