import { getAllCompanies, getAllUsers } from '@/db/queries';
import { UserWithCompanies } from '@/types';

import PageHeader from '@/components/common/page-header';
import { LinkUserForm } from '@/components/users/link-user-form';

export default async function Admin() {
  const users = (await getAllUsers()) as UserWithCompanies[];
  const companies = await getAllCompanies();
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        crumbs={[
          { href: '/', text: 'Admin' },
          { href: '/admin/users/link', text: 'Link user to company' },
        ]}
        buttonProps={{ secondary: { href: '/', text: 'Back' } }}
      />
      <div className="flex flex-col gap-4 p-4">
        <h1>Link user to company</h1>
        <LinkUserForm users={users} companies={companies} />
      </div>
    </div>
  );
}
