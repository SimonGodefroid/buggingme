import { getAllCompanies, getAllUsers } from '@/db/queries';
import { UserWithCompanies } from '@/types';

import PageHeader from '@/components/common/page-header';
import { CreateCompanyForm } from '@/components/companies/create-company-form';
import { LinkUserForm } from '@/components/users/link-user-form';

export default async function CreateCompany() {
  const users = (await getAllUsers()) as UserWithCompanies[];
  const companies = await getAllCompanies();
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        crumbs={[
          { href: '/', text: 'Admin' },
          { href: '/admin/companies/create', text: 'Create company' },
        ]}
        buttonProps={{ secondary: { href: '/', text: 'Back' } }}
      />
      <div className="flex flex-col gap-4 p-4">
        <h1>Create a company</h1>
        <CreateCompanyForm />
      </div>
    </div>
  );
}
