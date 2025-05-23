import { signIn } from '@/actions';
import db from '@/db';
import { ContributorWithReports } from '@/types';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { UserType } from '@prisma/client';

import SignInGitHubButton from '@/components/common/sign-in-github-button';
import ContributorsTable from '@/components/contributors/contributors-table';

export default async function Contributors() {
  const contributors: ContributorWithReports[] = await db.user.findMany({
    where: { userTypes: { hasSome: [UserType.ENGINEER] } },
    include: { Report: { include: { attachments: true } } },
  });
  return (
    <div className="flex flex-col gap-8 items-center justify-center p-8">
      <Card className="max-w-md p-6 my-auto mx-auto shadow-lg">
        <CardHeader className="justify-center">
          <h1 className="text-4xl font-bold">Contributor</h1>
        </CardHeader>
        <CardBody className="text-center">
          <p className="text-xl text-gray-600">/kənˈtrɪbjʊtə,ˈkɒntrɪbjuːtə/</p>
          <p className="text-lg font-bold mt-4">noun</p>
          <p className="text-lg mt-2">
            someone or something that contributes something or that contributes
            to something
          </p>
        </CardBody>
      </Card>
      <Card className="max-w-6xl p-6 my-auto mx-auto shadow-lg">
        <CardBody className="text-center">
          <p className="text-lg font-bold mt-4">Join us</p>
          <p className="text-lg mt-2">
            If you&apos;re a developer, a designer, a tester, or a tech
            enthusiast, you can contribute to this platform by submitting bugs
            you&apos;ve encountered with popular websites.
          </p>
        </CardBody>
      </Card>
      <div className="flex justify-center">
        <SignInGitHubButton />
      </div>
      <div className="w-full">
        <ContributorsTable contributors={contributors} />
      </div>
    </div>
  );
}
