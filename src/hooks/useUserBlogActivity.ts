/**
 * 📊 useUserBlogActivity Hook
 * Hook principal para gestionar la actividad del usuario en el blog
 */

import { useState, useEffect } from 'react';
import { getUserBlogStats } from '../services/userBlogService';
import type { UserBlogStats } from '../services/userBlogService';
import { useAuth } from '../contexts/AuthContext';

export function useUserBlogActivity() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserBlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserBlogStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar estadísticas');
      console.error('❌ [DASHBOARD] Error loading blog stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  return {
    stats,
    loading,
    error,
    refetch: loadStats
  };
}
