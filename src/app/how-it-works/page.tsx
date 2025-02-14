// import { signIn } from '@/actions';

import db from '@/db';
import { ReportWithTags } from '@/types';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';

import SignInGitHubButton from '@/components/common/sign-in-github-button';
import ReportsTable from '@/components/reports/reports-table';

export default async function HowItWorks() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center p-8">
      <Card className="max-w-6xl p-6 my-auto mx-auto shadow-lg gap-4">
        <CardHeader className="justify-center">
          <h1 className="text-4xl font-bold">Reporting bugs</h1>
        </CardHeader>
        <CardBody className="text-center">
          <p className="text-lg font-bold mt-4">Step 1</p>
          <p>
            You login and report a bug. It gets created without being linked to a company yet.
          </p>
          <p className="text-lg font-bold mt-4">Step 2</p>
          <p>Someone from our team reviews the bug report submission content.</p>
          <p className="text-lg font-bold mt-4">Step 3</p>
          <p>
            We create a company profile if needed and attach the bug to that
            company.
          </p>
        </CardBody>
      </Card>
      <div className="flex justify-center">
        <SignInGitHubButton />
      </div>
      <div className="w-full"></div>
    </div>
  );
}
