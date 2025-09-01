import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'kateryna.parfenova@gmail.com';
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.log(`User with email ${email} not found`);
    return;
  }

  // Update to ADMIN role
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' }
  });

  console.log(`Updated user ${updatedUser.email} to ADMIN role`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });