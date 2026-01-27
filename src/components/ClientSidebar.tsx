/**
 * 🏠 Sidebar Simplificado para Clientes
 * Sidebar minimalista para USER y CLIENT con opciones básicas
 */

import { SignOutButton } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import RoleBadge from './RoleBadge';
import { useDashboardSidebarConfig } from '../hooks/cms/useDashboardSidebarConfig';
import { useTheme } from '../contexts/ThemeContext';
import DynamicIcon from './ui/DynamicIcon';
import NotificationBell from './notifications/NotificationBell';

interface ClientSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface MenuItem {
  name: string;
  icon: string;
  menuKey: string;
  path: string;
  description: string;
}

export default function ClientSidebar({ isOpen, setIsOpen }: ClientSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = useAuth();
  
  // 🎨 Configuración dinámica del sidebar desde CMS
  const { clientConfig, globalConfig, getMenuIcon } = useDashboardSidebarConfig();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Estilos dinámicos basados en la configuración del CMS
  const styles = {
    headerGradient: isDarkMode
      ? `linear-gradient(to right, ${clientConfig.headerGradientFromDark}, ${clientConfig.headerGradientViaDark}, ${clientConfig.headerGradientToDark})`
      : `linear-gradient(to right, ${clientConfig.headerGradientFrom}, ${clientConfig.headerGradientVia}, ${clientConfig.headerGradientTo})`,
    activeItemGradient: isDarkMode
      ? `linear-gradient(to right, ${clientConfig.activeItemGradientFromDark}, ${clientConfig.activeItemGradientToDark})`
      : `linear-gradient(to right, ${clientConfig.activeItemGradientFrom}, ${clientConfig.activeItemGradientTo})`,
    sidebarBg: isDarkMode ? clientConfig.sidebarBgDark : clientConfig.sidebarBgLight,
    navBg: clientConfig.navBgTransparent ? 'transparent' : (isDarkMode ? clientConfig.navBgDark : clientConfig.navBgLight),
    navTextColor: isDarkMode ? clientConfig.navTextColorDark : clientConfig.navTextColor,
    navHoverBg: clientConfig.navHoverBgTransparent ? 'transparent' : (isDarkMode ? clientConfig.navHoverBgDark : clientConfig.navHoverBgLight),
    navHoverBgTransparent: clientConfig.navHoverBgTransparent || false,
    hoverBorderGradientEnabled: clientConfig.hoverBorderGradientEnabled || false,
    hoverBorderGradient: `linear-gradient(to right, ${clientConfig.hoverBorderGradientFrom || '#22c55e'}, ${clientConfig.hoverBorderGradientTo || '#3b82f6'})`,
    footerBg: isDarkMode ? clientConfig.footerBgDark : clientConfig.footerBgLight,
    borderColor: isDarkMode ? globalConfig.borderColorDark : globalConfig.borderColorLight,
    // Tipografía
    fontFamily: globalConfig.fontFamily || 'Montserrat',
    fontSizeBase: globalConfig.fontSizeBase || '0.875rem',
    fontSizeMenu: globalConfig.fontSizeMenu || '0.9375rem',
    fontSizeHeader: globalConfig.fontSizeHeader || '1rem',
    fontWeightNormal: globalConfig.fontWeightNormal || '500',
    fontWeightBold: globalConfig.fontWeightBold || '600',
  };

  // Menú simplificado solo para USER y CLIENT
  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: '🏠',
      menuKey: 'dashboard',
      path: '/dashboard/client',
      description: 'Panel principal'
    },
    {
      name: 'Mensajes',
      icon: '💬',
      menuKey: 'mensajes',
      path: '/dashboard/client/messages',
      description: 'Comunicación y solicitudes'
    },
    {
      name: 'Mi Actividad',
      icon: '📚',
      menuKey: 'actividad',
      path: '/dashboard/mi-blog',
      description: 'Actividad en el blog'
    },
    {
      name: 'Perfil',
      icon: '👤',
      menuKey: 'profile',
      path: '/dashboard/profile',
      description: 'Tu información'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    // Cerrar sidebar en móvil después de navegar
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full backdrop-blur-xl shadow-2xl z-30
          transition-all duration-300 ease-in-out flex flex-col overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isOpen ? 'w-72' : 'w-0 md:w-16'}
        `}
        style={{
          backgroundColor: styles.sidebarBg,
          borderRight: `1px solid ${styles.borderColor}`,
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSizeBase,
          fontWeight: styles.fontWeightNormal,
        }}
      >
        {/* Header del Sidebar */}
        <div 
          className="relative overflow-hidden"
          style={{ background: styles.headerGradient }}
        >
          {/* Efecto de fondo */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/10"></div>
          
          <div className="relative z-10">
            {isOpen ? (
              // Sidebar expandido
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      <img 
                        src={globalConfig.logoUrl} 
                        alt={globalConfig.logoAlt} 
                        className="h-8 w-auto filter brightness-0 invert"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Theme Toggle */}
                    <div className="bg-white/20 rounded-lg">
                      <ThemeToggle />
                    </div>
                    {/* 🔔 Campana de Notificaciones */}
                    <NotificationBell iconClassName="w-4 h-4" />
                    {/* Botón Cerrar Sesión compacto */}
                    <SignOutButton>
                      <button
                        className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200"
                        title="Cerrar Sesión"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </button>
                    </SignOutButton>
                    {/* Botón contraer */}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200"
                      title="Contraer sidebar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Panel de Usuario mejorado */}
                <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-lg p-3 border border-white/30 dark:border-white/20 shadow-lg">
                  {/* Información del usuario */}
                  {user && (
                    <div className="flex items-center gap-3 mb-3">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt="Tu foto"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/40 shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold border-2 border-white/40 shadow-md">
                          {(user.firstName || user.email).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p 
                          className="font-semibold text-white truncate"
                          style={{ 
                            fontSize: styles.fontSizeHeader,
                            fontWeight: styles.fontWeightBold 
                          }}
                        >
                          {user.firstName || user.email.split('@')[0]}
                        </p>
                        <p className="text-xs text-white/70 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status y Badge de Rol */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <span className="text-xs text-white/80 font-medium">Sesión Activa</span>
                    </div>
                    {role && <RoleBadge role={role} size="sm" />}
                  </div>
                </div>
              </div>
            ) : (
              // Sidebar colapsado
              <div className="p-2 flex flex-col items-center">
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors mb-2"
                  title="Expandir sidebar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Theme Toggle colapsado */}
                <div className="bg-white/20 rounded-lg mb-2">
                  <ThemeToggle />
                </div>
                
                {/* 🔔 Campana de Notificaciones colapsado */}
                <div className="mb-2">
                  <NotificationBell iconClassName="w-4 h-4" isCollapsed={true} />
                </div>
                
                {/* Botón Cerrar Sesión en modo colapsado */}
                <SignOutButton>
                  <button
                    className="text-white/80 hover:text-white hover:bg-red-500/20 rounded-lg p-1.5 transition-all duration-200"
                    title="Cerrar Sesión"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </SignOutButton>
                
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg mt-2"></div>
              </div>
            )}
          </div>
        </div>

        {/* Navegación Simplificada */}
        <nav 
          className="flex-1 overflow-y-auto backdrop-blur-sm transition-colors duration-300"
          style={{ backgroundColor: styles.navBg }}
        >
          {isOpen ? (
            // Navegación expandida
            <div className="p-3">
              <div className="mb-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-1">
                  Navegación
                </p>
              </div>
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        group w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'text-white shadow-lg scale-[1.01]'
                          : 'hover:translate-x-0.5'
                        }
                      `}
                      style={{
                        background: isActive ? styles.activeItemGradient : 'transparent',
                        color: isActive ? 'white' : styles.navTextColor,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          if (styles.navHoverBgTransparent && styles.hoverBorderGradientEnabled) {
                            e.currentTarget.style.background = styles.hoverBorderGradient;
                            e.currentTarget.style.padding = '1px';
                            const inner = e.currentTarget.querySelector('.menu-item-inner') as HTMLElement;
                            if (inner) {
                              inner.style.background = styles.sidebarBg;
                              inner.style.borderRadius = '7px';
                              inner.style.padding = '7px 11px';
                            }
                          } else {
                            e.currentTarget.style.backgroundColor = styles.navHoverBg;
                          }
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.padding = '';
                          const inner = e.currentTarget.querySelector('.menu-item-inner') as HTMLElement;
                          if (inner) {
                            inner.style.background = '';
                            inner.style.padding = '';
                          }
                        }
                      }}
                    >
                      <div className="menu-item-inner flex items-center gap-2 w-full rounded-lg transition-all">
                        <span className={`transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                          <DynamicIcon 
                            name={getMenuIcon(item.menuKey, isDarkMode).iconName}
                            color={isActive ? 'white' : getMenuIcon(item.menuKey, isDarkMode).color}
                            size={20}
                          />
                        </span>
                        <div className="flex-1 text-left">
                          <div 
                            className={`font-medium ${isActive ? 'text-white' : ''}`}
                            style={{ 
                              fontSize: styles.fontSizeMenu,
                              fontWeight: styles.fontWeightBold 
                            }}
                          >
                            {item.name}
                          </div>
                          <div 
                            className={`text-xs leading-tight ${isActive ? 'text-white/80' : 'opacity-70'}`}
                            style={{ fontSize: styles.fontSizeBase }}
                          >
                            {item.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full shadow-lg shadow-white/50 animate-pulse"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Navegación colapsada (solo iconos)
            <div className="p-1">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        group w-full flex items-center justify-center p-2.5 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'text-white shadow-lg scale-105'
                          : 'hover:scale-105'
                        }
                      `}
                      style={{
                        background: isActive ? styles.activeItemGradient : 'transparent',
                        color: isActive ? 'white' : styles.navTextColor,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          if (styles.navHoverBgTransparent && styles.hoverBorderGradientEnabled) {
                            e.currentTarget.style.background = styles.hoverBorderGradient;
                            e.currentTarget.style.padding = '1px';
                            const inner = e.currentTarget.querySelector('.menu-icon-inner') as HTMLElement;
                            if (inner) {
                              inner.style.background = styles.sidebarBg;
                              inner.style.borderRadius = '7px';
                              inner.style.padding = '9px';
                            }
                          } else {
                            e.currentTarget.style.backgroundColor = styles.navHoverBg;
                          }
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.padding = '';
                          const inner = e.currentTarget.querySelector('.menu-icon-inner') as HTMLElement;
                          if (inner) {
                            inner.style.background = '';
                            inner.style.padding = '';
                          }
                        }
                      }}
                      title={item.name}
                    >
                      <div className="menu-icon-inner flex items-center justify-center rounded-lg transition-all">
                        <span>
                          <DynamicIcon 
                            name={getMenuIcon(item.menuKey, isDarkMode).iconName}
                            color={isActive ? 'white' : getMenuIcon(item.menuKey, isDarkMode).color}
                            size={20}
                          />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Footer con versión */}
        <div 
          className="backdrop-blur-sm transition-colors duration-300 p-3"
          style={{ 
            backgroundColor: styles.navBg,
            borderTop: `1px solid ${styles.borderColor}`,
          }}
        >
          {isOpen ? (
            // Footer expandido
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">Web Scuti v1.0.0</p>
              <p className="text-xs text-slate-400 dark:text-gray-500">© 2025</p>
            </div>
          ) : (
            // Footer colapsado
            <div className="text-center">
              <p className="text-xs text-slate-400 dark:text-gray-500">v1.0</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}