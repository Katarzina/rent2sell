import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Get current date and last month date
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Fetch basic counts
    const [
      totalUsers,
      totalProperties,
      totalAgents,
      totalInquiries,
      recentUsers,
      recentProperties,
      usersByRole,
      propertiesByStatus
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.agentProfile.count(),
      prisma.inquiry.count(),
      prisma.user.count({ where: { createdAt: { gte: lastMonth } } }),
      prisma.property.count({ where: { createdAt: { gte: lastMonth } } }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true },
      }),
      prisma.property.groupBy({
        by: ['featured'],
        _count: { id: true },
      }),
    ]);

    // Calculate growth percentages
    const usersLastMonth = totalUsers - recentUsers;
    const propertiesLastMonth = totalProperties - recentProperties;
    
    const recentUserGrowth = usersLastMonth > 0 
      ? Math.round((recentUsers / usersLastMonth) * 100) 
      : 0;
    
    const recentPropertyGrowth = propertiesLastMonth > 0 
      ? Math.round((recentProperties / propertiesLastMonth) * 100) 
      : 0;

    // Format user roles data
    const userRoleMap = usersByRole.reduce((acc, item) => {
      acc[item.role] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Format properties status data
    const propertiesStatusMap = propertiesByStatus.reduce((acc, item) => {
      if (item.featured) {
        acc.featured = item._count.id;
      } else {
        acc.regular = item._count.id;
      }
      return acc;
    }, { featured: 0, regular: 0 });

    const stats = {
      totalUsers,
      totalProperties,
      totalAgents,
      totalInquiries,
      recentUserGrowth,
      recentPropertyGrowth,
      usersByRole: {
        USER: userRoleMap.USER || 0,
        AGENT: userRoleMap.AGENT || 0,
        ADMIN: userRoleMap.ADMIN || 0,
      },
      propertiesByStatus: propertiesStatusMap,
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