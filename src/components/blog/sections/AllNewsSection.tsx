/**
 * 🎯 All News Section
 * Sección "Todas las Noticias" con layout tipo maqueta
 * 3 columnas: tarjeta imagen izquierda, tarjeta texto centro, tarjeta imagen derecha
 */

import React, { useState, useMemo } from 'react';
import { Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';
import { AllNewsCard } from '../cards/AllNewsCard';
import { useTheme } from '../../../contexts/ThemeContext';
import type { BlogPost, BlogCategory, BlogTag } from '../../../types/blog';
import type { AllNewsConfig } from '../../../hooks/blog/useBlogCmsConfig';

interface AllNewsSectionProps {
  posts: BlogPost[];
  categories?: BlogCategory[];
  tags?: BlogTag[];
  config?: AllNewsConfig;
  onCategorySelect?: (categoryId: string | null) => void;
  onTagSelect?: (tagId: string | null) => void;
  selectedCategory?: string | null;
  selectedTag?: string | null;
}

export const AllNewsSection: React.FC<AllNewsSectionProps> = ({
  posts,
  categories = [],
  tags = [],
  config = {},
  onCategorySelect,
  onTagSelect,
  selectedCategory,
  selectedTag
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = config.postsPerPage || 6;

  // Sidebar colors (solo se usan las que se necesitan actualmente)
  const sidebarConfig = config.sidebar || {};
  const categoriesTitleColor = isDarkMode
    ? (sidebarConfig.categoriesTitleColorDark || '#ffffff')
    : (sidebarConfig.categoriesTitleColor || '#111827');
  const categoryItemColor = isDarkMode
    ? (sidebarConfig.categoryItemColorDark || '#d1d5db')
    : (sidebarConfig.categoryItemColor || '#4b5563');
  const tagsTitleColor = isDarkMode
    ? (sidebarConfig.tagsTitleColorDark || '#ffffff')
    : (sidebarConfig.tagsTitleColor || '#111827');
  const tagBgColor = isDarkMode
    ? (sidebarConfig.tagBgColorDark || '#374151')
    : (sidebarConfig.tagBgColor || '#e5e7eb');
  const tagTextColor = isDarkMode
    ? (sidebarConfig.tagTextColorDark || '#d1d5db')
    : (sidebarConfig.tagTextColor || '#4b5563');

  const fontFamily = config.fontFamily || 'Montserrat';

  // Paginación
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  // Agrupar posts en sets de 3 para el layout de la maqueta
  const postGroups = useMemo(() => {
    const groups: BlogPost[][] = [];
    for (let i = 0; i < currentPosts.length; i += 3) {
      groups.push(currentPosts.slice(i, i + 3));
    }
    return groups;
  }, [currentPosts]);

  // Funciones de paginación
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll suave al inicio de la sección
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  // Generar array de páginas a mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar con elipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <section 
      className="relative py-16"
      style={{ 
        backgroundColor: 'var(--color-background)',
        fontFamily: `'${fontFamily}', sans-serif`
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Título de sección */}
        <div className="flex items-center gap-4 mb-10">
          {config.showIcon !== false && (
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }}
            >
              <Newspaper 
                className="w-6 h-6"
                style={{ color: 'var(--color-primary)' }}
              />
            </div>
          )}
          <h2 
            className="text-3xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            {config.sectionTitle || 'Todas las Noticias'}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Grid de Posts */}
          <div className="flex-1">
            {postGroups.map((group, groupIndex) => (
              <div 
                key={groupIndex}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
              >
                {/* Todas las tarjetas usan image-overlay con hover expandible */}
                {group[0] && (
                  <AllNewsCard
                    post={group[0]}
                    variant="image-overlay"
                    config={{
                      // Combinar imageCard y textCard, priorizando textCard para estilos de botón y texto
                      ...config.imageCard,
                      ...config.textCard,
                      // Sobrescribir con valores específicos de imageCard para dimensiones
                      borderRadius: config.imageCard?.borderRadius || config.textCard?.borderRadius,
                      cardHeight: config.imageCard?.cardHeight || '400px',
                      cardWidth: config.imageCard?.cardWidth || '100%',
                      fontFamily
                    }}
                    className="md:col-span-1"
                  />
                )}

                {group[1] && (
                  <AllNewsCard
                    post={group[1]}
                    variant="image-overlay"
                    config={{
                      ...config.imageCard,
                      ...config.textCard,
                      borderRadius: config.imageCard?.borderRadius || config.textCard?.borderRadius,
                      cardHeight: config.imageCard?.cardHeight || '400px',
                      cardWidth: config.imageCard?.cardWidth || '100%',
                      fontFamily
                    }}
                    className="md:col-span-1"
                  />
                )}

                {group[2] && (
                  <AllNewsCard
                    post={group[2]}
                    variant="image-overlay"
                    config={{
                      ...config.imageCard,
                      ...config.textCard,
                      borderRadius: config.imageCard?.borderRadius || config.textCard?.borderRadius,
                      cardHeight: config.imageCard?.cardHeight || '400px',
                      cardWidth: config.imageCard?.cardWidth || '100%',
                      fontFamily
                    }}
                    className="md:col-span-1"
                  />
                )}
              </div>
            ))}

            {/* Paginación */}
            {totalPages > 1 && config.paginationStyle !== 'loadMore' && (
              <div className="flex justify-center items-center gap-2 mt-10">
                {/* Obtener estilos de paginación según tema */}
                {(() => {
                  const paginationStyles = isDarkMode 
                    ? config.paginationDark 
                    : config.paginationLight;
                  
                  // Fallback a los valores antiguos si no hay configuración por tema
                  const activeBg = paginationStyles?.activeBg || config.paginationActiveBg || (isDarkMode ? '#8b5cf6' : '#8b5cf6');
                  const activeText = paginationStyles?.activeText || config.paginationActiveText || '#ffffff';
                  const inactiveBg = paginationStyles?.inactiveBg || config.paginationInactiveBg || (isDarkMode ? '#1f2937' : '#f3f4f6');
                  const inactiveText = paginationStyles?.inactiveText || config.paginationInactiveText || (isDarkMode ? '#9ca3af' : '#374151');
                  const borderColor = paginationStyles?.borderColor || config.paginationBorderColor || (isDarkMode ? '#374151' : '#d1d5db');
                  const borderRadius = paginationStyles?.borderRadius || config.paginationBorderRadius || '8px';
                  const useGradient = paginationStyles?.activeUseGradient || false;
                  const gradientFrom = paginationStyles?.activeGradientFrom || '#8b5cf6';
                  const gradientTo = paginationStyles?.activeGradientTo || '#06b6d4';
                  const gradientDirection = paginationStyles?.activeGradientDirection || 'to-r';
                  
                  // Convertir dirección de gradiente
                  const getGradientCSS = () => {
                    const directionMap: Record<string, string> = {
                      'to-r': 'to right',
                      'to-l': 'to left',
                      'to-t': 'to top',
                      'to-b': 'to bottom',
                      'to-tr': 'to top right',
                      'to-tl': 'to top left',
                      'to-br': 'to bottom right',
                      'to-bl': 'to bottom left'
                    };
                    return `linear-gradient(${directionMap[gradientDirection] || 'to right'}, ${gradientFrom}, ${gradientTo})`;
                  };
                  
                  const activeBackground = useGradient ? getGradientCSS() : activeBg;
                  
                  return (
                    <>
                      {/* Botón Anterior */}
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 font-medium transition-all duration-200 flex items-center gap-1 ${
                          currentPage === 1
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: inactiveBg,
                          color: inactiveText,
                          border: `1px solid ${borderColor}`,
                          borderRadius
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                      </button>

                      {/* Números de página (solo si es 'numbered') */}
                      {config.paginationStyle !== 'simple' && (
                        <div className="flex items-center gap-1">
                          {getPageNumbers().map((page, index) => (
                            <React.Fragment key={index}>
                              {page === '...' ? (
                                <span 
                                  className="px-2 py-1"
                                  style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                                >
                                  ...
                                </span>
                              ) : (
                                <button
                                  onClick={() => goToPage(page as number)}
                                  className={`w-10 h-10 font-semibold transition-all duration-200 ${
                                    currentPage === page
                                      ? 'scale-110'
                                      : 'hover:scale-105'
                                  }`}
                                  style={{
                                    background: currentPage === page
                                      ? activeBackground
                                      : inactiveBg,
                                    color: currentPage === page
                                      ? activeText
                                      : inactiveText,
                                    border: currentPage === page
                                      ? 'none'
                                      : `1px solid ${borderColor}`,
                                    borderRadius
                                  }}
                                >
                                  {page}
                                </button>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                      {/* Botón Siguiente */}
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 font-medium transition-all duration-200 flex items-center gap-1 ${
                          currentPage === totalPages
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: inactiveBg,
                          color: inactiveText,
                          border: `1px solid ${borderColor}`,
                          borderRadius
                        }}
                      >
                        Siguiente
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Botón Cargar Más (alternativo) */}
            {totalPages > 1 && config.paginationStyle === 'loadMore' && currentPage < totalPages && (
              <div className="flex justify-center mt-10">
                {(() => {
                  const paginationStyles = isDarkMode 
                    ? config.paginationDark 
                    : config.paginationLight;
                  
                  const activeBg = paginationStyles?.activeBg || config.paginationActiveBg || '#60a5fa';
                  const activeText = paginationStyles?.activeText || config.paginationActiveText || '#ffffff';
                  const useGradient = paginationStyles?.activeUseGradient || false;
                  const gradientFrom = paginationStyles?.activeGradientFrom || '#8b5cf6';
                  const gradientTo = paginationStyles?.activeGradientTo || '#06b6d4';
                  const gradientDirection = paginationStyles?.activeGradientDirection || 'to-r';
                  
                  const directionMap: Record<string, string> = {
                    'to-r': 'to right',
                    'to-l': 'to left',
                    'to-t': 'to top',
                    'to-b': 'to bottom',
                    'to-tr': 'to top right',
                    'to-br': 'to bottom right'
                  };
                  
                  const activeBackground = useGradient 
                    ? `linear-gradient(${directionMap[gradientDirection] || 'to right'}, ${gradientFrom}, ${gradientTo})`
                    : activeBg;
                  
                  return (
                    <button
                      onClick={goToNextPage}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        background: activeBackground,
                        color: activeText
                      }}
                    >
                      Cargar más noticias
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside 
            className="w-full lg:w-80"
            style={{
              fontFamily: `'${sidebarConfig.fontFamily || 'Montserrat'}', sans-serif`
            }}
          >
            {/* Contenedor único para Categorías y Tags */}
            <div
              style={{
                backgroundColor: sidebarConfig.transparentBg 
                  ? 'transparent'
                  : (isDarkMode 
                      ? (sidebarConfig.bgColorDark || 'rgba(15, 23, 42, 0.8)')
                      : (sidebarConfig.bgColorLight || '#ffffff')),
                border: (sidebarConfig.showBorder !== false) 
                  ? `${sidebarConfig.borderWidth ?? 1}px solid ${
                      isDarkMode 
                        ? (sidebarConfig.borderColorDark || 'rgba(139, 92, 246, 0.3)')
                        : (sidebarConfig.borderColorLight || '#e5e7eb')
                    }`
                  : 'none',
                borderRadius: sidebarConfig.borderRadius || '12px',
                padding: sidebarConfig.padding || '24px',
                backdropFilter: sidebarConfig.transparentBg ? 'none' : 'blur(10px)'
              }}
            >
              {/* Sección de Categorías */}
              {categories.length > 0 && (
                <div className="mb-8">
                  <h3 
                    className="text-lg font-bold mb-4 uppercase tracking-wider"
                    style={{ color: categoriesTitleColor }}
                  >
                    Categorías
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => onCategorySelect?.(null)}
                        className={`flex items-center gap-2 w-full text-left py-2 px-1 transition-colors ${
                          !selectedCategory ? 'font-semibold' : ''
                        }`}
                        style={{ 
                          color: !selectedCategory 
                            ? sidebarConfig.categoryHoverColor || '#a855f7' 
                            : categoryItemColor
                        }}
                      >
                        All
                      </button>
                    </li>
                    {categories.map((category) => (
                      <li key={category._id}>
                        <button
                          onClick={() => onCategorySelect?.(category._id)}
                          className={`flex items-center gap-2 w-full text-left py-2 px-1 transition-colors hover:opacity-80 ${
                            selectedCategory === category._id ? 'font-semibold' : ''
                          }`}
                          style={{ 
                            color: selectedCategory === category._id 
                              ? sidebarConfig.categoryHoverColor || '#a855f7' 
                              : categoryItemColor
                          }}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sección de Tags */}
              {tags.length > 0 && (
                <div>
                  <h3 
                    className="text-lg font-bold mb-4 uppercase tracking-wider"
                    style={{ color: tagsTitleColor }}
                  >
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onTagSelect?.(null)}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                      style={{
                        backgroundColor: !selectedTag 
                          ? sidebarConfig.tagActiveBgColor || '#8b5cf6'
                          : tagBgColor,
                        color: !selectedTag 
                          ? sidebarConfig.tagActiveTextColor || '#ffffff'
                          : tagTextColor
                      }}
                    >
                      All
                    </button>
                    {tags.slice(0, sidebarConfig.maxVisibleTags || 8).map((tag) => (
                      <button
                        key={tag._id}
                        onClick={() => onTagSelect?.(tag._id)}
                        className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                        style={{
                          backgroundColor: selectedTag === tag._id 
                            ? sidebarConfig.tagActiveBgColor || '#8b5cf6'
                            : tagBgColor,
                          color: selectedTag === tag._id 
                            ? sidebarConfig.tagActiveTextColor || '#ffffff'
                            : tagTextColor
                        }}
                      >
                        {tag.name}
                      </button>
                    ))}
                    {tags.length > (sidebarConfig.maxVisibleTags || 8) && (
                      <span 
                        className="px-4 py-2 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: tagBgColor,
                          color: tagTextColor
                        }}
                      >
                        +{tags.length - (sidebarConfig.maxVisibleTags || 8)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default AllNewsSection;
