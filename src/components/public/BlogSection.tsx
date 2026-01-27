import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    name: string;
  } | null;
  category: {
    name: string;
    slug: string;
  };
  publishedAt: string;
  readTime: number;
}

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchRecentPosts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(
          `${apiUrl}/blog/posts?limit=3&status=published&sort=-publishedAt`,
          { signal: controller.signal }
        );
        
        if (response.ok && isMounted) {
          const data = await response.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        if ((error as any).name !== 'AbortError') {
          console.error('Error fetching blog posts:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecentPosts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <section className="py-20 theme-transition" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 theme-transition" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl md:text-4xl font-bold theme-text-primary">
              Últimas del Blog
            </h2>
          </div>
          <p className="text-lg theme-text-secondary max-w-2xl mx-auto">
            Descubre las últimas tendencias, tutoriales y noticias sobre tecnología y desarrollo
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post.slug}`}
              className="group theme-bg-card theme-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-cyan-500">
                    <BookOpen className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                    {post.category.name}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center space-x-4 text-xs theme-text-secondary mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>
                      {post.author?.name || 'Autor Desconocido'}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold theme-text-primary mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="theme-text-secondary text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More */}
                <div className="flex items-center justify-between">
                  <span className="text-sm theme-text-secondary">
                    {post.readTime} min lectura
                  </span>
                  <div className="flex items-center space-x-1 text-purple-600 font-medium text-sm group-hover:space-x-2 transition-all">
                    <span>Leer más</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA to Blog */}
        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <span>Ver todos los artículos</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
