import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     tags:
 *       - Properties
 *     summary: Get property by ID
 *     description: Retrieve a single property by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      )
    }

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        inquiries: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        tours: {
          where: {
            tourDate: {
              gte: new Date()
            }
          },
          orderBy: {
            tourDate: 'asc'
          }
        },
        _count: {
          select: {
            favorites: true,
            inquiries: true,
            tours: true
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     tags:
 *       - Properties
 *     summary: Update property
 *     description: Update an existing property
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyInput'
 *     responses:
 *       200:
 *         description: Property updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    const body = await request.json()

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      )
    }

    // Check if property exists and user has permission
    const existingProperty = await prisma.property.findUnique({
      where: { id }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Check authorization - property owner or ADMIN can update
    if (existingProperty.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        title: body.title,
        location: body.location,
        price: body.price,
        area: body.area,
        image: body.image,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        rating: body.rating,
        featured: body.featured,
        amenities: body.amenities,
        description: body.description
      }
    })

    return NextResponse.json(property)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     tags:
 *       - Properties
 *     summary: Delete property
 *     description: Delete a property by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Property ID
 *     responses:
 *       204:
 *         description: Property deleted successfully
 *       404:
 *         description: Property not found
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      )
    }

    // Check if property exists and user has permission
    const existingProperty = await prisma.property.findUnique({
      where: { id }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Check authorization - property owner or ADMIN can delete
    if (existingProperty.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    await prisma.property.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}