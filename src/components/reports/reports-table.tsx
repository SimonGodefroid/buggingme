'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import {
  Chip,
  ChipProps,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react';
import { Report } from '@prisma/client';

import { columns } from './data';

const statusColorMap: Record<string, ChipProps['color']> = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
};

export default function ReportsTable({ reports }: { reports: Report[] }) {
  const router = useRouter();

  const renderCell = React.useCallback(
    (report: Report, columnKey: React.Key) => {
      const cellValue = report?.[columnKey as keyof Report];

      switch (columnKey) {
        case 'title':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {cellValue?.toString()}
              </p>
            </div>
          );
        case 'company':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {cellValue?.toString()}
              </p>
              <a
                className="text-bold text-sm  text-default-400 border-dotted border-2 border-sky-300 max-w-max"
                href={report.url?.toString()}
              >
                {report.url?.toString()}
              </a>
            </div>
          );
        case 'steps':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {cellValue?.toString()}
              </p>
            </div>
          );
        case 'status':
          return (
            <Chip
              className="capitalize"
              // color={statusColorMap[report?.status || '']}
              size="sm"
              variant="flat"
            >
              {/* {cellValue} */}
            </Chip>
          );
        case 'actions':
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Edit report">
                <button
                  className="text-lg text-default-400 cursor-pointer active:opacity-50 p-1"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    alert('Edit report');
                  }}
                >
                  ✏️
                </button>
              </Tooltip>
              <Tooltip color="danger" content="Delete report">
                <button
                  className="text-lg text-danger cursor-pointer active:opacity-50 p-1"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    alert('Delete report');
                  }}
                >
                  🗑️
                </button>
              </Tooltip>
              <Tooltip color="primary" content="Information">
                <button
                  className="text-lg text-primary cursor-pointer active:opacity-50 p-1"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    alert('Information');
                  }}
                >
                  ⓘ
                </button>
              </Tooltip>
              <Tooltip color="primary" content="Upvote">
                <button
                  className="text-lg text-primary cursor-pointer active:opacity-50 p-1"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    alert('Upvoted');
                  }}
                >
                  <div className="text-medium bg-purple-100 w-8 h-8 flex justify-center items-center rounded-full mx-auto">
                    ↑
                  </div>
                </button>
              </Tooltip>
              <Tooltip color="primary" content="Downvote">
                <button
                  className="text-lg text-primary cursor-pointer active:opacity-50 p-1"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    alert('Downvoted');
                  }}
                >
                  <div className="text-medium bg-purple-100 w-8 h-8 flex justify-center items-center rounded-full mx-auto">
                    ↓
                  </div>
                </button>
              </Tooltip>
              <Tooltip color="primary" content="Follow">
                <button
                  className="cursor-pointer hover:opacity-70 p-2 "
                  onClick={(evt) => {
                    evt.stopPropagation();
                    alert('Followed');
                  }}
                >
                  <div className="text-medium bg-purple-100 w-8 h-8 flex justify-center items-center rounded-full mx-auto">
                    ⭐
                  </div>
                </button>
              </Tooltip>
            </div>
          );

        default:
          return cellValue || <></>;
      }
    },
    [],
  );

  return (
    <Table
      removeWrapper
      aria-label="Example table with custom cells"
      isHeaderSticky
      className="overflow-auto max-h-[70vh]"
      classNames={{ tr: ['hover:bg-sky-200'] }}
      isCompact
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody items={reports} isLoading>
        {(item) => (
          <TableRow
            className="cursor-pointer m-4"
            key={item.id}
            onClick={(evt) => {
              router.push(`/reports/${item.id}`);
            }}
          >
            {(columnKey) => (
              <TableCell>
                {columnKey === 'steps' ? (
                  <Tooltip
                    showArrow
                    content={
                      <div className="flex gap-4">
                        <img
                          src={
                            'https://placehold.co/600x400?text=Your+screenshot+here'
                          }
                          alt="Popover image"
                          width={200}
                          height={200}
                        />
                        <img
                          src={
                            'https://placehold.co/600x400?text=Your+screenshot+here'
                          }
                          alt="Popover image"
                          width={200}
                          height={200}
                        />
                      </div>
                    }
                  >
                    <div>
                      <>{renderCell(item, columnKey)}</>
                    </div>
                  </Tooltip>
                ) : (
                  <div>
                    <>{renderCell(item, columnKey)}</>
                  </div>
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
