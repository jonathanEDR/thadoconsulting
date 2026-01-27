import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ContactSection from '../../components/public/ContactSection';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import FloatingChatWidget from '../../components/floating-chat/FloatingChatWidget';
import { useCategoriasTipoServicio } from '../../hooks/useCategoriasTipoServicio';
import { useSeo } from '../../hooks/useSeo';
import { useTheme } from '../../contexts/ThemeContext';
import { getPageBySlug } from '../../services/cmsApi';

// Interfaces para el contenido de la página
interface HeroSection {
  title?: string;
  subtitle?: string;
  features?: string[];
  backgroundImage?: string | { light?: string; dark?: string };
  backgroundOpacity?: number;
  backgroundOverlay?: boolean;
  titleColor?: string;
  titleColorDark?: string;
  subtitleColor?: string;
  subtitleColorDark?: string;
  // Gradiente para título
  titleGradientEnabled?: boolean;
  titleGradientFrom?: string;
  titleGradientTo?: string;
  titleGradientDirection?: string;
}

interface FormSection {
  backgroundImage?: string | { light?: string; dark?: string };
  backgroundOpacity?: number;
  backgroundOverlay?: boolean;
  hideFormCard?: boolean;
}

interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
  iconBgColor?: string;
  iconColor?: string;
}

interface FeaturesSection {
  title?: string;
  items?: FeatureItem[];
  backgroundImage?: string | { light?: string; dark?: string };
  backgroundOpacity?: number;
  backgroundOverlay?: boolean;
  titleColor?: string;
  titleColorDark?: string;
}

interface ContactPageSections {
  hero?: HeroSection;
  form?: FormSection;
  features?: FeaturesSection;
}

interface ContactPageContent {
  contactPage?: ContactPageSections;
}

/**
 * 📝 Página Pública de Contacto
 * Página dedicada para formulario de contacto que puedes compartir con clientes
 * URL: /contacto
 */
