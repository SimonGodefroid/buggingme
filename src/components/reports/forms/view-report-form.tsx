'use server';

import React from 'react';

import db from '@/db';
import { Chip, Input, Textarea } from '@nextui-org/react';

import { ReportWithTags } from '@/types/reports';
import { Category } from '@/components/common/category';
import { EditorClient } from '@/components/common/editor';
import ImageTooltip from '@/components/common/image-tooltip';
import NotFound from '@/app/not-found';

import CompanySelector from '../../companies/company-selector';
import { Status } from '../status';
import ImpactSelector from './impact-selector';
import SeveritySelector from './severity-selector';
import TagsSelector from './tags-selector';

export default async function ViewReportForm({
  // tags,
  report,
}: {
  report: ReportWithTags;
}) {
  const tags = await db.tag.findMany();
  const FORM_ID = `view-report`;
  const images = report?.attachments
    ?.map((a) => ({ url: a.url, filename: a.filename }))
    .filter(Boolean);

  const viewModeProps = {
    isReadOnly: true,
    isDisabled: true,
  } as const;

  if (!report) {
    return <NotFound />;
  }

  return (
    <div className="text-foreground">
      <form className="" id={FORM_ID}>
        <div className="flex flex-col md:m-4">
          <div className="grid grid-cols-12 ">
            <div className="col-span-12 md:col-span-6">
              <div className="flex flex-col gap-4 m-4">
                <div className="grid grid-cols-12">
                  <div className="col-span-9">
                    <Input
                      {...viewModeProps}
                      defaultValue={report?.title}
                      name="title"
                      label="Title"
                      placeholder="Wrong user information in profile"
                    />
                  </div>
                  <div className="col-span-3">
                    <div className="flex flex-col items-center gap-2">
                      <Chip className="text-foreground bg-background">
                        Status
                      </Chip>
                      <Status status={report.status} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-9">
                    <CompanySelector report={report} mode={'view'} />
                  </div>
                  <div className="col-span-3">
                    <div className="flex flex-col items-center gap-2">
                      <Chip className="text-foreground bg-background">
                        Category
                      </Chip>
                      <Category category={report.category} />
                    </div>
                  </div>
                </div>
                <div className="gap-4">
                  <Input
                    {...viewModeProps}
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
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ImpactSelector
                    viewModeProps={viewModeProps}
                    report={report}
                  />
                  <SeveritySelector
                    viewModeProps={viewModeProps}
                    report={report}
                  />
                </div>
                <div className="gap-4">
                  <TagsSelector mode={'view'} tags={tags} report={report} />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6">
              {images?.length > 0 && (
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex justify-center md:justify-start flex-wrap">
                    {images?.map((image) => (
                      <ImageTooltip image={image} images={images} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-6">
              <div className="flex flex-col gap-4 m-4">
                <Textarea
                  {...viewModeProps}
                  label="Steps to reproduce"
                  name="steps"
                  defaultValue={report?.steps?.toString()}
                  placeholder={`1. Go to Settings\n2. Click on Personal information\n...`}
                />
                <Textarea
                  {...viewModeProps}
                  label="Current Behavior"
                  defaultValue={report?.currentBehavior?.toString()}
                  name="currentBehavior"
                  placeholder="Displayed information is related to a different user than me"
                />
                <Textarea
                  {...viewModeProps}
                  label="Expected Behavior"
                  defaultValue={report?.expectedBehavior?.toString()}
                  name="expectedBehavior"
                  placeholder="Displayed information under my profile should be mine"
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="flex flex-col gap-4 m-4">
                <Textarea
                  {...viewModeProps}
                  label="Suggestions"
                  name="suggestions"
                  defaultValue={report?.suggestions?.toString()}
                  placeholder="You should check around the API call being made to Identité Numérique you are likely not doing what's needed"
                />
                <EditorClient snippets={report.snippets} readOnly />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
