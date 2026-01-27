import React from 'react';
import { 
  Tags, 
  TrendingUp, 
  BookOpen, 
  Filter,
  ChevronRight 
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  description?: string;
  postsCount?: number;
}

interface ModernSidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  loading?: boolean;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Categories Loading */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Categorías
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Contenido curado por áreas tecnológicas
          </p>
        </div>
        
        <div className="p-4">
          {/* All Categories Button */}
          <button
            onClick={() => onCategorySelect(null)}
            className={`
              w-full flex items-center justify-between p-3 rounded-lg mb-2 transition-all duration-200
              ${!selectedCategory
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
                            <span className="font-medium block">Todas las noticias</span>
            </div>
            <ChevronRight 
              className={`w-4 h-4 transition-transform duration-200 ${
                !selectedCategory ? 'rotate-90' : ''
              }`} 
            />
          </button>

          {/* Category List */}
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => onCategorySelect(category._id)}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group
                  ${selectedCategory === category._id
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Tags className="w-4 h-4" />
                  <div className="text-left">
                    <span className="font-medium block">{category.name}</span>
                    {category.description && (
                      <span className="text-xs opacity-70 block truncate max-w-32">
                        {category.description}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {category.postsCount && (
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${selectedCategory === category._id
                        ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }
                    `}>
                      {category.postsCount}
                    </span>
                  )}
                  <ChevronRight 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      selectedCategory === category._id ? 'rotate-90' : 'group-hover:translate-x-1'
                    }`} 
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tecnologías Trending
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Lo más relevante del sector
          </p>
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {[
              'React', 'JavaScript', 'TypeScript', 'AI/ML', 
              'Cloud Computing', 'DevOps', 'Blockchain', 'Cybersecurity'
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Newsletter Tech
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Mantente al día con las últimas tendencias tecnológicas
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-[1.02]">
              Suscribirse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};