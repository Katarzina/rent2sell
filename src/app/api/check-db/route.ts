import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test connection
    await prisma.$connect();
    
    // Try to count items
    const itemCount = await prisma.rentalItem.count();
    
    // Try to get one item
    const firstItem = await prisma.rentalItem.findFirst();

    return NextResponse.json({
      status: 'success',
      connection: 'OK',
      itemCount,
      firstItem
    });
  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}