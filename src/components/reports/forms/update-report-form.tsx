'use client';

import React, { useEffect } from 'react';

import { redirect, useRouter } from 'next/navigation';

import { updateReport } from '@/actions/reports/update';
import { ReportWithTags, UserWithCompanies } from '@/types';
import { Button, Chip, Input, Textarea } from '@nextui-org/react';
import { Tag } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import { Category } from '@/components/common/category';
import { DragNDropFileUpload } from '@/components/common/drag-n-drop-file-upload';
import { EditorClient } from '@/components/common/editor';
import ImageTooltip from '@/components/common/image-tooltip';
import NotFound from '@/app/not-found';

import StatusSelector from '../../common/status-selector';
import CompanySelector from '../../companies/company-selector';
import ImpactSelector from './impact-selector';
import SeveritySelector from './severity-selector';
import TagsSelector from './tags-selector';

export const UpdateReportForm = ({
  user,
  tags,
  report,
}: {
  user?: UserWithCompanies | null;
  tags: Tag[];
  report?: ReportWithTags;
}) => {
  const FORM_ID = `update-report`;
  const router = useRouter();

  const [formState, action] = useFormState(
    updateReport.bind(null, { id: report!.id }),
    {
      errors: {},
    },
  );

  const [images, setImages] = React.useState<
    { url: string; filename: string }[]
  >(
    (report?.attachments || [])
      .map((a) => ({ url: a.url, filename: a.filename }))
      .filter(Boolean),
  );

  useEffect(() => {
    if (formState.success) {
      toast.success(`Report update successful !`);
      redirect(`/reports/${report?.id}`);
    }
    if (formState.errors._form?.length) {
      toast.error(formState.errors._form.join(', '));
    }
  }, [formState]);

  if (!report) {
    return <NotFound />;
  }

  return (
    <div>
      <form className="" id={FORM_ID} action={action}>
        <div className="flex flex-col m-4">
          {/* Upper */}
          <div className="grid grid-cols-12">
            {/* Left */}
            <div className="col-span-12 md:col-span-6">
              <div className="flex flex-col gap-4 mx-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-9">
                    <Input
                      isInvalid={!!formState?.errors.title}
                      errorMessage={formState?.errors.title?.join(', ')}
                      defaultValue={report?.title}
                      name="title"
                      label="Title"
                      placeholder="Wrong user information in profile"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <StatusSelector report={report} />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-9">
                    <CompanySelector mode={'update'} report={report} />
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <div className="flex justify-between md:flex-col items-center gap-2">
                      <Chip className="text-foreground bg-background">
                        Category
                      </Chip>
                      <Category category={report?.category} />
                    </div>
                  </div>
                </div>
                <div className="gap-4">
                  <Input
                    label="url"
                    name="url"
                    placeholder="www.example.com"
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <ImpactSelector report={report} />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <SeveritySelector />
                  </div>
                </div>
                <div className="gap-4">
                  <TagsSelector mode={'update'} report={report} tags={tags} />
                </div>
              </div>
            </div>
            {/* Right */}
            <div className="col-span-12 md:col-span-6">
              <div className="flex m-4">
                <div className="flex flex-col gap-4 w-full">
                  <DragNDropFileUpload
                    setImages={setImages}
                    images={images}
                    report={report}
                  />
                  <div className="flex justify-center md:justify-start flex-wrap">
                    <div
                      className={`grid grid-cols-${Math.min(Math.max(images.length - 1, 4), 2)}`}
                    >
                      {images?.map((image) => (
                        <ImageTooltip
                          key={image.filename}
                          report={report}
                          image={image}
                          setImages={setImages}
                          images={images}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Lower */}
          <div className="grid grid-cols-12">
            {/* Left */}
            <div className="col-span-12 md:col-span-6">
              <div className="flex flex-col gap-4 m-4">
                <Textarea
                  label="Steps to reproduce"
                  name="steps"
                  minRows={4}
                  defaultValue={report?.steps?.toString()}
                  isRequired
                  isInvalid={!!formState?.errors.steps}
                  errorMessage={formState?.errors.steps?.join(', ')}
                  placeholder={`1. Go to Settings\n2. Click on Personal information\n...`}
                />
                {/* <Textarea
                  label="Current Behavior"
                  minRows={4}
                  isRequired
                  isInvalid={!!formState?.errors.currentBehavior}
                  errorMessage={formState?.errors.currentBehavior?.join(', ')}
                  defaultValue={report?.currentBehavior?.toString()}
                  name="currentBehavior"
                  placeholder="Displayed information is related to a different user than me"
                /> */}
                {/* <Textarea
                  label="Expected Behavior"
                  minRows={4}
                  defaultValue={report?.expectedBehavior?.toString()}
                  name="expectedBehavior"
                  isRequired
                  isInvalid={!!formState?.errors.expectedBehavior}
                  errorMessage={formState?.errors.expectedBehavior?.join(', ')}
                  placeholder="Displayed information under my profile should be mine"
                /> */}
                <Textarea
                  label="Suggestions"
                  name="suggestions"
                  defaultValue={report?.suggestions?.toString()}
                  placeholder="You should check around the API call being made to Identité Numérique you are likely not doing what's needed"
                />
              </div>
            </div>
            {/* Right */}
            <div className="col-span-12 md:col-span-6">
              <div className="flex flex-col gap-4 m-4">
                <EditorClient snippets={report?.snippets} />
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="flex justify-between m-4">
        <Button color="danger" variant="flat" onClick={router.back}>
          Cancel
        </Button>

        <Button color="primary" type="submit" form={FORM_ID}>
          Submit
        </Button>
      </div>
    </div>
  );
};
