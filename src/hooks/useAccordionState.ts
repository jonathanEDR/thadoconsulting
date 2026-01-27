import { useState } from 'react';

export interface AccordionStates {
  texts: boolean;
  colors: boolean;
  fields: boolean;
  button: boolean;
  messages: boolean;
  backgroundImage: boolean;
  map: boolean;
  preview: boolean;
}

/**
 * Hook personalizado para manejar estados de acordeones con persistencia en localStorage
 */
export const useAccordionState = () => {
  const getStoredAccordionState = (key: string, defaultValue: boolean = true) => {
    try {
      const stored = localStorage.getItem(`contactFormAccordion_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const setStoredAccordionState = (key: string, value: boolean) => {
    try {
      localStorage.setItem(`contactFormAccordion_${key}`, JSON.stringify(value));
    } catch {
      // Ignorar errores de localStorage
    }
  };

  const [accordionStates, setAccordionStates] = useState<AccordionStates>({
    texts: getStoredAccordionState('texts', true),
    colors: getStoredAccordionState('colors', false),
    fields: getStoredAccordionState('fields', false),
    button: getStoredAccordionState('button', false),
    messages: getStoredAccordionState('messages', false),
    backgroundImage: getStoredAccordionState('backgroundImage', false),
    map: getStoredAccordionState('map', false),
    preview: getStoredAccordionState('preview', false)
  });

  const toggleAccordion = (section: keyof AccordionStates) => {
    setAccordionStates(prev => {
      const newValue = !prev[section];
      setStoredAccordionState(section, newValue);
      return { ...prev, [section]: newValue };
    });
  };

  const expandAll = () => {
    const allClosed = Object.values(accordionStates).every(state => !state);
    const newState = allClosed;
    
    Object.keys(accordionStates).forEach(key => {
      setStoredAccordionState(key, newState);
    });
    
    setAccordionStates(prev => 
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: newState }), {} as AccordionStates)
    );
  };

  const collapseAll = () => {
    Object.keys(accordionStates).forEach(key => {
      setStoredAccordionState(key, false);
    });
    
    setAccordionStates(prev => 
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {} as AccordionStates)
    );
  };

  return {
    accordionStates,
    toggleAccordion,
    expandAll,
    collapseAll
  };
};