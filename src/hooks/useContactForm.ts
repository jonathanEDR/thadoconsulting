import { useState } from 'react';
import { submitContact } from '../services/contactApi';
import type { ContactFormData, ContactResponse } from '../services/contactApi';

/**
 * 📝 Hook personalizado para gestionar el formulario de contacto
 * Maneja validación, envío, estados de loading/success/error
 */

export interface ContactFormState extends ContactFormData {
  acceptTerms: boolean;
}

export interface ContactFormErrors {
  nombre?: string;
  celular?: string;
  correo?: string;
  mensaje?: string;
  acceptTerms?: string;
  general?: string;
}

export interface UseContactFormReturn {
  formData: ContactFormState;
  errors: ContactFormErrors;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  successMessage: string;
  errorMessage: string;
  handleChange: (field: keyof ContactFormState, value: string | boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  isUserAuthenticated: boolean;
}

const getInitialFormState = (userEmail?: string, userName?: string): ContactFormState => ({
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

/**
 * Hook principal
 */
export const useContactForm = (
  onSuccessCallback?: () => void,
  userEmail?: string,
  userName?: string
): UseContactFormReturn => {
  const isUserAuthenticated = Boolean(userEmail && userName);
  const [formData, setFormData] = useState<ContactFormState>(
    getInitialFormState(userEmail, userName)
  );
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Validar formulario completo
   */
  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};

    // Validar nombre (solo si el usuario NO está autenticado)
    if (!isUserAuthenticated) {
      if (!formData.nombre.trim()) {
        newErrors.nombre = 'El nombre es requerido';
      } else if (formData.nombre.trim().length < 2) {
        newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
      } else if (formData.nombre.trim().length > 100) {
        newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
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
    } else if (formData.mensaje.trim().length > 2000) {
      newErrors.mensaje = 'El mensaje no puede exceder 2000 caracteres';
    }

    // Validar términos
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manejar cambios en los campos
   */
  const handleChange = (field: keyof ContactFormState, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof ContactFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Limpiar mensajes de estado
    if (isSuccess) setIsSuccess(false);
    if (isError) setIsError(false);
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
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
      // Preparar datos para envío (sin acceptTerms)
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
        // Éxito
        setIsSuccess(true);
        setSuccessMessage(response.message || '¡Gracias por contactarnos! Te responderemos pronto.');
        
        // Resetear formulario después de 3 segundos
        setTimeout(() => {
          resetForm();
        }, 3000);

        // Callback opcional
        if (onSuccessCallback) {
          onSuccessCallback();
        }
      } else {
        // Error del servidor
        setIsError(true);
        
        // Si hay errores de validación del backend, mostrarlos
        if (response.errors && response.errors.length > 0) {
          const backendErrors: ContactFormErrors = {};
          response.errors.forEach(err => {
            backendErrors[err.campo as keyof ContactFormErrors] = err.mensaje;
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
  };

  /**
   * Resetear formulario
   */
  const resetForm = () => {
    setFormData(getInitialFormState(userEmail, userName));
    setErrors({});
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

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
    isUserAuthenticated,
  };
};

export default useContactForm;
