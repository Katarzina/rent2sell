import { prisma } from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';

async function getRentalItems() {
  const items = await prisma.rentalItem.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
  return items;
}

export default async function Home() {
  const items = await getRentalItems();
  
  return <HomeClient initialItems={items} />;
}