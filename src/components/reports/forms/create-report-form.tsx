'use client';

import React, { useEffect, useState } from 'react';

import { redirect, useRouter } from 'next/navigation';

import { createReport } from '@/actions/reports/create';
import { ReportWithTags, UserWithCompanies } from '@/types';
import { Button, Input, Selection, Textarea } from '@nextui-org/react';
import { Tag } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import CampaignSelector from '@/components/campaigns/campaign-selector';
import { DragNDropFileUpload } from '@/components/common/drag-n-drop-file-upload';
import { EditorClient } from '@/components/common/editor';
import ImageTooltip from '@/components/common/image-tooltip';

import CompanySelector from '../../companies/company-selector';
import ImpactSelector from './impact-selector';
import SeveritySelector from './severity-selector';
import TagsSelector from './tags-selector';

export const CreateReportForm = ({
  user,
  tags,
  report,
}: {
  user?: UserWithCompanies | null;
  tags: Tag[];
  report?: ReportWithTags;
}) => {
  const FORM_ID = `create-report`;
  const router = useRouter();

  const [formState, action] = useFormState(createReport, {
    errors: {},
  });

  const [images, setImages] = React.useState<
    { url: string; filename: string }[]
  >([]);

  useEffect(() => {
    if (formState.success) {
      toast.success(
        `The report has been created it will be reviewed by an admin before publication !`,
      );
      redirect(`/reports`);
    }
    if (formState.errors._form?.length) {
      toast.error(formState.errors._form.join(', '));
    }
  }, [formState]);

  const [url, setUrl] = useState<string>('');
  // const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  // const handleCampaignChange = (campaign: any | null) => {
  //   setSelectedCampaign(campaign);
  //   if (campaign) {
  //     setSelectedCompany(campaign.companyId); // Force the company selector to the campaign's company
  //   } else {
  //     setSelectedCompany(null); // Allow free selection if no campaign is selected
  //   }
  // };

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
                    isInvalid={!!formState?.errors.title}
                    errorMessage={formState?.errors.title?.join(', ')}
                    defaultValue={report?.title}
                    name="title"
                    isRequired
                    label="Title"
                    placeholder="Wrong user information in profile"
                  />
                </div>
                {/* <div className="col-span-12">
                  <CampaignSelector
                    user={user!}
                    onCampaignChange={handleCampaignChange}
                  />
                </div> */}
                {/* <div className="col-span-12">
                  <CompanySelector
                    mode={'creation'}
                    report={report}
                    // selectedCampaign={selectedCampaign}
                    selectedCompanyId={selectedCompany || undefined} // Pass selected company ID
                    errors={formState?.errors?.companyId}
                  />
                </div> */}
                <div className="gap-4">
                  <Input
                    label="url"
                    name="url"
                    isClearable
                    isRequired
                    placeholder="www.example.com"
                    value={url}
                    onClear={() => setUrl('')}
                    onChange={(e) => {
                      const cleanedUrl = e.target.value.replace(
                        /(^\w+:|^)\/\//,
                        '',
                      );
                      setUrl(cleanedUrl);
                    }}
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
                  <ImpactSelector />
                  <SeveritySelector />
                </div>
                <TagsSelector mode={'creation'} tags={tags} />
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
                    mode="creation"
                  />
                  <div className="flex justify-center md:justify-start flex-wrap">
                    <div
                      className={`grid grid-cols-${Math.min(Math.max(images.length - 1, 4), 2)}`}
                    >
                      {images?.map((image) => (
                        <ImageTooltip
                          key={image.filename}
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
              <div className="flex flex-col gap-4 mx-4">
                <Textarea
                  label="Description"
                  minRows={4}
                  name="steps"
                  isRequired
                  isInvalid={!!formState?.errors.steps}
                  errorMessage={formState?.errors.steps?.join(', ')}
                  placeholder={`Steps to reproduce \n1. Go to Settings\n2. Click on Personal information\n...`}
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
                />
                <Textarea
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
              <div className="flex flex-col gap-4 m-4 md:mx-4 md:my-0">
                <EditorClient />
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
