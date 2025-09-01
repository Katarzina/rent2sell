import { PrismaClient, ProductCategory, ItemCondition } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.rentalItem.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@rent2sell.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  // Create rental items
  const items = [
    {
      title: "Premium Fishing Rod Set",
      category: ProductCategory.SPORTS,
      price: 575.00,
      image: [
        "https://images.unsplash.com/photo-1540808343400-6051b9158255?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800", 
        "https://images.unsplash.com/photo-1595257841889-eca2678454e2?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800"
      ],
      condition: ItemCondition.LIKE_NEW,
      rating: 4.8,
      location: "Prague 1, Czech Republic",
      features: ["Professional Rod", "Tackle Box", "Live Bait Container", "Fishing Net"],
      description: "Complete fishing set for both beginners and experienced anglers. Perfect for deep sea fishing.",
      minRentDays: 1,
      maxRentDays: 7,
      deposit: 100,
      userId: adminUser.id
    },
    {
      title: "Kayak Set for Two",
      category: ProductCategory.BOATS,
      price: 1035.00,
      image: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1526889588514-2e695856df85?auto=format&fit=crop&q=80&w=800"
      ],
      condition: ItemCondition.GOOD,
      rating: 4.7,
      location: "Prague 3, Czech Republic",
      features: ["2 Kayaks", "Paddles", "Life Vests", "Waterproof Bags"],
      description: "Tandem kayak set perfect for exploring waterways and coastal areas.",
      minRentDays: 1,
      maxRentDays: 7,
      deposit: 150,
      userId: adminUser.id
    }
  ];

  // Add items to database
  for (const item of items) {
    await prisma.rentalItem.create({
      data: item
    });
  }

  console.log('Created admin user:');
  console.log('- Admin: admin@rent2sell.com / password123');
  console.log(`Created ${items.length} rental items`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });