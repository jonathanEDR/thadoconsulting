import DOMPurify from 'dompurify';
import type { CardDesignStyles } from '../../../types/cms';
import type { ValueAddedData, ValueAddedItem } from './types';
import { DEFAULT_LIGHT_CARD_STYLES, DEFAULT_DARK_CARD_STYLES } from './constants';

/**
 * Limpia HTML del RichTextEditor y extrae solo texto
 */
export const cleanHtmlToText = (htmlString: string): string => {
  if (!htmlString) return '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = DOMPurify.sanitize(htmlString);
  return tempDiv.textContent || tempDiv.innerText || '';
};

/**
 * Obtiene estilos CSS robustos evitando valores undefined/null
 */
export const getSafeStyle = (value: string | undefined, fallback: string): string => {
  return value && value !== 'undefined' && value !== 'null' ? value : fallback;
};

/**
 * Detecta si un string es una URL de imagen
 */
export const isImageUrl = (str: string): boolean => {
  return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/');
};

/**
 * Obtiene el icono correcto según el tema activo
 */
export const getCurrentIcon = (
  valueItem: ValueAddedItem,
  theme: 'light' | 'dark'
): { type: 'image' | 'none'; value: string | null } => {
  if (theme === 'light' && valueItem.iconLight && isImageUrl(valueItem.iconLight)) {
    return { type: 'image', value: valueItem.iconLight };
  }
  if (theme === 'dark' && valueItem.iconDark && isImageUrl(valueItem.iconDark)) {
    return { type: 'image', value: valueItem.iconDark };
  }

  // Fallback al icono del otro tema si existe
  if (theme === 'light' && valueItem.iconDark && isImageUrl(valueItem.iconDark)) {
    return { type: 'image', value: valueItem.iconDark };
  }
  if (theme === 'dark' && valueItem.iconLight && isImageUrl(valueItem.iconLight)) {
    return { type: 'image', value: valueItem.iconLight };
  }

  return { type: 'none', value: null };
};

/**
 * Obtiene estilos de tarjeta según tema
 */
export const getCardStyles = (
  cardsDesign: ValueAddedData['cardsDesign'],
  theme: 'light' | 'dark'
): CardDesignStyles => {
  if (cardsDesign && cardsDesign[theme]) {
    const styles = cardsDesign[theme];
    
    if (styles.background === 'transparent') {
      styles.background = 'transparent';
    }
    
    return styles;
  }
  
  return theme === 'light' ? DEFAULT_LIGHT_CARD_STYLES : DEFAULT_DARK_CARD_STYLES;
};

/**
 * Mapea datos del CMS a estructura esperada
 */
export const getMappedValueAddedData = (data: ValueAddedData): ValueAddedData => {
  if (data.items) {
    return {
      ...data,
      subtitle: data.description || data.subtitle || '',
      cards: data.items.map((item, index) => ({
        id: item.id || item._id?.toString() || index.toString(),
        title: item.title,
        description: item.description,
        iconLight: item.iconLight,
        iconDark: item.iconDark,
        gradient: item.gradient || 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
        buttonText: item.buttonText,  // Texto personalizado del botón
        buttonUrl: item.buttonUrl,    // URL de destino del botón
        styles: item.styles,
        _id: item._id
      })),
      logos: data.logos || []
    };
  }

  return {
    ...data,
    subtitle: data.subtitle || '',
    cards: data.cards || [],
    logos: data.logos || []
  };
};

/**
 * Obtiene clases de alineación de tarjetas
 */
export const getCardsAlignmentClasses = (alignment: string = 'center'): string => {
  switch (alignment) {
    case 'center':
      return 'justify-center';
    case 'right':
      return 'justify-end';
    case 'left':
    default:
      return 'justify-start';
  }
};
