import { useState, useEffect } from 'react';
import { getClerkInstance, waitForClerk } from '../config/clerk';
import type { ClerkUser, UserData } from '../config/clerk';

/**
 * Hook personalizado para detectar usuario de Clerk de manera progresiva
 * Sin bloquear la carga inicial de páginas públicas
 * MEJORADO PARA PRODUCCIÓN
 */
export const useClerkDetection = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkClerkUser = async () => {
    try {
      // 🔥 MEJORA 1: Usar función centralizada para obtener Clerk
      const clerkInstance = getClerkInstance();



      // 🔥 MEJORA 2: Si no hay instancia, intentar esperar a que cargue
      if (!clerkInstance) {
        try {
          const loadedClerk = await waitForClerk(3000); // Esperar máximo 3 segundos
          return checkClerkUserSync(loadedClerk);
        } catch {
          setUserData(null);
          setIsLoading(false);
          return false;
        }
      }

      return checkClerkUserSync(clerkInstance);
    } catch (error) {
      setUserData(null);
      setIsLoading(false);
      return false;
    }
  };

  const checkClerkUserSync = (clerkInstance: any) => {
    try {
      // 🔥 MEJORA 3: Verificar si Clerk está completamente cargado
      if (clerkInstance && clerkInstance.loaded !== false) {
        
        // Verificar si hay usuario autenticado
        if (clerkInstance.user) {
          const user: ClerkUser = clerkInstance.user;

          const newUserData: UserData = {
            imageUrl: user.imageUrl || user.profileImageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddresses: user.emailAddresses
          };



          setUserData(newUserData);
          setIsLoading(false);
          return true;
        } else {
          // Clerk cargado pero sin usuario
          setUserData(null);
          setIsLoading(false);
          return false;
        }
      } else {
        // Clerk aún no está completamente cargado
        return false;
      }
    } catch (error) {
      setUserData(null);
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    
    // ✅ SOLUCIÓN: Verificación ÚNICA al montar, sin intervalo continuo
    const initialCheck = async () => {
      const result = await checkClerkUser();
      if (!result) {
        // Si no está listo, reintentar SOLO UNA VEZ después de 2 segundos
        setTimeout(async () => {
          await checkClerkUser();
        }, 2000);
      }
    };

    // Delay inicial pequeño para que Clerk termine de cargar
    setTimeout(initialCheck, 100);

    // ✅ ELIMINADO: smartInterval que consultaba cada 5-30 segundos
    // ✅ NUEVO: Solo escuchar eventos de Clerk, sin polling activo

    // ✅ MEJORA 5: Mejores event listeners
    const handleClerkEvent = async () => {
      setTimeout(async () => {
        await checkClerkUser();
      }, 200);
    };

    const handleSignOut = () => {
      setUserData(null);
      setIsLoading(false);
    };

    // ✅ MEJORA 6: Más eventos de Clerk para capturar cambios
    const events = [
      'clerk:loaded',
      'clerk:signIn', 
      'clerk:sessionCreated',
      'clerk:userUpdated'
    ];

    events.forEach(event => {
      window.addEventListener(event as any, handleClerkEvent);
    });

    // Agregar evento específico para signOut
    window.addEventListener('clerk:signOut' as any, handleSignOut);

    // ✅ ELIMINADO: eventos 'popstate' y 'focus' que causaban consultas excesivas
    
    // ✅ MEJORA 7: Verificar cuando la página vuelve a ser visible (SOLO SI ES NECESARIO)
    const handleVisibilityChange = async () => {
      if (!document.hidden && !userData) {
        // Solo verificar si NO hay usuario activo
        setTimeout(async () => {
          await checkClerkUser();
        }, 500);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // ✅ Cleanup sin smartInterval
      
      events.forEach(event => {
        window.removeEventListener(event as any, handleClerkEvent);
      });
      
      window.removeEventListener('clerk:signOut' as any, handleSignOut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // ✅ CRÍTICO: Sin dependencias para evitar re-ejecución

  // Función para obtener iniciales del usuario
  const getUserInitials = (userData: UserData): string => {
    const firstName = userData.firstName?.trim();
    const lastName = userData.lastName?.trim();
    const email = userData.emailAddresses?.[0]?.emailAddress;

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  return {
    userData,
    isLoggedIn: !!userData,
    isLoading,
    getUserInitials: () => userData ? getUserInitials(userData) : 'U'
  };
};