import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ClerkProvider, useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ServerNotificationProvider } from './contexts/ServerNotificationContext';
import ToastContainer from './components/common/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import { DashboardProviders } from './components/DashboardProviders';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import DashboardRouter from './components/DashboardRouter';
import SmartDashboardLayout from './components/SmartDashboardLayout';
import ScrollToTop from './components/common/ScrollToTop';
import WelcomeNotification from './components/WelcomeNotification';
import useGTMPageView from './hooks/useGTMPageView';
import { useKeepBackendAlive } from './hooks/useKeepBackendAlive';
import { UserRole } from './types/roles';
import { useAuth } from './contexts/AuthContext';
import { setTokenGetter } from './services/blog/blogApiClientSetup';
import './App.css';

// ⚡ Configuración de Clerk global optimizada
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_bGlnaHQtZG9scGhpbi00Mi5jbGVyay5hY2NvdW50cy5kZXYk';

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'YOUR_PUBLISHABLE_KEY') {
  throw new Error('Missing or Invalid Clerk Publishable Key. Check VITE_CLERK_PUBLISHABLE_KEY in .env.local');
}

// ⚡ OPTIMIZACIÓN: Lazy loading agresivo
// Páginas públicas - Sin dependencias de autenticación
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const ServicesPublic = lazy(() => import('./pages/public/ServicesPublicV2'));
const ServicioDetail = lazy(() => import('./pages/public/ServicioDetail'));
const Contact = lazy(() => import('./pages/public/Contact'));
const PublicProfilePage = lazy(() => import('./pages/public/PublicProfilePage'));
const PrivacyPolicy = lazy(() => import('./pages/public/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/public/TermsOfService'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

// Páginas de autenticación - CON Clerk optimizado
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));

// Dashboards con roles
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Páginas del dashboard - Con autenticación
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const LeadsManagement = lazy(() => import('./pages/admin/LeadsManagement'));
// Página de mensajería CRM (admin)
const CrmMessages = lazy(() => import('./pages/admin/CrmMessages'));
const CmsManager = lazy(() => import('./pages/CmsManager'));
const MediaLibrary = lazy(() => import('./pages/MediaLibrary'));

// Páginas administrativas
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));
const UserRoleManagement = lazy(() => import('./pages/admin/UserRoleManagement'));

// Páginas demo
const NotificationDemo = lazy(() => import('./pages/demo/NotificationDemo'));
const PerformanceDemo = lazy(() => import('./pages/demo/PerformanceDemo'));

// Módulo de Servicios
const ServicioDashboard = lazy(() => import('./pages/admin/ServicioDashboard'));
const ServiciosManagement = lazy(() => import('./pages/admin/ServiciosManagement'));
const ServicioForm = lazy(() => import('./pages/admin/ServicioFormV3'));

// Páginas del Portal Cliente
const ClientPortal = lazy(() => import('./pages/client/ClientPortal'));
const MyMessages = lazy(() => import('./pages/client/MyMessagesV2'));
const MySolicitudes = lazy(() => import('./pages/client/MySolicitudes'));

// Módulo de Blog - Páginas Públicas
const BlogHome = lazy(() => import('./pages/public/blog/BlogHome'));
const BlogPost = lazy(() => import('./pages/public/blog/BlogPost'));
const BlogFilterRedirect = lazy(() => import('./pages/public/blog/BlogFilterRedirect'));

// Módulo de Blog - Páginas Administrativas
const BlogDashboard = lazy(() => import('./pages/admin/blog/BlogDashboard'));

// Módulo de Agenda - Administrativo
const AgendaManagement = lazy(() => import('./pages/admin/AgendaManagement'));

// Componente de Testing IA (temporal) - Comentado hasta implementar
// const AISystemTestWithAuth = lazy(() => import('./components/testing/AISystemTestWithAuth'));
const PostEditor = lazy(() => import('./pages/admin/blog/PostEditor'));
const CategoriesManager = lazy(() => import('./pages/admin/blog/CategoriesManager'));
const CommentModeration = lazy(() => import('./pages/admin/blog/CommentModeration'));

