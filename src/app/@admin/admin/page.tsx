import { getAllCompanies, getAllUsers } from '@/db/queries';

import { UserWithCompanies } from '@/types/users';
import { LinkUserForm } from '@/components/users/link-user-form';

export default async function Admin() {
  const users = (await getAllUsers()) as UserWithCompanies[];
  const companies = await getAllCompanies();

  return (
    <div className="flex flex-col">
      <LinkUserForm users={users} companies={companies} />
    </div>
  );
}
