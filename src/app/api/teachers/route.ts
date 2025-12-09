import { NextResponse } from 'next/server';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { getAllTeachers, findTeacherByEmail, createTeacher } from '@/lib/turso-helpers';

// GET /api/teachers - Get all teachers
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 401 });
    }

    const teachers = await getAllTeachers();
    return NextResponse.json(teachers);
  } catch (error) {
    console.error('Get teachers error:', error);
    return NextResponse.json(
      { detail: 'Öğretmenler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/teachers - Create a new teacher
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, faculty, department, working_hours } = body;

    // Check if email already exists
    const existing = await findTeacherByEmail(email);
    if (existing) {
      return NextResponse.json(
        { detail: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    const teacher = await createTeacher({ name, email, faculty, department, working_hours });
    return NextResponse.json(teacher);
  } catch (error) {
    console.error('Create teacher error:', error);
    return NextResponse.json(
      { detail: 'Öğretmen eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
