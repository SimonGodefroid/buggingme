'use client';

import Image from 'next/image';

import { Tooltip } from '@nextui-org/react';

export default function ImageTooltip({
  image,
  images,
  setImages,
}: {
  image: { id: number; url: string };
  images?: { id: number; url: string }[];
  setImages?: React.Dispatch<
    React.SetStateAction<{ id: number; url: string }[]>
  >;
}) {
  const imageLoader = ({
    width = 400,
    height = 200,
  }: {
    width?: number;
    height?: number;
  }) => {
    return `https://placehold.co/${width}x${height}?text=Your+screenshot+here`;
  };
  return (
    <Tooltip
      placement="bottom"
      offset={-150}
      key={image.id}
      content={
        <div className="flex m-2 relative">
          {setImages && images && (
            <button
              className="text-lg text-primary cursor-pointer active:opacity-50 p-1 absolute top-4 right-4"
              onClick={(evt) => {
                evt.stopPropagation();
                if (confirm('Are you sure you want to delete this report?')) {
                  setImages((prevImages) => {
                    const images = prevImages.filter(
                      (img) => img.id !== image.id,
                    );
                    return images;
                  });
                  // deleteReport(report.id);
                }
              }}
            >
              <div className="text-medium bg-red-400 w-8 h-8 flex justify-center items-center rounded-full mx-auto">
                🗑️
              </div>
            </button>
          )}
          <Image
            loader={() => imageLoader({})}
            src={'placeholder.png'}
            width={400}
            height={200}
            alt="image screenshot"
          />
        </div>
      }
    >
      <div className={`w-1/${images?.length || 1}`}>
        <img className={`max-h-40`} src={image.url} />
      </div>
    </Tooltip>
  );
}
