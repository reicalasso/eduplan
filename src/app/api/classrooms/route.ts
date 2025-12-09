import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, isAdmin } from '@/lib/auth';

// GET /api/classrooms - Get all classrooms
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 401 });
    }

    const classrooms = await prisma.classroom.findMany({
      orderBy: { name: 'asc' },
    });

    // Transform to match frontend expected format
    const result = classrooms.map((c) => ({
      id: c.id,
      name: c.name,
      capacity: c.capacity,
      type: c.type,
      faculty: c.faculty,
      department: c.department,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get classrooms error:', error);
    return NextResponse.json(
      { detail: 'Derslikler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/classrooms - Create a new classroom
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 403 });
    }

    const body = await request.json();
    const { name, capacity, type, faculty, department } = body;

    // Check if classroom already exists in this department
    const existing = await prisma.classroom.findFirst({
      where: { name, department },
    });
    if (existing) {
      return NextResponse.json(
        { detail: 'Bu derslik zaten bu bölümde mevcut' },
        { status: 400 }
      );
    }

    const classroom = await prisma.classroom.create({
      data: {
        name,
        capacity: capacity || 30,
        type: type || 'teorik',
        faculty,
        department,
      },
    });

    return NextResponse.json({
      id: classroom.id,
      name: classroom.name,
      capacity: classroom.capacity,
      type: classroom.type,
      faculty: classroom.faculty,
      department: classroom.department,
    });
  } catch (error) {
    console.error('Create classroom error:', error);
    return NextResponse.json(
      { detail: 'Derslik eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
