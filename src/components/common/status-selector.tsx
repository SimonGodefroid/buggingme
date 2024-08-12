import { Mode } from 'fs';
import { Key, startTransition } from 'react';

import { updateReportStatus } from '@/actions/reports';
import { REPORT_STATUS_STATE_MACHINE } from '@/actions/reports/helpers/reportStatus';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { Report, ReportStatus, UserType } from '@prisma/client';

import { Status } from '../reports/status';

export default function StatusSelector({
  report,
  mode,
}: {
  report?: Report;
  mode: Mode;
}) {
  const content = [report ? <Status status={report?.status} /> : null].filter(
    Boolean,
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          // size="lg"
          variant="light"
          // isDisabled={mode !== 'edit'}
          // className={
          //   mode !== 'edit'
          //     ? 'justify-end'
          //     : 'min-w-[200px] justify-between p-6'
          // }
        >
          {/* {mode === 'edit' && <span>Status: </span>} */}
          {/* <Status status={report?.status as ReportStatus} /> */}
          Status
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        classNames={{ list: 'w-60' }}
        // onAction={(newStatus: Key) => {
        //   if (
        //     confirm(
        //       `Please confirm your status update from ${report.status} to ${newStatus}`,
        //     )
        //   ) {
        //     startTransition(async () => {
        //       try {
        //         await updateReportStatus({
        //           id: report.id,
        //           oldStatus: report.status as ReportStatus,
        //           newStatus: newStatus as ReportStatus,
        //         });
        //       } catch (err: unknown) {
        //         if (err instanceof Error) {
        //           toast.error(err.message);
        //         }
        //       }
        //     });
        //   }
        // }}
      >
        {REPORT_STATUS_STATE_MACHINE[UserType.ENGINEER][
          (report?.status as ReportStatus) || ReportStatus.Open
        ].map((status: ReportStatus) => (
          <DropdownItem
            key={status!}
            // onMouseEnter={() => {
            //   setHovered(status as ReportStatus);
            // }}
            // onMouseLeave={() => setHovered(undefined)}
          >
            <div className="flex gap-4 justify-between">
              <Button type="submit" size="sm" variant="light">
                <Status status={status as ReportStatus} />
              </Button>
              {/* {hovered === status && (
                  <div className="flex flex-col bordered rounded border-1 border-black items-center justify-center gap-4 p-1">
                    update
                  </div>
                )} */}
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
