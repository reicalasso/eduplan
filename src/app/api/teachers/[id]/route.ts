import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, isAdmin } from '@/lib/auth';

// GET /api/teachers/[id] - Get a single teacher
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { id } = await params;
    const teacher = await prisma.teacher.findUnique({
      where: { id: parseInt(id) },
    });

    if (!teacher) {
      return NextResponse.json({ detail: 'Öğretmen bulunamadı' }, { status: 404 });
    }

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
    console.error('Get teacher error:', error);
    return NextResponse.json(
      { detail: 'Öğretmen bilgileri alınamadı' },
      { status: 500 }
    );
  }
}

// PUT /api/teachers/[id] - Update a teacher
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, faculty, department, working_hours } = body;

    const teacher = await prisma.teacher.update({
      where: { id: parseInt(id) },
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
    console.error('Update teacher error:', error);
    return NextResponse.json(
      { detail: 'Öğretmen güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE /api/teachers/[id] - Delete a teacher
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.teacher.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Öğretmen silindi' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    return NextResponse.json(
      { detail: 'Öğretmen silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
