// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { tags } from '../cypress/data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');
  await prisma.tag.deleteMany({});

  for (const tag of tags) {
    await prisma.tag.create({
      data: tag,
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });