import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, isAdmin } from '@/lib/auth';

// GET /api/teachers - Get all teachers
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 401 });
    }

    const teachers = await prisma.teacher.findMany({
      orderBy: { name: 'asc' },
    });

    // Transform to match frontend expected format
    const result = teachers.map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      faculty: t.faculty,
      department: t.department,
      working_hours: t.workingHours,
      is_active: t.isActive,
    }));

    return NextResponse.json(result);
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
    const existing = await prisma.teacher.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { detail: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    const teacher = await prisma.teacher.create({
      data: {
        name,
        email,
        faculty,
        department,
        workingHours: working_hours || '{}',
      },
    });

    return NextResponse.json({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      faculty: teacher.faculty,
      department: teacher.department,
      working_hours: teacher.workingHours,
      is_active: teacher.isActive,
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    return NextResponse.json(
      { detail: 'Öğretmen eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
