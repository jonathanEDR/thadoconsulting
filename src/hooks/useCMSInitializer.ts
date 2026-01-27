/**
 * 🎯 Hook para inicializar páginas CMS automáticamente
 * 
 * ⚠️ DESACTIVADO EN PRODUCCIÓN
 * Los datos ya están inicializados en la base de datos.
 * Solo activar si necesitas reinicializar páginas.
 */

import { useEffect } from 'react';
// import { initializeCMSPages } from '../services/cmsInitializer';
// import { useAuth } from '@clerk/clerk-react';

// Configuración: cambiar a true solo para desarrollo/reinicialización
const CMS_INIT_ENABLED = false;

/**
 * Hook que inicializa las páginas CMS si el usuario tiene permisos
 * @deprecated Los datos ya están inicializados. Este hook está desactivado.
 */
export const useCMSInitializer = () => {
  // DESACTIVADO: Los datos ya están inicializados en producción
  useEffect(() => {
    if (CMS_INIT_ENABLED && import.meta.env.DEV) {
      console.log('ℹ️ useCMSInitializer: Desactivado en producción');
    }
  }, []);
};

export default useCMSInitializer;
