import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/SimpleGoogleMap.css';

interface SimpleGoogleMapProps {
  googleMapsUrl?: string;
  height?: string;
  width?: string;  // 🆕 NUEVO - Ancho personalizado
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'custom'; // 🆕 NUEVO - Proporción
  alignment?: 'left' | 'center' | 'right' | 'full'; // 🆕 NUEVO - Alineación
  containerSize?: 'small' | 'medium' | 'large' | 'xl'; // 🆕 NUEVO - Tamaño predefinido
  borderRadius?: string;
  companyName?: string;
  address?: string;
  customLogo?: string; // 🆕 NUEVO - URL del logo personalizado
  logoSize?: 'small' | 'medium' | 'large'; // 🆕 NUEVO - Tamaño del logo

  shadow?: 'none' | 'small' | 'medium' | 'large'; // 🆕 NUEVO - Sombra
  markerBackground?: string; // 🆕 NUEVO - Color de fondo del marcador
  markerBorderColor?: string; // 🆕 NUEVO - Color del borde del marcador
  markerBorderWidth?: string; // 🆕 NUEVO - Grosor del borde del marcador
  markerStyle?: 'solid' | 'gradient' | 'custom'; // 🆕 NUEVO - Estilo del fondo
  pulseIntensity?: 'none' | 'low' | 'medium' | 'high' | 'extreme'; // 🆕 NUEVO - Intensidad del pulso
  pulseSpeed?: 'slow' | 'normal' | 'fast' | 'ultra'; // 🆕 NUEVO - Velocidad del pulso
  hoverEffect?: 'none' | 'glow' | 'thunder' | 'rainbow' | 'shake'; // 🆕 NUEVO - Efecto al hacer hover
  animationEnabled?: boolean; // 🆕 NUEVO - Habilitar/deshabilitar animaciones
}

