/**
 * PublicLayout Component
 * Layout para páginas públicas con chatbot flotante
 * 
 * Features:
 * - Header y Footer públicos
 * - FloatingChatWidget para asistencia
 * - Estructura responsive
 */

import React from 'react';
import PublicHeader from './public/PublicHeader';
import PublicFooter from './public/PublicFooter';
import FloatingChatWidget from './floating-chat/FloatingChatWidget';

interface PublicLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showChat?: boolean;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children,
  showHeader = true,
  showFooter = true,
  showChat = true
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <PublicHeader />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && <PublicFooter />}
      
      {/* 💬 Chatbot Flotante para páginas públicas */}
      {showChat && <FloatingChatWidget />}
    </div>
  );
};

export default PublicLayout;
