'use client';

import React, { useEffect, useState, useTransition } from 'react';

import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';

import { fetchAllCompanies } from '@/actions/companies/fetchAllCompanies';
import { createReport } from '@/actions/reports/create';
import { fetchAllTags } from '@/actions/reports/tags/fetchAllTags';
import { updateReport } from '@/actions/reports/update';
import {
  Button,
  Chip,
  Input,
  InputProps,
  Select,
  Selection,
  SelectItem,
  Textarea,
  Tooltip,
} from '@nextui-org/react';
import { Impact, ReportStatus, Severity, Tag } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import { ReportWithTags } from '@/types/reports';
import { UserWithCompanies } from '@/types/users';
import { DragNDropFileUpload } from '@/components/common/drag-n-drop-file-upload';
import { EditorClient } from '@/components/common/editor';
import NotFound from '@/app/not-found';

import { Category } from '../common/category';
import CategorySelector from '../common/category-selector';
import StatusSelector from '../common/status-selector';
import CompanySelector from '../companies/company-selector';
import { ImpactChip } from './impact';
import { SeverityChip } from './severity';
import { Status } from './status';

const imageLoader = ({ width, height }: { width: number; height: number }) => {
  return `https://placehold.co/${width}x${height}?text=Your+screenshot+here`;
};

export enum Mode {
  Create = 'create',
  Edit = 'edit',
  View = 'view',
}

export const ReportForm = ({
  user,
  report,
  disabled,
  mode,
  handleCancel,
}: {
  user?: UserWithCompanies | null;
  report?: ReportWithTags;
  disabled?: boolean;
  mode: Mode;
  handleCancel?: () => void;
}) => {
  const FORM_ID = `${mode}-report`;

  const [pending, startTransition] = useTransition();

  const [hovered, setHovered] = React.useState<ReportStatus | undefined>(
    undefined,
  );

  const [tags, setTags] = useState<Tag[] | []>([]);
  const [selectedTags, setSelectedTags] = useState<Selection>(
    new Set((report?.tags || []).map((tag) => tag.id)),
  );

  const [companies, setCompanies] = useState<any[] | []>([]);

  const router = useRouter();
  const [formState, action] = useFormState(
    mode === 'edit' && report && report.id
      ? updateReport.bind(null, { id: report?.id })
      : createReport,
    {
      errors: {},
    },
  );

  const [images, setImages] = React.useState<
    { id: number; url: string }[] | []
  >([]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const allTags = await fetchAllTags();
        setTags(allTags);
      } catch (error: unknown) {
        let message = 'Failed to load tags';
        if (error instanceof Error) {
          message += ` ${error.message}`;
        }
        toast.error(message);
      }
    };
    loadTags();
  }, []);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const allCompanies = await fetchAllCompanies();
        setCompanies(allCompanies);
      } catch (error: unknown) {
        let message = 'Failed to load companies';
        if (error instanceof Error) {
          message += ` ${error.message}`;
        }
        toast.error(message);
      }
    };
    loadCompanies();
  }, []);

  useEffect(() => {
    if (formState.success) {
      toast.success('Report edited successfully !');
      redirect(`/reports/${mode === Mode.Create ? '' : report?.id}`);
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

  if ((mode === Mode.View || mode === Mode.Edit) && !report) {
    return <NotFound />;
  }

  return (
    <div>
      <form className="" id={FORM_ID} action={action}>
        <div className="flex flex-col m-4">
          {/* Upper */}
          <div className="grid grid-cols-12 ">
            {/* Left */}
            <div className="col-span-12 md:col-span-6">
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
                  />
                  <div className="flex flex-col gap-2 items-center">
                    <StatusSelector report={report} mode={mode} />
                  </div>
                </div>
                <div className="gap-4">
                  <div className="flex gap-4 items-center">
                    <CompanySelector
                      mode={mode}
                      companies={companies}
                      report={report}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <CategorySelector
                        userType={user?.userTypes}
                        report={report}
                      />
                      <Category category={report?.category} />
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
                    isInvalid={!!formState?.errors.url}
                    errorMessage={formState?.errors.url?.join(', ')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Impact"
                    name="impact"
                    isRequired={mode !== Mode.View}
                    isDisabled={mode === Mode.View}
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
                    isRequired={mode !== Mode.View}
                    defaultSelectedKeys={[report?.severity || Severity.Medium]}
                    isDisabled={mode === Mode.View}
                    placeholder="Select a severity degree"
                    classNames={{ value: ['mt-1'] }}
                    renderValue={(selected) => (
                      <SeverityChip severity={selected[0].key as Severity} />
                    )}
                  >
                    {Object.values(Severity).map((degree) => (
                      <SelectItem key={degree}>
                        <SeverityChip severity={degree} />
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="gap-4">
                  <Select
                    label={<div className="mb-4">Tags</div>}
                    name="tags"
                    isLoading={!Boolean(tags.length > 0)}
                    isDisabled={mode === Mode.View}
                    selectionMode="multiple"
                    selectedKeys={selectedTags}
                    onSelectionChange={setSelectedTags}
                    renderValue={(values) => {
                      return [
                        ...values.map((value) => (
                          <Chip
                            color="primary"
                            isCloseable
                            onClose={() => {
                              // Remove the item from the selectedTags set
                              const newSelectedTags = new Set(selectedTags);
                              if (value.key) {
                                newSelectedTags.delete(value?.key as string);
                                setSelectedTags(newSelectedTags);
                              }
                            }}
                            key={value.key}
                            className="m-1"
                          >
                            {value.textValue}
                          </Chip>
                        )),
                        <Chip
                          onClick={() => setSelectedTags(new Set([]))}
                          className="m-1"
                        >
                          Clear
                        </Chip>,
                      ];
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
            {/* Right */}
            <div className="col-span-12 md:col-span-6">
              <div className="flex m-4">
                <div className="flex flex-col gap-4 w-full">
                  {!disabled && <DragNDropFileUpload setImages={setImages} />}
                  <div className="flex gap-4 justify-end">
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
            <div className="col-span-12 md:col-span-6">
              <div className="flex flex-col gap-4 m-4">
                <Textarea
                  {...viewModeProps}
                  label="Steps to reproduce"
                  name="steps"
                  defaultValue={report?.steps?.toString()}
                  isRequired={mode !== Mode.View}
                  isInvalid={!!formState?.errors.steps}
                  errorMessage={formState?.errors.steps?.join(', ')}
                  placeholder={`1. Go to Settings\n2. Click on Personal information\n...`}
                />
                <Textarea
                  {...viewModeProps}
                  label="Current Behavior"
                  isRequired={mode !== Mode.View}
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
                  isRequired={mode !== Mode.View}
                  isInvalid={!!formState?.errors.expectedBehavior}
                  errorMessage={formState?.errors.expectedBehavior?.join(', ')}
                  placeholder="Displayed information under my profile should be mine"
                />
              </div>
            </div>
            {/* Right */}
            <div className="col-span-12 md:col-span-6">
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
              mode === Mode.Create && typeof handleCancel === 'function'
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
