/**
 * 🚀 Modern Hero Section para Blog Principal
 * Hero impactante con animaciones y respeto al tema dark/light
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Users, BookOpen, Sparkles } from 'lucide-react';

interface ModernHeroSectionProps {
  totalPosts?: number;
  totalReaders?: string;
  onSearch?: () => void;
}

export const ModernHeroSection: React.FC<ModernHeroSectionProps> = ({
  totalPosts = 0,
  totalReaders = "5K+",
  onSearch
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Badge Superior */}
          <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">Actualizado semanalmente</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Donde los <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">profesionales</span>
            <br />
            se mantienen informados
          </h1>

          {/* Subtítulo */}
          <p className="text-xl lg:text-2xl text-blue-100 dark:text-blue-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Contenido curado y validado sobre las últimas tendencias tecnológicas. 
            Información confiable para profesionales del desarrollo.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-3 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="bg-green-400/20 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-300" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">{totalPosts}+</div>
                <div className="text-sm text-blue-200">Artículos</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="bg-blue-400/20 p-2 rounded-lg">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">{totalReaders}</div>
                <div className="text-sm text-blue-200">Lectores</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="bg-purple-400/20 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-300" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">+40K</div>
                <div className="text-sm text-blue-200">Views/mes</div>
              </div>
            </div>
          </div>

          {/* Search Bar Principal */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Buscar noticias de React, JavaScript, tendencias tecnológicas..."
                className="w-full pl-16 pr-6 py-6 text-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl shadow-2xl border-0 focus:ring-4 focus:ring-white/25 dark:focus:ring-blue-400/25 transition-all duration-300"
                onFocus={onSearch}
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={onSearch}
              >
                Buscar
              </button>
            </div>
          </div>

          {/* CTAs Principales */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="#featured"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              <BookOpen className="w-5 h-5" />
              Explorar Artículos
            </Link>
            
            <Link
              to="#newsletter"
              className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm border-2 border-white/30 dark:border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              Manténte Informado
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-blue-200 dark:text-blue-300 text-sm mb-4">
              Confiado por desarrolladores de:
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm px-6 py-2 rounded-lg">
                <span className="text-white font-semibold">Startups</span>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm px-6 py-2 rounded-lg">
                <span className="text-white font-semibold">Freelancers</span>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm px-6 py-2 rounded-lg">
                <span className="text-white font-semibold">Agencies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="currentColor"
            className="text-gray-50 dark:text-gray-900"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default ModernHeroSection;