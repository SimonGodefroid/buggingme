import React from 'react';

import { User as NextUIUser } from '@nextui-org/react';
import { User } from '@prisma/client';

export default function UserCard({
  user,
  withEmail = false,
}: {
  user: User;
  withEmail?: boolean;
}) {
  return (
    <NextUIUser
      name={user.name}
      description={withEmail ? user.email : undefined}
      avatarProps={{
        src: user.image || '',
      }}
    />
  );
}
