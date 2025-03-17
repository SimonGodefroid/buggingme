'use client';

import { ReportWithTags } from '@/types';
import { Button, Tooltip } from '@nextui-org/react';
import { Report } from '@prisma/client';
import { toast } from 'react-toastify';

export type LinkedInWebhookPayload = {
  title: Report['title'];
  description: Report['steps'];
  imageUrl: ReportWithTags['attachments'][number]['url'];
  company: string;
  id: string;
};

async function sendWebhook(report: ReportWithTags) {
  try {
    const response = await fetch('/api/webhooks/linkedin', {
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
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to send webhook: ${response.statusText}`);
    }

    toast.success('Report successfully notified on LinkedIn!');
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'An unexpected error occurred.',
    );
  }
}

export default function NotifyReport({ report }: { report: ReportWithTags }) {
  const isNotified = Boolean(report.notifiedAt);
  return (
    <Tooltip
      content={
        isNotified ? `Already notified on linkedin on ${report.notifiedAt}` : ''
      }
    >
      <Button
        onClick={() => sendWebhook(report)}
        color={isNotified ? 'default' : 'warning'}
        disabled={isNotified}
      >
        Notify Report on LinkedIn
      </Button>
    </Tooltip>
  );
}
