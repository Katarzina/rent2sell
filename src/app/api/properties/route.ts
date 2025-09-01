 import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * @swagger
 * /api/properties:
 *   get:
 *     tags:
 *       - Properties
 *     summary: Get all properties
 *     description: Retrieve a list of all properties with optional filtering
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured properties
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *     responses:
 *       200:
 *         description: List of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get('featured')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')

    const where: any = {}

    if (featured !== null) {
      where.featured = featured === 'true'
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      }
    }

    // Note: Price is stored as string, so we need to handle filtering differently
    // In a real app, you'd want to store price as a number

    const properties = await prisma.property.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch properties',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/properties:
 *   post:
 *     tags:
 *       - Properties
 *     summary: Create a new property
 *     description: Add a new property listing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyInput'
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check authorization - only AGENT and ADMIN can create properties
    if (!['AGENT', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const property = await prisma.property.create({
      data: {
        title: body.title,
        location: body.location,
        price: body.price,
        area: body.area,
        image: body.image,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        rating: body.rating || 0,
        featured: body.featured || false,
        amenities: body.amenities || [],
        description: body.description,
        userId: session.user.id // Associate property with user
      }
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}