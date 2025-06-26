// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { tags } from '../cypress/data';

const prisma = new PrismaClient();

async function main() {
  if (!(process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL)) {
    throw new Error('Missing POSTGRES_URL')
  }
  console.log('process.env.POSTGRES_URL_NON_POOLING', process.env.POSTGRES_URL_NON_POOLING);
  console.log('process.env.POSTGRES_PRISMA_URL', process.env.POSTGRES_PRISMA_URL);
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