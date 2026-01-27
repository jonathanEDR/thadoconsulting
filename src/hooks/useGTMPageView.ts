/**
 * Hook para trackear Page Views en Google Tag Manager
 * 
 * En una SPA, GTM solo detecta la carga inicial.
 * Este hook envía eventos de page_view cuando cambia la ruta.
 * 
 * @example
 * // En App.tsx o Layout principal:
 * useGTMPageView();
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Tipado para dataLayer de GTM
declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

/**
 * Envía un evento de page_view a GTM cuando cambia la ruta
 */
export function useGTMPageView() {
  const location = useLocation();

  useEffect(() => {
    // Asegurar que dataLayer existe
    window.dataLayer = window.dataLayer || [];

    // Enviar evento de page_view a GTM
    window.dataLayer.push({
      event: 'page_view',
      page_path: location.pathname + location.search,
      page_title: document.title,
      page_location: window.location.href,
    });

    // Debug en desarrollo
    if (import.meta.env.DEV) {
      console.log('📊 GTM Page View:', {
        path: location.pathname,
        title: document.title,
      });
    }
  }, [location.pathname, location.search]);
}

/**
 * Envía un evento personalizado a GTM
 * 
 * @example
 * // Trackear clic en CTA
 * pushGTMEvent('cta_click', { button_name: 'Solicitar Cotización' });
 * 
 * // Trackear formulario enviado
 * pushGTMEvent('form_submit', { form_name: 'contact', success: true });
 */
export function pushGTMEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  window.dataLayer = window.dataLayer || [];
  
  window.dataLayer.push({
    event: eventName,
    ...eventParams,
  });

  // Debug en desarrollo
  if (import.meta.env.DEV) {
    console.log('📊 GTM Event:', eventName, eventParams);
  }
}

/**
 * Eventos predefinidos para acciones comunes
 */
export const GTMEvents = {
  // Conversiones
  contactFormSubmit: (formData?: Record<string, unknown>) =>
    pushGTMEvent('contact_form_submit', formData),
  
  quotationRequest: (serviceName: string) =>
    pushGTMEvent('quotation_request', { service_name: serviceName }),
  
  // Engagement
  ctaClick: (buttonName: string, location: string) =>
    pushGTMEvent('cta_click', { button_name: buttonName, location }),
  
  serviceView: (serviceName: string, categoryName: string) =>
    pushGTMEvent('service_view', { 
      service_name: serviceName, 
      category_name: categoryName 
    }),
  
  blogPostView: (postTitle: string, postCategory: string) =>
    pushGTMEvent('blog_post_view', { 
      post_title: postTitle, 
      post_category: postCategory 
    }),
  
  // Chat
  chatOpen: () => pushGTMEvent('chat_open'),
  chatMessage: (messageType: 'user' | 'bot') =>
    pushGTMEvent('chat_message', { message_type: messageType }),
  
  // Scroll
  scrollDepth: (percentage: number) =>
    pushGTMEvent('scroll_depth', { depth_percentage: percentage }),
};

export default useGTMPageView;
