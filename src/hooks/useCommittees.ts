import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Committee } from '@/types';

export function useCommittees() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Committee[]>('/committees');
      setCommittees(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar comités');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { committees, loading, error, refetch: fetch };
}
