import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, isAdmin } from '@/lib/auth';

// DELETE /api/schedules/[id] - Delete a schedule
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
    await prisma.schedule.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Program silindi' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    return NextResponse.json(
      { detail: 'Program silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
