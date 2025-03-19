'use client';

import { useEffect, useState } from 'react';

import { Issue } from 'next/dist/build/swc';
import { useRouter } from 'next/navigation';

import { updateCompany } from '@/actions';
import { Avatar, Button, Input, Select, SelectItem } from '@nextui-org/react';
import { Company, IssueTracker } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import CompanyBadge from './company-badge';
import CompanyCard from './company-card';

const UPDATE_COMPANY_FORM_ID = 'update-company';
export function UpdateCompanyForm({ company }: { company: Company }) {
  const router = useRouter();
  const [updateCompanyFormState, updateCompanyAction] = useFormState(
    updateCompany.bind(null, { companyId: company.id }),
    {
      errors: {},
    },
  );

  useEffect(() => {
    if (updateCompanyFormState.success) {
      toast.success(
        `Company ${updateCompanyFormState?.company?.name} has been updated`,
      );
      router.push(`/companies/${company.id}`);
    }
    if (updateCompanyFormState.errors._form?.length) {
      toast.error(
        `Something went wrong while udpating the company ${updateCompanyFormState.errors._form?.join(',')}`,
      );
    }
  }, [updateCompanyFormState, router]);

  const [companyData, setCompanyData] = useState<{
    name: string;
    domain: string;
    logo: string;
    issueTracker: IssueTracker;
  }>({
    name: `${company.name}`,
    domain: `${company.domain}`,
    logo: `${company.logo}`,
    issueTracker: `${company.issueTracker}` as IssueTracker,
  });

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <form id={UPDATE_COMPANY_FORM_ID} action={updateCompanyAction}>
        <div className="flex flex-col gap-4 justify-center">
          <div>
            <div className="flex flex-col gap-4 pt-4">
              <Input
                name="name"
                isRequired
                label="Company Name"
                value={companyData.name}
                defaultValue={company.name}
                isInvalid={!!updateCompanyFormState?.errors.name}
                errorMessage={updateCompanyFormState?.errors.name?.join(', ')}
                onValueChange={(value) =>
                  setCompanyData({ ...companyData, name: value })
                }
              />
              <Input
                name="domain"
                isRequired
                isInvalid={!!updateCompanyFormState?.errors.domain}
                errorMessage={updateCompanyFormState?.errors.domain?.join(', ')}
                value={companyData.domain}
                label="Company Domain"
                onValueChange={(value) =>
                  setCompanyData({ ...companyData, domain: value })
                }
              />

              <Input
                name="logo"
                label="Company Logo"
                value={companyData.logo}
                isInvalid={!!updateCompanyFormState?.errors.logo}
                errorMessage={updateCompanyFormState?.errors.logo?.join(', ')}
                onValueChange={(value) =>
                  setCompanyData({ ...companyData, logo: value })
                }
              />
              <Select
                label={<div className="mb-4">Issue Tracker</div>}
                name="issueTracker"
                isMultiline
                placeholder="Select issue tracker"
                selectedKeys={new Set([companyData.issueTracker])} // Ensure controlled state
                onSelectionChange={(value) => {
                  const selectedValue = Array.from(value)[0] as IssueTracker;
                  setCompanyData({
                    ...companyData,
                    issueTracker: selectedValue,
                  });
                }}
              >
                {Object.values(IssueTracker).map((issueTracker) => (
                  <SelectItem key={issueTracker} value={issueTracker}>
                    {issueTracker}
                  </SelectItem>
                ))}
              </Select>
              <div className="flex gap-2 items-center">
                <CompanyBadge company={companyData as Company} />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              color="primary"
              variant="bordered"
              onClick={() => router.push(`/companies/${company.id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" color="success" form={UPDATE_COMPANY_FORM_ID}>
              Update company
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
