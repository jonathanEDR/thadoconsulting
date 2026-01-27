import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAccordionState } from '../../hooks/useAccordionState';
import type { ContactFormEditorProps } from './types/ContactFormTypes';

// Componentes de secciones
import TextsSection from './sections/TextsSection';
import ColorsSection from './sections/ColorsSection';
import FieldsSection from './sections/FieldsSection';
import ButtonSection from './sections/ButtonSection';
import MessagesSection from './sections/MessagesSection';
import BackgroundImageSection from './sections/BackgroundImageSection';
import MapSection from './sections/MapSection';
import PreviewSection from './sections/PreviewSection';

const ContactFormEditor: React.FC<ContactFormEditorProps> = ({
  pageData,
  updateContent
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const contactForm = pageData.content.contactForm;
  
  const { accordionStates, toggleAccordion, expandAll, collapseAll } = useAccordionState();

  React.useEffect(() => {
    if (contactForm && !contactForm.styles) {
      updateContent('contactForm.styles.light.titleColor', '#1f2937');
    }
  }, [contactForm, updateContent]);

  if (!contactForm) {
    return (
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
        <div className="text-center text-gray-500 dark:text-gray-400">
          No se encontró configuración del formulario de contacto
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center">
           Editor del Formulario de Contacto
        </h2>
        
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            {Object.values(accordionStates).filter(Boolean).length}/{Object.keys(accordionStates).length} abiertas
          </div>
          <div className="flex gap-1">
            <button onClick={expandAll} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50">
              ↗️ Todo
            </button>
            <button onClick={collapseAll} className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50">
              ↙️ Nada
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <TextsSection
          contactForm={contactForm}
          updateContent={updateContent}
          isDark={isDark}
          isOpen={accordionStates.texts}
          onToggle={() => toggleAccordion('texts')}
        />

        <ColorsSection
          contactForm={contactForm}
          updateContent={updateContent}
          isDark={isDark}
          isOpen={accordionStates.colors}
          onToggle={() => toggleAccordion('colors')}
        />

        <FieldsSection
          contactForm={contactForm}
          updateContent={updateContent}
          isDark={isDark}
          isOpen={accordionStates.fields}
          onToggle={() => toggleAccordion('fields')}
        />

        <ButtonSection
          contactForm={contactForm}
          updateContent={updateContent}
          isDark={isDark}
          isOpen={accordionStates.button}
          onToggle={() => toggleAccordion('button')}
        />

        <MessagesSection
          contactForm={contactForm}
          updateContent={updateContent}
          isDark={isDark}
          isOpen={accordionStates.messages}
          onToggle={() => toggleAccordion('messages')}
        />

        <BackgroundImageSection
          contactForm={contactForm}
          updateContent={updateContent}
          isDark={isDark}
          isOpen={accordionStates.backgroundImage}
          onToggle={() => toggleAccordion('backgroundImage')}
        />

        <MapSection
          contactForm={contactForm}
          updateContent={updateContent}
          isDark={isDark}
          isOpen={accordionStates.map}
          onToggle={() => toggleAccordion('map')}
        />

        <PreviewSection
          contactForm={contactForm}
          updateContent={updateContent}
          isDark={isDark}
          isOpen={accordionStates.preview}
          onToggle={() => toggleAccordion('preview')}
        />
      </div>
    </div>
  );
};

export default ContactFormEditor;
