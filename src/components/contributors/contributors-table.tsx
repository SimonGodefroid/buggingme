'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { ContributorWithReports } from '@/types';
import {
  Button,
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
  User,
} from '@nextui-org/react';
import { Key } from '@react-types/shared';

import { columns } from '../contributors/data';
import ContributorCard from './contributor-card';

const INITIAL_VISIBLE_COLUMNS = ['name', 'reports', 'reputation'];

export default function ContributorsTable({
  contributors,
  withEmail = false,
}: {
  contributors: ContributorWithReports[];
  withEmail?: boolean;
}) {
  const router = useRouter();
  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
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
    let filteredContributors = [...contributors];

    if (hasSearchFilter) {
      filteredContributors = filteredContributors.filter(
        (contributor: ContributorWithReports) =>
          contributor?.name?.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredContributors;
  }, [contributors, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort(
      (a: ContributorWithReports, b: ContributorWithReports) => {
        const first =
          a?.[sortDescriptor?.column as keyof ContributorWithReports];
        const second =
          b?.[sortDescriptor?.column as keyof ContributorWithReports];
        const cmp = first! < second! ? -1 : first! > second! ? 1 : 0;

        return sortDescriptor.direction === 'descending' ? -cmp : cmp;
      },
    );
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (contributor: ContributorWithReports, columnKey: React.Key) => {
      // const cellValue = contributor[columnKey as keyof ContributorWithReports];
      switch (columnKey) {
        case 'name':
          return (
            <User
              avatarProps={{
                radius: 'lg',
                src: `${contributor?.image}` || '',
              }}
              description={withEmail ? contributor.email : undefined}
              name={contributor?.name}
            >
              {contributor?.name}
            </User>
          );
        case 'reputation':
          return <span>{contributor?.reputation} </span>;
        case 'reports':
          return <span>{contributor?.Report?.length} </span>;
        default:
          return (
            <>
              {typeof contributor?.[
                columnKey as keyof ContributorWithReports
              ] === 'string'
                ? contributor?.[columnKey as keyof ContributorWithReports]
                : '-'}
            </>
          );
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
            Total {contributors.length} contributors
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
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    contributors.length,
    hasSearchFilter,
    onClear,
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
    <div className="md:mx-4">
      <Table
        className="hidden md:flex"
        aria-label="Contributors table"
        isHeaderSticky
        isStriped
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[70vh] p-0 m-0 border-8 border-background',
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
              align={column.uid === 'actions' ? 'end' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={'No contributors found'} items={sortedItems}>
          {(item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer"
              onClick={(evt) => {
                router.push(`/contributors/${item.id}`);
              }}
            >
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="md:hidden flex flex-col gap-4 m-2">
        {topContent}
        {sortedItems.map((contributor) => (
          <ContributorCard key={contributor.id} item={contributor} />
        ))}
      </div>
    </div>
  );
}
