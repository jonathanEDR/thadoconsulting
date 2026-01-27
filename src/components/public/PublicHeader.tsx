import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useClerkDetection } from '../../hooks/useClerkDetection';
import { useCategoriasList } from '../../hooks/useCategoriasCache';
import Logo from '../Logo';
import '../../styles/gradient-borders.css';

/**
 * Header optimizado para páginas públicas con detección progresiva de usuario
 * 
 * Características:
 * - Carga inicial rápida sin bloqueo por Clerk
 * - Detección progresiva del estado de autenticación
 * - Avatar real del usuario cuando Clerk está disponible
 * - Fallback a iniciales si no hay imagen
 * - Toggle de tema unificado y responsivo
 * - Botón "Contáctanos" temático
 * - Diseño responsive mejorado
 * 
 * Estructura:
 * 1. Logo centrado en móvil, izquierda en desktop
 * 2. Navegación centrada en todas las resoluciones  
 * 3. Toggle tema y avatar en la parte derecha
 */
const PublicHeaderOptimized = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showSolutionsDropdown, setShowSolutionsDropdown] = useState(false);

  // Hook para obtener categorías de servicios para el menú Soluciones
  const { data: categorias = [] } = useCategoriasList({ activas: true });

  // Hook personalizado para detectar usuario de Clerk
  const { userData, getUserInitials } = useClerkDetection();

  // Función para hacer scroll suave hacia la sección de contacto
  const scrollToContact = () => {
    // Buscar la sección de contacto
    const contactElement = document.getElementById('contacto');
    
    if (contactElement) {
      // Si encuentra la sección, hacer scroll suave
      contactElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else if (window.location.pathname === '/') {
      // Si está en home pero no encuentra la sección, esperar y reintentar
      // ✅ Este setTimeout es OK porque es dentro de un handler de click, no un effect
      setTimeout(() => {
        const element = document.getElementById('contacto');
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    } else {
      // Si está en otra página, navegar al home con hash
      navigate('/#contacto');
    }
  };

  // Efecto para controlar la visibilidad del navbar
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // ✅ Efecto para manejar navegación con hash (ej: /#contacto) CON CLEANUP
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (window.location.hash === '#contacto') {
      timeoutId = setTimeout(() => {
        const contactElement = document.getElementById('contacto');
        if (contactElement) {
          contactElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 300);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // 🔧 Efecto para cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowSolutionsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 theme-transition transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'
      }`} 
      style={{
        backgroundColor: lastScrollY > 50 
          ? (theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)') 
          : 'transparent',
        backdropFilter: lastScrollY > 50 ? 'blur(12px) saturate(180%)' : 'none',
        boxShadow: lastScrollY > 50 
          ? (theme === 'dark' 
            ? '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.1)' 
            : '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 40px rgba(139, 92, 246, 0.05)')
          : 'none',
        borderBottom: lastScrollY > 50 
          ? `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.15)'}` 
          : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center h-auto sm:h-14">
          {/* Desktop: Logo izquierda | Mobile: Logo centrado + Toggle tema derecha */}
          <div className="flex justify-between items-center sm:justify-start py-2 sm:py-0 w-full sm:w-auto sm:flex-shrink-0">
            {/* Logo - Centrado en móvil, izquierda en desktop */}
            <div className="flex-1 flex justify-center sm:justify-start sm:flex-initial">
              <Link 
                to="/" 
                aria-label="Scuti Company - Ir al inicio"
                className="flex items-center transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 rounded-lg"
              >
                <Logo size="sm" animated compact />
              </Link>
            </div>

            {/* Theme Toggle - Visible en móvil, oculto en desktop */}
            <div className="sm:hidden flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg transition-all duration-200 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30"
                style={{
                  color: theme === 'dark' ? '#A78BFA' : '#6B21A8'
                }}
                aria-label="Cambiar tema"
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Navegación - Mobile: fila separada | Desktop: centrada entre logo y acciones */}
          <nav className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 py-2 sm:py-0 sm:space-x-4 lg:space-x-6 sm:flex-1 sm:justify-center w-full sm:w-auto" role="navigation" aria-label="Navegación principal" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <Link 
              to="/" 
              className="relative theme-text-primary font-medium theme-transition px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 group overflow-hidden"
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = theme === 'dark' ? '#A78BFA' : '#7C3AED';
                (e.target as HTMLElement).style.backgroundColor = theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = '';
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }}
              aria-current="page"
            >
              <span className="relative z-10">Inicio</span>
            </Link>
            <Link 
              to="/nosotros" 
              className="relative theme-text-secondary theme-transition px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 group overflow-hidden"
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = theme === 'dark' ? '#A78BFA' : '#7C3AED';
                (e.target as HTMLElement).style.backgroundColor = theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = '';
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <span className="relative z-10">Nosotros</span>
            </Link>
            <Link 
              to="/servicios" 
              className="relative theme-text-secondary theme-transition px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 group overflow-hidden"
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = theme === 'dark' ? '#A78BFA' : '#7C3AED';
                (e.target as HTMLElement).style.backgroundColor = theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = '';
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }}
              aria-label="Servicios"
            >
              <span className="relative z-10">Servicios</span>
            </Link>
            <Link 
              to="/blog" 
              className="relative theme-text-secondary theme-transition px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 group overflow-hidden"
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = theme === 'dark' ? '#A78BFA' : '#7C3AED';
                (e.target as HTMLElement).style.backgroundColor = theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = '';
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }}
              aria-label="Blog"
            >
              <span className="relative z-10">Blog</span>
            </Link>
            <div className="relative group dropdown-container">
              <button 
                className="relative theme-text-secondary theme-transition flex items-center px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 group overflow-hidden"
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = theme === 'dark' ? '#A78BFA' : '#7C3AED';
                  (e.target as HTMLElement).style.backgroundColor = theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';
                  setShowSolutionsDropdown(true);
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = '';
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                }}
                onClick={() => setShowSolutionsDropdown(!showSolutionsDropdown)}
                aria-label="Menú de soluciones"
              >
                Soluciones
                <svg className="w-3 h-3 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu - Categorías de Servicios */}
              {categorias.length > 0 && (
                <div
                  className={`absolute top-full left-0 mt-1 w-64 rounded-lg shadow-lg border z-50 transition-all duration-200 ${
                    showSolutionsDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    borderColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(209, 213, 219, 1)',
                    backdropFilter: 'blur(12px)'
                  }}
                  onMouseEnter={() => setShowSolutionsDropdown(true)}
                  onMouseLeave={() => setShowSolutionsDropdown(false)}
                >
                  <div className="py-2">
                    {categorias.map((categoria) => (
                      <Link
                        key={categoria._id}
                        to={`/servicios?categoria=${categoria.slug}`}
                        className="block px-4 py-2.5 text-sm theme-text-secondary theme-transition rounded-md mx-1"
                        onClick={() => setShowSolutionsDropdown(false)}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = theme === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)';
                          (e.target as HTMLElement).style.color = theme === 'dark' ? '#A78BFA' : '#7C3AED';
                          (e.target as HTMLElement).style.paddingLeft = '1.25rem';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = 'transparent';
                          (e.target as HTMLElement).style.color = '';
                          (e.target as HTMLElement).style.paddingLeft = '1rem';
                        }}
                      >
                        {categoria.icono} {categoria.nombre}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CONTÁCTANOS en navegación - Solo visible en móvil */}
            <button 
              onClick={scrollToContact}
              className="sm:hidden px-4 py-1.5 rounded-full transition-all duration-300 font-medium text-xs border-2"
              style={{
                borderColor: theme === 'light' ? '#7528ee' : '#7528ee',
                color: theme === 'light' ? '#7528ee' : '#7528ee',
                backgroundColor: 'transparent',
                fontFamily: "'Montserrat', sans-serif"
              }}
              onMouseEnter={(e) => {
                const element = e.target as HTMLElement;
                element.style.backgroundColor = theme === 'light' ? '#7528ee' : '#7528ee';
                element.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                const element = e.target as HTMLElement;
                element.style.backgroundColor = 'transparent';
                element.style.color = theme === 'light' ? '#7528ee' : '#7528ee';
              }}
            >
              CONTÁCTANOS
            </button>
          </nav>

          {/* Actions Desktop - Toggle de tema + CONTÁCTANOS + Avatar */}
          <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
            {/* Theme Toggle - Solo visible en desktop */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg transition-all duration-200 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30"
              style={{
                color: theme === 'dark' ? '#A78BFA' : '#6B21A8'
              }}
              aria-label="Cambiar tema"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            
            {/* CONTÁCTANOS - Color rosado en tema blanco */}
            <button 
              onClick={scrollToContact}
              className="px-4 py-2 rounded-full transition-all duration-300 font-semibold text-xs border-2 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              style={{
                borderColor: '#7528ee',
                color: theme === 'dark' ? '#A78BFA' : '#7528ee',
                backgroundColor: 'transparent',
                boxShadow: theme === 'dark' ? '0 4px 12px rgba(139, 92, 246, 0.2)' : '0 4px 12px rgba(117, 40, 238, 0.15)',
                fontFamily: "'Montserrat', sans-serif"
              }}
              onMouseEnter={(e) => {
                const element = e.target as HTMLElement;
                element.style.backgroundColor = '#7528ee';
                element.style.color = '#FFFFFF';
                element.style.borderColor = '#7528ee';
                element.style.boxShadow = theme === 'dark' ? '0 8px 20px rgba(139, 92, 246, 0.4)' : '0 8px 20px rgba(117, 40, 238, 0.3)';
              }}
              onMouseLeave={(e) => {
                const element = e.target as HTMLElement;
                element.style.backgroundColor = 'transparent';
                element.style.color = theme === 'dark' ? '#A78BFA' : '#7528ee';
                element.style.borderColor = '#7528ee';
                element.style.boxShadow = theme === 'dark' ? '0 4px 12px rgba(139, 92, 246, 0.2)' : '0 4px 12px rgba(117, 40, 238, 0.15)';
              }}
            >
              CONTÁCTANOS
            </button>

            {/* Avatar del usuario - Solo si está logueado */}
            {userData ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-1.5 px-2 py-1.5 rounded-lg transition-all duration-200 group border"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                  borderColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
                  backdropFilter: 'blur(8px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';
                  e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)';
                }}
                aria-label={`Dashboard de ${userData.firstName || 'Usuario'}`}
                title={`Ir al dashboard - ${userData.firstName || 'Usuario'}`}
              >
                {/* Avatar con imagen real o iniciales */}
                {userData.imageUrl ? (
                  <img 
                    src={userData.imageUrl} 
                    alt={`Avatar de ${userData.firstName || 'Usuario'}`}
                    className="w-6 h-6 rounded-full object-cover border-2 transition-all duration-200"
                    style={{
                      borderColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)'
                    }}
                    onError={(e) => {
                      // Si falla la imagen, mostrar iniciales
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                
                {/* Fallback con iniciales */}
                <div 
                  className={`w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-medium text-xs border-2 transition-all duration-200 ${
                    userData.imageUrl ? 'hidden' : ''
                  }`}
                  style={{
                    borderColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)'
                  }}
                >
                  {getUserInitials()}
                </div>
                
                {/* Flecha indicadora */}
                <svg 
                  className="w-3 h-3 transition-colors duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{
                    color: theme === 'dark' ? '#A78BFA' : '#8B5CF6'
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : null}
          </div>

        </div>
      </div>

    </header>
  );
};

export default PublicHeaderOptimized;
