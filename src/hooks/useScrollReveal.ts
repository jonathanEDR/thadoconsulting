/**
 * 🔍 HOOK DE SCROLL REVEAL
 * Hook personalizado para animar elementos cuando entran al viewport
 * Usa Intersection Observer API para detectar visibilidad
 */

import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number; // Porcentaje visible para trigger (0-1)
  rootMargin?: string; // Margen antes de trigger (ej: "0px 0px -100px 0px")
  triggerOnce?: boolean; // Solo animar una vez
  delay?: number; // Delay antes de animar (ms)
}

/**
 * Hook que retorna una ref y un estado de visibilidad
 * Usa Intersection Observer para detectar cuando el elemento es visible
 */
export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
  const {
    threshold = 0.1, // 10% del elemento visible
    rootMargin = '0px 0px -50px 0px', // Trigger 50px antes del viewport bottom
    triggerOnce = true,
    delay = 0
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Crear el observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Aplicar delay si existe
            if (delay > 0) {
              setTimeout(() => {
                setIsVisible(true);
              }, delay);
            } else {
              setIsVisible(true);
            }

            // Si solo queremos trigger una vez, desconectar
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            // Si no es triggerOnce, permitir ocultar de nuevo
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    // Observar el elemento
    observer.observe(element);

    // Cleanup
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return { ref: elementRef, isVisible };
};

/**
 * Hook simplificado que retorna solo la ref
 * La clase CSS se aplica automáticamente
 */
export const useScrollRevealRef = (options: UseScrollRevealOptions = {}) => {
  const { ref, isVisible } = useScrollReveal(options);

  useEffect(() => {
    if (ref.current && isVisible) {
      ref.current.classList.add('is-visible');
    }
  }, [isVisible, ref]);

  return ref;
};

/**
 * Hook para múltiples elementos con stagger effect
 */
export const useScrollRevealList = (
  count: number,
  options: UseScrollRevealOptions & { staggerDelay?: number } = {}
) => {
  const { staggerDelay = 100, ...revealOptions } = options;
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observers = refs.current.map((element, index) => {
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setVisibleIndices(prev => new Set([...prev, index]));
                if (revealOptions.triggerOnce !== false) {
                  observer.unobserve(element);
                }
              }, index * staggerDelay);
            }
          });
        },
        {
          threshold: revealOptions.threshold || 0.1,
          rootMargin: revealOptions.rootMargin || '0px 0px -50px 0px'
        }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer, index) => {
        if (observer && refs.current[index]) {
          observer.unobserve(refs.current[index]!);
        }
      });
    };
  }, [count, staggerDelay, revealOptions]);

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    refs.current[index] = el;
  };

  return { setRef, visibleIndices };
};

export default useScrollReveal;