// Módulo de Blog - Páginas del Cliente
const MyBlogHub = lazy(() => import('./components/blog/MyBlogHub'));

// Panel Central de IA
const AIAgentsDashboard = lazy(() => import('./pages/admin/AIAgentsDashboard'));
const BlogAgentConfig = lazy(() => import('./pages/admin/BlogAgentConfig'));
const BlogAgentTraining = lazy(() => import('./pages/admin/BlogAgentTraining'));
const SEOAgentConfig = lazy(() => import('./pages/admin/SEOAgentConfig'));
const SEOAgentTraining = lazy(() => import('./pages/admin/SEOAgentTraining'));
const ServicesAgentConfig = lazy(() => import('./pages/admin/ServicesAgentConfig'));
const ServicesAgentTraining = lazy(() => import('./pages/admin/ServicesAgentTraining'));

// 🚀 SCUTI AI - Chat Principal con GerenteGeneral
const ScutiAIChatPage = lazy(() => import('./pages/admin/ScutiAIChatPage'));
const AIAnalytics = lazy(() => import('./pages/admin/AIAnalytics'));

// 🔔 Historial de Notificaciones
const NotificationsHistory = lazy(() => import('./pages/admin/NotificationsHistory'));

// 🏢 Módulo de Contabilidad
const ContabilidadManagement = lazy(() => import('./pages/admin/ContabilidadManagement'));
const FichaCliente = lazy(() => import('./pages/admin/FichaCliente'));
const DeclaracionesCliente = lazy(() => import('./pages/admin/DeclaracionesCliente'));
const ProyeccionesCliente = lazy(() => import('./pages/admin/ProyeccionesCliente'));
const MiContabilidad = lazy(() => import('./pages/client/MiContabilidad'));

