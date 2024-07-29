'use client';

import React, {
  FormEvent,
  Key,
  useEffect,
  useState,
  useTransition,
} from 'react';

import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';

import { createReport } from '@/actions/reports/create';
import { REPORT_STATUS_STATE_MACHINE } from '@/actions/reports/helpers/reportStatus';
import { updateReport } from '@/actions/reports/update';
import { updateReportStatus } from '@/actions/reports/updateStatus';
import { faker } from '@faker-js/faker';
import {
  Autocomplete,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  InputProps,
  Select,
  Selection,
  SelectItem,
  Textarea,
  Tooltip,
} from '@nextui-org/react';
import { Impact, ReportStatus, Severity, type Report } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import { DragNDropFileUpload } from '@/components/common/drag-n-drop-file-upload';
import { EditorClient } from '@/components/common/editor';

import { Status } from './status';

const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=Your+screenshot+here';
const imageLoader = ({ width, height }: { width: number; height: number }) => {
  return `https://placehold.co/${width}x${height}?text=Your+screenshot+here`;
};

const MOCK_REPORT = {
  id: `${faker.database.mongodbObjectId}`,
  title: `${faker.hacker.noun()} ${faker.hacker.ingverb()}`,
  url: `${faker.internet.url().replace('https://', '')}`,
  company: `${faker.company.name()}`,
  steps: `1. ${faker.hacker.verb()} ${faker.hacker.noun()}\n2. ${faker.hacker.verb()} ${faker.hacker.noun()}`,
  currentBehavior: `It is currently ${faker.hacker.ingverb()} the ${faker.hacker.noun()}`,
  expectedBehavior: `It should ${faker.hacker.verb()} the ${faker.hacker.noun()}`,
  suggestions: `Try to ${faker.hacker.verb()} the ${faker.hacker.noun()}`,
  snippets: `// coucou c'est pour du js`,
  language: `javascript`,
  userId: faker.database.mongodbObjectId(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.anytime(),
  status: ReportStatus.Open,
  impact: Impact.SiteWide,
  severity: Severity.Medium,
};

export const ReportForm = ({
  report = MOCK_REPORT,
  disabled,
  mode,
  handleCancel,
}: {
  report?: Report;
  disabled?: boolean;
  mode: 'edit' | 'create' | 'view';
  handleCancel?: () => void;
}) => {
  const [pending, startTransition] = useTransition();

  const [hovered, setHovered] = React.useState<ReportStatus | undefined>(
    undefined,
  );
  const FORM_ID = `${mode}-report`;
  const [selectedTags, setSelectedTags] = React.useState<Selection>(
    new Set([]),
  );
  const router = useRouter();
  const [formState, action] = useFormState(
    mode === 'edit'
      ? updateReport.bind(null, { id: report?.id })
      : createReport,
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
      redirect(`/reports/${mode === 'create' ? '' : report?.id}`);
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
    <div>
      <form className="bg-blue-200 py-2 my-2" id={FORM_ID} action={action}>
        <div className="flex flex-col m-4">
          {/* Upper */}
          <div className="grid grid-cols-12 ">
            {/* Left */}
            <div className="col-span-6 ">
              <div className="flex flex-col gap-4 m-4">
                <div className="flex gap-4 items-center">
                  <Input
                    {...viewModeProps}
                    isInvalid={!!formState?.errors.title}
                    errorMessage={formState?.errors.title?.join(', ')}
                    defaultValue={report?.title}
                    name="title"
                    label="Title"
                    placeholder="Wrong user information in profile"
                    // endContent={}
                  />
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        // size="lg"
                        variant="light"
                        isDisabled={mode !== 'edit'}
                        className={
                          mode !== 'edit'
                            ? 'justify-end'
                            : 'min-w-[200px] justify-between p-6'
                        }
                      >
                        {mode === 'edit' && <span>Status: </span>}
                        <Status status={report?.status as ReportStatus} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      classNames={{ list: 'w-60' }}
                      onAction={(newStatus: Key) => {
                        if (
                          confirm(
                            `Please confirm your status update from ${report.status} to ${newStatus}`,
                          )
                        ) {
                          startTransition(async () => {
                            try {
                              await updateReportStatus({
                                id: report.id,
                                oldStatus: report.status as ReportStatus,
                                newStatus: newStatus as ReportStatus,
                              });
                            } catch (err: unknown) {
                              if (err instanceof Error) {
                                toast.error(err.message);
                              }
                            }
                          });
                        }
                      }}
                    >
                      {REPORT_STATUS_STATE_MACHINE['Engineer'][
                        report.status
                      ].map((status) => (
                        <DropdownItem
                          key={status!}
                          onMouseEnter={() => {
                            setHovered(status as ReportStatus);
                          }}
                          onMouseLeave={() => setHovered(undefined)}
                        >
                          <div className="flex gap-4 justify-between">
                            <Button type="submit" size="sm" variant="light">
                              <Status status={status as ReportStatus} />
                            </Button>
                            {hovered === status && (
                              <div className="flex flex-col bordered rounded border-1 border-black items-center justify-center gap-4 p-1">
                                update
                              </div>
                            )}
                          </div>
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                  <Select
                    label="Impact"
                    isDisabled={mode === 'view'}
                    placeholder="Select a impact level"
                    defaultSelectedKeys={['SiteWide']}
                  >
                    {Object.values(Impact).map((level) => (
                      <SelectItem key={level}>{level}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Severity"
                    defaultSelectedKeys={['Medium']}
                    isDisabled={mode === 'view'}
                    placeholder="Select an severity degree"
                  >
                    {Object.values(Severity).map((degree) => (
                      <SelectItem key={degree}>{degree}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    label={<div className="mb-4">Tags</div>}
                    isDisabled={mode === 'view'}
                    selectionMode="multiple"
                    endContent={
                      new Set(selectedTags).size > 0 ? (
                        <span
                          className="border-1 border-black rounded-full px-2"
                          onClick={() => setSelectedTags(new Set([]))}
                        >
                          Clear
                        </span>
                      ) : undefined
                    }
                    selectedKeys={selectedTags}
                    onSelectionChange={setSelectedTags}
                    renderValue={(values) => {
                      return values.map((value) => (
                        <Chip
                          color="primary"
                          isCloseable
                          onClose={() => {
                            // Remove the item from the selectedTags set
                            const newSelectedTags = new Set(selectedTags);
                            newSelectedTags.delete(value?.textValue!);
                            setSelectedTags(newSelectedTags);
                          }}
                          key={value.key}
                          className="m-1"
                        >
                          {value.textValue}
                        </Chip>
                      ));
                    }}
                    isMultiline
                    placeholder="Select tags"
                  >
                    {Object.values(ReportStatus).map((tag) => (
                      <SelectItem key={tag}>{tag}</SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            {/* Right */}
            <div className="col-span-6">
              <div className="flex m-4">
                <div className="flex flex-col gap-4 w-full">
                  {!disabled && <DragNDropFileUpload setImages={setImages} />}
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
                  isRequired={mode !== 'view'}
                  isInvalid={!!formState?.errors.steps}
                  errorMessage={formState?.errors.steps?.join(', ')}
                  placeholder={`1. Go to Settings\n2. Click on Personal information\n...`}
                />
                <Textarea
                  {...viewModeProps}
                  label="Current Behavior"
                  isRequired={mode !== 'view'}
                  isInvalid={!!formState?.errors.currentBehavior}
                  errorMessage={formState?.errors.currentBehavior?.join(', ')}
                  defaultValue={report?.currentBehavior?.toString()}
                  name="currentBehavior"
                  placeholder="Displayed information is related to a different user than me"
                />
                <Textarea
                  {...viewModeProps}
                  label="Expected Behavior"
                  defaultValue={report?.expectedBehavior?.toString()}
                  name="expectedBehavior"
                  isRequired={mode !== 'view'}
                  isInvalid={!!formState?.errors.expectedBehavior}
                  errorMessage={formState?.errors.expectedBehavior?.join(', ')}
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
  );
};
