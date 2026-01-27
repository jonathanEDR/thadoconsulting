/**
 * 📝 Hook especializado para el modal de cotización de servicios
 * Versión optimizada del useContactForm para evitar dependencias circulares
 */

import { useState, useCallback } from 'react';
import { submitContact } from '../services/contactApi';
import type { ContactFormData, ContactResponse } from '../services/contactApi';

export interface QuoteFormState {
  nombre: string;
  celular: string;
  correo: string;
  mensaje: string;
  categoria?: string;
  acceptTerms: boolean;
}

export interface QuoteFormErrors {
  nombre?: string;
  celular?: string;
  correo?: string;
  mensaje?: string;
  acceptTerms?: string;
  general?: string;
}

export interface UseQuoteFormReturn {
  formData: QuoteFormState;
  errors: QuoteFormErrors;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  successMessage: string;
  errorMessage: string;
  handleChange: (field: keyof QuoteFormState, value: string | boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  initializeMessage: (message: string) => void;
  isUserAuthenticated: boolean;
}

const getInitialFormState = (userEmail?: string, userName?: string): QuoteFormState => ({
  nombre: userName || '',
  celular: '',
  correo: userEmail || '',
  mensaje: '',
  categoria: '',
  acceptTerms: false,
});

/**
 * Validar email
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar teléfono (formato flexible)
 */
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 9;
};

export const useQuoteForm = (
  onSuccessCallback?: () => void,
  userEmail?: string,
  userName?: string
): UseQuoteFormReturn => {
  const isUserAuthenticated = Boolean(userEmail && userName);
  const [formData, setFormData] = useState<QuoteFormState>(
    getInitialFormState(userEmail, userName)
  );
  const [errors, setErrors] = useState<QuoteFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Validar formulario completo
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: QuoteFormErrors = {};

    // Validar nombre (solo si el usuario NO está autenticado)
    if (!isUserAuthenticated) {
      if (!formData.nombre.trim()) {
        newErrors.nombre = 'El nombre es requerido';
      } else if (formData.nombre.trim().length < 2) {
        newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
      }
    }

    // Validar celular
    if (!formData.celular.trim()) {
      newErrors.celular = 'El celular es requerido';
    } else if (!isValidPhone(formData.celular)) {
      newErrors.celular = 'Formato de celular inválido';
    }

    // Validar correo (solo si el usuario NO está autenticado)
    if (!isUserAuthenticated) {
      if (!formData.correo.trim()) {
        newErrors.correo = 'El correo es requerido';
      } else if (!isValidEmail(formData.correo)) {
        newErrors.correo = 'Formato de correo inválido';
      }
    }

    // Validar mensaje
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es requerido';
    } else if (formData.mensaje.trim().length < 10) {
      newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isUserAuthenticated]);

  /**
   * Manejar cambios en los campos
   */
  const handleChange = useCallback((field: keyof QuoteFormState, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    setErrors(prev => {
      if (prev[field as keyof QuoteFormErrors]) {
        return { ...prev, [field]: undefined };
      }
      return prev;
    });
    
    // Limpiar mensajes de estado
    setIsSuccess(false);
    setIsError(false);
  }, []);

  /**
   * Inicializar mensaje (para pre-llenado)
   */
  const initializeMessage = useCallback((message: string) => {
    setFormData(prev => {
      if (prev.mensaje === '' && message) {
        return { ...prev, mensaje: message };
      }
      return prev;
    });
  }, []);

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      setIsError(true);
      setErrorMessage('Por favor, corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setErrors({});

    try {
      // Preparar datos para envío
      const dataToSend: ContactFormData = {
        nombre: formData.nombre.trim(),
        celular: formData.celular.trim(),
        correo: formData.correo.trim(),
        mensaje: formData.mensaje.trim(),
        ...(formData.categoria && { categoria: formData.categoria })
      };

      // Enviar formulario
      const response: ContactResponse = await submitContact(dataToSend);

      if (response.success) {
        setIsSuccess(true);
        setSuccessMessage(response.message || '¡Gracias por contactarnos! Te responderemos pronto.');
        
        // Callback opcional
        if (onSuccessCallback) {
          setTimeout(() => {
            onSuccessCallback();
          }, 1500);
        }
      } else {
        setIsError(true);
        
        if (response.errors && response.errors.length > 0) {
          const backendErrors: QuoteFormErrors = {};
          response.errors.forEach(err => {
            backendErrors[err.campo as keyof QuoteFormErrors] = err.mensaje;
          });
          setErrors(backendErrors);
          setErrorMessage('Por favor, corrige los errores indicados');
        } else {
          setErrorMessage(response.message || 'Hubo un error al enviar el mensaje');
        }
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setIsError(true);
      setErrorMessage('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, onSuccessCallback]);

  /**
   * Resetear formulario
   */
  const resetForm = useCallback(() => {
    setFormData(getInitialFormState(userEmail, userName));
    setErrors({});
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setSuccessMessage('');
    setErrorMessage('');
  }, [userEmail, userName]);

  return {
    formData,
    errors,
    isLoading,
    isSuccess,
    isError,
    successMessage,
    errorMessage,
    handleChange,
    handleSubmit,
    resetForm,
    initializeMessage,
    isUserAuthenticated,
  };
};

export default useQuoteForm;