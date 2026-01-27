/**
 * Página de Filtro de Blog (Categoría/Tag)
 * 
 * Esta página maneja las rutas:
 * - /blog/category/:slug
 * - /blog/categoria/:slug
 * - /blog/tag/:slug
 * 
 * NO debe ser indexada por Google porque son filtros, no páginas únicas.
 * Redirige a /blog con el filtro aplicado y meta noindex.
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface BlogFilterRedirectProps {
  filterType: 'category' | 'tag';
}

const BlogFilterRedirect: React.FC<BlogFilterRedirectProps> = ({ filterType }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir a /blog con el parámetro de filtro
    const queryParam = filterType === 'category' ? 'categoria' : 'tag';
    
    // Usar replace para no agregar al historial
    navigate(`/blog?${queryParam}=${slug}`, { replace: true });
  }, [slug, filterType, navigate]);

  return (
    <>
      {/* Meta noindex para que Google no indexe estas URLs */}
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.thadoconsulting.com/blog" />
        <title>Redirigiendo... | THADO Consulting</title>
      </Helmet>
      
      {/* Contenido mínimo mientras redirige */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Redirigiendo al blog...
          </p>
        </div>
      </div>
    </>
  );
};

export default BlogFilterRedirect;
