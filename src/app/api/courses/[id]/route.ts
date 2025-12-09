import { NextResponse } from 'next/server';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { getCourseById, updateCourse, deleteCourse } from '@/lib/turso-helpers';

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
    const course = await getCourseById(parseInt(id));

    if (!course) {
      return NextResponse.json({ detail: 'Ders bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(course);
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
    const body = await request.json();
    const course = await updateCourse(parseInt(id), body);
    return NextResponse.json(course);
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
    await deleteCourse(parseInt(id));
    return NextResponse.json({ message: 'Ders silindi' });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json(
      { detail: 'Ders silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