const Contact = () => {
  const { theme } = useTheme();
  const [pageData, setPageData] = useState<{ content: ContactPageContent } | null>(null);

  // 🎯 SEO dinámico
  const { SeoHelmet } = useSeo({
    pageName: 'contact',
    fallbackTitle: 'Contacto - THADO Consulting',
    fallbackDescription: 'Contáctanos para servicios contables, tributarios y financieros para MYPES en Perú.'
  });

  // Cargar datos del CMS (sin caché para obtener siempre datos frescos)
  useEffect(() => {
    const loadPageData = async () => {
      try {
        // Limpiar caché de localStorage para esta página
        try {
          localStorage.removeItem('cmsCache_page-contact');
        } catch (e) {
          // Ignorar errores de localStorage
        }
        
        // Cargar sin usar caché (useCache = false)
        const data = await getPageBySlug('contact', false);
        if (data) {
          setPageData(data);
          console.log('📄 Contact page data loaded:', data.content?.contactPage);
        }
      } catch (error: any) {
        // Silenciar error si la página no existe - usamos valores por defecto
        if (!error?.isNotFound) {
          console.error('Error loading contact page data:', error);
        }
      }
    };
    loadPageData();
  }, []);

  // Obtener configuración de secciones (desde contactPage en el CMS)
  const contactPage = pageData?.content?.contactPage || {};
  const hero = contactPage.hero || {};
  const formConfig = contactPage.form || {};
  const featuresConfig = contactPage.features || {};

  // Función para obtener imagen de fondo según tema
  const getBackgroundImage = (bgImage?: string | { light?: string; dark?: string }) => {
    if (!bgImage) return null;
    if (typeof bgImage === 'string') return bgImage;
    return theme === 'dark' ? (bgImage.dark || bgImage.light) : (bgImage.light || bgImage.dark);
  };

  // Obtener categorías para el formulario
  const { categorias: categoriasConTipo, isLoading: loadingCategorias } = useCategoriasTipoServicio();

  // Fallback a categorías por defecto si la API falla
  const defaultCategorias = [
    { _id: '1', nombre: 'Desarrollo Web', slug: 'desarrollo-web', icono: '🌐', color: '#3B82F6' },
    { _id: '2', nombre: 'App Móvil', slug: 'app-movil', icono: '📱', color: '#8B5CF6' },
    { _id: '3', nombre: 'E-commerce', slug: 'ecommerce', icono: '🛒', color: '#EC4899' },
    { _id: '4', nombre: 'Sistemas', slug: 'sistemas', icono: '⚙️', color: '#F59E0B' },
    { _id: '5', nombre: 'Consultoría', slug: 'consultoria', icono: '💼', color: '#10B981' },
    { _id: '6', nombre: 'Diseño', slug: 'diseño', icono: '🎨', color: '#06B6D4' },
    { _id: '7', nombre: 'Marketing', slug: 'marketing', icono: '📊', color: '#F97316' },
    { _id: '8', nombre: 'Otro', slug: 'otro', icono: '📋', color: '#6B7280' }
  ];

  // Convertir categorías al formato esperado por ContactSection
  // Si hay categorías de la API, usarlas; si no, usar las por defecto
  const categoriasParaUsar = categoriasConTipo.length > 0 ? categoriasConTipo : defaultCategorias;
  
  const categorias = categoriasParaUsar.map((cat: any) => ({
    _id: cat._id,
    nombre: cat.nombre,
    slug: cat.slug,
    descripcion: cat?.descripcion || '',
    icono: cat.icono || '📋',
    color: cat.color || '#6B7280',
    orden: 0, // No disponible en el nuevo formato
    activo: true, // Solo devolvemos las activas
    totalServicios: 0, // No necesario para el formulario
    createdAt: '', // No necesario para el formulario
    updatedAt: '' // No necesario para el formulario
  }));

  // No bloquear la renderización mientras carga, mostrar con fallback
  if (loadingCategorias && categoriasConTipo.length === 0) {
    // Continuamos con fallback, no mostramos spinner
  }

  // Variables para imágenes de fondo
  const heroBackgroundImage = getBackgroundImage(hero.backgroundImage);
  const formBackgroundImage = getBackgroundImage(formConfig.backgroundImage);
  const featuresBackgroundImage = getBackgroundImage(featuresConfig.backgroundImage);

  // Debug: Mostrar datos cargados
  console.log('🎨 [Contact Page] Hero background config:', {
    backgroundImage: hero.backgroundImage,
    resolvedImage: heroBackgroundImage,
    opacity: hero.backgroundOpacity,
    theme
  });

  // Colores de texto según tema
  const heroTitleColor = theme === 'dark' 
    ? (hero.titleColorDark || '#ffffff') 
    : (hero.titleColor || '#111827');
  const heroSubtitleColor = theme === 'dark' 
    ? (hero.subtitleColorDark || '#9ca3af') 
    : (hero.subtitleColor || '#4b5563');
  const featuresTitleColor = theme === 'dark' 
    ? (featuresConfig.titleColorDark || '#ffffff') 
    : (featuresConfig.titleColor || '#111827');

  // Detectar si el título usa gradiente (construir el gradiente si está habilitado)
  const heroTitleGradient = hero.titleGradientEnabled
    ? `linear-gradient(${hero.titleGradientDirection || 'to right'}, ${hero.titleGradientFrom || '#8B5CF6'}, ${hero.titleGradientTo || '#06B6D4'})`
    : null;
  
  // Configuración para ocultar la tarjeta del formulario
  const hideFormCard = formConfig.hideFormCard || false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <SeoHelmet />
      
      {/* Schema.org ContactPage */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contacto - THADO Consulting",
            "description": "Contáctanos para servicios contables, tributarios y financieros para MYPES en Perú.",
            "url": "https://www.thadoconsulting.com/contacto",
            "mainEntity": {
              "@type": "Organization",
              "name": "THADO Consulting",
              "url": "https://www.thadoconsulting.com",
              "logo": "https://www.thadoconsulting.com/FAVICON.png",
              "email": "contacto@thadoconsulting.pe",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lima",
                "addressCountry": "PE"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "contacto@thadoconsulting.pe",
                "contactType": "customer service",
                "availableLanguage": ["Spanish"]
              }
            }
          })}
        </script>
      </Helmet>
      
      <PublicHeader />
      
      {/* Hero Section */}
      <section 
        className="relative pt-20 pb-12 overflow-hidden"
      >
        {/* Fondo por defecto si no hay imagen */}
        {!heroBackgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 dark:from-gray-900 via-purple-100/20 dark:via-purple-900/20 to-blue-100/20 dark:to-blue-900/20" />
        )}
        
        {/* Capa de color base cuando hay imagen (para que la opacidad funcione correctamente) */}
        {heroBackgroundImage && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb' }}
          />
        )}
        
        {/* Imagen de fondo */}
        {heroBackgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${heroBackgroundImage})`,
              opacity: hero.backgroundOpacity ?? 1
            }}
          />
        )}
        
        {/* Overlay oscuro opcional */}
        {heroBackgroundImage && hero.backgroundOverlay && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)' }}
          />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-down">
            <h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              style={heroTitleGradient ? {
                background: heroTitleGradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent'
              } : { color: heroTitleColor }}
            >
              {hero.title || '¡Trabajemos Juntos! 🚀'}
            </h1>
            
            <p 
              className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed"
              style={{ color: heroSubtitleColor }}
            >
              {hero.subtitle || 'Cuéntanos sobre tu proyecto y te ayudaremos a convertir tus ideas en realidad digital. Nuestro equipo está listo para asesorarte.'}
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm" style={{ color: heroSubtitleColor }}>
              {(hero.features || ['Respuesta en 24 horas', 'Cotización gratuita', 'Asesoría especializada']).map((feature: string, index: number) => (
                <span key={index} className="flex items-center">
                  <svg className={`w-5 h-5 mr-2 ${index === 0 ? 'text-green-500' : index === 1 ? 'text-blue-500' : 'text-purple-500'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de Contacto */}
      <section 
        className="relative py-16 overflow-hidden"
      >
        {/* Fondo por defecto si no hay imagen */}
        {!formBackgroundImage && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme === 'dark' ? '#111827' : '#ffffff' }}
          />
        )}
        
        {/* Capa de color base cuando hay imagen */}
        {formBackgroundImage && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme === 'dark' ? '#111827' : '#ffffff' }}
          />
        )}
        
        {/* Imagen de fondo */}
        {formBackgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${formBackgroundImage})`,
              opacity: formConfig.backgroundOpacity ?? 1
            }}
          />
        )}
        
        {/* Overlay oscuro opcional */}
        {formBackgroundImage && formConfig.backgroundOverlay && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)' }}
          />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactSection 
            transparentBackground={true}
            data={{
              enabled: true,
              title: '📝 Cuéntanos sobre tu proyecto',
              subtitle: 'EMPEZEMOS A TRABAJAR JUNTOS',
              description: 'Completa el formulario y nos pondremos en contacto contigo lo antes posible para discutir tu proyecto y brindarte una cotización personalizada.',
              fields: {
                nombreLabel: 'Nombre completo',
                nombrePlaceholder: 'Tu nombre',
                nombreRequired: true,
                celularLabel: 'Celular / Teléfono',
                celularPlaceholder: '+51 999 999 999',
                celularRequired: true,
                correoLabel: 'Correo electrónico',
                correoPlaceholder: 'tu@email.com',
                correoRequired: true,
                mensajeLabel: 'Cuéntanos sobre tu proyecto',
                mensajePlaceholder: 'Describe tu proyecto, necesidades o consulta...',
                mensajeRequired: true,
                mensajeRows: 5,
                categoriaEnabled: true,
                categoriaLabel: 'Tipo de servicio que necesitas',
                categoriaPlaceholder: 'Selecciona el tipo de servicio',
                categoriaRequired: true,
                termsText: 'Acepto la Política de Privacidad y Términos de Servicio',
                termsRequired: true,
                termsLink: '/politica-privacidad',
              },
              button: {
                text: 'Enviar solicitud 🚀',
                loadingText: 'Enviando...',
              },
              messages: {
                success: '¡Excelente! 🎉 Hemos recibido tu solicitud. Te contactaremos en las próximas 24 horas para discutir tu proyecto.',
                error: 'Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente o contáctanos directamente.',
              },
              styles: {
                light: {
                  titleColor: '#1f2937',
                  subtitleColor: '#6b7280',
                  descriptionColor: '#4b5563',
                  formBackground: 'rgba(255, 255, 255, 0.95)',
                  formBorder: 'rgba(0, 0, 0, 0.1)',
                  formShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  labelColor: '#374151',
                  inputBackground: '#ffffff',
                  inputBorder: '#e5e7eb',
                  inputText: '#1f2937',
                  errorColor: '#ef4444',
                },
                dark: {
                  titleColor: '#f3f4f6',
                  subtitleColor: '#d1d5db',
                  descriptionColor: '#9ca3af',
                  formBackground: 'rgba(31, 41, 55, 0.95)',
                  formBorder: 'rgba(255, 255, 255, 0.1)',
                  formShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                  labelColor: '#e5e7eb',
                  inputBackground: '#374151',
                  inputBorder: '#4b5563',
                  inputText: '#f3f4f6',
                  errorColor: '#fca5a5',
                }
              },
              layout: {
                maxWidth: '600px',
                padding: '1.5rem',
                borderRadius: hideFormCard ? '0' : '0.75rem',
              },
              cardsDesign: {
                light: {
                  background: hideFormCard ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
                  border: hideFormCard ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
                  borderWidth: hideFormCard ? '0' : '1px',
                  shadow: hideFormCard ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  hoverBackground: hideFormCard ? 'transparent' : 'rgba(255, 255, 255, 1)',
                  hoverBorder: hideFormCard ? 'transparent' : 'rgba(0, 0, 0, 0.15)',
                  hoverShadow: hideFormCard ? 'none' : '0 10px 40px rgba(0, 0, 0, 0.15)',
                  iconGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  iconBackground: '#f3f4f6',
                  iconColor: '#667eea',
                  titleColor: '#1f2937',
                  descriptionColor: '#4b5563',
                  linkColor: '#667eea',
                  cardPadding: hideFormCard ? '0' : '1.5rem',
                },
                dark: {
                  background: hideFormCard ? 'transparent' : 'rgba(31, 41, 55, 0.95)',
                  border: hideFormCard ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                  borderWidth: hideFormCard ? '0' : '1px',
                  shadow: hideFormCard ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.3)',
                  hoverBackground: hideFormCard ? 'transparent' : 'rgba(31, 41, 55, 1)',
                  hoverBorder: hideFormCard ? 'transparent' : 'rgba(255, 255, 255, 0.15)',
                  hoverShadow: hideFormCard ? 'none' : '0 10px 40px rgba(0, 0, 0, 0.4)',
                  iconGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  iconBackground: '#1e293b',
                  iconColor: '#a78bfa',
                  titleColor: '#f3f4f6',
                  descriptionColor: '#9ca3af',
                  linkColor: '#a78bfa',
                  cardPadding: hideFormCard ? '0' : '1.5rem',
                }
              },
              map: {
                enabled: false,
              }
            } as any}
            categorias={categorias}
          />
        </div>
      </section>

      {/* Información adicional */}
      <section 
        className="relative py-16 overflow-hidden"
      >
        {/* Fondo por defecto si no hay imagen */}
        {!featuresBackgroundImage && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' }}
          />
        )}
        
        {/* Capa de color base cuando hay imagen */}
        {featuresBackgroundImage && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' }}
          />
        )}
        
        {/* Imagen de fondo */}
        {featuresBackgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${featuresBackgroundImage})`,
              opacity: featuresConfig.backgroundOpacity ?? 1
            }}
          />
        )}
        
        {/* Overlay oscuro opcional */}
        {featuresBackgroundImage && featuresConfig.backgroundOverlay && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)' }}
          />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ color: featuresTitleColor }}
            >
              {featuresConfig.title || '¿Por qué elegir THADO Consulting?'}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(featuresConfig.items || [
              { title: 'Desarrollo Rápido', description: 'Entregamos proyectos en tiempo récord sin comprometer la calidad.', iconBgColor: 'purple' },
              { title: 'Calidad Garantizada', description: 'Cada proyecto pasa por rigurosas pruebas de calidad.', iconBgColor: 'blue' },
              { title: 'Soporte Continuo', description: 'Te acompañamos durante todo el proceso y después del lanzamiento.', iconBgColor: 'green' }
            ]).map((item: FeatureItem, index: number) => {
              const colorMap: Record<string, { bg: string; text: string }> = {
                purple: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-600 dark:text-purple-400' },
                blue: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-600 dark:text-blue-400' },
                green: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-600 dark:text-green-400' },
                cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/50', text: 'text-cyan-600 dark:text-cyan-400' },
                amber: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-600 dark:text-amber-400' },
                rose: { bg: 'bg-rose-100 dark:bg-rose-900/50', text: 'text-rose-600 dark:text-rose-400' }
              };
              const colors = colorMap[item.iconBgColor || 'purple'] || colorMap.purple;

              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <svg className={`w-8 h-8 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />}
                      {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75c0-1.148-.198-2.25-.559-3.262" />}
                    </svg>
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PublicFooter />
      
      {/* 💬 Chatbot de Ventas Flotante */}
      <FloatingChatWidget />
    </div>
  );
};

export default Contact;
