import { useState, useEffect, useRef } from 'react';
import type { ValueAddedLogo } from '../types';

interface LogosSectionProps {
  logos: ValueAddedLogo[];
}

interface BubblePosition {
  x: number;
  y: number;
  vx: number; // Velocidad X
  vy: number; // Velocidad Y
  rotation: number;
  scale: number;
  zIndex: number; // Profundidad (algunas detrás, algunas delante)
}

export const LogosSection = ({ logos }: LogosSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Estado para posiciones de burbujas
  const [bubbles, setBubbles] = useState<BubblePosition[]>([]);
  const bubblesRef = useRef<BubblePosition[]>([]);

  // Ordenar logos - siempre se ejecuta
  const sortedLogos = logos ? [...logos].sort((a, b) => (a.order || 0) - (b.order || 0)) : [];

  // Inicializar posiciones aleatorias de las burbujas en toda la pantalla
  useEffect(() => {
    if (!logos || logos.length === 0) return;
    
    // Solo inicializar si no hay burbujas todavía
    if (bubbles.length > 0) return;

    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    const initialBubbles = sortedLogos.map(() => {
      // z-index aleatorio: 50% detrás (z: 1-5), 50% delante (z: 15-20)
      const isBackground = Math.random() > 0.5;
      return {
        x: Math.random() * (containerWidth - 120),
        y: Math.random() * (containerHeight - 120),
        vx: (Math.random() - 0.5) * 0.5, // Velocidad más lenta
        vy: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4, // Entre 0.8 y 1.2
        zIndex: isBackground ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 6) + 15
      };
    });

    setBubbles(initialBubbles);
    bubblesRef.current = initialBubbles;
  }, [logos, sortedLogos, bubbles.length]);

  // Animación de movimiento continuo
  useEffect(() => {
    if (bubbles.length === 0 || !logos || logos.length === 0) return;

    let isMounted = true;

    const animate = () => {
      if (!isMounted) return;

      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const logoSize = 120;

      const newBubbles = bubblesRef.current.map((bubble) => {
        let { x, y, vx, vy, rotation, scale, zIndex } = bubble;

        x += vx;
        y += vy;

        if (x <= 0 || x >= containerWidth - logoSize) {
          vx = -vx * 0.9;
          x = Math.max(0, Math.min(x, containerWidth - logoSize));
        }
        
        if (y <= 0 || y >= containerHeight - logoSize) {
          vy = -vy * 0.9;
          y = Math.max(0, Math.min(y, containerHeight - logoSize));
        }

        rotation += 0.3;

        return { x, y, vx, vy, rotation, scale, zIndex };
      });

      bubblesRef.current = newBubbles;
      setBubbles(newBubbles);

      if (isMounted) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isMounted = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [bubbles.length, logos]);

  // Efecto de empuje al pasar el mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newBubbles = bubblesRef.current.map((bubble) => {
      const dx = bubble.x + 60 - mouseX; // 60 = mitad del logo
      const dy = bubble.y + 60 - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Si el mouse está cerca, empujar la burbuja
      if (distance < 150) {
        const force = (150 - distance) / 150;
        return {
          ...bubble,
          vx: bubble.vx + (dx / distance) * force * 0.5,
          vy: bubble.vy + (dy / distance) * force * 0.5,
          zIndex: bubble.zIndex
        };
      }

      return bubble;
    });

    bubblesRef.current = newBubbles;
  };

  // Early return DESPUÉS de todos los hooks
  if (!logos || logos.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-5 pointer-events-none"
      style={{ minHeight: '100%', width: '100%' }}
      onMouseMove={handleMouseMove}
    >
        {/* Burbujas flotantes */}
        {sortedLogos.map((logo, index) => {
          const bubble = bubbles[index];
          if (!bubble) return null;

          const isBackground = bubble.zIndex < 10;
          
          // Generar key única robusta - manejar MongoDB ObjectId
          let logoKey: string;
          if (logo._id) {
            // Manejar MongoDB ObjectId: puede ser string, objeto con $oid, o tener toString()
            if (typeof logo._id === 'string') {
              logoKey = logo._id;
            } else if (logo._id && typeof logo._id === 'object') {
              // Intentar múltiples formas de extraer el ID
              const idObj = logo._id as any;
              if (idObj.$oid) {
                logoKey = idObj.$oid;
              } else if (typeof idObj.toString === 'function' && idObj.toString() !== '[object Object]') {
                logoKey = idObj.toString();
              } else if (idObj.id) {
                logoKey = String(idObj.id);
              } else {
                // Último recurso: usar nombre + índice si el objeto no es convertible
                logoKey = `logo-${logo.name || logo.alt}-${index}`;
              }
            } else {
              logoKey = String(logo._id);
            }
          } else {
            logoKey = `logo-${logo.name || logo.alt}-${index}`;
          }
          
          return (
            <div
              key={logoKey}
              className="absolute transition-transform duration-100 ease-linear pointer-events-auto"
              style={{
                left: `${bubble.x}px`,
                top: `${bubble.y}px`,
                transform: `rotate(${bubble.rotation}deg) scale(${bubble.scale})`,
                width: '120px',
                height: '120px',
                willChange: 'transform',
                zIndex: bubble.zIndex,
                opacity: isBackground ? 0.4 : 0.9 // Burbujas de fondo más transparentes
              }}
            >
              <div className="group relative w-full h-full flex items-center justify-center">
                {/* Efecto de burbuja glassmorphism */}
                <div 
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-2xl"
                  style={{
                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                    filter: isBackground ? 'blur(1px)' : 'none'
                  }}
                />
                
                {/* Logo dentro de la burbuja */}
                <div className="relative z-10 w-20 h-20 flex items-center justify-center">
                  {logo.link ? (
                    <a
                      href={logo.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative group-hover:scale-110 transition-transform duration-300"
                      title={logo.name}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img
                        src={logo.imageUrl}
                        alt={logo.alt}
                        title={logo.name}
                        className="w-full h-full object-contain"
                        style={{
                          filter: 'drop-shadow(0 4px 12px rgba(255,255,255,0.4)) brightness(1.1)'
                        }}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </a>
                  ) : (
                    <img
                      src={logo.imageUrl}
                      alt={logo.alt}
                      title={logo.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      style={{
                        filter: 'drop-shadow(0 4px 12px rgba(255,255,255,0.4)) brightness(1.1)'
                      }}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>

                {/* Brillo de burbuja */}
                <div 
                  className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/30 blur-md"
                  style={{ pointerEvents: 'none' }}
                />
              </div>
            </div>
          );
        })}
      </div>
  );
};
