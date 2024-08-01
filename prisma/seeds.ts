// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // const tags = [
  //   { name: 'Visual Problem' },
  //   { name: 'Accessibility (a11y) Issue' },
  //   { name: 'Data Issue' },
  //   { name: 'Performance Issue' },
  //   { name: 'Security Vulnerability' },
  //   { name: 'Functional Bug' },
  //   { name: 'Usability Issue' },
  //   { name: 'Compatibility Issue' },
  //   { name: 'Content Issue' },
  //   { name: 'Code Issue' },
  //   { name: 'Integration Issue' },
  //   { name: 'Responsive Design Issue' },
  // ];

  // const companies = [
  //   {
  //     name: 'BugGuide',
  //     domain: 'bugguide.net',
  //     logo: 'https://logo.clearbit.com/bugguide.net',
  //   },
  //   {
  //     name: 'BugHerd',
  //     domain: 'bugherd.com',
  //     logo: 'https://logo.clearbit.com/bugherd.com',
  //   },
  //   {
  //     name: '벅스!',
  //     domain: 'bugs.co.kr',
  //     logo: 'https://logo.clearbit.com/bugs.co.kr',
  //   },
  //   {
  //     name: 'BugMeNot',
  //     domain: 'bugmenot.com',
  //     logo: 'https://logo.clearbit.com/bugmenot.com',
  //   },
  //   {
  //     name: 'BugSnag',
  //     domain: 'bugsnag.com',
  //     logo: 'https://logo.clearbit.com/bugsnag.com',
  //   },];

  // for (const tag of tags) {
  //   await prisma.tag.create({
  //     data: tag,
  //   });
  // }
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