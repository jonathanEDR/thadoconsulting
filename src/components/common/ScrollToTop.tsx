/**
 * 📜 SCROLL TO TOP COMPONENT
 * Componente para manejar el scroll al cambiar de ruta
 * 
 * ✅ Optimizado para respetar navegación hacia atrás (botón back)
 * ✅ Solo hace scroll to top en navegación hacia adelante (PUSH)
 * ✅ Mantiene posición del scroll al usar botón atrás (POP)
 */

import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// 🗄️ Almacenar posiciones de scroll por ruta
const scrollPositions = new Map<string, number>();

export const ScrollToTop: React.FC = () => {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'
  const prevPathRef = useRef<string>(pathname);

  useEffect(() => {
    // Guardar posición actual antes de cambiar de ruta
    if (prevPathRef.current !== pathname) {
      scrollPositions.set(prevPathRef.current, window.scrollY);
      prevPathRef.current = pathname;
    }

    // 🔙 Si es navegación hacia atrás (POP), restaurar posición guardada
    if (navigationType === 'POP') {
      const savedPosition = scrollPositions.get(pathname);
      if (savedPosition !== undefined) {
        // Usar requestAnimationFrame para asegurar que el DOM esté listo
        requestAnimationFrame(() => {
          window.scrollTo({
            top: savedPosition,
            left: 0,
            behavior: 'instant'
          });
        });
        return;
      }
    }

    // ➡️ Si es navegación hacia adelante (PUSH/REPLACE), scroll to top
    if (navigationType === 'PUSH' || navigationType === 'REPLACE') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [pathname, key, navigationType]);

  return null;
};

export default ScrollToTop;