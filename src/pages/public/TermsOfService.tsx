import { Helmet } from 'react-helmet-async';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import FloatingChatWidget from '../../components/floating-chat/FloatingChatWidget';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Pagina de Terminos y Condiciones
 * Contiene los terminos legales de uso de los servicios de THADO Consulting
 */
const TermsOfService = () => {
  const { theme } = useTheme();

  return (
    <>
      <Helmet>
        <title>Terminos y Condiciones - THADO Consulting</title>
        <meta name="description" content="Lee nuestros terminos y condiciones de uso de servicios de THADO Consulting." />
        <meta name="keywords" content="terminos y condiciones, terminos de servicio, THADO Consulting, condiciones de uso" />

        {/* Open Graph */}
        <meta property="og:title" content="Terminos y Condiciones - THADO Consulting" />
        <meta property="og:description" content="Lee nuestros terminos y condiciones de uso de servicios" />
        <meta property="og:image" content="https://www.thadoconsulting.com/logohorizontalconfondo.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="THADO Consulting - Términos y Condiciones" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.thadoconsulting.com/terminos" />
        <meta property="og:site_name" content="THADO Consulting" />
        <meta property="og:locale" content="es_PE" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terminos y Condiciones - THADO Consulting" />
        <meta name="twitter:description" content="Lee nuestros terminos y condiciones" />
        <meta name="twitter:image" content="https://www.thadoconsulting.com/logohorizontalconfondo.jpg" />
        <meta name="twitter:image:alt" content="THADO Consulting - Términos y Condiciones" />

        {/* Canonical */}
        <link rel="canonical" href="https://www.thadoconsulting.com/terminos" />
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
              Terminos y Condiciones
            </h1>
            <p
              className={`text-lg md:text-xl max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Por favor lee cuidadosamente estos terminos antes de utilizar nuestros servicios.
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
                  1. Aceptacion de los Terminos
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Al acceder y utilizar los servicios de THADO Consulting, aceptas estar
                    vinculado por estos Terminos y Condiciones. Si no estas de acuerdo
                    con alguna parte de estos terminos, no podras acceder al servicio.
                  </p>
                  <p>
                    Estos terminos aplican a todos los visitantes, usuarios y otras
                    personas que accedan o utilicen nuestros servicios.
                  </p>
                </div>
              </div>

              {/* Seccion 2 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  2. Descripcion de los Servicios
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    THADO Consulting proporciona servicios contables, tributarios,
                    financieros y de consultoría empresarial.
                    Nuestros servicios incluyen pero no se limitan a:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Contabilidad general y registros contables</li>
                    <li>Declaraciones tributarias ante SUNAT</li>
                    <li>Libros electrónicos y PDT</li>
                    <li>Asesoría financiera y planificación fiscal</li>
                    <li>Consultoría empresarial para MYPES</li>
                    <li>Auditoría y revisión contable</li>
                  </ul>
                </div>
              </div>

              {/* Seccion 3 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  3. Cuentas de Usuario
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Al crear una cuenta con nosotros, garantizas que:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Tienes al menos 18 anos de edad</li>
                    <li>La informacion que proporcionas es precisa y completa</li>
                    <li>Mantendras la seguridad de tu cuenta y contrasena</li>
                    <li>Aceptas la responsabilidad por todas las actividades bajo tu cuenta</li>
                    <li>Nos notificaras inmediatamente sobre cualquier uso no autorizado</li>
                  </ul>
                  <p>
                    Nos reservamos el derecho de suspender o terminar tu cuenta si
                    determinamos que has violado estos terminos.
                  </p>
                </div>
              </div>

              {/* Seccion 4 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  4. Propiedad Intelectual
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    El servicio y su contenido original, caracteristicas y funcionalidades
                    son y seguiran siendo propiedad exclusiva de THADO Consulting y sus
                    licenciantes. El servicio esta protegido por derechos de autor,
                    marcas registradas y otras leyes.
                  </p>
                  <p>
                    Para proyectos de desarrollo personalizado, la propiedad intelectual
                    del software desarrollado se definira en el contrato especifico de
                    cada proyecto.
                  </p>
                </div>
              </div>

              {/* Seccion 5 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  5. Uso Aceptable
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Te comprometes a no utilizar nuestros servicios para:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Violar cualquier ley o regulacion aplicable</li>
                    <li>Enviar material publicitario no solicitado o spam</li>
                    <li>Hacerse pasar por otra persona o entidad</li>
                    <li>Interferir con el funcionamiento del servicio</li>
                    <li>Intentar acceder sin autorizacion a sistemas o datos</li>
                    <li>Transmitir virus u otro codigo malicioso</li>
                    <li>Recopilar informacion de otros usuarios sin consentimiento</li>
                  </ul>
                </div>
              </div>

              {/* Seccion 6 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  6. Pagos y Facturacion
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Los terminos de pago especificos se estableceran en cada contrato
                    de servicio individual. En general:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Los precios estan sujetos a cambio con previo aviso</li>
                    <li>Los pagos deben realizarse segun los plazos acordados</li>
                    <li>Los retrasos en el pago pueden resultar en suspension del servicio</li>
                    <li>Los impuestos aplicables seran responsabilidad del cliente</li>
                  </ul>
                </div>
              </div>

              {/* Seccion 7 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  7. Limitacion de Responsabilidad
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    En ningún caso THADO Consulting, sus directores, empleados, socios,
                    agentes, proveedores o afiliados seran responsables por danos
                    indirectos, incidentales, especiales, consecuentes o punitivos,
                    incluyendo sin limitacion, perdida de ganancias, datos, uso,
                    fondo de comercio u otras perdidas intangibles.
                  </p>
                  <p>
                    Nuestra responsabilidad total no excedera el monto pagado por
                    el cliente en los doce (12) meses anteriores al evento que dio
                    origen a la reclamacion.
                  </p>
                </div>
              </div>

              {/* Seccion 8 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  8. Garantias y Soporte
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    THADO Consulting se compromete a:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Entregar los servicios acordados segun las especificaciones del contrato</li>
                    <li>Proporcionar soporte tecnico durante el periodo acordado</li>
                    <li>Corregir defectos de software dentro del periodo de garantia</li>
                    <li>Mantener la confidencialidad de la informacion del cliente</li>
                  </ul>
                  <p>
                    Los terminos especificos de garantia y soporte se detallan en
                    cada contrato de servicio.
                  </p>
                </div>
              </div>

              {/* Seccion 9 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  9. Terminacion
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Podemos terminar o suspender tu acceso inmediatamente, sin previo
                    aviso ni responsabilidad, por cualquier razon, incluyendo sin
                    limitacion si incumples estos Terminos y Condiciones.
                  </p>
                  <p>
                    Tras la terminacion, tu derecho a utilizar el servicio cesara
                    inmediatamente. Las disposiciones que por su naturaleza deban
                    sobrevivir a la terminacion, continuaran en vigor.
                  </p>
                </div>
              </div>

              {/* Seccion 10 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  10. Ley Aplicable
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Estos terminos se regiran e interpretaran de acuerdo con las
                    leyes de la Republica del Peru, sin tener en cuenta sus
                    disposiciones sobre conflictos de leyes.
                  </p>
                  <p>
                    Cualquier disputa sera resuelta exclusivamente por los tribunales
                    competentes de Lima, Peru.
                  </p>
                </div>
              </div>

              {/* Seccion 11 */}
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  11. Cambios en los Terminos
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Nos reservamos el derecho de modificar o reemplazar estos terminos
                    en cualquier momento. Los cambios entraran en vigor inmediatamente
                    despues de su publicacion en nuestro sitio web.
                  </p>
                  <p>
                    Es tu responsabilidad revisar estos terminos periodicamente.
                    El uso continuado del servicio despues de la publicacion de
                    cambios constituye la aceptacion de dichos cambios.
                  </p>
                </div>
              </div>

              {/* Seccion 12 - Contacto */}
              <div className={`p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  12. Contacto
                </h2>
                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Si tienes alguna pregunta sobre estos Terminos y Condiciones,
                    puedes contactarnos:
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

export default TermsOfService;
