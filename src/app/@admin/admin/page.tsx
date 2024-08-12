import { fetchAllCompanies, fetchAllUsers } from '@/actions';
import { Prisma } from '@prisma/client';

import { LinkUserForm } from '@/components/users/link-user-form';
import { UserWithCompanies } from '@/types/users';



export default async function Admin() {
  const users = (await fetchAllUsers()) as UserWithCompanies[];
  const companies = await fetchAllCompanies();

  return (
    <div className="flex flex-col">
      <LinkUserForm users={users} companies={companies} />
    </div>
  );
}
