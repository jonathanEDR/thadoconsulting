/**
 * 📊 AI Analytics Page
 * Página para visualizar estadísticas de AI
 */

import React from 'react';
import { AIAnalyticsDashboard } from '../../components/admin/AIAnalyticsDashboard';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AIAnalytics: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics de Inteligencia Artificial
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Estadísticas de uso y rendimiento del sistema de AI
          </p>
        </div>

        {/* Dashboard Component */}
        <AIAnalyticsDashboard />
      </div>
    </div>
  );
};

export default AIAnalytics;