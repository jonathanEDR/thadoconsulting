/**
 * 📚 useReadingHistory Hook
 * Hook para gestionar el historial de lectura del usuario
 */

import { useState, useEffect, useCallback } from 'react';
import { getReadingHistory, addToReadingHistory } from '../services/userBlogService';
import type { ReadingHistoryItem, PaginatedResponse } from '../services/userBlogService';
import { useAuth } from '../contexts/AuthContext';

interface UseReadingHistoryOptions {
  page?: number;
  limit?: number;
  period?: 'today' | 'week' | 'month' | 'all';
}

export function useReadingHistory(options: UseReadingHistoryOptions = {}) {
  const { user } = useAuth();
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<ReadingHistoryItem>['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getReadingHistory(options);
      setHistory(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Error al cargar historial');
      console.error('Error loading reading history:', err);
    } finally {
      setLoading(false);
    }
  }, [user, options.page, options.limit, options.period]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [loadHistory, user]);

  const recordReading = async (postId: string, progress: number = 0) => {
    try {
      await addToReadingHistory(postId, progress);
      // Recargar historial después de registrar
      await loadHistory();
    } catch (err: any) {
      console.error('Error recording reading:', err);
      throw new Error(err.message || 'Error al registrar lectura');
    }
  };

  return {
    history,
    pagination,
    loading,
    error,
    refetch: loadHistory,
    recordReading
  };
}
