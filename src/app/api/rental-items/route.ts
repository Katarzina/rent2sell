/**
 * @swagger
 * /api/rental-items:
 *   get:
 *     tags:
 *       - RentalItems
 *     summary: Get all rental items
 *     responses:
 *       200:
 *         description: List of rental items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RentalItem'
 *   post:
 *     tags:
 *       - RentalItems
 *     summary: Create a new rental item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RentalItem'
 *     responses:
 *       201:
 *         description: Rental item created successfully
 *       401:
 *         description: Unauthorized
 * components:
 *   schemas:
 *     RentalItem:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - price
 *         - condition
 *         - location
 *       properties:
 *         title:
 *           type: string
 *         category:
 *           type: string
 *           enum: [BOATS, EQUIPMENT, FASHION, ELECTRONICS, SPORTS, PARTY, TRAVEL, OTHER]
 *         price:
 *           type: number
 *         image:
 *           type: array
 *           items:
 *             type: string
 *         condition:
 *           type: string
 *           enum: [NEW, LIKE_NEW, GOOD, FAIR]
 *         location:
 *           type: string
 *         features:
 *           type: array
 *           items:
 *             type: string
 *         description:
 *           type: string
 *         minRentDays:
 *           type: integer
 *         maxRentDays:
 *           type: integer
 *         deposit:
 *           type: number
 */

import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
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

    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch rental items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rental items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    let userId: string;

    // Проверяем Bearer токен
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader);

    if (authHeader?.startsWith('Bearer ')) {
      // Используем Bearer токен
      const token = authHeader.split(' ')[1];
      console.log('Using Bearer token:', token);
      try {
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
        userId = decoded.id;
        console.log('Decoded user ID from token:', userId);
      } catch (e) {
        console.error('Token verification failed:', e);
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }
    } else {
      // Пробуем сессию
      console.log('No Bearer token, checking session');
      const session = await getAuthSession();
      if (!session?.user) {
        console.log('No session found');
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      userId = session.user.id;
      console.log('Using session user ID:', userId);
    }

    const data = await request.json();
    console.log('Creating item with data:', data);

    const item = await prisma.rentalItem.create({
      data: {
        ...data,
        userId
      }
    });

    console.log('Created item:', item);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Failed to create rental item:', error);
    return NextResponse.json(
      { error: 'Failed to create rental item' },
      { status: 500 }
    );
  }
}