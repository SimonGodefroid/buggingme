import { Card, CardBody, CardHeader } from '@nextui-org/react';

import SignInAuth0Button from '@/components/common/sign-in-auth0-button';

export default function Campaigns() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center p-8">
      <Card className="max-w-md p-6 my-auto mx-auto shadow-lg">
        <CardHeader className="text-center">
          <h1 className="text-4xl font-bold">Campaign</h1>
        </CardHeader>
        <CardBody>
          <p className="text-xl text-gray-600">/kamˈpeɪn/</p>
          <p className="text-lg font-bold mt-4">noun</p>
          <p className="text-lg mt-2">
            a connected series of operations designed to bring about a
            particular result
          </p>
        </CardBody>
      </Card>
      <Card className="max-w-6xl p-6 my-auto mx-auto shadow-lg">
        <CardBody>
          <p className="text-lg font-bold mt-4">Join us</p>
          <p className="text-lg mt-2">
            Organize a campaign to get contributors finding the bugs for your company.
          </p>
        </CardBody>
        <div className="flex justify-center">
          <SignInAuth0Button label="" />
        </div>
      </Card>
    </div>
  );
}
