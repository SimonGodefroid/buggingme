'use client';

import { useMemo } from 'react';

import { useMonaco } from '@monaco-editor/react';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';

export const LanguagePicker = ({
  setLanguage,
  language,
  readOnly = false,
}: {
  setLanguage: Function;
  language: string;
  readOnly?: boolean;
}) => {
  const monaco = useMonaco();
  const LANGUAGES = useMemo(() => {
    return monaco?.languages
      .getLanguages()
      .sort((a, b) => (a.id < b.id ? -1 : 1));
  }, [monaco]);

  return (
    <Autocomplete
      label={readOnly ? 'Language' : 'Select a language'}
      size="sm"
      isDisabled={readOnly}
      labelPlacement="outside-left"
      color="success"
      className="max-w-fit text-green-300"
      selectedKey={language}
      onSelectionChange={(value) => {
        setLanguage(value);
      }}
    >
      {(LANGUAGES || []).map((lg) => (
        <AutocompleteItem key={lg.id} value={lg.id}>
          {lg.id}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};
