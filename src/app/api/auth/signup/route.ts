import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { validateSignUp } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = validateSignUp(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: 'USER', // Default role
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPass } = user;

    return NextResponse.json(userWithoutPass, { status: 201 });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { error: 'Failed to sign up' },
      { status: 500 }
    );
  }
}