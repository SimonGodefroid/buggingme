import db from '@/db';
import { UserType } from '@prisma/client';

import LeaderboardTable from '@/components/leaderboard/leaderboard-table';

export default async function Leaderboard() {
  const users = await db.user.findMany({
    where: { userTypes: { hasSome: [UserType.ENGINEER] } },
    take: 5,
    include: {
      companies: true,
      Report: {
        include: {
          tags: true,
          user: true,
          StatusHistory: true,
          company: true,
          attachments: true,
          comments: true,
          campaign: true,
        },
      },
    },
  });
  const tags = await db.tag.findMany({});
  return (
    <div className="flex flex-col gap-4 p-4">
      <LeaderboardTable users={users} tags={tags} />
    </div>
  );
}
