const { PrismaClient, ProductCategory, ItemCondition } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.rentalItem.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@rent2sail.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  // Create rental items
  const items = [
    {
      title: "Premium Fishing Rod Set",
      category: ProductCategory.SPORTS,
      price: 575.00, // 25 USD
      image: ["https://images.unsplash.com/photo-1540808343400-6051b9158255?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800", 
              "https://images.unsplash.com/photo-1595257841889-eca2678454e2?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800"],
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
      title: "Yacht 'Sea Breeze' 40ft",
      category: ProductCategory.BOATS,
      price: 11500.00, // 500 USD
      image: ["https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&q=80&w=800"],
      condition: ItemCondition.GOOD,
      rating: 4.9,
      location: "Prague 2, Czech Republic",
      features: ["Sleeps 6", "Full Kitchen", "GPS Navigation", "Safety Equipment"],
      description: "Luxurious 40ft yacht perfect for day trips or weekend getaways. Captain available for hire.",
      minRentDays: 1,
      maxRentDays: 14,
      deposit: 2000,
      userId: adminUser.id
    },
    {
      title: "Kayak Set for Two",
      category: ProductCategory.BOATS,
      price: 1035.00, // 45 USD
      image: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1526889588514-2e695856df85?auto=format&fit=crop&q=80&w=800"],
      condition: ItemCondition.GOOD,
      rating: 4.7,
      location: "Prague 3, Czech Republic",
      features: ["2 Kayaks", "Paddles", "Life Vests", "Waterproof Bags"],
      description: "Tandem kayak set perfect for exploring waterways and coastal areas.",
      minRentDays: 1,
      maxRentDays: 7,
      deposit: 150,
      userId: adminUser.id
    },
    {
      title: "Diving Equipment Set",
      category: ProductCategory.SPORTS,
      price: 1495.00, // 65 USD
      image: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1582332205846-bf7aec371062?auto=format&fit=crop&q=80&w=800"],
      condition: ItemCondition.NEW,
      rating: 4.9,
      location: "Prague 4, Czech Republic",
      features: ["BCD", "Regulator", "Wetsuit", "Fins", "Mask"],
      description: "Complete scuba diving set for certified divers. All equipment recently serviced.",
      minRentDays: 1,
      maxRentDays: 14,
      deposit: 300,
      userId: adminUser.id
    },
    {
      title: "Jet Ski Yamaha",
      category: ProductCategory.BOATS,
      price: 4600.00, // 200 USD
      image: ["https://images.unsplash.com/photo-1578530332818-6ba472e67b9f?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1586523277964-dacf3353e62b?auto=format&fit=crop&q=80&w=800"],
      condition: ItemCondition.LIKE_NEW,
      rating: 4.8,
      location: "Prague 5, Czech Republic",
      features: ["2021 Model", "Life Jackets", "Safety Kit", "Trailer Available"],
      description: "High-performance jet ski perfect for thrill-seekers. Training available for beginners.",
      minRentDays: 1,
      maxRentDays: 7,
      deposit: 500,
      userId: adminUser.id
    },
    {
      title: "Surfboard for Beginners",
      category: ProductCategory.SPORTS,
      price: 805.00, // 35 USD
      image: ["https://images.unsplash.com/photo-1531722569936-825d3dd91b15?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=800"],
      condition: ItemCondition.GOOD,
      rating: 4.6,
      location: "Prague 6, Czech Republic",
      features: ["8ft Board", "Soft Top", "Leash", "Wax"],
      description: "Beginner-friendly surfboard with soft top for safety. Includes basic surfing instruction.",
      minRentDays: 1,
      maxRentDays: 7,
      deposit: 100,
      userId: adminUser.id
    },
    {
      title: "Paddleboard Set",
      category: ProductCategory.SPORTS,
      price: 920.00, // 40 USD
      image: ["https://images.unsplash.com/photo-1526889588514-2e695856df85?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1526832507-e5b4d4015c9c?auto=format&fit=crop&q=80&w=800"],
      condition: ItemCondition.LIKE_NEW,
      rating: 4.7,
      location: "Prague 7, Czech Republic",
      features: ["11ft Board", "Paddle", "Life Vest", "Carry Bag"],
      description: "Stable paddleboard perfect for exploring calm waters. Great for yoga and fitness.",
      minRentDays: 1,
      maxRentDays: 14,
      deposit: 150,
      userId: adminUser.id
    },
    {
      title: "Fishing Boat 21ft",
      category: ProductCategory.BOATS,
      price: 5750.00, // 250 USD
      image: ["https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1563784462386-044fd95e9852?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800"],
      condition: ItemCondition.GOOD,
      rating: 4.8,
      location: "Prague 8, Czech Republic",
      features: ["GPS", "Fish Finder", "Live Well", "Tackle Storage"],
      description: "Well-maintained fishing boat ideal for inshore and nearshore fishing.",
      minRentDays: 1,
      maxRentDays: 7,
      deposit: 800,
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
  console.log('- Admin: admin@rent2sail.com / password123');
  console.log(`Created ${items.length} rental items`);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });