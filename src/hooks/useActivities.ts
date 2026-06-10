import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Activity } from '@/types';

interface Filters {
  status?: string;
  approval_status?: string;
  committee_id?: string;
}

export function useActivities(filters: Filters = {}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
      );
      const { data } = await api.get<Activity[]>('/activities', { params });
      setActivities(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar actividades');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { activities, loading, error, refetch: fetch };
}

export function useActivity(id: string) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Activity>(`/activities/${id}`)
      .then(({ data }) => setActivity(data))
      .finally(() => setLoading(false));
  }, [id]);

  return { activity, loading };
}
