// import { signIn } from '@/actions';

import db from '@/db';
import { ReportWithTags } from '@/types';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';

import SignInGitHubButton from '@/components/common/sign-in-github-button';
import ReportsTable from '@/components/reports/reports-table';

export default async function Reports() {
  const reports: ReportWithTags[] = await db.report.findMany({
    where: { companyId: { notIn: [`${process.env.BUG_BUSTERS_COMPANY_ID}`] } },
    include: {
      company: true,
      tags: true,
      user: true,
      StatusHistory: true,
      attachments: true,
      comments: true,
      campaign: true,
    },
  });
  return (
    <div className="flex flex-col gap-8 items-center justify-center p-8">
      <Card className="max-w-xs items-center justify-center p-6 my-auto mx-auto shadow-lg">
        {/* <CardHeader className="text-center"> */}
        <CardHeader className="justify-center">
          <h1 className="text-4xl font-bold">Report</h1>
        </CardHeader>
        <CardBody className="text-center">
          <p className="text-xl text-gray-600">/rɪˈpɔːt/</p>
          <p className="text-lg font-bold mt-4">verb</p>
          <p className="text-lg mt-2">to make a written record or summary of</p>
        </CardBody>
      </Card>
      <Card className="max-w-6xl p-6 my-auto mx-auto shadow-lg gap-4">
        <CardBody className="text-center">
          <p className="text-lg font-bold mt-4">Start reporting bugs now</p>
          <p className="text-lg mt-2">
            Reporting bugs will help companies to improve their services and
            products. You will get noticed easier by the companies and they will
            be able to either reward you a bounty or offer you a job interview.
          </p>
        </CardBody>
      </Card>
      <div className="flex justify-center">
        <SignInGitHubButton />
      </div>
      <div className="w-full">
        <ReportsTable reports={reports} />
      </div>
    </div>
  );
}
