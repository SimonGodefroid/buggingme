'use client';

import React, { Fragment, useEffect } from 'react';

import { redirect } from 'next/navigation';

import { linkReport } from '@/actions/reports/linkToCompany';
import { ReportWithTags } from '@/types';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import { EditorClient } from '@/components/common/editor';
import ImageTooltip from '@/components/common/image-tooltip';
import CompanyPicker from '@/components/companies/company-picker';

import { TagChip } from '../tag';

export default function LinkReportForm({ report }: { report: ReportWithTags }) {
  const [formState, action] = useFormState(
    linkReport.bind(null, { id: report!.id }),
    {
      errors: {},
    },
  );

  useEffect(() => {
    if (formState.success) {
      toast.success(`Linking report was successful !`);
      redirect(`/reports/link`);
    }
    if (formState.errors._form?.length) {
      toast.error(formState.errors._form.join(', '));
    }
  }, [formState]);
  return (
    <Card className="p-4">
      <CardHeader className="flex justify-between">
        <div>
          <p>{report.title}</p>
          <pre>{report.id}</pre>
        </div>
        <div className="flex gap-4">
          <form action={action} id="link-report" className="flex gap-4">
            <CompanyPicker />
            <Button type="submit" form="link-report">
              Link to company
            </Button>
          </form>
        </div>
      </CardHeader>
      <CardBody>
        <div key={report.id} className="flex flex-col gap-2">
          <p>Company: {report.company?.name}</p>
          <p>Title: {report.title}</p>
          <p>Reporter: {report.user.email}</p>
          <p className="max-w-5xl">Description: {report.steps}</p>
          <p>Suggestion: {report.suggestions}</p>
          <div className="flex gap-4">
            Tags:{' '}
            {report.tags.map((t) => (
              <Fragment key={t.id}>
                <TagChip tag={t} />
              </Fragment>
            ))}
          </div>
          <div className="pt-4">
            <EditorClient snippets={report?.snippets} />
          </div>
          {report.attachments?.length > 0 && (
            <div className="flex flex-col gap-4 w-full">
              <div className="flex justify-center md:justify-start flex-wrap">
                <div
                  className={`grid grid-cols-${Math.min(Math.max(report.attachments?.length - 1, 4), 2)}`}
                >
                  {report.attachments?.map((image) => (
                    <ImageTooltip
                      key={image.filename}
                      image={image}
                      images={report.attachments}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
