/**
 * Default Chatbot Configuration
 * Valores por defecto para la configuración del chatbot
 */

import type { ChatbotConfig } from '../types/cms';

export const defaultChatbotConfig: ChatbotConfig = {
  botName: 'Asesor Contable THADO',
  statusText: 'En línea • Respuesta inmediata',
  logo: {
    light: '',
    dark: ''
  },
  logoAlt: 'Asesor Contable THADO',
  welcomeMessage: {
    title: '¡Hola! Soy tu Asesor Contable 📊',
    description: 'Estoy aquí para ayudarte con consultas sobre contabilidad, tributación, SUNAT y gestión empresarial.'
  },
  suggestedQuestions: [
    {
      icon: '📊',
      text: '¿Qué servicios contables ofrecen?',
      message: '¿Qué servicios contables ofrecen?'
    },
    {
      icon: '💰',
      text: 'Consulta sobre SUNAT',
      message: 'Tengo dudas sobre mis obligaciones con SUNAT'
    },
    {
      icon: '📋',
      text: 'Cotizar servicios',
      message: 'Quiero cotizar servicios contables para mi empresa'
    },
    {
      icon: '📞',
      text: 'Agendar consultoría',
      message: '¿Cómo puedo agendar una consultoría gratuita?'
    }
  ],
  headerStyles: {
    light: {
      background: 'linear-gradient(to right, #EFF6FF, #F5F3FF)',
      titleColor: '#111827',
      subtitleColor: '#626871',
      logoBackground: 'linear-gradient(to bottom right, #2554a3, #3462af)'
    },
    dark: {
      background: 'linear-gradient(to right, #1F2937, #1F2937)',
      titleColor: '#FFFFFF',
      subtitleColor: '#9CA3AF',
      logoBackground: 'linear-gradient(to bottom right, #2554a3, #3462af)'
    }
  },
  buttonStyles: {
    size: 'medium',
    position: {
      bottom: '24px',
      right: '24px'
    },
    gradient: {
      from: '#2554a3',
      to: '#3462af'
    },
    shape: 'circle',
    icon: {
      light: '',
      dark: ''
    }
  },
  behavior: {
    autoOpen: false,
    autoOpenDelay: 5000,
    showUnreadBadge: true,
    showPoweredBy: true
  },
  enabled: true
};
