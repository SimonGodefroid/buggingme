'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';

import { updateReport } from '@/actions/reports/update';
import {
  Button,
  Chip,
  Input,
  Select,
  Selection,
  SelectItem,
  Textarea,
  Tooltip,
} from '@nextui-org/react';
import { Impact, Severity, Tag } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import { ReportWithTags } from '@/types/reports';
import { UserWithCompanies } from '@/types/users';
import { Category } from '@/components/common/category';
import { DragNDropFileUpload } from '@/components/common/drag-n-drop-file-upload';
import { EditorClient } from '@/components/common/editor';
import NotFound from '@/app/not-found';

import CategorySelector from '../../common/category-selector/category-selector';
import StatusSelector from '../../common/status-selector';
import CompanySelector from '../../companies/company-selector';
import { ImpactChip } from '../impact';
import { SeverityChip } from '../severity';

const imageLoader = ({ width, height }: { width: number; height: number }) => {
  return `https://placehold.co/${width}x${height}?text=Your+screenshot+here`;
};

export enum Mode {
  Creation = 'creation',
  Update = 'update',
  View = 'view',
}

export const UpdateReportForm = ({
  user,
  tags,
  report,
  mode,
  handleCancel,
}: {
  user?: UserWithCompanies | null;
  tags: Tag[];
  report?: ReportWithTags;
  mode: 'view' | 'update' | 'creation';
  handleCancel?: () => void;
}) => {
  const FORM_ID = `${mode}-report`;
  const router = useRouter();

  const [selectedTags, setSelectedTags] = useState<Selection>(
    new Set((report?.tags || []).map((tag) => tag.id)),
  );

  const [formState, action] = useFormState(
    updateReport.bind(null, { id: report!.id }),
    {
      errors: {},
    },
  );

  const [images, setImages] = React.useState<
    { id: number; url: string }[] | []
  >([]);

  useEffect(() => {
    if (formState.success) {
      toast.success(`Report ${mode.toLowerCase()} successful !`);
      redirect(`/reports/${mode === Mode.Creation ? '' : report?.id}`);
    }
    if (formState.errors._form?.length) {
      toast.error(formState.errors._form.join(', '));
    }
  }, [formState]);

  if (mode === Mode.Update && !report) {
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
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-10">
                    <Input
                      isInvalid={!!formState?.errors.title}
                      errorMessage={formState?.errors.title?.join(', ')}
                      defaultValue={report?.title}
                      name="title"
                      label="Title"
                      placeholder="Wrong user information in profile"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-2">
                    <StatusSelector report={report} />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-10">
                    <CompanySelector mode={mode} report={report} />
                  </div>
                  <div className="col-span-12 md:col-span-2">
                    <div className="flex flex-col items-center gap-2">
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
                    <Select
                      label="Impact"
                      name="impact"
                      placeholder="Select an impact level"
                      defaultSelectedKeys={[
                        report?.impact || Impact.SingleUser,
                      ]}
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
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Select
                      label="Severity"
                      name="severity"
                      defaultSelectedKeys={[
                        report?.severity || Severity.Medium,
                      ]}
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
                </div>
                <div className="gap-4">
                  <Select
                    label={<div className="mb-4">Tags</div>}
                    name="tags"
                    isLoading={!Boolean(tags?.length > 0)}
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
                        mode !== Mode.View && (
                          <Chip
                            key="clear"
                            onClick={() => setSelectedTags(new Set([]))}
                            className="m-1"
                          >
                            Clear
                          </Chip>
                        ),
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
            {/* Right */}
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
                  isRequired={mode !== Mode.View}
                  isInvalid={!!formState?.errors.steps}
                  errorMessage={formState?.errors.steps?.join(', ')}
                  placeholder={`1. Go to Settings\n2. Click on Personal information\n...`}
                />
                <Textarea
                  label="Current Behavior"
                  minRows={4}
                  isRequired={mode !== Mode.View}
                  isInvalid={!!formState?.errors.currentBehavior}
                  errorMessage={formState?.errors.currentBehavior?.join(', ')}
                  defaultValue={report?.currentBehavior?.toString()}
                  name="currentBehavior"
                  placeholder="Displayed information is related to a different user than me"
                />
                <Textarea
                  label="Expected Behavior"
                  minRows={4}
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
                  label="Suggestions"
                  name="suggestions"
                  defaultValue={report?.suggestions?.toString()}
                  placeholder="You should check around the API call being made to Identité Numérique you are likely not doing what's needed"
                />
                <EditorClient snippets={report?.snippets} />
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="flex justify-between m-4">
        <Button
          color="danger"
          variant="flat"
          onClick={
            mode === Mode.Creation && typeof handleCancel === 'function'
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
    </div>
  );
};
