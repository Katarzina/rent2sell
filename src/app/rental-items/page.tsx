import { prisma } from '@/lib/prisma';
import RentalItemsClient from './rental-items-client';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function RentalItemsPage() {
  const session = await getAuthSession();
  
  // Redirect to login if not authenticated
  if (!session) {
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