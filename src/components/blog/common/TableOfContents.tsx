/**
 * 📑 TableOfContents Component - V8 Flotante
 * Botón flotante estilo chatbot con panel desplegable
 * Simple, limpio y funcional en todas las pantallas
 * 
 * ✅ Ahora soporta configuración de estilos desde CMS
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { List, ChevronRight, X } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TOCStyles {
  light?: {
    background?: string;
    border?: string;
    activeColor?: string;
    textColor?: string;
    progressColor?: string;
    progressBarFrom?: string;
    progressBarTo?: string;
  };
  dark?: {
    background?: string;
    border?: string;
    activeColor?: string;
    textColor?: string;
    progressColor?: string;
    progressBarFrom?: string;
    progressBarTo?: string;
  };
}

interface TableOfContentsProps {
  tocItems: TOCItem[];
  className?: string;
  variant?: 'floating';
  showProgress?: boolean;
  styles?: TOCStyles;
  theme?: 'light' | 'dark';
}

interface GroupedTOC {
  parent: TOCItem;
  children: TOCItem[];
}

export default function TableOfContents({
  tocItems,
  className = '',
  showProgress = true,
  styles,
  theme = 'dark',
}: TableOfContentsProps) {
  
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibleHeadingsRef = useRef<Set<string>>(new Set());

  // Obtener estilos según el tema
  const currentStyles = useMemo(() => {
    const themeStyles = theme === 'dark' ? styles?.dark : styles?.light;
    return {
      buttonGradientFrom: themeStyles?.activeColor || (theme === 'dark' ? '#a855f7' : '#9333ea'),
      buttonGradientTo: themeStyles?.progressColor || (theme === 'dark' ? '#3b82f6' : '#2563eb'),
      panelBackground: themeStyles?.background || (theme === 'dark' ? '#111827' : '#ffffff'),
      panelBorder: themeStyles?.border || (theme === 'dark' ? '#374151' : '#e5e7eb'),
      textColor: themeStyles?.textColor || (theme === 'dark' ? '#d1d5db' : '#374151'),
      activeColor: themeStyles?.activeColor || (theme === 'dark' ? '#a855f7' : '#9333ea'),
      progressBarFrom: themeStyles?.progressBarFrom || themeStyles?.activeColor || (theme === 'dark' ? '#a855f7' : '#9333ea'),
      progressBarTo: themeStyles?.progressBarTo || themeStyles?.progressColor || (theme === 'dark' ? '#3b82f6' : '#2563eb'),
    };
  }, [styles, theme]);

  // Agrupar items: H2 como padre, H3+ como hijos
  const groupedItems = useMemo((): GroupedTOC[] => {
    const groups: GroupedTOC[] = [];
    let currentGroup: GroupedTOC | null = null;

    tocItems.forEach((item) => {
      if (item.level === 2 || item.level === 1) {
        if (currentGroup) groups.push(currentGroup);
        currentGroup = { parent: item, children: [] };
      } else if (currentGroup && item.level > 2) {
        currentGroup.children.push(item);
      }
    });

    if (currentGroup) groups.push(currentGroup);
    return groups;
  }, [tocItems]);

  // Calcular el H2 padre del heading activo
  const activeParentId = useMemo(() => {
    const activeItem = tocItems.find(item => item.id === activeId);
    if (!activeItem) return '';
    if (activeItem.level <= 2) return activeItem.id;
    
    const activeIndex = tocItems.findIndex(item => item.id === activeId);
    for (let i = activeIndex - 1; i >= 0; i--) {
      if (tocItems[i].level <= 2) return tocItems[i].id;
    }
    return '';
  }, [activeId, tocItems]);

  // Intersection Observer - Detecta headings visibles
  useEffect(() => {
    if (!tocItems.length) return;

    const updateActiveHeading = () => {
      const visibleIds = Array.from(visibleHeadingsRef.current);
      
      if (visibleIds.length === 0) {
        const scrollY = window.scrollY;
        let lastPassedId = '';
        
        for (const item of tocItems) {
          const element = document.getElementById(item.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            if (elementTop <= scrollY + 150) {
              lastPassedId = item.id;
            }
          }
        }
        
        if (lastPassedId) setActiveId(lastPassedId);
        return;
      }
      
      for (const item of tocItems) {
        if (visibleIds.includes(item.id)) {
          setActiveId(item.id);
          break;
        }
      }
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleHeadingsRef.current.add(entry.target.id);
          } else {
            visibleHeadingsRef.current.delete(entry.target.id);
          }
        });
        updateActiveHeading();
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    );

    const timeoutId = setTimeout(() => {
      tocItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element && observerRef.current) {
          observerRef.current.observe(element);
        }
      });
      updateActiveHeading();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observerRef.current?.disconnect();
      visibleHeadingsRef.current.clear();
    };
  }, [tocItems]);

  // Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = documentHeight > 0 
        ? Math.min((scrolled / documentHeight) * 100, 100) 
        : 0;
      setReadProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click handler
  const handleClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsOpen(false);
    }
  }, []);

  if (!tocItems.length) return null;

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          text-white shadow-lg hover:shadow-xl
          transition-all duration-300 
          hover:scale-105 active:scale-95
          flex items-center justify-center
          ${className}
        `}
        style={{
          background: `linear-gradient(to bottom right, ${currentStyles.buttonGradientFrom}, ${currentStyles.buttonGradientTo})`,
        }}
        aria-label={isOpen ? 'Cerrar índice' : 'Abrir índice'}
      >
        {/* Círculo de progreso */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="25" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
          <circle
            cx="28" cy="28" r="25" fill="none" stroke="white" strokeWidth="3"
            strokeDasharray={`${readProgress * 1.57} 157`}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <span className="relative z-10">
          {isOpen ? <X size={24} /> : <List size={24} />}
        </span>
      </button>

      {/* Panel del TOC */}
      <div 
        className={`
          fixed bottom-24 right-6 z-40
          w-80 max-w-[calc(100vw-3rem)]
          rounded-2xl shadow-2xl
          transition-all duration-300 ease-out
          ${isOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
          }
        `}
        style={{
          backgroundColor: currentStyles.panelBackground,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: currentStyles.panelBorder,
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4"
          style={{ borderBottom: `1px solid ${currentStyles.panelBorder}` }}
        >
          <div className="flex items-center gap-2">
            <List style={{ color: currentStyles.activeColor }} size={20} />
            <h3 className="font-semibold" style={{ color: currentStyles.textColor }}>Contenido</h3>
          </div>
          <span 
            className="text-sm font-medium px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: `${currentStyles.activeColor}20`,
              color: currentStyles.activeColor 
            }}
          >
            {Math.round(readProgress)}%
          </span>
        </div>

        {/* Barra de progreso */}
        {showProgress && (
          <div className="h-1" style={{ backgroundColor: `${currentStyles.panelBorder}` }}>
            <div 
              className="h-full transition-all duration-300"
              style={{ 
                width: `${readProgress}%`,
                background: `linear-gradient(to right, ${currentStyles.progressBarFrom}, ${currentStyles.progressBarTo})`
              }}
            />
          </div>
        )}

        {/* Lista de contenido */}
        <nav className="p-3 max-h-[60vh] overflow-y-auto">
          <ul className="space-y-1">
            {groupedItems.map((group) => {
              const isParentActive = activeId === group.parent.id;
              const hasActiveChild = group.children.some(child => child.id === activeId);
              const isExpanded = activeParentId === group.parent.id;
              const isGroupActive = isParentActive || hasActiveChild;

              return (
                <li key={group.parent.id}>
                  <button
                    onClick={() => handleClick(group.parent.id)}
                    className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200"
                    style={{
                      backgroundColor: isGroupActive ? `${currentStyles.activeColor}20` : 'transparent',
                      color: isGroupActive ? currentStyles.activeColor : currentStyles.textColor,
                      fontWeight: isGroupActive ? 500 : 400,
                    }}
                  >
                    <span 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: isGroupActive ? currentStyles.activeColor : currentStyles.panelBorder }}
                    />
                    <span className="text-sm line-clamp-2">{group.parent.text}</span>
                  </button>
                  
                  {group.children.length > 0 && (
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <ul className="ml-4 mt-1 space-y-1" style={{ borderLeft: `2px solid ${currentStyles.panelBorder}` }}>
                        {group.children.map((child) => (
                          <li key={child.id}>
                            <button
                              onClick={() => handleClick(child.id)}
                              className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
                              style={{
                                color: activeId === child.id ? currentStyles.activeColor : currentStyles.textColor,
                                fontWeight: activeId === child.id ? 500 : 400,
                                opacity: activeId === child.id ? 1 : 0.7,
                              }}
                            >
                              <ChevronRight 
                                size={12} 
                                style={{ color: activeId === child.id ? currentStyles.activeColor : currentStyles.textColor }}
                              />
                              <span className="text-xs line-clamp-1">{child.text}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Overlay para cerrar en móvil */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
}
