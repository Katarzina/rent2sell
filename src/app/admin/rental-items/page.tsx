import { prisma } from '@/lib/prisma';
import RentalItemsClient from './rental-items-client';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminRentalItemsPage() {
  const session = await getAuthSession();
  
  // Redirect to login if not authenticated or not admin
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  // Fetch all rental items
  const items = await prisma.rentalItem.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
  
  return <RentalItemsClient initialItems={items} />;
}