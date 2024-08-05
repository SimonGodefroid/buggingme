import React from 'react';

import { User as NextUIUser } from '@nextui-org/react';
import { User } from '@prisma/client';

export default function UserCard({ user }: { user: User }) {
  return (
    <NextUIUser
      name={user.name}
      description={user.email}
      avatarProps={{
        src: user.image || '',
      }}
    />
  );
}
