'use client';

import React from 'react';

import Image from 'next/image';

import {
  Chip,
  Input,
  InputProps,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
} from '@nextui-org/react';
import { Impact, Severity, Tag } from '@prisma/client';

import { ReportWithTags } from '@/types/reports';
import { UserWithCompanies } from '@/types/users';
import { Category } from '@/components/common/category';
import { DragNDropFileUpload } from '@/components/common/drag-n-drop-file-upload';
import { EditorClient } from '@/components/common/editor';
import NotFound from '@/app/not-found';

import CompanySelector from '../../companies/company-selector';
import { ImpactChip } from '../impact';
import { SeverityChip } from '../severity';
import { Status } from '../status';

const imageLoader = ({ width, height }: { width: number; height: number }) => {
  return `https://placehold.co/${width}x${height}?text=Your+screenshot+here`;
};

export enum Mode {
  Creation = 'creation',
  Update = 'update',
  View = 'view',
}

export const ViewReportForm = ({
  user,
  tags,
  report,
  mode,
}: {
  user?: UserWithCompanies | null;
  tags: Tag[];
  report?: ReportWithTags;
  mode: 'view' | 'update' | 'creation';
  handleCancel?: () => void;
}) => {
  const FORM_ID = `${mode}-report`;

  const [images, setImages] = React.useState<
    { id: number; url: string }[] | []
  >([]);

  const viewModeProps = {
    isReadOnly: true,
    isDisabled: true,
    color: 'primary' as InputProps['color'],
  };

  if (!report) {
    return <NotFound />;
  }

  return (
    <div>
      <form className="" id={FORM_ID}>
        <div className="flex flex-col md:m-4">
          <div className="grid grid-cols-12 ">
            <div className="col-span-12 md:col-span-6">
              <div className="flex flex-col gap-4 m-4">
                <div className="grid grid-cols-12">
                  <div className="col-span-10">
                    <Input
                      {...viewModeProps}
                      defaultValue={report?.title}
                      name="title"
                      label="Title"
                      placeholder="Wrong user information in profile"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex flex-col items-center gap-2">
                      <Chip className="text-foreground bg-background">
                        Status
                      </Chip>
                      <Status status={report.status} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-10">
                    <CompanySelector mode={mode} report={report} />
                  </div>
                  <div className="col-span-2">
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
                  <Select
                    label="Impact"
                    name="impact"
                    {...viewModeProps}
                    placeholder="Select an impact level"
                    defaultSelectedKeys={[report?.impact || Impact.SingleUser]}
                    classNames={{ value: ['mt-1'] }}
                    renderValue={(selected) => (
                      <ImpactChip impact={selected[0].key as Impact} />
                    )}
                  >
                    {Object.values(Impact).map((impact) => (
                      <SelectItem key={impact}>
                        <ImpactChip impact={impact} />
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Severity"
                    name="severity"
                    {...viewModeProps}
                    defaultSelectedKeys={[report?.severity || Severity.Medium]}
                    placeholder="Select a severity degree"
                    classNames={{ value: ['mt-1'] }}
                    renderValue={(selected) => (
                      <SeverityChip severity={selected[0].key as Severity} />
                    )}
                  >
                    {Object.values(Severity).map((degree) => (
                      <SelectItem key={degree} textValue={degree}>
                        <SeverityChip severity={degree} />
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="gap-4">
                  <Select
                    label={<div className="mb-4">Tags</div>}
                    name="tags"
                    isDisabled
                    selectionMode="multiple"
                    selectedKeys={report.tags.map((tag) => tag.id)}
                    renderValue={(values) => {
                      return [
                        ...values.map((value) => (
                          <Chip
                            color="primary"
                            isCloseable
                            key={value.key}
                            className="m-1"
                          >
                            {value.textValue}
                          </Chip>
                        )),
                      ].filter(Boolean);
                    }}
                    isMultiline
                    placeholder="Select tags"
                  >
                    {(tags || []).map((tag: Tag) => (
                      <SelectItem key={tag.id}>{tag.name}</SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="flex m-4">
                <div className="flex flex-col gap-4 w-full">
                  {mode !== Mode.View && (
                    <DragNDropFileUpload setImages={setImages} />
                  )}
                  <div className="flex gap-4 justify-end">
                    {(images || []).map((image) => (
                      <Tooltip
                        placement="left"
                        offset={-150}
                        key={image.id}
                        content={
                          <div className="flex m-2 relative">
                            {mode !== Mode.View && (
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
                </div>
              </div>
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
};
