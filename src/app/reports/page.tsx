import { signIn } from '@/actions';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';

export default function Reports() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center p-8">
      <Card className="max-w-md p-6 my-auto mx-auto shadow-lg">
        <CardHeader className="text-center">
          <h1 className="text-4xl font-bold">Report</h1>
        </CardHeader>
        <CardBody>
          <p className="text-xl text-gray-600">/rɪˈpɔːt/</p>
          <p className="text-lg font-bold mt-4">verb</p>
          <p className="text-lg mt-2">to make a written record or summary of</p>
        </CardBody>
      </Card>
      <Card className="max-w-6xl p-6 my-auto mx-auto shadow-lg">
        <CardBody>
          <p className="text-lg font-bold mt-4">Start reporting bugs now</p>
          <p className="text-lg mt-2">
            Reporting bugs will help companies to improve their services and
            products. You will get noticed easier by the companies and they will
            be able to either reward you a bounty or offer you a job interview.
          </p>
        </CardBody>
        <div className="flex justify-center">
          <form action={signIn}>
            <Button type="submit" color="primary" variant="flat">
              Sign in with Github
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
