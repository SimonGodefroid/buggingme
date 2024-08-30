import { fetchUser } from '@/actions';
import { fetchAllTags } from '@/actions/reports/tags/fetchAllTags';

import PageHeader from '@/components/common/page-header';
import { CreateReportForm } from '@/components/reports/forms/create-report-form';

export default async function CreateReport() {
  const user = await fetchUser();
  const tags = await fetchAllTags();

  return (
    <div className="flex flex-col">
      <PageHeader
        crumbs={[
          { href: '/reports', text: 'Reports' },
          { href: `/reports/create`, text: 'Create report' },
        ]}
        buttonProps={{
          secondary: { text: 'Back' },
        }}
      />
      <CreateReportForm user={user} tags={tags} />
    </div>
  );
}
