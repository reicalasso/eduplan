'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { teachersApi } from '@/lib/api';
import type { Teacher, TeacherCreate } from '@/types';

export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await teachersApi.getAll();
      setTeachers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Öğretmenler yüklenirken bir hata oluştu';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const createTeacher = async (data: TeacherCreate) => {
    try {
      const newTeacher = await teachersApi.create(data);
      setTeachers((prev) => [...prev, newTeacher]);
      toast.success('Öğretmen başarıyla eklendi');
      return newTeacher;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Öğretmen eklenirken bir hata oluştu';
      toast.error(message);
      throw err;
    }
  };

  const updateTeacher = async (id: number, data: TeacherCreate) => {
    try {
      const updatedTeacher = await teachersApi.update(id, data);
      setTeachers((prev) =>
        prev.map((t) => (t.id === id ? updatedTeacher : t))
      );
      toast.success('Öğretmen başarıyla güncellendi');
      return updatedTeacher;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Öğretmen güncellenirken bir hata oluştu';
      toast.error(message);
      throw err;
    }
  };

  const deleteTeacher = async (id: number) => {
    try {
      await teachersApi.delete(id);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      toast.success('Öğretmen başarıyla silindi');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Öğretmen silinirken bir hata oluştu';
      toast.error(message);
      throw err;
    }
  };

  return {
    teachers,
    isLoading,
    error,
    fetchTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
}
