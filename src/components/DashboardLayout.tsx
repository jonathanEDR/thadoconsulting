import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          isMobile
            ? 'ml-0'
            : sidebarOpen
              ? 'ml-72'
              : 'ml-12'
        }`}
      >
        {isMobile && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-purple-600 dark:to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-purple-700 dark:hover:to-pink-700 transition-all duration-200 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <img 
                  src="/logos/logo-black.svg" 
                  alt="THADO Consulting" 
                  className="h-8 w-auto dark:hidden"
                />
                <img 
                  src="/logos/logo-white.svg" 
                  alt="THADO Consulting" 
                  className="h-8 w-auto hidden dark:block"
                />
              </div>
            </div>
          </div>
        )}

        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}