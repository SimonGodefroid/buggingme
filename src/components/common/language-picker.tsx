'use client';

import { useMemo } from 'react';

import { useMonaco } from '@monaco-editor/react';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';

export const LanguagePicker = ({
  setLanguage,
  language,
}: {
  setLanguage: Function;
  language: string;
}) => {
  const monaco = useMonaco();
  const LANGUAGES = useMemo(() => {
    return monaco?.languages
      .getLanguages()
      .sort((a, b) => (a.id < b.id ? -1 : 1));
  }, [monaco]);

  return (
    <Autocomplete
      label="Select a language"
      className="max-w-fit"
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
