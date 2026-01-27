import type { PageData } from '../../../types/cms';

/**
 * Props compartidas para todas las secciones del formulario de contacto
 */
export interface ContactFormSectionProps {
  contactForm: any;
  updateContent: (field: string, value: any) => void;
  isDark: boolean;
}

/**
 * Props para el editor principal del formulario de contacto
 */
export interface ContactFormEditorProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}