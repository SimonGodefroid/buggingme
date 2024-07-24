'use client';

import { useState } from 'react';

import { Editor } from '@monaco-editor/react';

import { LanguagePicker } from './language-picker';

export const EditorClient = ({ readOnly = false }: { readOnly?: boolean }) => {
  const [code, setCode] = useState("// coucou c'est pour du js");
  const [language, setLanguage] = useState('javascript');
  const handleEditorChange = (value: string = '') => {
    setCode(value);
  };
  return (
    <div className="flex flex-col gap-4">
      <input hidden name="snippets" value={code} readOnly />
      <input hidden name="language" value={language} readOnly />
      <LanguagePicker
        setLanguage={setLanguage}
        language={language}
        readOnly={readOnly}
      />
      <Editor
        height="20vh"
        theme="vs-dark"
        defaultValue={code}
        language={language}
        options={{ minimap: { enabled: false }, readOnly }}
        onChange={handleEditorChange}
      />
    </div>
  );
};
