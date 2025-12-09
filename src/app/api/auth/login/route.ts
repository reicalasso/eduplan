import { NextResponse } from 'next/server';
import { db, prisma, isTurso } from '@/lib/db';
import { verifyPassword, generateToken, hashPassword } from '@/lib/auth';

interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: string;
}

async function findUser(username: string): Promise<User | null> {
  if (isTurso && db) {
    const result = await db.execute({
      sql: 'SELECT id, username, passwordHash, role FROM User WHERE username = ?',
      args: [username],
    });
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      id: row.id as number,
      username: row.username as string,
      passwordHash: row.passwordHash as string,
      role: row.role as string,
    };
  }
  return prisma.user.findUnique({ where: { username } });
}

async function countUsers(): Promise<number> {
  if (isTurso && db) {
    const result = await db.execute('SELECT COUNT(*) as count FROM User');
    return Number(result.rows[0].count);
  }
  return prisma.user.count();
}

async function createDemoUsers(adminHash: string, teacherHash: string) {
  if (isTurso && db) {
    await db.execute({
      sql: 'INSERT INTO User (username, passwordHash, role) VALUES (?, ?, ?)',
      args: ['admin', adminHash, 'admin'],
    });
    await db.execute({
      sql: 'INSERT INTO User (username, passwordHash, role) VALUES (?, ?, ?)',
      args: ['teacher', teacherHash, 'teacher'],
    });
  } else {
    await prisma.user.createMany({
      data: [
        { username: 'admin', passwordHash: adminHash, role: 'admin' },
        { username: 'teacher', passwordHash: teacherHash, role: 'teacher' },
      ],
    });
  }
}

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
    let user = await findUser(username);

    // If no users exist, create demo users
    if (!user) {
      const userCount = await countUsers();
      if (userCount === 0) {
        // Create demo users
        const adminHash = await hashPassword('admin123');
        const teacherHash = await hashPassword('teacher123');
        await createDemoUsers(adminHash, teacherHash);

        // Try to find user again
        user = await findUser(username);
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
      { detail: 'Giriş yapılırken bir hata oluştu: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
