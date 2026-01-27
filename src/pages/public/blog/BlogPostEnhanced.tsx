/**
 * 📝 BlogPost Público (Sin IA)
 * Versión optimizada para páginas públicas sin funcionalidades de IA
 * ✅ Compatible con pre-renderizado SEO
 */

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useBlogPost } from '../../../hooks/blog';
import { 
  ShareButtons, 
  TagList, 
  RelatedPosts, 
  PostNavigation, 
  SEOHead, 
  PostHeader,
  AuthorCard
} from '../../../components/blog/common';
import { CommentsList } from '../../../components/blog/comments';
import { sanitizeHTML } from '../../../utils/blog';
import PublicFooter from '../../../components/public/PublicFooter';

const BlogPostEnhanced: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error, isPrerendering } = useBlogPost(slug || '');

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Blog Web Scuti`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  // ✅ SEO FIX: Durante pre-renderizado, NO mostrar "Artículo no encontrado"
  if ((error || !post) && !isPrerendering) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Artículo no encontrado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'El artículo que buscas no existe o ha sido eliminado.'}
          </p>
          <Link 
            to="/blog" 
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Durante pre-renderizado sin datos, retornar null para que el HTML estático permanezca
  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead post={post} />

      {/* Breadcrumb/Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al blog
            </Link>
            <ShareButtons 
              url={window.location.href}
              title={post.title}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Post Header */}
            <PostHeader post={post} />

            {/* Post Content */}
            <div className="p-6 sm:p-8">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: sanitizeHTML(post.content) 
                  }} 
                />
              </div>

              {/* Post Footer */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <TagList tags={post.tags} />
                  <ShareButtons 
                    url={window.location.href}
                    title={post.title}
                  />
                </div>
              </div>

              {/* Author Card */}
              {post.author && (
                <div className="mt-8">
                  <AuthorCard author={post.author} />
                </div>
              )}
            </div>
          </article>

          {/* Comments Section */}
          {post.allowComments && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <CommentsList postSlug={slug!} />
            </div>
          )}

          {/* Related Posts */}
          <RelatedPosts 
            currentPost={post}
          />

          {/* Navigation */}
          <PostNavigation currentPost={post} />
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default BlogPostEnhanced;