import React from 'react';

interface WelcomeNotificationProps {
  onboarding: {
    leadCreated: boolean;
    messagesSent: number;
    leadId: string;
    leadName: string;
  };
  onClose: () => void;
}

/**
 * 🎉 Notificación de bienvenida para nuevos clientes
 * Se muestra cuando se completa el onboarding automático
 */
export const WelcomeNotification: React.FC<WelcomeNotificationProps> = ({
  onboarding,
  onClose
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top-2 slide-in-from-right-2">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 text-white">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <span className="text-2xl">🎉</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">¡Bienvenido a THADO!</h3>
                <p className="text-blue-100 text-sm">Tu cuenta ha sido configurada</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="space-y-3">
            <p className="text-blue-50">
              ¡Hemos configurado tu cuenta automáticamente! Ya puedes acceder a todas nuestras funcionalidades.
            </p>
            
            {/* Stats */}
            <div className="bg-white/10 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-100">Solicitud creada:</span>
                <span className="text-white font-semibold">
                  {onboarding.leadCreated ? '✅ Sí' : '❌ No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-100">Mensajes de bienvenida:</span>
                <span className="text-white font-semibold">
                  {onboarding.messagesSent} 💬
                </span>
              </div>
              
              {onboarding.leadName && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-100">Solicitud:</span>
                  <span className="text-white font-semibold truncate ml-2">
                    {onboarding.leadName}
                  </span>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors"
              >
                Entendido
              </button>
              
              <button
                onClick={() => {
                  // Navegar a mensajes
                  window.location.href = '/dashboard/messages';
                  onClose();
                }}
                className="flex-1 bg-white text-blue-600 hover:bg-blue-50 rounded-lg py-2 px-4 text-sm font-medium transition-colors"
              >
                Ver Mensajes 💬
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative bottom bar */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"></div>
      </div>
    </div>
  );
};

export default WelcomeNotification;