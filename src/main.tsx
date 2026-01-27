import { createRoot } from 'react-dom/client'
// ⚡ CSS crítico - carga inmediata
import './index.css'
import './styles/theme.css'
// ⚡ CSS de transiciones - carga diferida (no bloquea el render)
import('./styles/pageTransitions.css')
import App from './App.tsx'
import { HelmetProvider } from 'react-helmet-async'

/**
 * ⚡ OPTIMIZACIÓN DE RENDIMIENTO
 * - ClerkProvider removido de aquí (ahora solo en rutas protegidas)
 * - Páginas públicas se cargan sin dependencias de autenticación
 * - CSS de transiciones carga de forma diferida
 * - Mejora significativa en tiempo de carga inicial
 * - StrictMode deshabilitado para evitar problemas con animaciones
 */

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
)
