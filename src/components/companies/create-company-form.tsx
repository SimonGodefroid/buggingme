'use client';

import { Key, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { createCompany } from '@/actions';
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Avatar,
  Button,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { Company, IssueTracker } from '@prisma/client';
import debounce from 'lodash.debounce';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

const renderOption = (company: any) => (
  <div className="flex gap-2 items-center">
    <Avatar alt={company?.name} src={company?.logo} size="sm" isBordered />
    <div className="flex flex-col">
      <span>{company?.name}</span>
      <span className="text-tiny text-default-400">{company?.domain}</span>
    </div>
  </div>
);

const CREATE_COMPANY_FORM_ID = 'create-company';
export function CreateCompanyForm() {
  const router = useRouter();
  const [createCompanyFormState, createCompanyAction] = useFormState(
    createCompany,
    {
      errors: {},
    },
  );

  useEffect(() => {
    if (createCompanyFormState.success) {
      toast.success(
        `Company ${createCompanyFormState?.company?.name} has been created`,
      );
      router.push('/companies');
    }
    if (createCompanyFormState.errors._form?.length) {
      toast.error(
        `Something went wrong while creating the company ${createCompanyFormState.errors._form?.join(',')}`,
      );
    }
  }, [createCompanyFormState, router]);

  const [companyData, setCompanyData] = useState<{
    name: string;
    domain: string;
    logo: string;
    issueTracker?: IssueTracker;
  }>({ name: '', domain: '', logo: '' });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<
    {
      name: string;
      domain: string;
      logo: string;
    }[]
  >([]);
  const [inputValue, setInputValue] = useState('');

  const handleSelectionChange = (selectedKey: Key | null) => {
    const selectedSuggestion = suggestions.find(
      (suggestion) => `${suggestion.name}-${suggestion.domain}` === selectedKey,
    );
    if (selectedSuggestion)
      setCompanyData({
        ...selectedSuggestion,
        domain: `https://${selectedSuggestion.domain}`,
      });
  };

  const fetchSuggestions = async (term: string) => {
    if (!term) return setSuggestions([]);
    try {
      setLoading(true);
      const response = await fetch(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${term}`,
      );
      const data = await response.json();
      setSuggestions(data || []);
    } catch (err) {
      toast.error(`Error fetching companies: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 200);

  const handleInputChange = (value: string) => {
    if (!value) {
      setInputValue('');
      setCompanyData({ name: '', domain: '', logo: '' });
    }
    debouncedFetchSuggestions(value);
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <form id={CREATE_COMPANY_FORM_ID} action={createCompanyAction}>
        <div className="flex flex-col gap-4 justify-center">
          <div>
            <Autocomplete
              description={`Search term: ${inputValue}`}
              name="company"
              isLoading={loading}
              classNames={{ listboxWrapper: 'max-h-[320px]' }}
              inputProps={{
                classNames: { input: 'ml-1', inputWrapper: 'h-[60px]' },
              }}
              variant="bordered"
              allowsCustomValue
              onSelectionChange={handleSelectionChange}
              items={suggestions}
              label="Search company"
              placeholder="Select a company"
              onInputChange={handleInputChange}
            >
              <AutocompleteSection title="Suggestions">
                {suggestions.map((suggestion) => (
                  <AutocompleteItem
                    key={`${suggestion.name}-${suggestion.domain}`}
                    textValue={suggestion.name}
                  >
                    {renderOption(suggestion)}
                  </AutocompleteItem>
                ))}
              </AutocompleteSection>
            </Autocomplete>

            <div className="flex flex-col gap-4 pt-4">
              <Input
                name="name"
                isRequired
                label="Company Name"
                value={companyData.name}
                isInvalid={!!createCompanyFormState?.errors.name}
                errorMessage={createCompanyFormState?.errors.name?.join(', ')}
                onValueChange={(value) =>
                  setCompanyData({ ...companyData, name: value })
                }
              />
              <Input
                name="domain"
                isRequired
                isInvalid={!!createCompanyFormState?.errors.domain}
                errorMessage={createCompanyFormState?.errors.domain?.join(', ')}
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
                isInvalid={!!createCompanyFormState?.errors.logo}
                errorMessage={createCompanyFormState?.errors.logo?.join(', ')}
                onValueChange={(value) =>
                  setCompanyData({ ...companyData, logo: value })
                }
              />
              <Select
                label={<div className="mb-4">Issue Tracker</div>}
                name="issueTracker"
                isMultiline
                placeholder="Select issue tracker"
                // selectedKeys={new Set([companyData.issueTracker!])} // Ensure controlled state
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
                <Avatar
                  alt={companyData?.name}
                  src={companyData?.logo}
                  name={companyData?.name}
                  size="sm"
                  isBordered
                />
                <div className="flex flex-col">
                  <span>{companyData?.name}</span>
                  <span className="text-tiny text-default-400">
                    {companyData?.domain}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex p-4">
              <code>{JSON.stringify(companyData)}</code>
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              color="primary"
              variant="bordered"
              onClick={() => router.push(`/`)}
            >
              Cancel
            </Button>
            <Button type="submit" color="success" form={CREATE_COMPANY_FORM_ID}>
              Create company
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
