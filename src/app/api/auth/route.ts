import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const email = String(payload?.email ?? '').trim().toLowerCase();
    const password = String(payload?.password ?? '');

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let user = await prisma.user.findFirst({
      where: { email },
      include: { school: true }
    });

    if (!user) {
      const demoEmail = (process.env.DEMO_ADMIN_EMAIL ?? 'admin@eskooly.com').toLowerCase();
      const demoPassword = process.env.DEMO_ADMIN_PASSWORD ?? 'admin123';
      const canBootstrapDemoAdmin = email === demoEmail && password === demoPassword;

      if (!canBootstrapDemoAdmin) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      let school = await prisma.school.findFirst();

      if (!school) {
        school = await prisma.school.create({
          data: {
            name: 'eSkooly International School',
            alias: 'eskooly-dhaka',
          },
        });
      }

      const hashedPassword = await bcrypt.hash(demoPassword, 10);
      user = await prisma.user.upsert({
        where: { email: demoEmail },
        update: {
          password: hashedPassword,
          name: 'System Administrator',
          role: 'admin',
          schoolId: school.id,
        },
        create: {
          email: demoEmail,
          password: hashedPassword,
          name: 'System Administrator',
          role: 'admin',
          schoolId: school.id,
        },
        include: { school: true },
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create simple token (in production, use JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        schoolName: user.school?.name,
      },
    });

    // Set auth cookie for middleware to recognize
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
