import { NextResponse } from 'next/server';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { getAllSchedules, createSchedule } from '@/lib/turso-helpers';

// GET /api/schedules - Get all schedules
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 401 });
    }

    const schedules = await getAllSchedules();
    return NextResponse.json(schedules);
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

    const schedule = await createSchedule({ day, time_range, course_id, classroom_id });
    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Create schedule error:', error);
    return NextResponse.json(
      { detail: 'Program eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
