/**
 * 🧠 Smart Dashboard Layout
 * Layout inteligente que selecciona el sidebar correcto según el rol del usuario
 * - USER/CLIENT → ClientSidebar (simplificado)
 * - ADMIN/MODERATOR/SUPER_ADMIN → Sidebar (completo)
 * - Incluye FloatingChatWidget global para asistencia
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import ClientSidebar from './ClientSidebar';
import { shouldUseClientDashboard } from '../types/roles';

interface SmartDashboardLayoutProps {
  children: React.ReactNode;
}

export default function SmartDashboardLayout({ children }: SmartDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { role } = useAuth();

  // Determinar qué sidebar usar según el rol
  const useClientSidebar = role ? shouldUseClientDashboard(role) : false;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Componente Sidebar dinámico
  const SidebarComponent = useClientSidebar ? ClientSidebar : Sidebar;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 transition-colors duration-300">
      <SidebarComponent isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          isMobile
            ? 'ml-0'
            : sidebarOpen
              ? 'ml-72'
              : 'ml-12'
        }`}
      >
        {/* Botón flotante para abrir menú en móvil */}
        {isMobile && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className={`
              fixed top-4 left-4 z-50 p-3 text-white rounded-xl 
              shadow-lg hover:shadow-xl transition-all duration-300 
              hover:scale-110 active:scale-95
              backdrop-blur-sm border border-white/20
              ${useClientSidebar
                ? 'bg-gradient-to-r from-green-500/95 to-blue-500/95 hover:from-green-600 hover:to-blue-600'
                : 'bg-gradient-to-r from-blue-600/95 to-purple-600/95 hover:from-blue-700 hover:to-purple-700'
              }
            `}
            aria-label="Abrir menú de navegación"
            title="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <main className={`p-4 md:p-6 ${isMobile && !sidebarOpen ? 'pt-20' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}