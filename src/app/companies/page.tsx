import { Card, CardBody, CardHeader } from '@nextui-org/react';

import SignInAuth0Button from '@/components/common/sign-in-auth0-button';
import SignInGitHubButton from '@/components/common/sign-in-github-button';

export default function Companies() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center p-8">
      <Card className="max-w-xl p-6 my-auto mx-auto shadow-lg">
        <CardHeader className="justify-center">
          <h1 className="text-4xl font-bold">Company</h1>
        </CardHeader>
        <CardBody className="text-center">
          <p className="text-xl text-gray-600">/ˈkʌmp(ə)ni/</p>
          <p className="text-lg font-bold mt-4">noun</p>
          <p className="text-lg mt-2">
            an association of persons for carrying on a commercial or industrial
            enterprise
          </p>
        </CardBody>
      </Card>
      <Card className="max-w-6xl p-6 my-auto mx-auto shadow-lg gap-4">
        <CardBody className="text-center">
          <p className="text-lg font-bold mt-4">Join us</p>
          <p className="text-lg mt-2">
            If you are a representative of a company, you can use this platform
            to identify bugs that were reported by our contributors. You will
            also be able to schedule bug bounty campaigns and offer rewards to
            contributors who submit bugs.
          </p>
        </CardBody>
      </Card>
      <div className="flex justify-center">
        <SignInAuth0Button />
      </div>
    </div>
  );
}