// ⚡ Componente de loading con logo - Usa variables CSS del tema CMS
// Detecta el tema del CMS a través de la variable --color-background
const LoadingSpinner = () => {
  const [logoSrc, setLogoSrc] = React.useState('/LOGO_PARA_FONDO_OSCURO.svg');
  
  React.useEffect(() => {
    // Detectar tema observando el color de fondo configurado
    const detectTheme = () => {
      const bg = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-background')
        .trim();
      
      // Si el fondo es oscuro, usar logo para fondo oscuro
      const isDark = bg.includes('0f172a') || bg.includes('0F172A') || bg.includes('#000') || 
                     bg === '' || bg.includes('1e293b'); // Fallback a oscuro
      setLogoSrc(isDark ? '/LOGO_PARA_FONDO_OSCURO.svg' : '/LOGO_PARA_FONDO_BLANCO.svg');
    };
    
    detectTheme();
    // Re-detectar cuando cambie el tema
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--color-background, #0f172a)' }}
    >
      {/* Contenedor del logo con spinner */}
      <div className="relative flex items-center justify-center">
        {/* Spinner animado - usa color primario del tema */}
        <div 
          className="absolute w-44 h-44 animate-spin"
          style={{
            border: '3px solid transparent',
            borderTopColor: 'var(--color-primary, #8B5CF6)',
            borderRightColor: 'color-mix(in srgb, var(--color-primary, #8B5CF6) 50%, transparent)',
            borderRadius: '50%'
          }}
        />
        {/* Logo - seleccionado dinámicamente según el tema CMS */}
        <img
          src={logoSrc}
          alt="THADO Consulting"
          className="w-36 h-36 animate-pulse object-contain z-10"
          style={{ animationDuration: '2s' }}
        />
      </div>
      {/* Mensaje - usa color de texto del tema */}
      <p 
        className="mt-6 text-lg font-medium animate-pulse" 
        style={{ 
          color: 'var(--color-text-secondary, #94a3b8)',
          animationDuration: '1.5s' 
        }}
      >
        Cargando...
      </p>
      {/* Barra de progreso - usa color primario del tema */}
      <div 
        className="mt-4 h-1 w-32 rounded-full overflow-hidden"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary, #8B5CF6) 20%, transparent)' }}
      >
        <div 
          className="h-full rounded-full"
          style={{ 
            backgroundColor: 'var(--color-primary, #8B5CF6)',
            animation: 'loadingBar 1.5s ease-in-out infinite' 
          }}
        />
      </div>
      <style>{`
        @keyframes loadingBar {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

/**
 * Wrapper para rutas del dashboard con providers de autenticación y roles
 * Clerk + AuthContext se cargan aquí
 * NOTA: Las páginas manejan su propio layout (SmartDashboardLayout o DashboardLayout)
 */
const DashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <DashboardProviders>
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  </DashboardProviders>
);

/**
 * 🛡️ Guard genérico de autenticación + roles para wrappers persistentes
 * Muestra loading SOLO en el área de contenido, nunca full-screen.
 */
const DashboardAuthGuard = ({ allowedRoles }: { allowedRoles?: UserRole[] }) => {
  const { isLoaded, isSignedIn } = useUser();
  const { role, isLoading } = useAuth();

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-purple-600 dark:border-purple-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando módulo...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Cargando página...</p>
        </div>
      </div>
    }>
      <Outlet />
    </Suspense>
  );
};

/**
 * 🏢 Layout Persistente para Admin (ADMIN + MODERATOR + SUPER_ADMIN)
 */
const AdminLayoutWrapper = () => (
  <DashboardProviders>
    <SmartDashboardLayout>
      <DashboardAuthGuard allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]} />
    </SmartDashboardLayout>
  </DashboardProviders>
);

/**
 * 🤖 Layout Persistente para Super Admin (ADMIN + SUPER_ADMIN)
 */
const SuperAdminLayoutWrapper = () => (
  <DashboardProviders>
    <SmartDashboardLayout>
      <DashboardAuthGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]} />
    </SmartDashboardLayout>
  </DashboardProviders>
);

/**
 * 🔒 Layout Persistente para cualquier usuario autenticado
 */
const AuthenticatedLayoutWrapper = () => (
  <DashboardProviders>
    <SmartDashboardLayout>
      <DashboardAuthGuard />
    </SmartDashboardLayout>
  </DashboardProviders>
);

/**
 * 🎯 Layout Persistente SOLO para Dashboard del Cliente
 */
const ClientDashboardLayoutWrapper = () => (
  <DashboardProviders>
    <SmartDashboardLayout>
      <DashboardAuthGuard allowedRoles={[UserRole.USER, UserRole.CLIENT]} />
    </SmartDashboardLayout>
  </DashboardProviders>
);

/**
 * 🏢 Layout Persistente para Módulo de Contabilidad (Admin)
 * Reutiliza SuperAdminLayoutWrapper (= mismos roles ADMIN + SUPER_ADMIN)
 */
const ContabilidadLayoutWrapper = SuperAdminLayoutWrapper;

// 📊 Componente para trackear Page Views en GTM
function GTMTracker() {
  useGTMPageView();
  return null;
}

// 🏓 Componente para mantener el backend de Render activo
function BackendKeepAlive() {
  useKeepBackendAlive();
  return null;
}

function AppContent() {
  const { showWelcomeNotification, onboardingData, dismissWelcomeNotification } = useAuth();
  const { getToken } = useClerkAuth();

  // Configurar el token getter para el blog API
  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  return (
    <BrowserRouter>
      <GTMTracker />
      <BackendKeepAlive />
      <ScrollToTop />
      
      {/* 🎉 Notificación de bienvenida para nuevos clientes */}
      {showWelcomeNotification && onboardingData && (
        <WelcomeNotification 
          onboarding={onboardingData}
          onClose={dismissWelcomeNotification}
        />
      )}
      
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
                  {/* ⚡ PÁGINAS PÚBLICAS - SIN CLERK, CARGA INSTANTÁNEA */}
                  <Route path="/" element={<Home />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/servicios" element={<ServicesPublic />} />
              <Route path="/servicios/:slug" element={<ServicioDetail />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/perfil/:username" element={<PublicProfilePage />} />

              {/* 📜 PÁGINAS LEGALES */}
              <Route path="/privacidad" element={<PrivacyPolicy />} />
              <Route path="/terminos" element={<TermsOfService />} />

              {/* 📰 BLOG - Páginas Públicas */}
              <Route path="/blog" element={<BlogHome />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
                            {/* 🔄 Redirecciones de filtros de blog (noindex) */}
              <Route path="/blog/category/:slug" element={<BlogFilterRedirect filterType="category" />} />
              <Route path="/blog/categoria/:slug" element={<BlogFilterRedirect filterType="category" />} />
              <Route path="/blog/tag/:slug" element={<BlogFilterRedirect filterType="tag" />} />
              <Route path="/blog/tags/:slug" element={<BlogFilterRedirect filterType="tag" />} />
                            {/* �🔐 RUTAS DE AUTENTICACIÓN - Clerk ya disponible globalmente */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
      
              {/* 🔒 RUTAS PROTEGIDAS CON SISTEMA DE ROLES */}
              
              {/* Dashboard Principal - Redirige según rol */}
              <Route path="/dashboard" element={
                <DashboardRoute>
                  <DashboardRouter />
                </DashboardRoute>
              } />
              
              {/* 👤 RUTAS DEL CLIENTE con Layout Persistente */}
              <Route path="/dashboard/client" element={<ClientDashboardLayoutWrapper />}>
                <Route index element={<ClientDashboard />} />
                <Route path="portal" element={<ClientPortal />} />
                {/* 🔒 Mensajes y Contabilidad: solo rol CLIENT */}
                <Route path="messages" element={
                  <RoleBasedRoute allowedRoles={[UserRole.CLIENT]} redirectTo="/dashboard/client">
                    <MyMessages />
                  </RoleBasedRoute>
                } />
                <Route path="solicitudes" element={<MySolicitudes />} />
                <Route path="leads" element={<Navigate to="/dashboard/client/solicitudes" replace />} />
                <Route path="contabilidad" element={
                  <RoleBasedRoute allowedRoles={[UserRole.CLIENT]} redirectTo="/dashboard/client">
                    <MiContabilidad />
                  </RoleBasedRoute>
                } />
              </Route>

              {/* 🔓 RUTAS PARA CUALQUIER USUARIO AUTENTICADO */}
              <Route element={<AuthenticatedLayoutWrapper />}>
                <Route path="/dashboard/profile" element={<Profile />} />
                <Route path="/dashboard/mi-blog" element={<MyBlogHub />} />
              </Route>
              
              {/* ⚡ RUTAS ADMIN + MODERATOR + SUPER_ADMIN */}
              <Route element={<AdminLayoutWrapper />}>
                {/* Dashboard Admin */}
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                
                {/* Notificaciones */}
                <Route path="/dashboard/notifications" element={<NotificationsHistory />} />
                
                {/* CMS */}
                <Route path="/dashboard/cms/*" element={<CmsManager />} />
                
                {/* Media Library */}
                <Route path="/dashboard/media" element={<MediaLibrary />} />
                
                {/* CRM */}
                <Route path="/dashboard/crm" element={<LeadsManagement />} />
                <Route path="/dashboard/crm/messages" element={<CrmMessages />} />
                
                {/* Agenda */}
                <Route path="/dashboard/agenda" element={<AgendaManagement />} />
                
                {/* Servicios */}
                <Route path="/dashboard/servicios" element={<ServicioDashboard />} />
                <Route path="/dashboard/servicios/management" element={<ServiciosManagement />} />
                <Route path="/dashboard/servicios/new" element={<ServicioForm />} />
                <Route path="/dashboard/servicios/:id/edit" element={<ServicioForm />} />
                
                {/* Blog Admin */}
                <Route path="/dashboard/blog" element={<BlogDashboard />} />
                <Route path="/dashboard/blog/posts/new" element={<PostEditor />} />
                <Route path="/dashboard/blog/posts/:id/edit" element={<PostEditor />} />
                <Route path="/dashboard/blog/categories" element={<CategoriesManager />} />
                <Route path="/dashboard/blog/moderation" element={<CommentModeration />} />
                
                {/* Demos */}
                <Route path="/demo/notifications" element={<NotificationDemo />} />
                <Route path="/demo/performance" element={<PerformanceDemo />} />
              </Route>
              
              {/* 🏢 MÓDULO DE CONTABILIDAD - ADMIN + SUPER_ADMIN */}
              <Route path="/dashboard/contabilidad" element={<ContabilidadLayoutWrapper />}>
                <Route index element={<ContabilidadManagement />} />
                <Route path="clientes/:id" element={<FichaCliente />} />
                <Route path="clientes/:clienteId/declaraciones" element={<DeclaracionesCliente />} />
                <Route path="clientes/:clienteId/proyecciones" element={<ProyeccionesCliente />} />
              </Route>

              {/* 🤖 RUTAS SUPER ADMIN - ADMIN + SUPER_ADMIN */}
              <Route element={<SuperAdminLayoutWrapper />}>
                {/* Agentes IA */}
                <Route path="/dashboard/ai-agents" element={<AIAgentsDashboard />} />
                <Route path="/dashboard/agents/blog/config" element={<BlogAgentConfig />} />
                <Route path="/dashboard/agents/blog/training" element={<BlogAgentTraining />} />
                <Route path="/dashboard/agents/seo/config" element={<SEOAgentConfig />} />
                <Route path="/dashboard/agents/seo/training" element={<SEOAgentTraining />} />
                <Route path="/dashboard/agents/services/config" element={<ServicesAgentConfig />} />
                <Route path="/dashboard/agents/services/training" element={<ServicesAgentTraining />} />
                
                {/* Scuti AI */}
                <Route path="/dashboard/scuti-ai" element={<ScutiAIChatPage />} />
                <Route path="/dashboard/ai-analytics" element={<AIAnalytics />} />
                
                {/* Gestión de Usuarios */}
                <Route path="/dashboard/admin/users" element={<UsersManagement />} />
                <Route path="/dashboard/admin/user-roles" element={<UserRoleManagement />} />
              </Route>

              {/* Redirección de ruta antigua */}
              <Route path="/dashboard/agents" element={<Navigate to="/dashboard/ai-agents" replace />} />

              {/* 🤖 Sistema de IA - Testing (Temporal) */}
              {/* Route temporalmente comentada - componente no implementado
              <Route path="/admin/ai-test" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <AISystemTestWithAuth />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              */}

              {/* 404 - Catch all unmatched routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          {/* 🔔 Contenedor de notificaciones Toast */}
          <ToastContainer position="top-right" />
        </BrowserRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      {/* ⚡ ClerkProvider global optimizado - Carga lazy */}
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        afterSignOutUrl="/"
      >
        {/* ⚡ ThemeProvider es ligero, se mantiene global */}
        <ThemeProvider>
          {/* 🔔 Sistema de notificaciones global (toasts) */}
          <NotificationProvider>
            {/* 🔐 AuthProvider con notificación de bienvenida */}
            <AuthProvider>
              {/* 🔔 Notificaciones del servidor (persistentes) */}
              <ServerNotificationProvider pollInterval={30000}>
                <AppContent />
              </ServerNotificationProvider>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
