'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { schedulesApi } from '@/lib/api';
import type { Schedule } from '@/types';

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await schedulesApi.getAll();
      setSchedules(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ders programı yüklenirken bir hata oluştu';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const deleteSchedule = async (id: number) => {
    try {
      await schedulesApi.delete(id);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      toast.success('Program başarıyla silindi');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Program silinirken bir hata oluştu';
      toast.error(message);
      throw err;
    }
  };

  const deleteByDays = async (days: string[]) => {
    try {
      await schedulesApi.deleteByDays(days);
      setSchedules((prev) => prev.filter((s) => !days.includes(s.day)));
      toast.success('Programlar başarıyla silindi');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Programlar silinirken bir hata oluştu';
      toast.error(message);
      throw err;
    }
  };

  return {
    schedules,
    isLoading,
    error,
    fetchSchedules,
    deleteSchedule,
    deleteByDays,
  };
}
