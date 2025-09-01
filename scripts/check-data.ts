import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.rentalItem.findMany();
  
  console.log('Rental Items in Database:');
  items.forEach(item => {
    console.log('\n-------------------');
    console.log(`ID: ${item.id}`);
    console.log(`Title: "${item.title}"`);
    console.log(`Category: ${item.category}`);
    console.log('Images:');
    item.image.forEach((img, i) => console.log(`  ${i + 1}. ${img}`));
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });