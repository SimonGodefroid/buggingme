// prisma/seed.ts
import { PrismaClient, UserType } from '@prisma/client';
import { sessions, tags, users } from '../cypress/data';

const prisma = new PrismaClient();
// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: process.env.POSTGRES_URL_NON_POOLING,
//     },
//   },
// });
export async function seed() {
  console.log('Seeding test db...');
  await prisma.attachment.deleteMany({});
  await prisma.invitation.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tag.deleteMany({});

  for (const tag of tags) {
    await prisma.tag.create({
      data: tag,
    });
  }
  // await prisma.user.create({
  //   data: {
  //     id: "4a2047d5-bacb-47a8-b351-77a7fab897ee",
  //     name: "SimonG",
  //     email: "simon.g@mail.com",
  //     emailVerified: null,
  //     image: "https://avatars.githubusercontent.com/u/1231223?v=4",
  //     createdAt: new Date("2024-08-29 19:42:19.286"),
  //     updatedAt: new Date("2024-09-05 08:27:35.784"),
  //     userTypes: [UserType.ENGINEER],
  //     validPublicReportsCount: 0,
  //     reputation: 0,
  //   },
  // });
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
  for (const session of sessions) {
    await prisma.session.create({
      data: session,
    });
  }

}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });