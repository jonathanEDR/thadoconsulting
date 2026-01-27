import { Helmet } from 'react-helmet-async';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import FloatingChatWidget from '../../components/floating-chat/FloatingChatWidget';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Pagina de Politica de Privacidad
 * Contiene informacion sobre como THADO Consulting maneja los datos personales
 */
const PrivacyPolicy = () => {
  const { theme } = useTheme();

  return (
    <>
      <Helmet>
        <title>Politica de Privacidad - THADO Consulting</title>
        <meta name="description" content="Conoce nuestra politica de privacidad y como protegemos tus datos personales en THADO Consulting." />
        <meta name="keywords" content="politica de privacidad, proteccion de datos, THADO Consulting, privacidad" />

        {/* Open Graph */}
        <meta property="og:title" content="Politica de Privacidad - THADO Consulting" />
        <meta property="og:description" content="Conoce nuestra politica de privacidad y como protegemos tus datos personales" />
        <meta property="og:image" content="https://www.thadoconsulting.com/logofondonegro.jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="THADO Consulting - Política de Privacidad" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.thadoconsulting.com/privacidad" />
        <meta property="og:site_name" content="THADO Consulting" />
        <meta property="og:locale" content="es_PE" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Politica de Privacidad - THADO Consulting" />
        <meta name="twitter:description" content="Conoce nuestra politica de privacidad" />
        <meta name="twitter:image" content="https://www.thadoconsulting.com/logofondonegro.jpeg" />
        <meta name="twitter:image:alt" content="THADO Consulting - Política de Privacidad" />

        {/* Canonical */}
        <link rel="canonical" href="https://www.thadoconsulting.com/privacidad" />
      </Helmet>

      <div className={`min-h-screen w-full overflow-x-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <PublicHeader />

        {/* Hero Section */}
        <section
          className="relative min-h-[40vh] flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: theme === 'dark' ? '#111827' : '#F9FAFB'
          }}
        >
          <div className="relative z-10 container mx-auto px-4 py-24 text-center">
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Politica de Privacidad
            </h1>
            <p
              className={`text-lg md:text-xl max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Tu privacidad es importante para nosotros. Aqui explicamos como recopilamos,
              usamos y protegemos tu informacion personal.
            </p>
            <p className={`text-sm mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Ultima actualizacion: Enero 2025
            </p>
          </div>
        </section>

        {/* Contenido Principal */}
        <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">

              {/* Seccion 1 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  1. Informacion que Recopilamos
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    En THADO Consulting recopilamos informacion que nos proporcionas directamente cuando:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Creas una cuenta en nuestra plataforma</li>
                    <li>Completas formularios de contacto o solicitud de servicios</li>
                    <li>Te comunicas con nuestro equipo de soporte</li>
                    <li>Participas en encuestas o promociones</li>
                    <li>Utilizas nuestro chat de asistencia con IA</li>
                  </ul>
                  <p>
                    Esta informacion puede incluir tu nombre, direccion de correo electronico,
                    numero de telefono, nombre de empresa y cualquier otra informacion que
                    decidas compartir con nosotros.
                  </p>
                </div>
              </div>

              {/* Seccion 2 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  2. Uso de la Informacion
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Utilizamos la informacion recopilada para:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Proporcionar, mantener y mejorar nuestros servicios</li>
                    <li>Procesar transacciones y enviar notificaciones relacionadas</li>
                    <li>Responder a tus comentarios, preguntas y solicitudes</li>
                    <li>Enviarte informacion tecnica, actualizaciones y alertas de seguridad</li>
                    <li>Comunicarnos contigo sobre productos, servicios y eventos</li>
                    <li>Personalizar y mejorar tu experiencia en nuestra plataforma</li>
                    <li>Detectar, investigar y prevenir actividades fraudulentas</li>
                  </ul>
                </div>
              </div>

              {/* Seccion 3 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  3. Proteccion de Datos
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Implementamos medidas de seguridad tecnicas y organizativas para proteger
                    tu informacion personal contra acceso no autorizado, alteracion, divulgacion
                    o destruccion. Estas medidas incluyen:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encriptacion SSL/TLS para todas las comunicaciones</li>
                    <li>Almacenamiento seguro de datos con cifrado</li>
                    <li>Controles de acceso estrictos para nuestro personal</li>
                    <li>Monitoreo continuo de seguridad y auditorias regulares</li>
                    <li>Autenticacion segura mediante Clerk</li>
                  </ul>
                </div>
              </div>

              {/* Seccion 4 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  4. Compartir Informacion
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    No vendemos ni alquilamos tu informacion personal a terceros.
                    Podemos compartir tu informacion en las siguientes circunstancias:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Con proveedores de servicios que nos ayudan a operar nuestra plataforma</li>
                    <li>Para cumplir con obligaciones legales</li>
                    <li>Para proteger nuestros derechos y seguridad</li>
                    <li>Con tu consentimiento explicito</li>
                  </ul>
                </div>
              </div>

              {/* Seccion 5 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  5. Cookies y Tecnologias Similares
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Utilizamos cookies y tecnologias similares para mejorar tu experiencia,
                    analizar el trafico y personalizar el contenido. Puedes configurar tu
                    navegador para rechazar cookies, aunque esto puede afectar algunas
                    funcionalidades del sitio.
                  </p>
                </div>
              </div>

              {/* Seccion 6 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  6. Tus Derechos
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Tienes derecho a:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Acceder a tu informacion personal</li>
                    <li>Rectificar datos inexactos</li>
                    <li>Solicitar la eliminacion de tus datos</li>
                    <li>Oponerte al procesamiento de tus datos</li>
                    <li>Solicitar la portabilidad de tus datos</li>
                    <li>Retirar tu consentimiento en cualquier momento</li>
                  </ul>
                  <p>
                    Para ejercer estos derechos, contactanos a traves de nuestros
                    canales de comunicacion oficiales.
                  </p>
                </div>
              </div>

              {/* Seccion 7 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  7. Cambios en esta Politica
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Podemos actualizar esta politica de privacidad periodicamente.
                    Te notificaremos sobre cambios significativos publicando la nueva
                    politica en nuestro sitio web y, cuando sea apropiado, mediante
                    notificacion por correo electronico.
                  </p>
                </div>
              </div>

              {/* Seccion 8 - Contacto */}
              <div className={`p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  8. Contacto
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Si tienes preguntas sobre esta politica de privacidad o sobre como
                    manejamos tu informacion personal, puedes contactarnos:
                  </p>
                  <ul className="space-y-2">
                    <li>
                      <strong>Email:</strong>{' '}
                      <a
                        href="mailto:contacto@thadoconsulting.pe"
                        className="text-purple-500 hover:text-purple-400 transition-colors"
                      >
                        contacto@thadoconsulting.pe
                      </a>
                    </li>
                    <li>
                      <strong>Ubicacion:</strong> Lima, Peru
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        <PublicFooter />
        <FloatingChatWidget />
      </div>
    </>
  );
};

export default PrivacyPolicy;
