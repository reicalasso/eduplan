import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, isAdmin } from '@/lib/auth';

// GET /api/courses/[id] - Get a single course
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
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        teacher: { select: { id: true, name: true } },
        sessions: true,
        departments: true,
      },
    });

    if (!course) {
      return NextResponse.json({ detail: 'Ders bulunamadı' }, { status: 404 });
    }

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
    console.error('Get course error:', error);
    return NextResponse.json(
      { detail: 'Ders bilgileri alınamadı' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - Update a course
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
    const courseId = parseInt(id);
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

    // Calculate total hours from sessions
    const totalHours = sessions?.reduce((sum: number, s: { hours: number }) => sum + s.hours, 0) || 2;

    // Delete existing sessions and departments
    await prisma.courseSession.deleteMany({ where: { courseId } });
    await prisma.courseDepartment.deleteMany({ where: { courseId } });

    const course = await prisma.course.update({
      where: { id: courseId },
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
    console.error('Update course error:', error);
    return NextResponse.json(
      { detail: 'Ders güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete a course
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
    await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Ders silindi' });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json(
      { detail: 'Ders silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
