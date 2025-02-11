'use client';

import { useEffect } from 'react';

import { linkUserToCompanies } from '@/actions';
import { UserWithCompanies } from '@/types';
import { Button, Select, SelectItem, Tooltip } from '@nextui-org/react';
import { Company } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

const LINK_FORM_ID = 'link-user';
export function LinkUserForm({
  users = [],
  companies = [],
}: {
  users: UserWithCompanies[];
  companies: Company[];
}) {
  const [linkFormState, linkAction] = useFormState(linkUserToCompanies, {
    errors: {},
  });

  useEffect(() => {
    if (linkFormState.success) {
      toast.success(
        `User ${linkFormState.user?.email} linked to ${linkFormState.user?.companies.length} companies \n ${linkFormState.user?.companies.map((company: UserWithCompanies['companies'][number]) => company.name).join(', ')}`,
      );
    }
  }, [linkFormState]);

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <form id={LINK_FORM_ID} action={linkAction}>
        <div className="flex flex-col gap-4 justify-center">
          <Select
            isRequired
            name="id"
            label="User"
            labelPlacement="outside"
            renderValue={(value) => {
              const selectedUser = users.find(
                (user) => user.id === value[0].key,
              );
              return (
                <div className="flex justify-between items-center">
                  {selectedUser?.email}{' '}
                  {(selectedUser?.companies || []).length > 0 && (
                    <Tooltip
                      content={selectedUser?.companies
                        .map((a) => a.name)
                        .join(',')}
                    >
                      ⓘ
                    </Tooltip>
                  )}
                </div>
              );
            }}
          >
            {users.map((user) => {
              return (
                <SelectItem
                  endContent={
                    (user?.companies || []).length > 0 && (
                      <Tooltip
                        content={user?.companies
                          ?.map((company) => company.name)
                          .join(', ')}
                      >
                        <span>ⓘ</span>
                      </Tooltip>
                    )
                  }
                  key={user.id}
                >
                  {user.name}
                </SelectItem>
              );
            })}
          </Select>
          <Select
            name="companyIds"
            label="Companies"
            labelPlacement="outside"
            multiple
          >
            {companies.map((company) => (
              <SelectItem key={company.id}>{company.name}</SelectItem>
            ))}
          </Select>
          <Button type="submit" color="success" form={LINK_FORM_ID}>
            Link user to company
          </Button>
        </div>
      </form>
    </div>
  );
}
