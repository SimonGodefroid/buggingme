import { Skeleton } from '@nextui-org/react';

export default function Loading() {
  return (
    <div className="text-foreground">
      <div className="flex flex-col md:m-4">
        <div className="grid grid-cols-12 ">
          <div className="col-span-12 md:col-span-6">
            <div className="flex flex-col gap-4 m-4">
              <div className="grid grid-cols-12">
                <div className="col-span-10">
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="col-span-2">
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-10">
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="col-span-2">
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>
              </div>
              <div className="gap-4">
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="gap-4">
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="flex m-4">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex gap-4 justify-end">
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-6">
            <div className="flex flex-col gap-4 m-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="flex flex-col gap-4 m-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
