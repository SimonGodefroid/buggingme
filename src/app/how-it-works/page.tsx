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
          <p>Sign up and report a bug.</p>
          <p className="text-lg font-bold mt-4">Step 2</p>
          <p>Our team will review the bug report submission content.</p>
          <p className="text-lg font-bold mt-4">Step 3</p>
          <p>
            We will create a company profile when needed and make bug report
            visible for the company.
          </p>
        </CardBody>
      </Card>
      <Card className="max-w-6xl p-6 my-auto mx-auto shadow-lg gap-4">
        <CardHeader className="justify-center">
          <h1 className="text-4xl font-bold">Mingle and break the ice</h1>
        </CardHeader>
        <CardBody className="text-center">
          <p>
            Chat with fellow engineers about tech, jobs or any engineering topic
          </p>
          <p>Get noticed by companies for your contribution to the community</p>
          <p>Stand out from other applicants by being active</p>
        </CardBody>
      </Card>
      <div className="flex justify-center">
        <SignInGitHubButton />
      </div>
      <div className="w-full"></div>
    </div>
  );
}
