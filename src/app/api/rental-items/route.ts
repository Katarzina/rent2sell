import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/rental-items - Получить все предметы
export async function GET() {
  console.log('GET /api/rental-items called');
  try {
    // Test database connection
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (connError) {
      console.error('Database connection error:', connError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    console.log('Fetching rental items from database...');
    
    // Count total items first
    const count = await prisma.rentalItem.count();
    console.log('Total items in database:', count);

    const items = await prisma.rentalItem.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    console.log('Successfully fetched items from database:', items);

    if (!items || items.length === 0) {
      console.log('No items found in database');
      return NextResponse.json(
        { message: 'No items found', items: [] },
        { status: 200 }
      );
    }

    const response = NextResponse.json(items);
    console.log('Sending response:', { 
      status: response.status, 
      itemCount: items.length 
    });
    return response;
  } catch (error) {
    console.error('Database error while fetching rental items:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch rental items' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/rental-items - Создать новый предмет
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    },
  });
}

export async function POST(request: Request) {
  console.log('POST /api/rental-items called');
  try {
    const session = await getAuthSession();
    console.log('Session:', session);

    if (!session?.user) {
      console.log('Unauthorized - session:', session?.user);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log('Creating item with data:', data);

    const item = await prisma.rentalItem.create({
      data: {
        title: data.title,
        category: data.category,
        price: data.price,
        image: data.image,
        condition: data.condition,
        rating: data.rating,
        location: data.location,
        minRentDays: data.minRentDays,
        deposit: data.deposit,
        features: data.features,
        description: data.description,
        userId: session.user.id
      }
    });

    console.log('Successfully created item:', item);
    return new NextResponse(JSON.stringify(item), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to create rental item:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create rental item' },
      { status: 500 }
    );
  }
}