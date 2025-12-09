import { NextResponse } from 'next/server';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { getAllCourses, findCourseByCode, createCourse } from '@/lib/turso-helpers';

// GET /api/courses - Get all courses
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 401 });
    }

    const courses = await getAllCourses();
    return NextResponse.json(courses);
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

    // Check if code already exists
    const existing = await findCourseByCode(body.code);
    if (existing) {
      return NextResponse.json(
        { detail: 'Bu ders kodu zaten kullanılıyor' },
        { status: 400 }
      );
    }

    const course = await createCourse(body);
    return NextResponse.json(course);
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json(
      { detail: 'Ders eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
