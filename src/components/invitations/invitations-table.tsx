'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { isCompany, isEngineer } from '@/helpers';
import type { InvitationWithCampaignAndParties } from '@/types';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  User as NextUIUser,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { InvitationStatus, User, UserType } from '@prisma/client';
import { Key } from '@react-types/shared';

import { columns } from './columns';
import UpdateInvitationStatusForm from './forms/update-invitation-status-form';
import InvitationCard from './invitation-card';
import { Status } from './status';

export default function InvitationsTable({
  invitations,
  user,
}: {
  invitations: InvitationWithCampaignAndParties[];
  user: User;
}) {
  const isEngineerUser = isEngineer(user);
  const isCompanyUser = isCompany(user);
  const INITIAL_VISIBLE_COLUMNS = [
    'name',
    'campaign',
    isEngineerUser ? null : 'invitee',
    'invitor',
    'status',
    'actions',
  ].filter(Boolean);
  const router = useRouter();
  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS as string[]),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column: { uid: Key }) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredInvitations = [...invitations];

    if (hasSearchFilter) {
      filteredInvitations = filteredInvitations.filter((invitation) =>
        invitation.campaignId.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (
      statusFilter !== 'all' &&
      Array.from(invitations).length !== invitations.length
    ) {
      filteredInvitations = filteredInvitations.filter((invitation) =>
        Array.from(statusFilter).includes(invitation.id),
      );
    }

    return filteredInvitations;
  }, [invitations, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort(
      (
        a: InvitationWithCampaignAndParties,
        b: InvitationWithCampaignAndParties,
      ) => {
        const first =
          a[sortDescriptor.column as keyof InvitationWithCampaignAndParties];
        const second =
          b[sortDescriptor.column as keyof InvitationWithCampaignAndParties];
        const cmp = first! < second! ? -1 : first! > second! ? 1 : 0;

        return sortDescriptor.direction === 'descending' ? -cmp : cmp;
      },
    );
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (
      invitation: InvitationWithCampaignAndParties,
      columnKey: keyof InvitationWithCampaignAndParties | 'actions',
    ) => {
      switch (columnKey) {
        case 'invitor':
          return (
            <NextUIUser
              avatarProps={{
                radius: 'lg',
                src: `${invitation?.company?.logo}`,
              }}
              description={invitation?.company.name}
              name={invitation?.company.name}
            >
              {invitation?.company.name}
            </NextUIUser>
          );
        case 'invitee':
          return (
            <NextUIUser
              avatarProps={{
                radius: 'lg',
                src: `${invitation?.[columnKey]?.image}`,
              }}
              description={invitation?.[columnKey]?.name}
              name={invitation?.[columnKey]?.name}
            >
              {invitation?.[columnKey]?.name}
            </NextUIUser>
          );

        case 'campaign':
          return (
            <span>
              {invitation.campaign.name} -{' '}
              {invitation.campaign.startDate.toLocaleDateString('en-GB')}
            </span>
          );
        case 'status':
          return <Status status={invitation.status} />;
        case 'actions': {
          const disabled =
            invitation.status === InvitationStatus.Accepted ||
            invitation.status === InvitationStatus.Rejected ||
            invitation.status === InvitationStatus.Cancelled ||
            invitation.status === InvitationStatus.Revoked;
          return (
            <>
              {isEngineerUser && (
                <div className="flex items-center gap-4 justify-end">
                  <UpdateInvitationStatusForm
                    status={InvitationStatus.Accepted}
                    id={invitation.id}
                    disabled={disabled}
                  />
                  <UpdateInvitationStatusForm
                    status={InvitationStatus.Rejected}
                    id={invitation.id}
                    disabled={disabled}
                  />
                </div>
              )}
              {isCompanyUser && (
                <div className="flex items-center gap-4 justify-end">
                  <UpdateInvitationStatusForm
                    status={InvitationStatus.Cancelled}
                    id={invitation.id}
                    disabled={
                      invitation.status === InvitationStatus.Cancelled ||
                      invitation.status === InvitationStatus.Accepted ||
                      invitation.status === InvitationStatus.Revoked
                    }
                  />
                  <UpdateInvitationStatusForm
                    status={InvitationStatus.Revoked}
                    id={invitation.id}
                    disabled={
                      invitation.status === InvitationStatus.Cancelled ||
                      invitation.status !== InvitationStatus.Accepted
                    }
                  />
                </div>
              )}
            </>
          );
        }
        default:
          return <span>{String(invitation?.[columnKey])}</span>;
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
            placeholder="Search by name..."
            startContent={'🔍'}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={'>'} variant="flat">
                  Campaign
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
                {invitations.map((invitation) => (
                  <DropdownItem
                    key={invitation.campaignId}
                    className="capitalize"
                  >
                    {invitation.campaignId}
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
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {isCompanyUser && (
              <Button as={Link} color="primary" href="/invitations/send">
                Invite users
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {invitations.length} invitations
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
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
    invitations.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400"></span>
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
        aria-label="Invitations table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[382px] p-0 border-8  border-background',
        }}
        selectedKeys={selectedKeys}
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
        <TableBody emptyContent={'No invitation found'} items={sortedItems}>
          {(item) => (
            <TableRow
              key={item.id}
              // className="cursor-pointer"
              // onClick={() => router.push(`/invitations/${item.id}`)}
            >
              {(columnKey) => (
                <TableCell>
                  {renderCell(
                    item,
                    columnKey as keyof InvitationWithCampaignAndParties,
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="md:hidden flex flex-col gap-4 m-2">
        {topContent}
        {sortedItems.map((invitation) => (
          <InvitationCard key={invitation.id} item={invitation} />
        ))}
      </div>
    </div>
  );
}
