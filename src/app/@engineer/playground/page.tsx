import { Suspense } from 'react';

import PlaygroundComponent from '@/components/playground/playground-component';

import Loading from './loading';

export const dynamic = 'force-dynamic';

export default function Playground({
  params,
}: {
  params: { reportId: string };
}) {
  return (
    <div className="flex flex-col">
      <h1>Testing the suspense</h1>
      <Suspense fallback={<Loading />}>
        <PlaygroundComponent reportId={params.reportId} />
      </Suspense>
    </div>
  );
}
