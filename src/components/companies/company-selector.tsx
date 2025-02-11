'use client';

import React, { Key, useEffect, useState } from 'react';

import { fetchAllCompanies } from '@/actions';
import { ReportWithTags } from '@/types';
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Avatar,
} from '@nextui-org/react';
import { Campaign, Company } from '@prisma/client';
import debounce from 'lodash.debounce';
import differenceby from 'lodash.differenceby';
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

type CompanySuggestion = {
  name: string;
  domain: string;
  logo: string;
};

export default function CompanySelector({
  mode,
  report,
  errors,
  selectedCompanyId,
  selectedCampaign,
}: {
  mode: 'view' | 'update' | 'creation';
  report?: ReportWithTags;
  errors?: string[];
  selectedCompanyId?: string;
  selectedCampaign?: Campaign;
}) {
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
  const [companyData, setCompanyData] = useState<
    { id: string } | CompanySuggestion | null
  >();
  const [loading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CompanySuggestion[] | []>([]);
  const [inputValue, setInputValue] = useState<string>('');
  useEffect(() => {
    if (selectedCompanyId) {
      setCompanyData({ id: selectedCompanyId });
    }
  }, [selectedCompanyId]);
  const handleSelectionChange = (selectedKey: Key | null) => {
    if (!selectedKey) {
      setCompanyData({ name: inputValue, domain: '', logo: '' });
    } else {
      const id = `${selectedKey}`.split(`company#`)[1];
      if (id) {
        const selectedCompany = companies.find((company) => company.id === id);
        if (selectedCompany) setCompanyData({ id: selectedCompany.id });
      } else {
        const selectedSuggestion = suggestions.find(
          (suggestion) => suggestion.name === selectedKey,
        );
        if (selectedSuggestion)
          setCompanyData({
            name: selectedSuggestion.name,
            logo: selectedSuggestion.logo,
            domain: selectedSuggestion.domain,
          });
      }
    }
  };

  const handleInputChange = (value: string) => {
    // if the search input is cleared
    if (!value) {
      // we reset the company data
      setCompanyData(null);
    } else {
      // otherwise we just record the search input value...
      setInputValue(value);
      // and trigger the call to suggestions
      debouncedFetchSuggestions(value);
    }
  };

  // Fetch suggestions from clearbit on input change
  const fetchSuggestions = async (term: string): Promise<void> => {
    if (!term) {
      setSuggestions([]); // Reset if the input is cleared
      return;
    }

    let candidateCompanies: CompanySuggestion[] = [];

    try {
      setIsLoading(true);
      candidateCompanies = await fetch(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${term}`,
      ).then((res) => res.json());

      const filteredSuggestions = differenceby(
        candidateCompanies,
        companies,
        'name',
      );
      setSuggestions(filteredSuggestions || []);
      setIsLoading(false);
    } catch (err) {
      toast.error(
        `Something went wrong while fetching candidate companies ${(err as Error).message}`,
      );
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 200);

  if (report && mode !== 'creation') {
    return (
      <div className="flex border-2 bg-foreground-100 rounded-xl p-4 w-full">
        <a
          href={`${report?.company?.domain || `example.com`}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {renderOption(report?.company)}
        </a>
      </div>
    );
  }

  return (
    <div className="">
      <Autocomplete
        name="company"
        isRequired
        isDisabled={!!selectedCampaign || !!selectedCompanyId}
        isInvalid={!!errors?.length}
        errorMessage={errors?.join(', ')}
        isLoading={loading}
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
        allowsCustomValue
        description={
          selectedCampaign
            ? 'You selected a Campaign so the company is set automtically'
            : ''
        }
        onSelectionChange={handleSelectionChange}
        items={suggestions}
        selectedKey={
          selectedCompanyId ? `company#${selectedCompanyId}` : undefined
        }
        label="Pick a company"
        placeholder="Select a company"
        onInputChange={handleInputChange}
      >
        <AutocompleteSection title="existing companies" showDivider>
          {companies.map((company: any) => (
            <AutocompleteItem
              key={`company#${company.id}`}
              textValue={company.name}
            >
              {renderOption(company)}
            </AutocompleteItem>
          ))}
        </AutocompleteSection>
        <AutocompleteSection title="suggestions">
          {suggestions.map((suggestion) => {
            return (
              <AutocompleteItem
                key={`${suggestion.name}-${suggestion.domain}`}
                textValue={suggestion.name}
              >
                {renderOption(suggestion)}
              </AutocompleteItem>
            );
          })}
        </AutocompleteSection>
      </Autocomplete>
      {companyData && 'id' in companyData ? (
        <input
          name="companyId"
          value={companyData?.id || undefined}
          hidden
          onChange={noop}
        />
      ) : (
        <>
          <input
            name="companyName"
            value={companyData?.name || inputValue}
            hidden
            onChange={noop}
          />
          <input
            name="companyDomain"
            value={companyData?.domain?.toString()}
            hidden
            onChange={noop}
          />
          <input
            name="companyLogo"
            value={companyData?.logo?.toString()}
            hidden
            onChange={noop}
          />
        </>
      )}
    </div>
  );
}
