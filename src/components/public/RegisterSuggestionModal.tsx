import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface RegisterSuggestionModalProps {
  onContinueWithout: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

/**
 * 🎉 Modal de Sugerencia de Registro
 * Muestra antes de enviar el formulario de contacto para usuarios no autenticados
 * Ofrece crear cuenta o continuar sin registro
 */
export const RegisterSuggestionModal: React.FC<RegisterSuggestionModalProps> = ({
  onContinueWithout,
  onClose,
  isLoading = false
}) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    onClose();
    navigate('/signup', { 
      state: { 
        from: 'contact-form',
        message: 'Crea tu cuenta para hacer seguimiento de tu solicitud' 
      } 
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con botón cerrar */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icono principal */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-cyan-500 text-white text-4xl mb-4 shadow-lg animate-bounce-slow">
              🎉
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ¡Un momento!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base">
              ¿Te gustaría crear una cuenta?
            </p>
          </div>
        </div>

        {/* Contenido - Beneficios */}
        <div className="px-6 pb-6">
          <div className="space-y-3 mb-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 text-sm font-bold">
                ✓
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="font-semibold">Seguimiento en tiempo real</strong> de tu solicitud
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 text-sm font-bold">
                ✓
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="font-semibold">Mensajes directos</strong> de nuestro equipo
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 text-sm font-bold">
                ✓
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="font-semibold">Historial completo</strong> de tus proyectos
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 text-sm font-bold">
                ✓
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="font-semibold">Acceso prioritario</strong> a actualizaciones
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            {/* Botón principal: Crear cuenta */}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-600 hover:from-purple-700 hover:via-purple-800 hover:to-cyan-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <span className="text-xl">🚀</span>
              <span>Crear cuenta gratis</span>
            </button>

            {/* Botón secundario: Continuar sin registro */}
            <button
              onClick={onContinueWithout}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-medium text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Enviando...
                </span>
              ) : (
                'Continuar sin registro'
              )}
            </button>

            {/* Botón terciario: Cancelar */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>

          {/* Nota adicional */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            Solo te tomará <strong>30 segundos</strong> crear tu cuenta 💜
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RegisterSuggestionModal;
