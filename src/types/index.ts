// ==================== USER & AUTH ====================
export interface User {
  username: string;
  role: 'admin' | 'teacher';
  permissions: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// ==================== TEACHER ====================
export interface WorkingHours {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  faculty: string;
  department: string;
  working_hours: string; // JSON string of WorkingHours
  is_active?: boolean;
}

export interface TeacherCreate {
  name: string;
  email: string;
  faculty: string;
  department: string;
  working_hours: string;
}

// ==================== COURSE ====================
export interface CourseSession {
  id?: number;
  type: 'teorik' | 'lab';
  hours: number;
}

export interface CourseDepartment {
  id?: number;
  department: string;
  student_count: number;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  teacher_id: number;
  faculty: string;
  level: string;
  type?: string;
  category: 'zorunlu' | 'secmeli';
  semester: string;
  ects: number;
  total_hours?: number;
  is_active: boolean;
  student_count?: number;
  sessions: CourseSession[];
  departments: CourseDepartment[];
  teacher?: {
    id: number;
    name: string;
  } | null;
}

export interface CourseCreate {
  name: string;
  code: string;
  teacher_id: number;
  faculty: string;
  level: string;
  category: 'zorunlu' | 'secmeli';
  semester: string;
  ects: number;
  is_active: boolean;
  sessions: Omit<CourseSession, 'id'>[];
  departments: Omit<CourseDepartment, 'id'>[];
}

// ==================== CLASSROOM ====================
export interface Classroom {
  id: number;
  name: string;
  capacity: number;
  type: 'teorik' | 'lab';
  faculty: string;
  department: string;
}

export interface ClassroomCreate {
  name: string;
  capacity: number;
  type: 'teorik' | 'lab';
  faculty: string;
  department: string;
}

// ==================== SCHEDULE ====================
export interface Schedule {
  id: number;
  day: string;
  time_range: string;
  course_id?: number;
  classroom_id?: number;
  course?: {
    id: number;
    name: string;
    code: string;
    teacher_id: number;
    teacher?: {
      id: number;
      name: string;
      email: string;
      faculty: string;
      department: string;
    } | null;
    total_hours?: number;
    student_count?: number;
  } | null;
  classroom?: {
    id: number;
    name: string;
    type: string;
    capacity: number;
  } | null;
}

export interface ScheduleCreate {
  day: string;
  time_range: string;
  course_id: number;
  classroom_id: number;
}

// ==================== SCHEDULER ====================
export interface SchedulerStatus {
  total_active_courses: number;
  total_active_sessions: number;
  scheduled_sessions: number;
  completion_percentage: number;
}

export interface SchedulerResult {
  success: boolean;
  message: string;
  scheduled_count: number;
  unscheduled_count: number;
  success_rate: number;
  schedule: Schedule[];
  unscheduled: {
    id: number;
    name: string;
    code: string;
    total_hours: number;
    student_count: number;
    reason: string;
  }[];
  perfect: boolean;
}

// ==================== STATISTICS ====================
export interface Statistics {
  teacherCount: number;
  courseCount: number;
  classroomCount: number;
  scheduleCount: number;
}

// ==================== FACULTY & DEPARTMENT ====================
export interface Faculty {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}
