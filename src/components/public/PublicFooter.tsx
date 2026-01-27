import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logo from '../Logo';
import { SITE_CONFIG } from '../../config/siteConfig';
import type { PageData } from '../../types/cms';
import { getCmsApiUrl, logApiCall, testBackendConnection } from '../../utils/apiHelper';
import { useClerkDetection } from '../../hooks/useClerkDetection';
import { useCategoriasList } from '../../hooks/useCategoriasCache';

const PublicFooter = () => {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<PageData | null>(null);

  // Hook para detectar usuario autenticado (mejorado para producción)
  const { userData, getUserInitials, isLoading } = useClerkDetection();

  // Hook para obtener categorías de servicios
  const { data: categorias = [] } = useCategoriasList({ activas: true });
  
  useEffect(() => {
    let isMounted = true;
    
    const CACHE_KEY = 'publicFooter_pageData';
    // ⚡ 8 horas - Páginas públicas (contenido estático)
    const CACHE_DURATION = 8 * 60 * 60 * 1000;

    const fetchPageData = async () => {
      if (!isMounted) return;

      try {
        // ✅ PRIMERO: Verificar si hay datos en localStorage
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          try {
            const { data, timestamp } = JSON.parse(cachedData);
            const age = Date.now() - timestamp;
            
            if (age < CACHE_DURATION && isMounted) {
              setPageData(data);
              return; // ✅ Usar caché - NO hacer request
            }
          } catch (e) {
            console.error('Error parseando localStorage:', e);
          }
        }

        // ✅ SEGUNDO: Si no hay caché válido, hacer request
        const timestamp = new Date().getTime();
        const apiUrl = `${getCmsApiUrl('/pages/home')}?t=${timestamp}`;
        
        logApiCall(apiUrl, 'Obteniendo datos de página home');
        
        const response = await fetch(apiUrl);
        
        if (response.ok) {
          const result = await response.json();
          const data = result.data || result;
          
          if (isMounted) {
            setPageData(data);
            
            // ✅ Guardar en localStorage para próximas visitas
            localStorage.setItem(CACHE_KEY, JSON.stringify({
              data,
              timestamp: Date.now()
            }));
          }
        } else {
          console.error('Error obteniendo datos del footer:', response.status);
        }
      } catch (error) {
        console.error('Error fetching page data:', error);
      }
    };

    testBackendConnection();
    fetchPageData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const contactData = pageData?.content?.contact;
  
  return (
    <footer className="relative theme-transition theme-border" 
            style={{
              borderTopWidth: '1px',
              borderTopColor: `color-mix(in srgb, var(--color-primary) 20%, transparent)`,
              backgroundImage: 'url(/8.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
      {/* Contenido del footer - Sin overlay para mostrar imagen HD */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Layout responsive: móvil vertical, desktop horizontal */}
        <div className="space-y-8 lg:space-y-0">
          {/* Layout Desktop: Todo en una fila horizontal */}
          <div className="hidden lg:flex lg:items-start lg:justify-between lg:gap-12">
            {/* Logo y Descripción de la Empresa */}
            <div className="flex-shrink-0 max-w-sm">
              <div className="mb-4">
                <Logo size="lg" withText variant="white" />
              </div>
              {/* 🆕 Descripción de la empresa */}
              {contactData?.description && (
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {contactData.description}
                </p>
              )}
              
              {/* 🆕 Información estructurada (Schema.org) - ✅ Usando configuración centralizada */}
              <div 
                itemScope 
                itemType="https://schema.org/Organization"
                className="hidden"
              >
                <meta itemProp="name" content={SITE_CONFIG.siteName} />
                <meta itemProp="url" content={SITE_CONFIG.siteUrl} />
                <meta itemProp="email" content={contactData?.email || SITE_CONFIG.contact.email} />
                <meta itemProp="telephone" content={contactData?.phone || SITE_CONFIG.contact.phone} />
                <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <meta itemProp="streetAddress" content={contactData?.address || SITE_CONFIG.contact.address} />
                  <meta itemProp="addressLocality" content={contactData?.city || SITE_CONFIG.region} />
                  <meta itemProp="addressRegion" content={contactData?.country || SITE_CONFIG.country} />
                </div>
                <meta itemProp="openingHours" content={SITE_CONFIG.contact.openingHours} />
              </div>
            </div>

            {/* Soluciones - Categorías de servicios */}
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-4">Soluciones</h3>
              <ul className="space-y-2">
                {categorias.length > 0 ? (
                  categorias.slice(0, 5).map((categoria) => (
                    <li key={categoria._id}>
                      <Link
                        to={`/servicios?categoria=${categoria.slug}`}
                        className="text-gray-200 hover:text-purple-400 transition-colors text-sm"
                      >
                        {categoria.icono} {categoria.nombre}
                      </Link>
                    </li>
                  ))
                ) : (
                  // Fallback mientras cargan las categorías
                  <>
                    <li><Link to="/servicios" className="text-gray-200 hover:text-purple-400 transition-colors text-sm">Ver todos los servicios</Link></li>
                  </>
                )}
                {/* Siempre mostrar link a todos los servicios */}
                {categorias.length > 0 && (
                  <li className="pt-2 border-t border-gray-700">
                    <Link to="/servicios" className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
                      Ver todos →
                    </Link>
                  </li>
                )}
              </ul>
            </div>

          

            {/* Recursos */}
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-200 hover:text-purple-400 transition-colors text-sm">Blog de Tecnología</Link></li>
                <li><Link to="/recursos/casos-exito" className="text-gray-200 hover:text-purple-400 transition-colors text-sm">Casos de Éxito</Link></li>
                <li><Link to="/recursos/guias" className="text-gray-200 hover:text-purple-400 transition-colors text-sm">Guías y Tutoriales</Link></li>
                <li><Link to="/recursos/webinars" className="text-gray-200 hover:text-purple-400 transition-colors text-sm">Webinars</Link></li>
                <li><Link to="/nosotros" className="text-gray-200 hover:text-purple-400 transition-colors text-sm">Sobre Nosotros</Link></li>
              </ul>
            </div>

             {/* Acceso - Movido aquí en lugar de Industrias */}
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-4">Acceso</h3>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="w-full px-4 py-2 bg-gray-700/50 rounded-lg animate-pulse">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-300 text-sm">Verificando sesión...</span>
                      </div>
                    </div>
                  </div>
                ) : userData ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-medium rounded-lg hover:shadow-lg transition-all text-sm"
                      title={`Ir al dashboard - ${userData.firstName || 'Usuario'}`}
                    >
                      {userData.imageUrl ? (
                        <img 
                          src={userData.imageUrl} 
                          alt={`Avatar de ${userData.firstName || 'Usuario'}`}
                          className="w-4 h-4 rounded-full object-cover border border-white/20"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs ${
                          userData.imageUrl ? 'hidden' : ''
                        }`}
                      >
                        {getUserInitials()}
                      </div>
                      <span>Mi Dashboard</span>
                    </button>
                    <div className="text-center text-gray-400 text-xs">
                      Hola, {userData.firstName || 'Usuario'} 👋
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full px-4 py-2 text-gray-200 hover:text-purple-400 transition-colors text-sm text-left border border-gray-600 rounded-lg hover:border-purple-400"
                    >
                      🔐 Iniciar Sesión
                    </button>
                    <button
                      onClick={() => navigate('/signup')}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all text-sm"
                    >
                      🚀 Crear Cuenta
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Contáctanos */}
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-4">Contáctanos</h3>
              <div className="space-y-3 text-sm">
                {/* 🆕 Dirección */}
                {(contactData?.address || contactData?.city) && (
                  <div className="flex items-start space-x-2 text-gray-200">
                    <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      {contactData?.address && <div>{contactData.address}</div>}
                      <div>
                        {contactData?.city || 'Lima'}, {contactData?.country || 'Perú'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Teléfono - ✅ Usando configuración centralizada */}
                <div className="flex items-center space-x-2 text-gray-200">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${contactData?.phone || SITE_CONFIG.contact.phoneClean}`} className="hover:text-purple-400 transition-colors">
                    {contactData?.phone || SITE_CONFIG.contact.phone}
                  </a>
                </div>
                
                {/* Email - ✅ Usando configuración centralizada */}
                <div className="flex items-center space-x-2 text-gray-200">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${contactData?.email || SITE_CONFIG.contact.email}`} className="hover:text-purple-400 transition-colors">
                    {contactData?.email || SITE_CONFIG.contact.email}
                  </a>
                </div>

                {/* 🆕 Horario de atención */}
                {contactData?.businessHours && (
                  <div className="flex items-start space-x-2 text-gray-200">
                    <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="font-medium text-white text-xs">Horario de Atención</div>
                      <div>{contactData.businessHours}</div>
                    </div>
                  </div>
                )}

                {/* Redes sociales dinámicas */}
                <div className="mt-4">
                  <div className="flex space-x-3">
                    {/* Redes sociales dinámicas */}
                    {contactData?.socialLinks && Array.isArray(contactData.socialLinks) && contactData.socialLinks.length > 0 ? (
                      <>
                        {contactData.socialLinks
                          .filter(link => link && link.enabled)
                          .map((link, index) => {
                            return (
                              <a 
                                key={`${link.name}-${index}`}
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors group"
                                title={link.name}
                              >
                                {link.icon ? (
                                  <img 
                                    src={link.icon} 
                                    alt={link.name}
                                    className="w-4 h-4 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-4 h-4 bg-white rounded-sm" title="Sin icono configurado"></div>
                                )}
                              </a>
                            );
                          })
                        }
                      </>
                    ) : (
                      // Fallback con iconos por defecto - ✅ Usando configuración centralizada
                      <>
                        <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors" title="Facebook">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                        <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors" title="Instagram">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                        <a href={SITE_CONFIG.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors" title="Twitter">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                          </svg>
                        </a>
                        <a href={SITE_CONFIG.social.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-green-600 transition-colors" title="WhatsApp">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Layout Móvil/Tablet: Mantenemos el diseño original */}
          <div className="lg:hidden space-y-8">
            {/* Brand y Descripción - Centrado en móvil */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="mb-4">
                <Logo size="lg" withText variant="white" />
              </div>
              {/* 🆕 Descripción para móvil */}
              {contactData?.description && (
                <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                  {contactData.description}
                </p>
              )}
            </div>

            {/* Contenido principal - Grid responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Soluciones y Acceso juntos en móvil */}
              <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-0">
                {/* Soluciones - Categorías de servicios */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Soluciones</h3>
                  <ul className="space-y-2">
                    {categorias.length > 0 ? (
                      categorias.slice(0, 5).map((categoria) => (
                        <li key={categoria._id}>
                          <Link
                            to={`/servicios?categoria=${categoria.slug}`}
                            className="text-gray-200 hover:text-purple-400 transition-colors text-sm"
                          >
                            {categoria.icono} {categoria.nombre}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li><Link to="/servicios" className="text-gray-200 hover:text-purple-400 transition-colors text-sm">Ver todos los servicios</Link></li>
                    )}
                    {categorias.length > 0 && (
                      <li className="pt-2 border-t border-gray-700">
                        <Link to="/servicios" className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
                          Ver todos →
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Acceso - Movido aquí */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Acceso</h3>
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="space-y-3">
                        <div className="w-full px-4 py-2 bg-gray-700/50 rounded-lg animate-pulse">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-300 text-sm">Verificando...</span>
                          </div>
                        </div>
                      </div>
                    ) : userData ? (
                      <div className="space-y-3">
                        <button
                          onClick={() => navigate('/dashboard')}
                          className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-medium rounded-lg hover:shadow-lg transition-all text-sm"
                        >
                          {userData.imageUrl ? (
                            <img 
                              src={userData.imageUrl} 
                              alt="Avatar"
                              className="w-4 h-4 rounded-full object-cover border border-white/20"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                              {getUserInitials()}
                            </div>
                          )}
                          <span>Mi Dashboard</span>
                        </button>
                        <div className="text-center text-gray-400 text-xs">
                          Hola, {userData.firstName || 'Usuario'} 👋
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate('/login')}
                          className="w-full px-4 py-2 text-gray-200 hover:text-purple-400 transition-colors text-sm text-left border border-gray-600 rounded-lg hover:border-purple-400"
                        >
                          🔐 Iniciar Sesión
                        </button>
                        <button
                          onClick={() => navigate('/signup')}
                          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all text-sm"
                        >
                          🚀 Crear Cuenta
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Recursos y Contáctanos juntos en móvil */}
              <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-0">
                {/* Recursos */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Recursos</h3>
                  <ul className="space-y-2">
                    <li><Link to="/blog" className="text-gray-200 hover:text-purple-400 transition-colors text-sm">Blog de Tecnología</Link></li>
                    <li><Link to="/recursos/casos-exito" className="text-gray-200 hover:text-purple-400 transition-colors text-sm">Casos de Éxito</Link></li>
                    <li><Link to="/recursos/guias" className="text-gray-200 hover:text-purple-400 transition-colors text-sm">Guías y Tutoriales</Link></li>
                    <li><Link to="/recursos/webinars" className="text-gray-200 hover:text-purple-400 transition-colors text-sm">Webinars</Link></li>
                    <li><Link to="/nosotros" className="text-gray-200 hover:text-purple-400 transition-colors text-sm">Sobre Nosotros</Link></li>
                  </ul>
                </div>
                
                {/* Contáctanos */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Contáctanos</h3>
                  <div className="space-y-3 text-sm">
                    {/* 🆕 Dirección para móvil */}
                    {(contactData?.address || contactData?.city) && (
                      <div className="flex items-start space-x-2 text-gray-200">
                        <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          {contactData?.address && <div>{contactData.address}</div>}
                          <div>
                            {contactData?.city || SITE_CONFIG.region}, {contactData?.country || SITE_CONFIG.country}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Teléfono - ✅ Usando configuración centralizada */}
                    <div className="flex items-center space-x-2 text-gray-200">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${contactData?.phone || SITE_CONFIG.contact.phoneClean}`} className="hover:text-purple-400 transition-colors">
                        {contactData?.phone || SITE_CONFIG.contact.phone}
                      </a>
                    </div>
                    
                    {/* Email - ✅ Usando configuración centralizada */}
                    <div className="flex items-center space-x-2 text-gray-200">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${contactData?.email || SITE_CONFIG.contact.email}`} className="hover:text-purple-400 transition-colors">
                        {contactData?.email || SITE_CONFIG.contact.email}
                      </a>
                    </div>

                    {/* 🆕 Horario de atención para móvil */}
                    {contactData?.businessHours && (
                      <div className="flex items-start space-x-2 text-gray-200">
                        <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <div className="font-medium text-white text-xs">Horario de Atención</div>
                          <div>{contactData.businessHours}</div>
                        </div>
                      </div>
                    )}

                    {/* Redes sociales dinámicas */}
                    <div className="mt-4">
                      <div className="flex space-x-3">
                        {/* 🔥 SOLUCIÓN 5: Mejorar validación y logging para móvil */}
                        {contactData?.socialLinks && Array.isArray(contactData.socialLinks) && contactData.socialLinks.length > 0 ? (
                          <>
                            {contactData.socialLinks
                              .filter(link => link && link.enabled)
                              .map((link, index) => {
                                return (
                                  <a 
                                    key={`${link.name}-mobile-${index}`}
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors group"
                                    title={link.name}
                                  >
                                    {link.icon ? (
                                      <img 
                                        src={link.icon} 
                                        alt={link.name}
                                        className="w-4 h-4 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    ) : (
                                      <div className="w-4 h-4 bg-white rounded-sm" title="Sin icono configurado"></div>
                                    )}
                                  </a>
                                );
                              })
                            }
                          </>
                        ) : (
                          // Fallback con iconos por defecto si no hay redes sociales configuradas
                          <>
                            <a href="https://www.facebook.com/profile.php?id=61564318740689" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors" title="Facebook">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61564318740689" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors" title="Pinterest">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.083.346-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017 0z"/>
                              </svg>
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61564318740689" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors" title="Twitter">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                              </svg>
                            </a>
                            <a href="https://wa.me/51973397306" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-green-600 transition-colors" title="WhatsApp">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                              </svg>
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

     
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 bg-black/90 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Scuti Company. Todos los derechos reservados.
            </p>
            
            {/* Enlaces legales */}
            <div className="flex flex-wrap justify-center space-x-6 text-sm">
              <Link to="/privacidad" className="text-gray-400 hover:text-purple-400 transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/terminos" className="text-gray-400 hover:text-purple-400 transition-colors">
                Términos de Servicio
              </Link>
              <a href="/sitemap.xml" className="text-gray-400 hover:text-purple-400 transition-colors">
                Sitemap
              </a>
            </div>

            {/* 🆕 Badges de confianza */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-green-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs">SSL Seguro</span>
              </div>
              
              <div className="flex items-center space-x-1 text-blue-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs">Desarrollo Rápido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
