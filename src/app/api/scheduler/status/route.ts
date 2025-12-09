import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/scheduler/status - Get scheduling status
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 401 });
    }

    // Get active courses and their sessions
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      include: { sessions: true },
    });

    const totalActiveCourses = courses.length;
    const totalActiveSessions = courses.reduce((sum, c) => sum + c.sessions.length, 0);

    // Get scheduled sessions count
    const scheduledSessions = await prisma.schedule.count();

    const completionPercentage = totalActiveSessions > 0
      ? Math.round((scheduledSessions / totalActiveSessions) * 100)
      : 0;

    return NextResponse.json({
      total_active_courses: totalActiveCourses,
      total_active_sessions: totalActiveSessions,
      scheduled_sessions: scheduledSessions,
      completion_percentage: completionPercentage,
    });
  } catch (error) {
    console.error('Get scheduler status error:', error);
    return NextResponse.json(
      { detail: 'Durum bilgisi alınamadı' },
      { status: 500 }
    );
  }
}