const SimpleGoogleMap = ({
  googleMapsUrl = '',
  height = '400px',
  width,  // 🆕 NUEVO - Ancho personalizado
  aspectRatio = 'landscape', // 🆕 NUEVO - Proporción por defecto
  alignment = 'center', // 🆕 NUEVO - Alineación por defecto
  containerSize = 'medium', // 🆕 NUEVO - Tamaño predefinido por defecto
  borderRadius = '1rem',
  companyName = 'Nuestra Ubicación',
  address = '',
  customLogo, // 🆕 NUEVO - Logo personalizado
  logoSize = 'medium', // 🆕 NUEVO - Tamaño del logo por defecto

  shadow = 'medium', // 🆕 NUEVO - Sombra por defecto
  markerBackground = '#8B5CF6', // 🆕 NUEVO - Color de fondo por defecto
  markerBorderColor = '#ffffff', // 🆕 NUEVO - Color del borde por defecto
  markerBorderWidth = '4px', // 🆕 NUEVO - Grosor del borde por defecto
  markerStyle = 'gradient', // 🆕 NUEVO - Estilo por defecto
  pulseIntensity = 'medium', // 🆕 NUEVO - Intensidad del pulso por defecto
  pulseSpeed = 'normal', // 🆕 NUEVO - Velocidad del pulso por defecto
  hoverEffect = 'glow', // 🆕 NUEVO - Efecto hover por defecto
  animationEnabled = true // 🆕 NUEVO - Animaciones habilitadas por defecto
}: SimpleGoogleMapProps) => {
  const { theme } = useTheme();

  // 🆕 NUEVO: Función para obtener dimensiones basadas en el tamaño del contenedor
  const getContainerDimensions = () => {
    const sizes = {
      small: { width: '300px', height: '200px' },
      medium: { width: '400px', height: '300px' },
      large: { width: '500px', height: '400px' },
      xl: { width: '600px', height: '500px' }
    };
    
    const defaultSize = sizes[containerSize] || sizes.medium;
    
    return {
      width: width || defaultSize.width,
      height: height || defaultSize.height
    };
  };

  // 🆕 NUEVO: Función para obtener clases de alineación
  const getAlignmentClasses = () => {
    const alignmentMap = {
      left: 'ml-0 mr-auto',
      center: 'mx-auto',
      right: 'ml-auto mr-0',
      full: 'w-full'
    };
    return alignmentMap[alignment] || alignmentMap.center;
  };

  // 🆕 NUEVO: Función para obtener clases de aspect ratio
  const getAspectRatioClasses = () => {
    const ratioMap = {
      square: 'aspect-square',
      landscape: 'aspect-video',
      portrait: 'aspect-[9/16]',
      custom: ''
    };
    return ratioMap[aspectRatio] || '';
  };

  // 🆕 NUEVO: Función para obtener clases de sombra
  const getShadowClasses = () => {
    const shadowMap = {
      none: '',
      small: 'shadow-sm',
      medium: 'shadow-lg',
      large: 'shadow-2xl'
    };
    return shadowMap[shadow] || shadowMap.medium;
  };

  // 🆕 NUEVO: Función para obtener tamaño del logo
  const getLogoSize = () => {
    const logoSizes = {
      small: { width: '24px', height: '24px' },
      medium: { width: '32px', height: '32px' },
      large: { width: '48px', height: '48px' }
    };
    return logoSizes[logoSize] || logoSizes.medium;
  };

  // 🆕 NUEVO: Función para obtener el estilo del fondo del marcador
  const getMarkerBackgroundStyle = () => {
    const baseColor = markerBackground || '#8B5CF6';
    
    switch (markerStyle) {
      case 'solid':
        return {
          background: baseColor
        };
      case 'gradient':
        // Generar gradiente automático basado en el color base
        const lightColor = adjustColorBrightness(baseColor, 20);
        const darkColor = adjustColorBrightness(baseColor, -20);
        return {
          background: `linear-gradient(135deg, ${lightColor} 0%, ${darkColor} 100%)`
        };
      case 'custom':
        // Permitir gradientes personalizados
        return {
          background: baseColor.includes('gradient') ? baseColor : `linear-gradient(135deg, ${baseColor} 0%, #7C3AED 100%)`
        };
      default:
        return {
          background: `linear-gradient(135deg, ${baseColor} 0%, #7C3AED 100%)`
        };
    }
  };

  // 🆕 NUEVO: Función helper para ajustar el brillo de un color
  const adjustColorBrightness = (color: string, percent: number) => {
    // Si es un color hex
    if (color.startsWith('#')) {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    // Si no es hex, devolver el color original
    return color;
  };

  // 🆕 NUEVO: Función para obtener clases de animación
  const getAnimationClasses = () => {
    if (!animationEnabled) return 'animations-disabled';
    
    const pulseClass = `pulse-${pulseIntensity}`;
    const speedClass = `speed-${pulseSpeed}`;
    const hoverClass = `hover-${hoverEffect}`;
    
    return `${pulseClass} ${speedClass} ${hoverClass}`.trim();
  };

  // 🆕 NUEVO: Función para obtener la duración de animación dinámica
  const getAnimationDuration = () => {
    if (!animationEnabled) return '0s';
    
    const speedMap = {
      slow: '8s',
      normal: '4s', 
      fast: '2s',
      ultra: '1s'
    };
    
    return speedMap[pulseSpeed] || '4s';
  };

  // 🆕 NUEVO: Función para obtener la escala del pulso según intensidad
  const getPulseScale = (ringIndex: number) => {
    if (!animationEnabled || pulseIntensity === 'none') return { transform: 'translate(-50%, -50%) scale(1)' };
    
    const baseScales = {
      none: [1, 1, 1],
      low: [1.05, 1.03, 1.01],
      medium: [1.2, 1.15, 1.1],
      high: [1.4, 1.3, 1.2],
      extreme: [1.8, 1.6, 1.4]
    };
    
    const scales = baseScales[pulseIntensity] || baseScales.medium;
    return { transform: `translate(-50%, -50%) scale(${scales[ringIndex] || 1})` };
  };

  const dimensions = getContainerDimensions();

  // Función mejorada para convertir URL de Google Maps a embed
  const getEmbedUrl = () => {
    if (!googleMapsUrl) {
      return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15057.334840628334!2d-77.04276278715878!3d-12.04635330943029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c6f0d54871b7%3A0x11b9b5b4c5a2b5c3!2sLima%2C%20Peru!5e0!3m2!1sen!2spe!4v1635959562000!5m2!1sen!2spe";
    }
    
    // Si ya es embed, usarla directamente
    if (googleMapsUrl.includes('/embed')) {
      return googleMapsUrl;
    }
    
    // NUEVO: Manejar URLs acortadas de Google Maps (goo.gl o maps.app.goo.gl)
    if (googleMapsUrl.includes('goo.gl') || googleMapsUrl.includes('maps.app.goo.gl')) {
      // Método EFECTIVO: búsqueda específica en Perú usando la dirección real
      // Agregamos "Perú" al final para asegurar geolocalización correcta
      const locationQuery = `${address}, Huánuco, Perú`.replace(/\s+/g, '+').toLowerCase();
      const peruEmbedUrl = `https://maps.google.com/maps?width=100%25&height=600&hl=es&q=${locationQuery}&t=&z=17&ie=UTF8&iwloc=B&output=embed`;
      
      return peruEmbedUrl;
    }
    
    // Si contiene 'google.com/maps', intentar convertir
    if (googleMapsUrl.includes('google.com/maps')) {
      // Método 1: Buscar coordenadas @lat,lng
      const coordMatch = googleMapsUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (coordMatch) {
        const [, lat, lng] = coordMatch;
        const convertedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15057!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2spe!4v1635959562000!5m2!1sen!2spe`;
        return convertedUrl;
      }
      
      // Método 2: Reemplazar /maps/ por /maps/embed
      const simpleConvert = googleMapsUrl.replace('/maps/', '/maps/embed?pb=!1m18!1m12!1m3!1d15057!2d-77.042!3d-12.046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2spe!4v1635959562000!5m2!1sen!2spe&');
      return simpleConvert;
    }
    
    // Fallback: usar búsqueda por nombre y dirección
    const searchQuery = encodeURIComponent(`${companyName} ${address}`);
    return `https://www.google.com/maps/embed/v1/place?key=&q=${searchQuery}`;
  };

  const embedUrl = getEmbedUrl();

  // Función para normalizar URL de Google Maps
  const normalizeGoogleMapsUrl = (url: string): string => {
    if (!url) return '';
    
    // Si ya tiene protocolo, devolverla tal como está
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Si es una URL de Google Maps sin protocolo, agregar https://
    if (url.startsWith('google.com/') || url.startsWith('maps.google.com/') || url.startsWith('www.google.com/')) {
      return `https://${url}`;
    }
    
    // Si es una URL de maps.app.goo.gl sin protocolo
    if (url.startsWith('maps.app.goo.gl/')) {
      return `https://${url}`;
    }
    
    // Si es una URL goo.gl sin protocolo
    if (url.startsWith('goo.gl/')) {
      return `https://${url}`;
    }
    
    // Por defecto, agregar https://
    return `https://${url}`;
  };

  // Función para abrir Google Maps en nueva pestaña
  const openInGoogleMaps = () => {
    if (googleMapsUrl && !googleMapsUrl.includes('/embed')) {
      // Normalizar la URL antes de usarla
      const normalizedUrl = normalizeGoogleMapsUrl(googleMapsUrl);
      window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback: buscar coordenadas o usar búsqueda
      const coordMatch = embedUrl.match(/2d(-?\d+\.?\d*)!3d(-?\d+\.?\d*)/);
      if (coordMatch) {
        const [, lng, lat] = coordMatch;
        const mapsUrl = `https://www.google.com/maps/@${lat},${lng},15z`;
        window.open(mapsUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Último recurso: búsqueda por nombre con ubicación específica en Perú
        const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(address + ', Lima, Perú')}`;
        window.open(searchUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Siempre mostrar el mapa (usaremos default si no hay URL personalizada)

  return (
    <div 
      className={`map-container ${getAlignmentClasses()} ${getAspectRatioClasses()} ${getShadowClasses()} ${getAnimationClasses()}`}
      style={{ 
        position: 'relative', 
        width: dimensions.width,
        height: aspectRatio === 'custom' ? dimensions.height : undefined,
        borderRadius, 
        overflow: 'hidden',
        border: '1px solid rgba(139, 92, 246, 0.1)',
        cursor: 'pointer',
        maxWidth: alignment === 'full' ? '100%' : dimensions.width
      }}
      onClick={openInGoogleMaps}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          openInGoogleMaps();
        }
      }}
      aria-label={`Abrir ${companyName} en Google Maps`}>
      {/* Google Maps Iframe */}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ 
          border: 0, 
          borderRadius,
          filter: theme === 'dark' ? 'brightness(0.8) contrast(1.1)' : 'none'
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Mapa de ${companyName}`}
      />
      
      {/* Marcador central con radar animado */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        {/* Ondas de radar con configuración personalizable */}
        <div 
          className="radar-ring"
          style={{
            width: pulseIntensity === 'extreme' ? '180px' : pulseIntensity === 'high' ? '160px' : '140px',
            height: pulseIntensity === 'extreme' ? '180px' : pulseIntensity === 'high' ? '160px' : '140px',
            borderRadius: '50%',
            border: '3px solid rgba(139, 92, 246, 0.7)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            ...getPulseScale(0),
            animationDuration: getAnimationDuration(),
            animationDelay: '0s',
            backdropFilter: 'blur(1px)',
            pointerEvents: 'none'
          }} 
        />
        <div 
          className="radar-ring"
          style={{
            width: pulseIntensity === 'extreme' ? '130px' : pulseIntensity === 'high' ? '120px' : '100px',
            height: pulseIntensity === 'extreme' ? '130px' : pulseIntensity === 'high' ? '120px' : '100px',
            borderRadius: '50%',
            border: '3px solid rgba(139, 92, 246, 0.8)',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            ...getPulseScale(1),
            animationDuration: getAnimationDuration(),
            animationDelay: '1.3s',
            backdropFilter: 'blur(1px)',
            pointerEvents: 'none'
          }} 
        />
        <div 
          className="radar-ring"
          style={{
            width: pulseIntensity === 'extreme' ? '80px' : pulseIntensity === 'high' ? '70px' : '60px',
            height: pulseIntensity === 'extreme' ? '80px' : pulseIntensity === 'high' ? '70px' : '60px',
            borderRadius: '50%',
            border: '3px solid rgba(139, 92, 246, 0.9)',
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            ...getPulseScale(2),
            animationDuration: getAnimationDuration(),
            animationDelay: '2.6s',
            backdropFilter: 'blur(1px)',
            pointerEvents: 'none'
          }} 
        />
        
        {/* Marcador central más visible */}
        <div style={{
          width: logoSize === 'large' ? '60px' : logoSize === 'medium' ? '48px' : '40px',
          height: logoSize === 'large' ? '60px' : logoSize === 'medium' ? '48px' : '40px',
          borderRadius: '50%',
          ...getMarkerBackgroundStyle(),
          border: `${markerBorderWidth || '4px'} solid ${markerBorderColor || 'white'}`,
          boxShadow: `0 6px 20px rgba(139, 92, 246, 0.9), 0 0 0 3px rgba(139, 92, 246, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'markerPulse 2s infinite alternate',
          backdropFilter: 'blur(2px)'
        }}>
          {/* Logo personalizado o icono de ubicación */}
          {customLogo ? (
            <img 
              src={customLogo}
              alt={`Logo ${companyName}`}
              style={{
                ...getLogoSize(),
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
              onError={(e) => {
                // Fallback al emoji si la imagen no carga
                e.currentTarget.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.innerHTML = '📍';
                fallback.style.cssText = `
                  width: 16px; height: 16px; border-radius: 50%; 
                  background: white; font-weight: bold; font-size: 10px; 
                  color: #8B5CF6; display: flex; align-items: center; 
                  justify-content: center; box-shadow: inset 0 1px 2px rgba(139, 92, 246, 0.2);
                `;
                e.currentTarget.parentNode?.appendChild(fallback);
              }}
            />
          ) : (
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: 'white',
              fontWeight: 'bold',
              fontSize: '10px',
              color: '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 2px rgba(139, 92, 246, 0.2)'
            }}>
              📍
            </div>
          )}
        </div>
        

      </div>

      {/* Overlay con información y click */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          padding: '16px',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={openInGoogleMaps}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to top, rgba(139, 92, 246, 0.8), transparent)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)';
        }}
      >
        <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '4px' }}>
          {companyName}
        </h3>
        {address && <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>{address}</p>}
        {/* Debug temporal - mostrar si hay URL personalizada */}
        <p style={{ fontSize: '10px', opacity: 0.6, marginBottom: '4px', color: googleMapsUrl ? '#90EE90' : '#FFB6C1' }}>
          {googleMapsUrl 
            ? (googleMapsUrl.includes('goo.gl') ? '🔗 URL acortada → Búsqueda en Perú' : '✅ URL personalizada configurada')
            : '⚠️ Usando ubicación por defecto'
          }
        </p>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '12px', 
          opacity: 0.75 
        }}>
          📍 <span>Haz clic para abrir en Google Maps</span>
          <svg 
            style={{ width: '12px', height: '12px', marginLeft: 'auto' }}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SimpleGoogleMap;