import React from 'react';
import { Tags, Filter } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  description?: string;
  postsCount?: number;
}

interface SimpleSidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  loading?: boolean;
}

export const SimpleSidebar: React.FC<SimpleSidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categorías Simples */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Categorías
            </h3>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          {/* Todas las categorías */}
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              !selectedCategory
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Todas las noticias
          </button>

          {/* Lista de categorías */}
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategorySelect(category._id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                selectedCategory === category._id
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{category.name}</span>
              {category.postsCount && (
                <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  {category.postsCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Populares */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Tags className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Trending
            </h3>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {['React', 'JavaScript', 'AI', 'Cloud', 'DevOps', 'Mobile'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};