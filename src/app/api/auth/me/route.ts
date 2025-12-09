import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { detail: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    // Return user with permissions
    const permissions = user.role === 'admin' 
      ? ['read', 'write', 'delete', 'admin']
      : ['read', 'limited_write'];

    return NextResponse.json({
      username: user.username,
      role: user.role,
      permissions,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { detail: 'Kullanıcı bilgileri alınamadı' },
      { status: 500 }
    );
  }
}
