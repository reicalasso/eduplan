import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, isAdmin } from '@/lib/auth';

// GET /api/schedules - Get all schedules
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 401 });
    }

    const schedules = await prisma.schedule.findMany({
      include: {
        course: {
          include: {
            teacher: {
              select: { id: true, name: true, email: true, faculty: true, department: true },
            },
            departments: true,
          },
        },
        classroom: true,
      },
      orderBy: [{ day: 'asc' }, { timeRange: 'asc' }],
    });

    // Transform to match frontend expected format
    const result = schedules.map((s) => ({
      id: s.id,
      day: s.day,
      time_range: s.timeRange,
      course_id: s.courseId,
      classroom_id: s.classroomId,
      course: s.course
        ? {
            id: s.course.id,
            name: s.course.name,
            code: s.course.code,
            teacher_id: s.course.teacherId,
            total_hours: s.course.totalHours,
            student_count: s.course.departments?.reduce(
              (sum: number, d: { studentCount: number }) => sum + (d.studentCount || 0),
              0
            ) || 0,
            teacher: s.course.teacher,
          }
        : null,
      classroom: s.classroom
        ? {
            id: s.classroom.id,
            name: s.classroom.name,
            type: s.classroom.type,
            capacity: s.classroom.capacity,
          }
        : null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get schedules error:', error);
    return NextResponse.json(
      { detail: 'Ders programı yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/schedules - Create a new schedule
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 403 });
    }

    const body = await request.json();
    const { day, time_range, course_id, classroom_id } = body;

    const schedule = await prisma.schedule.create({
      data: {
        day,
        timeRange: time_range,
        courseId: course_id,
        classroomId: classroom_id,
      },
      include: {
        course: {
          include: { teacher: { select: { id: true, name: true } } },
        },
        classroom: true,
      },
    });

    return NextResponse.json({
      id: schedule.id,
      day: schedule.day,
      time_range: schedule.timeRange,
      course_id: schedule.courseId,
      classroom_id: schedule.classroomId,
      course: schedule.course,
      classroom: schedule.classroom,
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    return NextResponse.json(
      { detail: 'Program eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
