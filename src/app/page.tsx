import db from '@/db';
import { ReportWithTags } from '@/types';
import { Card, CardBody, CardHeader } from '@nextui-org/react';

import SignInGitHubButton from '@/components/common/sign-in-github-button';
import ReportSummary from '@/components/reports/report-summary';

export default async function Home() {
  const reports = (await db.report.findMany({
    include: { tags: true, attachments: true, company: true, user: true },
    where: { companyId: { notIn: [`${process.env.BUG_BUSTERS_COMPANY_ID}`] } },
    orderBy: { createdAt: 'desc' },
  })) as ReportWithTags[];
  return (
    <div className="flex flex-col gap-8 justify-center p-4">
      {/* <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <Card className="max-w-lg p-6 my-auto mx-auto shadow-lg">
            <CardHeader className="justify-center md:justify-start">
              <h1 className="text-4xl font-bold">Engineer</h1>
            </CardHeader>
            <CardBody className="text-center md:text-left">
              <p className="text-lg mt-2">
                1. Sign in with GitHub <br />
                2. Report a minimum of 5 Approved public bugs <br />
                3. Report private bugs (only visible to the companies) <br />
                4. Earn rewards or get an interview <br />
                5. Take part in campaigns <br />
              </p>
            </CardBody>
          </Card>
        </div>
        <div className="col-span-12 md:col-span-6">
          <Card className="max-w-lg p-6 my-auto mx-auto shadow-lg">
            <CardHeader className="justify-center md:justify-start">
              <h1 className="text-4xl font-bold">Company</h1>
            </CardHeader>
            <CardBody className="text-center md:text-left">
              <p className="text-lg mt-2">
                1. Sign in with Auth0 <br />
                2. Claim your account <br />
                3. Triage your private bugs (only visible to you) <br />
                4. Get in touch with contributors <br />
                5. Launch campaigns <br />
              </p>
            </CardBody>
          </Card>
        </div>
      </div> */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <Card className="max-w-6xl p-6 my-auto mx-auto shadow-lg">
            <CardHeader className="justify-center text-center">
              <h1 className="text-4xl font-bold">Stand out now and get hired</h1>
            </CardHeader>
            {/* <CardHeader className="text-center">
              <h1 className="text-4xl font-bold">Meet halfway</h1>
            </CardHeader> */}
            <CardBody className="justify-center text-center">
              <p className="text-lg">
                Report bugs (it can be visual, an improper 500 error, an a11y issue, a security
                concern...)<br />
                Talk about tech.<br/>
                Get noticed. <br />
                Get hired.
                <br />
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex items-center flex-col gap-4 md:flex-row md:justify-center">
          <SignInGitHubButton label="Start Now | Join Us" />
          {/* <Divider /> */}
          {/* <SignInAuth0Button label="Start now | Company" /> */}
          {/* <SignInGitHubButton label="Start now | Engineer" />
          <Divider />
          <SignInAuth0Button label="Start now | Company" /> */}
        </div>
      </div>
      <div className="flex flex-col w-full gap-4">
        <h2>Browse latest reports:</h2>
        {reports.map((r) => (
          <ReportSummary key={r.id} report={r} />
        ))}
      </div>
    </div>
  );
}
