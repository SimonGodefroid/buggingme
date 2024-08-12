import { Button, Link } from '@nextui-org/react';

export default function ReportNotFound() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-xl ">Report not found</h1>
      <p className="text-lg">
        Sorry this resource does not exist or you do not have access to it.
      </p>
      <Button color="primary" variant="ghost" as={Link} href={`/reports`}>
        Back to Reports
      </Button>
    </div>
  );
}
