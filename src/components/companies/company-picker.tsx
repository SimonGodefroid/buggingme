'use client';

import React, { Key, useEffect, useState } from 'react';

import { fetchAllCompanies } from '@/actions';
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Avatar,
} from '@nextui-org/react';
import { Company } from '@prisma/client';
import { toast } from 'react-toastify';

const noop = () => {};
const renderOption = (company: any) => {
  return (
    <div className="flex gap-2 items-center">
      <Avatar alt={company?.name} src={company?.logo} size="sm" isBordered />
      <div className="flex flex-col">
        <span>{company?.name}</span>
        <span className="text-tiny text-default-400">{company?.domain}</span>
      </div>
    </div>
  );
};

export default function CompanyPicker() {
  const [companies, setCompanies] = useState<Company[] | []>([]);
  
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const allCompanies = await fetchAllCompanies();
        setCompanies(allCompanies);
      } catch (error: unknown) {
        let message = 'Failed to load companies';
        if (error instanceof Error) {
          message += ` ${error.message}`;
        }
        toast.error(message);
      }
    };
    loadCompanies();
  }, []);
  const [companyId, setCompanyId] = useState<string>();
  const handleSelectionChange = (selectedKey: Key | null) => {
    if (selectedKey) setCompanyId(selectedKey as string);
  };

  const selectedCompanyId = companies.filter((c) => c.id === companyId)?.[0]
    ?.id;

  return (
    <div className="">
      <Autocomplete
        name="company"
        isRequired
        value={companyId}
        classNames={{
          listboxWrapper: 'max-h-[320px]',
          selectorButton: 'text-default-500',
        }}
        inputProps={{
          classNames: {
            input: 'ml-1',
            inputWrapper: 'h-[60px] bg-background',
            label: 'mb-2',
          },
        }}
        variant="bordered"
        onSelectionChange={handleSelectionChange}
        selectedKey={companyId ? `${selectedCompanyId}` : undefined}
        defaultItems={companies}
        label="Pick a company"
        placeholder="Select a company"
      >
        <AutocompleteSection title="existing companies" showDivider>
          {companies.map((company: any) => (
            <AutocompleteItem key={company.id} textValue={company.name}>
              {renderOption(company)}
            </AutocompleteItem>
          ))}
        </AutocompleteSection>
      </Autocomplete>
      <input name="companyId" value={companyId} hidden onChange={noop} />
    </div>
  );
}
