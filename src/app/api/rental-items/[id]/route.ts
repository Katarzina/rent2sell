import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/rental-items/[id] - Получить конкретный предмет
export async function GET(request: Request, { params }: RouteParams) {
  console.log(`GET /api/rental-items/${params.id} called`);
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      console.log('Invalid ID format:', params.id);
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    console.log('Fetching rental item from database, id:', id);
    const item = await prisma.rentalItem.findUnique({
      where: { id }
    });

    if (!item) {
      console.log('Item not found in database, id:', id);
      return NextResponse.json(
        { error: 'Rental item not found' },
        { status: 404 }
      );
    }

    console.log('Successfully fetched item:', item);
    return NextResponse.json(item);
  } catch (error) {
    console.error('Database error while fetching rental item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rental item' },
      { status: 500 }
    );
  }
}

// PATCH /api/rental-items/[id] - Обновить предмет
export async function PATCH(request: Request, { params }: RouteParams) {
  console.log(`PATCH /api/rental-items/${params.id} called`);
  try {
    const session = await getAuthSession();
    console.log('Session in PATCH:', session);
    console.log('Session:', session);
    
    if (!session || session.user?.role !== 'ADMIN') {
      console.log('Unauthorized: Invalid session or not admin role');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      console.log('Invalid ID format:', params.id);
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const data = await request.json();
    console.log('Update data:', data);

    const item = await prisma.rentalItem.update({
      where: { id },
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
        description: data.description
      }
    });

    console.log('Successfully updated item:', item);
    return NextResponse.json(item);
  } catch (error) {
    console.error('Failed to update rental item:', error);
    return NextResponse.json(
      { error: 'Failed to update rental item' },
      { status: 500 }
    );
  }
}

// DELETE /api/rental-items/[id] - Удалить предмет
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getAuthSession();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.rentalItem.delete({
      where: {
        id: parseInt(params.id)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete rental item:', error);
    return NextResponse.json(
      { error: 'Failed to delete rental item' },
      { status: 500 }
    );
  }
}