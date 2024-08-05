'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { pascalToSentenceCase } from '@/helpers/strings/pascalToSentenceCase';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from '@nextui-org/react';
import { ReportStatus } from '@prisma/client';
import { Key } from '@react-types/shared';

import { ReportWithTags } from '@/app/reports/[reportId]/page';

import { columns } from '../reports/data';
import { ImpactChip } from './impact';
import { SeverityChip } from './severity';
import { Status } from './status';
import { TagChip } from './tag';

const INITIAL_VISIBLE_COLUMNS = [
  'title',
  'company',
  'status',
  'user',
  'tags',
  'severity',
  'impact',
  'createdAt',
  'actions',
];

export default function ReportsTable({
  reports,
}: {
  reports: ReportWithTags[];
}) {
  const router = useRouter();
  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<
    Selection | ReportStatus
  >('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'createdAt',
    direction: 'descending',
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column: (typeof columns)[number]) =>
      Array.from(visibleColumns).includes(column.uid as Key),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredReports = [...reports];

    if (hasSearchFilter) {
      filteredReports = filteredReports.filter((report) =>
        report.title.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== Object.keys(ReportStatus).length
    ) {
      filteredReports = filteredReports.filter((report) =>
        Array.from(statusFilter).includes(report.status),
      );
    }

    return filteredReports;
  }, [reports, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: ReportWithTags, b: ReportWithTags) => {
      const first = a?.[sortDescriptor?.column as keyof ReportWithTags];
      const second = b?.[sortDescriptor?.column as keyof ReportWithTags];
      const cmp = first! < second! ? -1 : first! > second! ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (report: ReportWithTags, columnKey: React.Key) => {
      const cellValue = report[columnKey as keyof ReportWithTags];
      switch (columnKey) {
        case 'company':
          return (
            <User
              avatarProps={{
                radius: 'lg',
                src: `${report?.company?.logo}` || '',
              }}
              description={report.company?.domain}
              name={report?.company?.name}
            >
              {report?.company?.name}
            </User>
          );
        case 'title':
          return (
            <Tooltip content={<pre></pre>}>
              <div className="flex flex-col">
                <p className="text-bold text-small capitalize">
                  {report.title}
                </p>
              </div>
            </Tooltip>
          );
        case 'url':
          return (
            <a href={`https://${report.url}`} target="_blank" rel="noreferrer">
              {report.url}
            </a>
          );
        case 'createdAt':
          return (
            <Chip color="default" size="sm">
              {new Date(report.createdAt).toISOString()}
            </Chip>
          );
        case 'steps':
          return (
            <div>
              <p>{report.steps}</p>
            </div>
          );
        case 'severity':
          return <SeverityChip severity={report.severity} />;
        case 'impact':
          return (
            <div>
              <ImpactChip impact={report.impact} />
            </div>
          );
        case 'tags':
          return (
            <div className="flex flex-col gap-4">
              {report.tags.map((tag) => (
                <TagChip key={tag.id} tag={tag} />
              ))}
            </div>
          );
        case 'status':
          return <Status status={report.status} />;
        case 'actions':
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Button>View</Button>
              <Button>Edit</Button>
              <Button>Delete</Button>
            </div>
          );
        // default:
        //   return <>{cellValue}</>;
      }
    },
    [],
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by keywords..."
            startContent={'🔍'}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={'>'} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {Object.keys(ReportStatus).map((status: string) => (
                  <DropdownItem key={status} className="capitalize">
                    {pascalToSentenceCase(status)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={'>'} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column: (typeof columns)[number]) => {
                  return (
                    <DropdownItem key={column.uid} className="capitalize">
                      {column.name}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
            {/* <Button color="primary" endContent={'+'}>
              Add New
            </Button> */}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {reports.length} reports
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    reports.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400" />
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      aria-label="Reports table"
      isHeaderSticky
      isStriped
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[382px]',
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column: any) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No reports found'} items={sortedItems}>
        {(item) => (
          <TableRow
            key={item.id}
            className="cursor-pointer"
            onClick={() => router.push(`/reports/${item.id}`)}
          >
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
