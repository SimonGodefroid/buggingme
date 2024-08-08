import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@nextui-org/react';

import SignInAuth0Button from '@/components/common/sign-in-auth0-button';
import SignInGitHubButton from '@/components/common/sign-in-github-button';

export default function Home() {
  return (
    <div className="flex flex-col gap-8 justify-center p-8">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Card className="max-w-lg p-2 my-auto mx-auto shadow-lg">
            <CardHeader className="text-center">
              <h1 className="text-4xl font-bold">Engineer</h1>
            </CardHeader>
            <CardBody>
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
        <div className="col-span-6">
          <Card className="max-w-lg p-2 my-auto mx-auto shadow-lg">
            <CardHeader className="text-center">
              <h1 className="text-4xl font-bold">Company</h1>
            </CardHeader>
            <CardBody>
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
      </div>
      <Card className="max-w-6xl p-6 my-auto mx-auto shadow-lg">
        <CardBody>
          <p className="text-lg">
            It could be visual, it could be a 500, an a11y issue, a security
            concern... <br />
            A. An Engineer has already noticed it and reported it. <br />
            B. The company can get their team to investigate and fix it. <br />
            C. The users will have a better experience. <br />
          </p>
        </CardBody>
      </Card>
      <div className="col-span-12 ">
        <div className="flex justify-center w-auto">
          <Popover>
            <PopoverTrigger>
              <Button>Start now !</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-4">
                <SignInAuth0Button />
                <Divider />
                <SignInGitHubButton />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
