// import { fetchTopPosts } from '@/db/queries/posts';
import { Divider } from '@nextui-org/react';

// import PostList from '@/components/posts/post-list';
// import TopicCreateForm from '@/components/topics/topic-create-form';
// import TopicList from '@/components/topics/topic-list';
export const dynamic = 'force-dynamic';
export default function Home() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-3">
        <h1 className="text-xl">Most recent bugs</h1>
        <div>list of posts WIP</div>
        {/* <PostList fetchData={fetchTopPosts} /> */}
      </div>
      <div className="border shadow py-3 px-2">
        <div>bug report form WIP</div>
        {/* <TopicCreateForm /> */}
        <Divider className="my-2" />
        <h3 className="text-lg">Topics</h3>
        <div>Leaderboard WIP</div>
        {/* <TopicList /> */}
      </div>
    </div>
  );
}
