import { NextResponse } from 'next/server';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { deleteSchedule } from '@/lib/turso-helpers';

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
    await deleteSchedule(parseInt(id));
    return NextResponse.json({ message: 'Program silindi' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    return NextResponse.json(
      { detail: 'Program silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
