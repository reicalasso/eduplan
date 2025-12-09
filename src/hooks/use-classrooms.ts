'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { classroomsApi } from '@/lib/api';
import type { Classroom, ClassroomCreate } from '@/types';

export function useClassrooms() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClassrooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await classroomsApi.getAll();
      setClassrooms(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Derslikler yüklenirken bir hata oluştu';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  const createClassroom = async (data: ClassroomCreate) => {
    try {
      const newClassroom = await classroomsApi.create(data);
      setClassrooms((prev) => [...prev, newClassroom]);
      toast.success('Derslik başarıyla eklendi');
      return newClassroom;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Derslik eklenirken bir hata oluştu';
      toast.error(message);
      throw err;
    }
  };

  const updateClassroom = async (id: number, data: ClassroomCreate) => {
    try {
      const updatedClassroom = await classroomsApi.update(id, data);
      setClassrooms((prev) =>
        prev.map((c) => (c.id === id ? updatedClassroom : c))
      );
      toast.success('Derslik başarıyla güncellendi');
      return updatedClassroom;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Derslik güncellenirken bir hata oluştu';
      toast.error(message);
      throw err;
    }
  };

  const deleteClassroom = async (id: number) => {
    try {
      await classroomsApi.delete(id);
      setClassrooms((prev) => prev.filter((c) => c.id !== id));
      toast.success('Derslik başarıyla silindi');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Derslik silinirken bir hata oluştu';
      toast.error(message);
      throw err;
    }
  };

  return {
    classrooms,
    isLoading,
    error,
    fetchClassrooms,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  };
}
