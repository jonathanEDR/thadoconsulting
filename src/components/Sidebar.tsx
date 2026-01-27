import { SignOutButton } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Permission } from '../types/roles';
import RoleBadge from './RoleBadge';
import { messageService } from '../services/messageService';
import { useDashboardSidebarConfig } from '../hooks/cms/useDashboardSidebarConfig';
import { useTheme } from '../contexts/ThemeContext';
import DynamicIcon from './ui/DynamicIcon';
import NotificationBell from './notifications/NotificationBell';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface MenuItem {
  name: string;
  icon: string;
  menuKey: string; // Clave para buscar el icono en la configuración CMS
  path: string;
  description: string;
  // Control de acceso
  roles?: UserRole[]; // Roles que pueden ver este item (si está vacío, todos lo ven)
  permission?: Permission; // Permiso específico requerido
  adminOnly?: boolean; // Solo para ADMIN, MODERATOR, SUPER_ADMIN
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, hasPermission, canAccessAdmin, shouldUseClientDashboard: isClientUser } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  // 🎨 Configuración dinámica del sidebar desde CMS
  const { adminConfig, globalConfig, getMenuIcon } = useDashboardSidebarConfig();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Estilos dinámicos basados en la configuración del CMS
  const styles = {
    headerGradient: isDarkMode
      ? `linear-gradient(to right, ${adminConfig.headerGradientFromDark}, ${adminConfig.headerGradientViaDark}, ${adminConfig.headerGradientToDark})`
      : `linear-gradient(to right, ${adminConfig.headerGradientFrom}, ${adminConfig.headerGradientVia}, ${adminConfig.headerGradientTo})`,
    activeItemGradient: isDarkMode
      ? `linear-gradient(to right, ${adminConfig.activeItemGradientFromDark}, ${adminConfig.activeItemGradientToDark})`
      : `linear-gradient(to right, ${adminConfig.activeItemGradientFrom}, ${adminConfig.activeItemGradientTo})`,
    sidebarBg: isDarkMode ? adminConfig.sidebarBgDark : adminConfig.sidebarBgLight,
    navBg: adminConfig.navBgTransparent ? 'transparent' : (isDarkMode ? adminConfig.navBgDark : adminConfig.navBgLight),
    navTextColor: isDarkMode ? adminConfig.navTextColorDark : adminConfig.navTextColor,
    navHoverBg: adminConfig.navHoverBgTransparent ? 'transparent' : (isDarkMode ? adminConfig.navHoverBgDark : adminConfig.navHoverBgLight),
    navHoverBgTransparent: adminConfig.navHoverBgTransparent || false,
    hoverBorderGradientEnabled: adminConfig.hoverBorderGradientEnabled || false,
    hoverBorderGradient: `linear-gradient(to right, ${adminConfig.hoverBorderGradientFrom || '#3b82f6'}, ${adminConfig.hoverBorderGradientTo || '#a855f7'})`,
    footerBg: isDarkMode ? adminConfig.footerBgDark : adminConfig.footerBgLight,
    logoutGradient: `linear-gradient(to right, ${adminConfig.logoutButtonGradientFrom}, ${adminConfig.logoutButtonGradientTo})`,
    borderColor: isDarkMode ? globalConfig.borderColorDark : globalConfig.borderColorLight,
  };

  useEffect(() => {
    let mounted = true;
    const loadUnread = async () => {
      try {
        const response = await messageService.getUnreadMessages();
        if (!mounted) return;
        if (response && response.success && response.data) {
          setUnreadCount(response.data.total || (response.data.mensajes || []).length || 0);
        }
      } catch (error) {
        // No bloquear la UI por errores de badge
        // console.warn('[Sidebar] error cargando mensajes no leídos', error);
      }
    };

    loadUnread();
    const interval = setInterval(loadUnread, 60000); // poll cada 60s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Definir items del menú con control de acceso
  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: '🏠',
      menuKey: 'dashboard',
      path: isClientUser ? '/dashboard/client' : '/dashboard/admin',
      description: 'Panel principal',
      // Todos pueden ver el dashboard
    },
    {
      name: 'Perfil',
      icon: '👤',
      menuKey: 'profile',
      path: '/dashboard/profile',
      description: 'Tu información personal',
      // Todos pueden ver su perfil
    },
    {
      name: 'Módulo Servicios',
      icon: '🚀',
      menuKey: 'servicios',
      path: '/dashboard/servicios/management',
      description: 'Gestión avanzada de servicios',
      permission: Permission.MANAGE_CONTENT,
      adminOnly: true,
      // Solo ADMIN, MODERATOR, SUPER_ADMIN - Panel de gestión de servicios
    },
    {
      name: 'CMS',
      icon: '📝',
      menuKey: 'cms',
      path: '/dashboard/cms',
      description: 'Gestor de contenido',
      permission: Permission.MANAGE_CONTENT,
      adminOnly: true,
      // Solo ADMIN, MODERATOR, SUPER_ADMIN
    },
    {
      name: 'Solicitudes',
      icon: '📋',
      menuKey: 'solicitudes',
      path: '/dashboard/crm',
      description: 'Gestión de solicitudes',
      permission: Permission.MANAGE_CONTENT,
      adminOnly: true,
      // Solo roles administrativos - Sistema de gestión de solicitudes
    },
    {
      name: 'Mensajes',
      icon: '💬',
      menuKey: 'mensajes',
      path: '/dashboard/crm/messages',
      description: 'Mensajes de solicitudes',
      permission: Permission.MANAGE_CONTENT,
      adminOnly: true,
    },
    {
      name: 'Agenda',
      icon: '📅',
      menuKey: 'agenda',
      path: '/dashboard/agenda',
      description: 'Calendario y eventos',
      permission: Permission.MANAGE_CONTENT,
      adminOnly: true,
      // Solo roles administrativos - Módulo de agenda
    },
    {
      name: 'Media Library',
      icon: '🖼️',
      menuKey: 'media',
      path: '/dashboard/media',
      description: 'Gestión de imágenes',
      permission: Permission.MANAGE_UPLOADS,
      adminOnly: true,
      // Solo roles administrativos con MANAGE_UPLOADS
    },
    {
      name: 'Blog',
      icon: '📝',
      menuKey: 'blog',
      path: '/dashboard/blog',
      description: 'Gestión del blog',
      permission: Permission.MANAGE_CONTENT,
      adminOnly: true,
      // Solo roles administrativos - Módulo de blog
    },
    {
      name: 'Agentes IA',
      icon: '🤖',
      menuKey: 'agentesIA',
      path: '/dashboard/ai-agents',
      description: 'Sistema de agentes inteligentes',
      permission: Permission.MANAGE_SYSTEM,
      roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      // Solo ADMIN y SUPER_ADMIN - Sistema de IA
    },
    {
      name: 'THADO AI',
      icon: '✨',
      menuKey: 'scutiAI',
      path: '/dashboard/scuti-ai',
      description: 'Chat inteligente con asistente IA contable',
      permission: Permission.MANAGE_SYSTEM,
      roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      // Solo ADMIN y SUPER_ADMIN - Chat principal
    },
    {
      name: 'Gestión de Usuarios',
      icon: '👥',
      menuKey: 'usuarios',
      path: '/dashboard/admin/users',
      description: 'Administrar usuarios y roles',
      permission: Permission.MANAGE_USERS,
      roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      // Solo ADMIN y SUPER_ADMIN
    },
  ];

  // Filtrar items del menú según permisos y rol
  const visibleMenuItems = menuItems.filter(item => {
    // Si no hay usuario autenticado, no mostrar nada
    if (!user || !role) return false;

    // Si el item requiere roles específicos
    if (item.roles && !item.roles.includes(role)) {
      return false;
    }

    // Si el item es solo para admins
    if (item.adminOnly && !canAccessAdmin) {
      return false;
    }

    // Si el item requiere un permiso específico
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }

    // Si pasa todas las validaciones, mostrar el item
    return true;
  });

  const handleNavigation = (path: string) => {
    navigate(path);
    // Cerrar sidebar en móvil después de navegar
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay para móvil - mejorado */}
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
                    {/* Botón ir al Home (página pública) */}
                    <button
                      onClick={() => navigate('/')}
                      className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                      title="Ir al sitio web"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    {/* Theme Toggle */}
                    <div className="bg-white/20 rounded-lg">
                      <ThemeToggle />
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                      title="Contraer sidebar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Indicador de sesión activa + Badge de Rol + Botón Cerrar Sesión */}
                <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-lg p-3 border border-white/30 dark:border-white/20 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-xs">
                        {canAccessAdmin ? 'Panel Administrativo' : 'Panel de Usuario'}
                      </p>
                      <p className="text-xs text-blue-50 opacity-80">
                        Sesión Activa
                      </p>
                    </div>
                    {/* 🔔 Campana de Notificaciones */}
                    <NotificationBell iconClassName="w-4 h-4" />
                    {/* Botón Cerrar Sesión compacto */}
                    <SignOutButton>
                      <button
                        className="flex items-center justify-center p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200"
                        title="Cerrar Sesión"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </button>
                    </SignOutButton>
                  </div>
                  {/* Badge de Rol */}
                  {role && (
                    <div className="flex items-center justify-between pt-2 border-t border-white/20">
                      <span className="text-xs text-white/80">Tu rol:</span>
                      <RoleBadge role={role} size="sm" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Sidebar colapsado
              <div className="p-2 flex flex-col items-center gap-2">
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                  title="Expandir sidebar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
                {/* Botón ir al Home colapsado */}
                <button
                  onClick={() => navigate('/')}
                  className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                  title="Ir al sitio web"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                {/* 🔔 Campana de Notificaciones colapsado */}
                <NotificationBell iconClassName="w-4 h-4" isCollapsed={true} />
                {/* Theme Toggle colapsado */}
                <div className="bg-white/20 rounded-lg">
                  <ThemeToggle />
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                {/* Botón Cerrar Sesión colapsado */}
                <SignOutButton>
                  <button
                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                    title="Cerrar Sesión"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
        </div>

        {/* Navegación */}
        <nav 
          className="flex-1 overflow-y-auto backdrop-blur-sm transition-colors duration-300"
          style={{ backgroundColor: styles.navBg }}
        >
          {isOpen ? (
            // Navegación expandida
            <div className="p-3">
              <div className="mb-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-1">
                  Navegación Principal
                </p>
              </div>
              <div className="space-y-1">
                {visibleMenuItems.map((item) => {
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
                            // Borde gradiente con fondo transparente
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
                            size={18}
                            color={isActive ? 'white' : getMenuIcon(item.menuKey, isDarkMode).color}
                            strokeWidth={1.5}
                          />
                        </span>
                        <div className="flex-1 text-left">
                          <div className={`font-medium text-sm ${isActive ? 'text-white' : ''}`}>
                            {item.name}
                          </div>
                          <div className={`text-xs leading-tight ${isActive ? 'text-white/80' : 'opacity-70'}`}>
                            {item.description}
                          </div>
                        </div>
                        {/* Badge de no leídos para Mensajería */}
                        {item.path === '/dashboard/crm/messages' && unreadCount > 0 && (
                          <div className="ml-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white">
                              {unreadCount}
                            </span>
                          </div>
                        )}
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
                {visibleMenuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        relative group w-full flex items-center justify-center p-2.5 rounded-lg transition-all duration-200
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
                        <DynamicIcon 
                          name={getMenuIcon(item.menuKey, isDarkMode).iconName}
                          size={18}
                          color={isActive ? 'white' : getMenuIcon(item.menuKey, isDarkMode).color}
                          strokeWidth={1.5}
                        />
                      </div>
                      {item.path === '/dashboard/crm/messages' && unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold bg-red-600 text-white rounded-full">
                          {unreadCount}
                        </span>
                      )}
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
            // Footer colapsado - vacío o mínimo
            <div className="text-center">
              <p className="text-xs text-slate-400 dark:text-gray-500">v1.0</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}