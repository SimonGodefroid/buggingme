// import { fetchTopPosts } from '@/db/queries/posts';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { faker } from '@faker-js/faker';
import { Divider, useDisclosure } from '@nextui-org/react';

import { CreateReportForm } from '@/components/reports/create-report-form';

export default async function Home() {
  // const generateReports = async () => {
  //   'use server';
  //   await db.report.createMany({
  //     data: [
  //       {
  //         content: faker.hacker.phrase(),
  //         title: faker.hacker.noun() + ' ' + faker.hacker.ingverb(),
  //         userId: 'd32ec347-5892-4788-9038-9455c8cc317d',
  //       },
  //     ],
  //   });

  //   revalidatePath('/');
  // };
  // const reports = await prisma.report.findMany({});
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-3">
        <h1 className="text-xl">Most recent reports</h1>
        <div>Reports list WIP</div>
        {/* <PostList fetchData={fetchTopPosts} /> */}
      </div>
      <div className="border shadow py-3 px-2">
        <CreateReportForm />
        <Divider className="my-2" />
        <h3 className="text-lg">Leaderboard</h3>
        <div>Leaderboard WIP</div>
        {/* <TopicList /> */}

        {/* <form action={generateReports}>
          <button type="submit">Generate reports</button>
        </form> */}
      </div>
      <div>
        <pre>
          {/* {reports?.map((report, index) => (
            <div key={report.id} className="my-10">
              <h4 className=" capitalize">
                {index} {report.title}
              </h4>
              <p>{report.content}</p>
            </div>
          ))} */}
        </pre>
      </div>
    </div>
  );
}
