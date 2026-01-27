/**
 * FloatingChatButton Component
 * Botón flotante animado para abrir el chat
 * 
 * Features:
 * - 🎯 Icono animado con efecto bounce continuo
 * - 🎭 Animación espectacular de giro 360° + salto al hover
 * - 💎 Efecto de brillo pulsante suave
 * - 📱 Badge de notificaciones
 * - 💬 Tooltip informativo
 * - 🎨 Soporte para imágenes personalizadas sin fondo
 * - 🔄 Adaptación automática: círculo para íconos por defecto, transparente para imágenes personalizadas
 * - ✨ Múltiples capas de efectos visuales y animaciones
 */

import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import type { ChatbotConfig } from '../../types/cms';

interface FloatingChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
  config: ChatbotConfig;
  className?: string;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  isOpen,
  onClick,
  unreadCount = 0,
  config,
  className = ''
}) => {
  const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark'>('light');
  const [isHovered, setIsHovered] = React.useState(false);

  // Detectar tema actual
  React.useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setCurrentTheme(isDark ? 'dark' : 'light');
    };

    updateTheme();
    
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Agregar estilos de animación al documento - agregando spin-jump
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes chatBounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0) scale(1);
        }
        40% {
          transform: translateY(-10px) scale(1.03);
        }
        60% {
          transform: translateY(-5px) scale(1.01);
        }
      }

      @keyframes softPulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.08);
        }
        100% {
          transform: scale(1);
        }
      }

      @keyframes glowPulse {
        0%, 100% {
          box-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.6);
          transform: scale(1.02);
        }
      }

      .chat-bounce {
        animation: chatBounce 2.5s ease-in-out infinite;
      }

      .chat-soft-pulse {
        animation: softPulse 0.6s ease-in-out;
      }

      .chat-glow-pulse {
        animation: glowPulse 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Calcular tamaño según configuración
  const sizeMap = {
    small: 'w-12 h-12',
    medium: 'w-14 h-14',
    large: 'w-16 h-16'
  };
  
  const size = sizeMap[config.buttonStyles.size];
  
  // Calcular forma según configuración
  const shapeMap = {
    circle: 'rounded-full',
    rounded: 'rounded-xl',
    square: 'rounded-lg'
  };
  
  const shape = shapeMap[config.buttonStyles.shape];

  // Calcular tamaño del icono
  const iconSizeMap = {
    small: 20,
    medium: 24,
    large: 28
  };
  
  const iconSize = iconSizeMap[config.buttonStyles.size];

  // Helper function para corregir URLs de SVG sin extensión
  const getCorrectImageUrl = (url: string) => {
    if (!url) return url;
    // Si es una URL de Cloudinary de tipo 'raw' sin extensión, probablemente sea SVG
    const pathPart = url.split('/').pop();
    if (url.includes('/raw/upload/') && pathPart && !pathPart.includes('.') && pathPart.length > 10) {
      return `${url}.svg`;
    }
    return url;
  };

  // Obtener icono personalizado según tema
  const customIcon = config.buttonStyles.icon?.[currentTheme];
  const correctedIconUrl = customIcon ? getCorrectImageUrl(customIcon) : undefined;

  // Determinar si tenemos imagen personalizada
  const hasCustomIcon = Boolean(correctedIconUrl);

  // Calcular clases de animación - diferente según tipo de icono
  const getAnimationClass = () => {
    if (isOpen) return '';
    
    if (isHovered) {
      return 'chat-soft-pulse';
    }
    
    // Animación en reposo según tipo de icono
    if (hasCustomIcon) {
      return 'chat-bounce'; // Iconos personalizados: solo rebote básico
    } else {
      return 'chat-glow-pulse'; // Iconos por defecto: pulso con brillo
    }
  };

  const animationClass = getAnimationClass();

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed z-50
        ${hasCustomIcon ? '' : `${size} ${shape} flex items-center justify-center`}
        ${hasCustomIcon ? '' : 'text-white shadow-lg'}
        ${hasCustomIcon ? '' : 'group'}
        focus:outline-none
        ${animationClass}
        ${className}
        
        /* Responsive - Más grande en móvil para mejor touch target */
        ${!hasCustomIcon ? 'sm:w-14 sm:h-14 w-16 h-16' : ''}
      `}
      style={{
        bottom: config.buttonStyles.position.bottom,
        right: config.buttonStyles.position.right,
        ...(hasCustomIcon ? { 
          background: 'none',
          border: 'none',
          padding: '0',
          margin: '0',
          width: 'auto',
          height: 'auto',
          minWidth: 'auto',
          minHeight: 'auto',
          maxWidth: 'none',
          maxHeight: 'none',
          overflow: 'visible'
        } : {
          background: `linear-gradient(to bottom right, ${config.buttonStyles.gradient.from}, ${config.buttonStyles.gradient.to})`
        })
      }}
      aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
    >
      {/* Contenido del botón - sin contenedor para iconos personalizados */}
      {hasCustomIcon ? (
        // Icono personalizado renderizado DIRECTAMENTE - sin divs contenedores
        <>
          {isOpen ? (
            // Estado cerrar para iconos personalizados
            <div className="relative">
              <img 
                src={correctedIconUrl} 
                alt="Chat assistant"
                className={`
                  transform transition-all duration-300 opacity-50
                  ${config.buttonStyles.size === 'small' ? 'w-12 h-12' : ''}
                  ${config.buttonStyles.size === 'medium' ? 'w-16 h-16' : ''}
                  ${config.buttonStyles.size === 'large' ? 'w-20 h-20' : ''}
                  filter drop-shadow-lg grayscale
                `}
                style={{ 
                  objectFit: 'contain',
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-500/90 rounded-full p-2 backdrop-blur-sm">
                  <X 
                    size={iconSize * 0.7} 
                    className="text-white transform transition-transform duration-300 group-hover:rotate-90" 
                  />
                </div>
              </div>
            </div>
          ) : (
            // Estado normal para iconos personalizados - IMAGEN DIRECTA
            <>
              <img 
                src={correctedIconUrl} 
                alt="Chat assistant"
                className={`
                  transform transition-all duration-300 
                  ${config.buttonStyles.size === 'small' ? 'w-12 h-12' : ''}
                  ${config.buttonStyles.size === 'medium' ? 'w-16 h-16' : ''}
                  ${config.buttonStyles.size === 'large' ? 'w-20 h-20' : ''}
                  filter drop-shadow-lg
                `}
                style={{ 
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              {/* Badge de notificaciones para iconos personalizados */}
              {config.behavior.showUnreadBadge && unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce z-10">
                  <span className="text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        // Para iconos por defecto - con contenedor div
        <div className="relative">
          {isOpen ? (
            // Botón de cerrar para iconos por defecto
            <div className={`${size} ${shape} bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center`}>
              <X 
                size={iconSize} 
                className="transform transition-transform duration-300 group-hover:rotate-90" 
              />
            </div>
          ) : (
            // Icono por defecto con fondo circular
            <div className={`${size} ${shape} bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center`}>
              <MessageCircle 
                size={iconSize} 
                className="transform transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
          )}

          {/* Badge de notificaciones para iconos por defecto */}
          {config.behavior.showUnreadBadge && !isOpen && unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce z-10">
              <span className="text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tooltip mejorado - para ambos tipos de iconos */}
      {!isOpen && (
        <div className={`absolute right-16 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap transition-opacity pointer-events-none z-20 ${
          hasCustomIcon 
            ? (isHovered ? 'opacity-100' : 'opacity-0')
            : 'opacity-0 group-hover:opacity-100'
        }`}>
          💬 {config.botName}
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}

      {/* Efectos hover SOLO para iconos por defecto */}
      {!hasCustomIcon && (
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"></div>
      )}
    </button>
  );
};

export default FloatingChatButton;
