import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signJwtAccessToken } from '@/lib/jwt';
import { validateSignIn } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = validateSignIn(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create token
    const { password: _, ...userWithoutPass } = user;
    const accessToken = signJwtAccessToken(userWithoutPass);

    const result = {
      ...userWithoutPass,
      accessToken,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
}