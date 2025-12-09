import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, generateToken, hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { detail: 'Kullanıcı adı ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Find user
    let user = await prisma.user.findUnique({
      where: { username },
    });

    // If no users exist, create demo users
    if (!user) {
      const userCount = await prisma.user.count();
      if (userCount === 0) {
        // Create demo users
        const adminHash = await hashPassword('admin123');
        const teacherHash = await hashPassword('teacher123');

        await prisma.user.createMany({
          data: [
            { username: 'admin', passwordHash: adminHash, role: 'admin' },
            { username: 'teacher', passwordHash: teacherHash, role: 'teacher' },
          ],
        });

        // Try to find user again
        user = await prisma.user.findUnique({
          where: { username },
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { detail: 'Geçersiz kullanıcı adı veya şifre' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { detail: 'Geçersiz kullanıcı adı veya şifre' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return NextResponse.json({
      access_token: token,
      token_type: 'bearer',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { detail: 'Giriş yapılırken bir hata oluştu' },
      { status: 500 }
    );
  }
}
