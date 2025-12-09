import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getSchedulerStatus } from '@/lib/turso-helpers';

// GET /api/scheduler/status - Get scheduling status
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { totalActiveCourses, totalActiveSessions, scheduledSessions } = await getSchedulerStatus();

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
