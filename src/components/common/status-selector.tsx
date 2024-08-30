'use client';

import { Key, startTransition, useCallback } from 'react';

import { updateReportStatus } from '@/actions/reports';
import { REPORT_STATUS_STATE_MACHINE } from '@/actions/reports/helpers/reportStatus';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { ReportStatus, UserType } from '@prisma/client';
import { toast } from 'react-toastify';

import { ReportWithTags } from '@/types';
import { Status } from '@/components/reports/status';

export default function StatusSelector({
  report,
}: {
  report?: ReportWithTags;
}) {
  const handleUpdate = useCallback(
    (status: Key) => {
      if (
        confirm(
          `Please confirm your status update from ${report!.status} to ${status}`,
        )
      ) {
        startTransition(async () => {
          try {
            await updateReportStatus({
              id: report!.id,
              oldStatus: report!.status as ReportStatus,
              newStatus: status as ReportStatus,
            });
          } catch (err: unknown) {
            if (err instanceof Error) {
              toast.error(err.message);
            }
          }
        });
      }
    },
    [report],
  );

  const Selector = () => (
    <Dropdown>
      <DropdownTrigger>
        <Button size="sm" className="text-background bg-foreground ">
          Status
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        classNames={{ list: 'text-center' }}
        aria-label="Update report status"
        onAction={handleUpdate}
      >
        {(
          REPORT_STATUS_STATE_MACHINE?.[
            report?.user.userTypes?.[0] as UserType
          ][report?.status as ReportStatus] || []
        ).map((status) => (
          <DropdownItem className="w-full" key={status} textValue={status}>
            <Status status={status} />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <Selector />
      <Status status={report!.status} />
    </div>
  );
}
