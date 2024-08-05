// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tags = [
    { name: 'Visual Problem' },
    { name: 'Accessibility (a11y) Issue' },
    { name: 'Data Issue' },
    { name: 'Performance Issue' },
    { name: 'Security Vulnerability' },
    { name: 'Functional Bug' },
    { name: 'Usability Issue' },
    { name: 'Compatibility Issue' },
    { name: 'Content Issue' },
    { name: 'Code Issue' },
    { name: 'Integration Issue' },
    { name: 'Responsive Design Issue' },
  ];


  for (const tag of tags) {
    await prisma.tag.create({
      data: tag,
    });
  }
  // for (const company of companies) {
  //   await prisma.company.create({
  //     data: company,
  //   });
  // }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });