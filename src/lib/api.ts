import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import type {
  AuthResponse,
  User,
  Teacher,
  TeacherCreate,
  Course,
  CourseCreate,
  Classroom,
  ClassroomCreate,
  Schedule,
  ScheduleCreate,
  SchedulerStatus,
  SchedulerResult,
  Statistics,
} from '@/types';

const API_URL = '/api';

// Axios instance with interceptors
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to headers
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ==================== AUTH ====================
export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { username, password });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// ==================== TEACHERS ====================
export const teachersApi = {
  getAll: async (): Promise<Teacher[]> => {
    const response = await api.get<Teacher[]>('/teachers');
    return response.data;
  },

  getById: async (id: number): Promise<Teacher> => {
    const response = await api.get<Teacher>(`/teachers/${id}`);
    return response.data;
  },

  create: async (data: TeacherCreate): Promise<Teacher> => {
    const response = await api.post<Teacher>('/teachers', data);
    return response.data;
  },

  update: async (id: number, data: TeacherCreate): Promise<Teacher> => {
    const response = await api.put<Teacher>(`/teachers/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/teachers/${id}`);
  },
};

// ==================== COURSES ====================
export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/courses');
    return response.data;
  },

  getById: async (id: number): Promise<Course> => {
    const response = await api.get<Course>(`/courses/${id}`);
    return response.data;
  },

  getUnscheduled: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/courses/unscheduled');
    return response.data;
  },

  create: async (data: CourseCreate): Promise<Course> => {
    const response = await api.post<Course>('/courses', data);
    return response.data;
  },

  update: async (id: number, data: CourseCreate): Promise<Course> => {
    const response = await api.put<Course>(`/courses/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },
};

// ==================== CLASSROOMS ====================
export const classroomsApi = {
  getAll: async (): Promise<Classroom[]> => {
    const response = await api.get<Classroom[]>('/classrooms');
    return response.data;
  },

  getById: async (id: number): Promise<Classroom> => {
    const response = await api.get<Classroom>(`/classrooms/${id}`);
    return response.data;
  },

  create: async (data: ClassroomCreate): Promise<Classroom> => {
    const response = await api.post<Classroom>('/classrooms', data);
    return response.data;
  },

  update: async (id: number, data: ClassroomCreate): Promise<Classroom> => {
    const response = await api.put<Classroom>(`/classrooms/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/classrooms/${id}`);
  },
};

// ==================== SCHEDULES ====================
export const schedulesApi = {
  getAll: async (): Promise<Schedule[]> => {
    const response = await api.get<Schedule[]>('/schedules');
    return response.data;
  },

  getById: async (id: number): Promise<Schedule> => {
    const response = await api.get<Schedule>(`/schedules/${id}`);
    return response.data;
  },

  create: async (data: ScheduleCreate): Promise<Schedule> => {
    const response = await api.post<Schedule>('/schedules', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/schedules/${id}`);
  },

  deleteByDay: async (day: string): Promise<void> => {
    await api.delete(`/schedules/day/${day}`);
  },

  deleteByDays: async (days: string[]): Promise<void> => {
    await api.post('/schedules/days/delete', { days });
  },
};

// ==================== SCHEDULER ====================
export const schedulerApi = {
  generate: async (): Promise<SchedulerResult> => {
    const response = await api.post<SchedulerResult>('/scheduler/generate');
    return response.data;
  },

  getStatus: async (): Promise<SchedulerStatus> => {
    const response = await api.get<SchedulerStatus>('/scheduler/status');
    return response.data;
  },
};

// ==================== STATISTICS ====================
export const statisticsApi = {
  get: async (): Promise<Statistics> => {
    const response = await api.get<Statistics>('/statistics/');
    return response.data;
  },
};

export default api;
