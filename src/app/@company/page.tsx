import { fetchUser } from '@/actions';
import { fetchCompanyDashboardData } from '@/actions/dashboard/fetchCompanyDashboardData';

import PageHeader from '@/components/common/page-header';
import Dashboard from '@/components/dashboard/company-dashboard';

export default async function Home() {
  const user = await fetchUser();
  if (!user) {
    return <div>Not authorized</div>;
  }
  const { comments, reports, campaigns, invitations } =
    await fetchCompanyDashboardData(user?.id);
  return (
    <div className="flex flex-col gap-4">
      <PageHeader crumbs={[]} />
      <Dashboard
        comments={comments}
        reports={reports}
        campaigns={campaigns}
        invitations={invitations}
      />
    </div>
  );
}
