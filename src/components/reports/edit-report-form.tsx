'use client';

import React, { useEffect } from 'react';

import Image from 'next/image';
import { notFound, redirect, useRouter } from 'next/navigation';

import { createReport } from '@/actions/reports/create';
import { updateReport } from '@/actions/reports/update';
import {
  Button,
  Input,
  InputProps,
  Textarea,
  Tooltip,
} from '@nextui-org/react';
import type { Report } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import { DragNDropFileUpload } from '@/components/common/drag-n-drop-file-upload';
import { EditorClient } from '@/components/common/editor';

const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=Your+screenshot+here';
const imageLoader = ({ width, height }: { width: number; height: number }) => {
  return `https://placehold.co/${width}x${height}?text=Your+screenshot+here`;
};

export const EditReportForm = ({
  report,
  disabled,
  mode,
  handleCancel,
}: {
  report?: Report;
  disabled?: boolean;
  mode: 'edit' | 'create' | 'view';
  handleCancel?: () => void;
}) => {
  const FORM_ID = 'edit-report';
  const router = useRouter();
  const [formState, action] = useFormState(
    report ? updateReport.bind(null, { id: report?.id }) : createReport,
    {
      errors: {},
    },
  );

  const [images, setImages] = React.useState<{ id: number; url: string }[]>(
    Array.from({ length: 1 }, (v, k) => ({ id: k, url: DEFAULT_IMAGE })),
  );

  useEffect(() => {
    if (formState.success) {
      toast.success('Report edited successfully !');
      redirect(`/reports/${report?.id}`);
    }
    if (formState.errors._form?.length) {
      toast.error(formState.errors._form.join(', '));
    }
  }, [formState]);

  const viewModeProps = {
    isRequired: !disabled,
    isReadOnly: disabled,
    color: disabled ? ('primary' as InputProps['color']) : undefined,
  };

  // if (!report) {
  //   notFound();
  // }
  return (
    <>
      <div>
        <div>
          <form className="bg-slate-900" id={FORM_ID} action={action}>
            <div className="flex flex-col m-4">
              {/* Upper */}
              <div className="grid grid-cols-12 ">
                {/* Left */}
                <div className="col-span-6 ">
                  <div className="flex flex-col gap-4 m-4">
                    <Input
                      {...viewModeProps}
                      isInvalid={!!formState?.errors.title}
                      errorMessage={formState?.errors.title?.join(', ')}
                      defaultValue={report?.title}
                      name="title"
                      label="Title"
                      placeholder="Wrong user information in profile"
                    />
                    <Input
                      {...viewModeProps}
                      label="Company"
                      defaultValue={report?.company}
                      name="company"
                      // startContent={}
                      // endContent={}
                      placeholder="Example Inc."
                      isInvalid={!!formState?.errors.company}
                      errorMessage={formState?.errors.company?.join(', ')}
                    />
                    <Input
                      {...viewModeProps}
                      label="url"
                      name="url"
                      placeholder="https://www.example.com"
                      defaultValue={report?.url?.toString()}
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">
                            https://
                          </span>
                        </div>
                      }
                      isInvalid={!!formState?.errors.url}
                      errorMessage={formState?.errors.url?.join(', ')}
                    />
                  </div>
                </div>
                {/* Right */}
                <div className="col-span-6">
                  <div className="flex m-4">
                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex gap-4">
                        {(images || []).map((image) => (
                          <Tooltip
                            placement="left"
                            offset={-150}
                            key={image.id}
                            content={
                              <div className="flex m-2 relative">
                                {!disabled && (
                                  <button
                                    className="text-lg text-primary cursor-pointer active:opacity-50 p-1 absolute top-4 right-4"
                                    onClick={(evt) => {
                                      evt.stopPropagation();
                                      if (
                                        confirm(
                                          'Are you sure you want to delete this report?',
                                        )
                                      ) {
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
                                  loader={() =>
                                    imageLoader({
                                      width: 400,
                                      height: 200,
                                    })
                                  }
                                  src={'placeholder.png'}
                                  width={400}
                                  height={200}
                                  alt="image screenshot"
                                />
                              </div>
                            }
                          >
                            <div className={`w-1/${images.length}`}>
                              <img className={`max-h-40`} src={image.url} />
                            </div>
                          </Tooltip>
                        ))}
                      </div>
                      {!disabled && (
                        <DragNDropFileUpload setImages={setImages} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Lower */}
              <div className="grid grid-cols-12">
                {/* Left */}
                <div className="col-span-6 ">
                  <div className="flex flex-col gap-4 m-4">
                    <Textarea
                      {...viewModeProps}
                      label="Steps to reproduce"
                      name="steps"
                      defaultValue={report?.steps?.toString()}
                      isRequired
                      isInvalid={!!formState?.errors.steps}
                      errorMessage={formState?.errors.steps?.join(', ')}
                      placeholder={`1. Go to Settings\n2. Click on Personal information\n...`}
                    />
                    <Textarea
                      {...viewModeProps}
                      label="Current Behavior"
                      isRequired
                      isInvalid={!!formState?.errors.currentBehavior}
                      errorMessage={formState?.errors.currentBehavior?.join(
                        ', ',
                      )}
                      defaultValue={report?.currentBehavior?.toString()}
                      name="currentBehavior"
                      placeholder="Displayed information is related to a different user than me"
                    />
                    <Textarea
                      {...viewModeProps}
                      label="Expected Behavior"
                      defaultValue={report?.expectedBehavior?.toString()}
                      name="expectedBehavior"
                      isRequired
                      isInvalid={!!formState?.errors.expectedBehavior}
                      errorMessage={formState?.errors.expectedBehavior?.join(
                        ', ',
                      )}
                      placeholder="Displayed information under my profile should be mine"
                    />
                  </div>
                </div>
                {/* Right */}
                <div className="col-span-6">
                  <div className="flex flex-col gap-4 m-4">
                    <Textarea
                      {...viewModeProps}
                      label="Suggestions"
                      name="suggestions"
                      defaultValue={report?.suggestions?.toString()}
                      placeholder="You should check around the API call being made to Identité Numérique you are likely not doing what's needed"
                    />
                    <EditorClient readOnly={disabled} />
                  </div>
                </div>
              </div>
            </div>
          </form>

          {!disabled && (
            <div className="flex justify-between m-4">
              <Button
                color="danger"
                variant="flat"
                onClick={
                  mode === 'create' && typeof handleCancel === 'function'
                    ? () => handleCancel()
                    : () => router.back()
                }
              >
                Cancel
              </Button>

              <Button color="primary" type="submit" form={FORM_ID}>
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
