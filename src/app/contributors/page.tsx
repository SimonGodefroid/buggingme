import { signIn } from '@/actions';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';

import SignInGitHubButton from '@/components/common/sign-in-github-button';

export default function Contributors() {
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
            If you're a developer, a designer, a tester, or a tech enthusiast,
            you can contribute to this platform by submitting bugs you've
            encountered with popular websites.
          </p>
        </CardBody>
      </Card>
      <div className="flex justify-center">
        <SignInGitHubButton />
      </div>
    </div>
  );
}
