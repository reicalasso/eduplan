import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/statistics - Get system statistics
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 401 });
    }

    const [teacherCount, courseCount, classroomCount, scheduleCount] = await Promise.all([
      prisma.teacher.count(),
      prisma.course.count(),
      prisma.classroom.count(),
      prisma.schedule.count(),
    ]);

    return NextResponse.json({
      teacherCount,
      courseCount,
      classroomCount,
      scheduleCount,
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    return NextResponse.json(
      { detail: 'İstatistikler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
