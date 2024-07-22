// import { fetchTopPosts } from '@/db/queries/posts';

import { Divider } from '@nextui-org/react';


export default async function Home() {
  // const reports = await prisma.report.findMany({});
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-3">
        <h1 className="text-xl">Most recent reports</h1>
        <div>Reports list WIP</div>
        {/* <PostList fetchData={fetchTopPosts} /> */}
      </div>
      <div className="border shadow py-3 px-2">
        
        <Divider className="my-2" />
        <h3 className="text-lg">Leaderboard</h3>
        <div>Leaderboard WIP</div>
        {/* <TopicList /> */}
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
