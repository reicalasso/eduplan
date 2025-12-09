import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, isAdmin } from '@/lib/auth';

// GET /api/courses - Get all courses
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      include: {
        teacher: {
          select: { id: true, name: true },
        },
        sessions: true,
        departments: true,
      },
      orderBy: { name: 'asc' },
    });

    // Transform to match frontend expected format
    const result = courses.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      teacher_id: c.teacherId,
      faculty: c.faculty,
      level: c.level,
      category: c.category,
      semester: c.semester,
      ects: c.ects,
      total_hours: c.totalHours,
      is_active: c.isActive,
      teacher: c.teacher ? { id: c.teacher.id, name: c.teacher.name } : null,
      sessions: c.sessions.map((s) => ({
        id: s.id,
        type: s.type,
        hours: s.hours,
      })),
      departments: c.departments.map((d) => ({
        id: d.id,
        department: d.department,
        student_count: d.studentCount,
      })),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { detail: 'Dersler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      code,
      teacher_id,
      faculty,
      level,
      category,
      semester,
      ects,
      is_active,
      sessions,
      departments,
    } = body;

    // Check if code already exists
    const existing = await prisma.course.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { detail: 'Bu ders kodu zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Calculate total hours from sessions
    const totalHours = sessions?.reduce((sum: number, s: { hours: number }) => sum + s.hours, 0) || 2;

    const course = await prisma.course.create({
      data: {
        name,
        code,
        teacherId: teacher_id || null,
        faculty,
        level: level || '1',
        category: category || 'zorunlu',
        semester: semester || 'güz',
        ects: ects || 3,
        totalHours,
        isActive: is_active ?? true,
        sessions: {
          create: sessions?.map((s: { type: string; hours: number }) => ({
            type: s.type,
            hours: s.hours,
          })) || [],
        },
        departments: {
          create: departments?.map((d: { department: string; student_count: number }) => ({
            department: d.department,
            studentCount: d.student_count || 0,
          })) || [],
        },
      },
      include: {
        teacher: { select: { id: true, name: true } },
        sessions: true,
        departments: true,
      },
    });

    return NextResponse.json({
      id: course.id,
      name: course.name,
      code: course.code,
      teacher_id: course.teacherId,
      faculty: course.faculty,
      level: course.level,
      category: course.category,
      semester: course.semester,
      ects: course.ects,
      total_hours: course.totalHours,
      is_active: course.isActive,
      teacher: course.teacher,
      sessions: course.sessions.map((s) => ({ id: s.id, type: s.type, hours: s.hours })),
      departments: course.departments.map((d) => ({
        id: d.id,
        department: d.department,
        student_count: d.studentCount,
      })),
    });
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json(
      { detail: 'Ders eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
