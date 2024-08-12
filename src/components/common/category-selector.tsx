import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Tooltip,
} from '@nextui-org/react';
import { Report, ReportCategory, UserType } from '@prisma/client';

import { Category } from './category';

export default function CategorySelector({
  report,
  userType,
}: {
  report?: Report;
  userType?: UserType[];
}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" className="flex flex-col gap-4">
          {`Category`}
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
        <DropdownSection title="Open categories">
          {[
            ReportCategory.New,
            ReportCategory.Informative,
            ReportCategory.Valid,
          ].map((category) => (
            <DropdownItem key={category!}>
              <div className="flex gap-4 justify-between">
                <Button type="submit" size="sm" variant="light">
                  <Category category={category as ReportCategory} />
                </Button>
              </div>
            </DropdownItem>
          ))}
        </DropdownSection>
        <DropdownSection title="Closed categories">
          {[
            ReportCategory.Spam,
            ReportCategory.Duplicate,
            ReportCategory.NotApplicable,
          ].map((category) => (
            <DropdownItem key={category!}>
              <div className="flex gap-4 justify-between">
                <Button type="submit" size="sm" variant="light">
                  <Category category={category as ReportCategory} />
                </Button>
              </div>
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
