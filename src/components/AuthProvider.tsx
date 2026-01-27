import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setAuthTokenGetter } from '../services/cmsApi';
import { setAuthTokenGetter as setImageAuthTokenGetter } from '../services/imageService';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Componente que inicializa la función de obtención de tokens
 * para las requests autenticadas de la API
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { getToken } = useAuth();

  useEffect(() => {
    // Configurar la función de obtención de tokens para cmsApi
    setAuthTokenGetter(getToken);
    
    // Configurar la función de obtención de tokens para imageService
    setImageAuthTokenGetter(getToken);
  }, [getToken]);

  return <>{children}</>;
};
