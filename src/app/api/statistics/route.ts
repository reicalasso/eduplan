import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getStatistics } from '@/lib/turso-helpers';

// GET /api/statistics - Get system statistics
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Yetkisiz erişim' }, { status: 401 });
    }

    const stats = await getStatistics();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Get statistics error:', error);
    return NextResponse.json(
      { detail: 'İstatistikler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
