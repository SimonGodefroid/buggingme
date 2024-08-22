'use client';

import Image from 'next/image';

import { ReportWithTags } from '@/types';
import { Button, Card, CardFooter, Tooltip } from '@nextui-org/react';

import DeleteAttachmentForm from '../attachments/delete-attachment-form';

export default function ImageTooltip({
  report,
  image,
  images,
  setImages,
}: {
  report?: ReportWithTags;
  image: { url: string; filename: string };
  images?: { url: string; filename: string }[];
  setImages?: React.Dispatch<
    React.SetStateAction<{ url: string; filename: string }[]>
  >;
}) {
  const imageLoader = ({
    width = 400,
    height = 200,
    url = `https://placehold.co/${width}x${height}?text=Your+screenshot+here`,
  }: {
    width?: number;
    height?: number;
    url?: string;
  }) => {
    return url;
  };
  const imageCount = Math.max(
    Math.min(images?.filter(Boolean).length ?? 0, 6),
    2,
  );
  const widthClass = `w-1/${imageCount}`;
  return (
    <Tooltip
      placement={images?.length ?? 0 > 1 ? 'bottom-end' : 'left'}
      crossOffset={images?.length ?? 0 > 1 ? -200 : 0}
      offset={images?.length ?? 0 > 1 ? -200 : 0}
      key={image.url}
      content={
        <div className="flex m-2 relative">
          {images && (
            <div>
              <div className="absolute top-4 left-4 bg-slate-500">
                {image.filename}
              </div>
              <div className="text-lg text-primary cursor-pointer active:opacity-50 p-1 absolute top-4 right-4 flex gap-4">
                {/* <div className="text-medium bg-red-400 w-8 h-8 flex justify-center items-center rounded-full mx-auto"> */}
                {report?.attachments.map((a) => a.url).includes(image.url) &&
                  setImages && (
                    <DeleteAttachmentForm
                      attachmentUrl={image.url}
                      onDelete={() => {
                        setImages((prevImages) =>
                          prevImages.filter((img) => img !== image),
                        );
                      }}
                    />
                  )}
                {/* </div> */}
              </div>
            </div>
          )}
          <Card isFooterBlurred radius="lg" className="border-none">
            <Image
              loader={() => imageLoader({ url: image.url })}
              src={image.url}
              width={600}
              height={300}
              alt="image screenshot"
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 bg-pink-800 bg-opacity-60	 ">
              <p className="text-tiny text-white/80">{image.filename}</p>
              {report?.attachments.map((a) => a.url).includes(image.url) &&
                setImages && (
                  <DeleteAttachmentForm
                    attachmentUrl={image.url}
                    onDelete={() => {
                      setImages((prevImages) =>
                        prevImages.filter((img) => img !== image),
                      );
                    }}
                  />
                )}
              {!report?.attachments.map((a) => a.url).includes(image.url) &&
                setImages && (
                  <Button
                    onClick={() => {
                      setImages((prevImages) =>
                        prevImages.filter((img) => img !== image),
                      );
                    }}
                  >
                    Discard
                  </Button>
                )}
            </CardFooter>
          </Card>
        </div>
      }
    >
      <img
        className={`${widthClass} max-h-1/4 border-1 border-white cursor-pointer`}
        src={image.url}
        onClick={() => {
          window.open(image.url, '_blank');
        }}
      />
    </Tooltip>
  );
}
