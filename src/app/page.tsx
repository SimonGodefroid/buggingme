import { Divider } from '@nextui-org/react';

import { BreadCrumbsClient } from '@/components/breadcrumbs';

export default async function Home() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-3">
        <BreadCrumbsClient crumbs={[]} />
        <h1 className="text-xl">How it works?</h1>
      </div>
      <div className="border shadow py-3 px-2">
        <Divider className="my-2" />
        <h3 className="text-lg">Leaderboard</h3>
        <div>Leaderboard WIP</div>
        {/* <TopicList /> */}
      </div>
    </div>
  );
}
