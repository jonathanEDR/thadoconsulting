import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ClerkProvider, useAuth as useClerkAuth } from '@clerk/clerk-react';
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

// ⚡ Componente de loading minimalista - Optimizado para LCP
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-gray-500 text-sm">Cargando...</p>
    </div>
  </div>
);

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
 * 🎯 Layout Persistente SOLO para Dashboard del Cliente
 * Este wrapper mantiene el SmartDashboardLayout montado mientras navegas
 * entre las páginas del cliente, evitando re-renderizados innecesarios
 */
const ClientDashboardLayoutWrapper = () => (
  <DashboardProviders>
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={[UserRole.USER, UserRole.CLIENT]}>
        <SmartDashboardLayout>
          <Outlet />
        </SmartDashboardLayout>
      </RoleBasedRoute>
    </ProtectedRoute>
  </DashboardProviders>
);

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
                {/* Dashboard principal del cliente */}
                <Route index element={<ClientDashboard />} />
                
                {/* Portal Cliente */}
                <Route path="portal" element={<ClientPortal />} />
                
                {/* Mis Mensajes */}
                <Route path="messages" element={<MyMessages />} />
                
                {/* Mis Solicitudes con Timeline */}
                <Route path="solicitudes" element={<MySolicitudes />} />
                
                {/* Redirección de ruta antigua "leads" a nueva "solicitudes" */}
                <Route path="leads" element={<Navigate to="/dashboard/client/solicitudes" replace />} />
              </Route>
              
              {/* ⚡ Dashboard para ADMIN, MODERATOR y SUPER_ADMIN */}
              <Route path="/dashboard/admin" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Perfil - Accesible para todos los usuarios autenticados */}
              <Route path="/dashboard/profile" element={
                <DashboardRoute>
                  <Profile />
                </DashboardRoute>
              } />
              
              
              {/* � Historial de Notificaciones - Solo Admins */}
              <Route path="/dashboard/notifications" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <NotificationsHistory />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* �📚 Mi Actividad en el Blog - Accesible para todos los usuarios autenticados */}
              <Route path="/dashboard/mi-blog" element={
                <ProtectedRoute>
                  <MyBlogHub />
                </ProtectedRoute>
              } />
              
              {/* 📝 CMS - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              {/* Ruta consolidada para CMS - maneja todas las sub-rutas internamente */}
              <Route path="/dashboard/cms/*" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <CmsManager />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* 🖼️ Media Library - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              <Route path="/dashboard/media" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <MediaLibrary />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* 📋 CRM - Gestión de Leads - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              <Route path="/dashboard/crm" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <LeadsManagement />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* 💬 Mensajería CRM - Página administrativa de mensajes */}
              <Route path="/dashboard/crm/messages" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <CrmMessages />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* 📅 MÓDULO DE AGENDA - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              
              {/* Dashboard de Agenda - Calendario de reuniones y eventos */}
              <Route path="/dashboard/agenda" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <AgendaManagement />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* 🚀 MÓDULO DE SERVICIOS - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              
              {/* Dashboard Principal de Servicios - Estadísticas y métricas */}
              <Route path="/dashboard/servicios" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <ServicioDashboard />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Gestión de Servicios - Lista, filtros, CRUD */}
              <Route path="/dashboard/servicios/management" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <SmartDashboardLayout>
                      <ServiciosManagement />
                    </SmartDashboardLayout>
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Crear Nuevo Servicio */}
              <Route path="/dashboard/servicios/new" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <ServicioForm />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Editar Servicio Existente */}
              <Route path="/dashboard/servicios/:id/edit" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <SmartDashboardLayout>
                      <ServicioForm />
                    </SmartDashboardLayout>
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* � MÓDULO DE BLOG - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              
              {/* Dashboard Principal de Blog - Estadísticas y resumen */}
              <Route path="/dashboard/blog" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <SmartDashboardLayout>
                      <BlogDashboard />
                    </SmartDashboardLayout>
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Crear Nuevo Post */}
              <Route path="/dashboard/blog/posts/new" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <SmartDashboardLayout>
                      <PostEditor />
                    </SmartDashboardLayout>
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Editar Post Existente */}
              <Route path="/dashboard/blog/posts/:id/edit" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <SmartDashboardLayout>
                      <PostEditor />
                    </SmartDashboardLayout>
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Gestión de Categorías */}
              <Route path="/dashboard/blog/categories" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <CategoriesManager />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Moderación de Comentarios */}
              <Route path="/dashboard/blog/moderation" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <CommentModeration />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* 🤖 MÓDULO DE AGENTES IA - Solo ADMIN y SUPER_ADMIN */}
              
              {/* Redirección de ruta antigua a nueva */}
              <Route path="/dashboard/agents" element={<Navigate to="/dashboard/ai-agents" replace />} />
              
              {/* Dashboard Central de Agentes IA - Configuración y monitoreo */}
              <Route path="/dashboard/ai-agents" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <SmartDashboardLayout>
                      <AIAgentsDashboard />
                    </SmartDashboardLayout>
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* Configuración detallada del BlogAgent */}
              <Route path="/dashboard/agents/blog/config" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <SmartDashboardLayout>
                      <BlogAgentConfig />
                    </SmartDashboardLayout>
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* Entrenamiento avanzado del BlogAgent */}
              <Route path="/dashboard/agents/blog/training" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <SmartDashboardLayout>
                      <BlogAgentTraining />
                    </SmartDashboardLayout>
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* Configuración detallada del SEOAgent */}
              <Route path="/dashboard/agents/seo/config" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <SmartDashboardLayout>
                      <SEOAgentConfig />
                    </SmartDashboardLayout>
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* Entrenamiento avanzado del SEOAgent */}
              <Route path="/dashboard/agents/seo/training" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <SmartDashboardLayout>
                      <SEOAgentTraining />
                    </SmartDashboardLayout>
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* Configuración detallada del ServicesAgent */}
              <Route path="/dashboard/agents/services/config" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <SmartDashboardLayout>
                      <ServicesAgentConfig />
                    </SmartDashboardLayout>
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* Entrenamiento avanzado del ServicesAgent */}
              <Route path="/dashboard/agents/services/training" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <SmartDashboardLayout>
                      <ServicesAgentTraining />
                    </SmartDashboardLayout>
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* 🚀 SCUTI AI - Chat Principal con GerenteGeneral */}
              <Route path="/dashboard/scuti-ai" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <ScutiAIChatPage />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* Analytics de AI - Estadísticas de uso */}
              <Route path="/dashboard/ai-analytics" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <AIAnalytics />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* 👥 Gestión de Usuarios - Solo ADMIN y SUPER_ADMIN */}
              <Route path="/dashboard/admin/users" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <UsersManagement />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* 🎯 Gestión de Roles y Promociones - Solo ADMIN y SUPER_ADMIN */}
              <Route path="/dashboard/admin/user-roles" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <UserRoleManagement />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* 🎨 PÁGINAS DEMO - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              
              {/* Demo de Notificaciones */}
              <Route path="/demo/notifications" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <NotificationDemo />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Demo de Optimizaciones de Rendimiento */}
              <Route path="/demo/performance" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <PerformanceDemo />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

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
