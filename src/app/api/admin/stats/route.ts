import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const [
      totalUsers,
      totalItems,
      totalInquiries,
      recentUsers,
      recentItems,
      usersByRole,
      itemsByAvailability
    ] = await Promise.all([
      prisma.user.count(),
      prisma.rentalItem.count(),
      prisma.inquiry.count(),
      prisma.user.count({ where: { createdAt: { gte: lastMonth } } }),
      prisma.rentalItem.count({ where: { createdAt: { gte: lastMonth } } }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true },
      }),
      prisma.rentalItem.groupBy({
        by: ['available'],
        _count: { id: true },
      }),
    ]);

    const usersLastMonth = totalUsers - recentUsers;
    const itemsLastMonth = totalItems - recentItems;
    
    const recentUserGrowth = usersLastMonth > 0 
      ? Math.round((recentUsers / usersLastMonth) * 100) 
      : 0;
    
    const recentItemGrowth = itemsLastMonth > 0 
      ? Math.round((recentItems / itemsLastMonth) * 100) 
      : 0;

    const userRoleMap = usersByRole.reduce((acc, item) => {
      acc[item.role] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    const itemsAvailabilityMap = itemsByAvailability.reduce((acc, item) => {
      if (item.available) {
        acc.available = item._count.id;
      } else {
        acc.unavailable = item._count.id;
      }
      return acc;
    }, { available: 0, unavailable: 0 });

    const stats = {
      totalUsers,
      totalItems,
      totalInquiries,
      recentUserGrowth,
      recentItemGrowth,
      usersByRole: {
        USER: userRoleMap.USER || 0,
        ADMIN: userRoleMap.ADMIN || 0,
      },
      itemsByAvailability: itemsAvailabilityMap,
    };

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}