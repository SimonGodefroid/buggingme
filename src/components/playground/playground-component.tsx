import { notFound } from 'next/navigation';

import db from '@/db';

export default async function PlaygroundComponent({ reportId }: { reportId: string }) {
  // await new Promise((resolve) => {
  //   setTimeout(resolve, 3000);
  // });
  const report = await db.report.findFirst({ where: { id: reportId } });

  if (!report) {
    notFound();
  }

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold my-2">{report.title}</h1>
      <p className="p-4 border rounded">{report.steps}</p>
    </div>
  );
}
