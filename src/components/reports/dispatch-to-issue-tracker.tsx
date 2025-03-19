'use client';

import { ReportWithTags } from '@/types';
import { Button, Chip } from '@nextui-org/react';
import { Company } from '@prisma/client';
import { toast } from 'react-toastify';

async function sendWebhook(report: ReportWithTags) {
  try {
    const response = await fetch('/api/webhooks/integrations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: report.title,
        description: report.steps,
        imageUrl: report?.attachments?.[0]?.url,
        id: report.id,
        company: report.company?.name,
        companyId: report.company?.id,
        reportId: report.id,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to send webhook: ${response.statusText}`);
    }

    toast.success(
      `Report successfully dispatched to ${report.company?.issueTracker}`,
    );
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'An unexpected error occurred.',
    );
  }
}

export function DispatchToIssueTracker({
  company,
  report,
}: {
  company: Company;
  report: ReportWithTags;
}) {
  return (
    <div className="flex flex-col justify-center">
      {company.issueTracker && !report.ReportDispatch.length ? (
        <Button
          onClick={() => sendWebhook(report)}
        >{`Dispatch to ${company.issueTracker}`}</Button>
      ) : (
        <Chip suppressHydrationWarning>
          {` Dispatched on 
          ${(report.ReportDispatch || [])?.pop()?.dispatchedAt.toISOString() || ''}
          `}
        </Chip>
      )}
    </div>
  );
}
