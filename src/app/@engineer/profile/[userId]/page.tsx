import { auth } from '@/auth';
import db from '@/db';

import Debug from '@/components/common/debug';
import UserStats from '@/components/users/user-stats';

export default async function Profile() {
  const authenticatedUser = await auth();
  const id = authenticatedUser?.user?.id;
  const user = await db.user.findUnique({
    where: { id },
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
      <UserStats user={user} tags={tags} />
    </div>
  );
}
