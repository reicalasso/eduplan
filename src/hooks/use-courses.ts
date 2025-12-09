'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { coursesApi } from '@/lib/api';
import type { Course, CourseCreate } from '@/types';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await coursesApi.getAll();
      setCourses(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Dersler yüklenirken bir hata oluştu';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = async (data: CourseCreate) => {
    try {
      const newCourse = await coursesApi.create(data);
      setCourses((prev) => [...prev, newCourse]);
      toast.success('Ders başarıyla eklendi');
      return newCourse;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ders eklenirken bir hata oluştu';
      toast.error(message);
      throw err;
    }
  };

  const updateCourse = async (id: number, data: CourseCreate) => {
    try {
      const updatedCourse = await coursesApi.update(id, data);
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? updatedCourse : c))
      );
      toast.success('Ders başarıyla güncellendi');
      return updatedCourse;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ders güncellenirken bir hata oluştu';
      toast.error(message);
      throw err;
    }
  };

  const deleteCourse = async (id: number) => {
    try {
      await coursesApi.delete(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success('Ders başarıyla silindi');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ders silinirken bir hata oluştu';
      toast.error(message);
      throw err;
    }
  };

  return {
    courses,
    isLoading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
