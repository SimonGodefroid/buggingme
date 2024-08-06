'use client';

import React, { useEffect, useState, useTransition, type Key } from 'react';

import Image from 'next/image';
import { notFound, redirect, useRouter } from 'next/navigation';

import { fetchAllCompanies } from '@/actions/companies/fetchAllCompanies';
import { createReport } from '@/actions/reports/create';
import { REPORT_STATUS_STATE_MACHINE } from '@/actions/reports/helpers/reportStatus';
import { fetchAllTags } from '@/actions/reports/tags/fetchAllTags';
import { updateReport } from '@/actions/reports/update';
import { updateReportStatus } from '@/actions/reports/updateStatus';
import {
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
import { Impact, ReportStatus, Severity, Tag } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import { DragNDropFileUpload } from '@/components/common/drag-n-drop-file-upload';
import { EditorClient } from '@/components/common/editor';
import ReportNotFound from '@/app/reports/[reportId]/not-found';
import { ReportWithTags } from '@/app/reports/[reportId]/page';

import CompanySelector from '../companies/company-selector';
import { ImpactChip } from './impact';
import { SeverityChip } from './severity';
import { Status } from './status';

const imageLoader = ({ width, height }: { width: number; height: number }) => {
  return `https://placehold.co/${width}x${height}?text=Your+screenshot+here`;
};

export const ReportForm = ({
  report,
  disabled,
  mode,
  handleCancel,
}: {
  report?: ReportWithTags;
  disabled?: boolean;
  mode: 'edit' | 'create' | 'view';
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

  if ((mode === 'view' || mode === 'edit') && !report) {
    return <ReportNotFound />;
  }
  return (
    <div>
      <form className="" id={FORM_ID} action={action}>
        <div className="flex flex-col m-4">
          {/* Upper */}
          <div className="grid grid-cols-12 ">
            {/* Left */}
            <div className="col-span-6">
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
                  {report && report.id && mode === 'edit' ? (
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
                  ) : (
                    <Status
                      status={
                        mode === 'create'
                          ? ReportStatus.Open
                          : (report?.status as ReportStatus)
                      }
                    />
                  )}
                </div>
                <div className="gap-4">
                  <CompanySelector
                    mode={mode}
                    companies={companies}
                    report={report}
                  />
                  {/* <Input
                    {...viewModeProps}
                    label="Company"
                    defaultValue={report?.company}
                    name="company"
                    // startContent={}
                    // endContent={}
                    placeholder="Example Inc."
                    isInvalid={!!formState?.errors.company}
                    errorMessage={formState?.errors.company?.join(', ')}
                  /> */}
                  {/*<Autocomplete
                    allowsCustomValue
                    classNames={{
                      listboxWrapper: 'max-h-[320px]',
                      selectorButton: 'text-default-500',
                    }}
                    // onClear={() => setCompaniesSuggestions([])}
                    onInputChange={(value) => {
                      debouncedFetchCompanies(value);
                    }}
                    inputProps={{
                      classNames: {
                        input: 'ml-1',
                        inputWrapper: 'h-[60px] bg-background',
                        label: 'mb-2',
                      },
                      autoFocus: true,
                    }}
                    isRequired
                    listboxProps={{
                      hideSelectedIcon: true,
                      itemClasses: {
                        base: [
                          'rounded-medium',
                          'text-default-500',
                          'transition-opacity',
                          'data-[hover=true]:text-foreground',
                          'dark:data-[hover=true]:bg-default-50',
                          'data-[pressed=true]:opacity-70',
                          'data-[hover=true]:bg-default-200',
                          'data-[selectable=true]:focus:bg-default-100',
                          'data-[focus-visible=true]:ring-default-500',
                        ],
                      },
                    }}
                    aria-label="Select a company"
                    label="Company"
                    placeholder="Search company name"
                    popoverProps={{
                      offset: 10,
                      classNames: {
                        base: 'rounded-large',
                        content:
                          'p-1 border-small border-default-100 bg-background',
                      },
                    }}
                    startContent={'🔍'}
                    variant="bordered"
                  >
                    <AutocompleteSection title="Existing Companies">
                      {dbCompanies.map((company: CompanySuggestion) => (
                        <AutocompleteItem
                          key={company.id}
                          value={company.id}
                          textValue={company.name}
                        >
                          {renderOption(company)}
                        </AutocompleteItem>
                      ))}
                    </AutocompleteSection>
                    <AutocompleteSection title="New Companies">
                      {companiesSuggestions.map(
                        (company: CompanySuggestion) => (
                          <AutocompleteItem
                            key={company.id}
                            value={company.id}
                            textValue={company.name}
                          >
                            {renderOption(company)}
                          </AutocompleteItem>
                        ),
                      )}
                    </AutocompleteSection>
                    {/* {(item) => (
                      <AutocompleteItem key={item.domain} textValue={item.name}>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <Avatar
                              alt={item.name}
                              className="flex-shrink-0"
                              size="sm"
                              src={item.logo}
                            />
                            <div className="flex flex-col">
                              <span className="text-small">{item.name}</span>
                              <span className="text-tiny text-default-400">
                                {item.domain}
                              </span>
                            </div>
                          </div>
                          <Button
                            className="border-small mr-0.5 font-medium shadow-small"
                            radius="full"
                            size="sm"
                            variant="bordered"
                            // onPress={() => createCompany(item)}
                          >
                            Create
                          </Button>
                        </div>
                      </AutocompleteItem>
                    )} 
                  </Autocomplete>*/}
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
                    isRequired={mode !== 'view'}
                    isDisabled={mode === 'view'}
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
                    isRequired={mode !== 'view'}
                    defaultSelectedKeys={[report?.severity || Severity.Medium]}
                    isDisabled={mode === 'view'}
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
                    isDisabled={mode === 'view'}
                    selectionMode="multiple"
                    endContent={
                      mode !== 'view' &&
                      !Boolean(tags.length === 0) &&
                      new Set(selectedTags).size > 0 ? (
                        <span
                          className="text-sm border-1 border-black rounded-full px-2"
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
                      ));
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
            <div className="col-span-6">
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
