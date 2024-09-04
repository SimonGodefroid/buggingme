'use client';

import { useState } from 'react';

import { Editor } from '@monaco-editor/react';

import { LanguagePicker } from './language-picker';

export const EditorClient = ({
  readOnly = false,
  snippets,
}: {
  readOnly?: boolean;
  snippets?: string | null;
}) => {
  const [code, setCode] = useState(
    snippets ?? '// type something helpful here',
  );
  const [language, setLanguage] = useState('javascript');
  const handleEditorChange = (value: string = '') => {
    setCode(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <textarea hidden name="snippets" value={code} readOnly />
      <input hidden name="language" value={language} readOnly />
      <LanguagePicker
        setLanguage={setLanguage}
        language={language}
        readOnly={readOnly}
      />
      <Editor
        className="py-4 bg-[rgb(28,28,28)] rounded-lg"
        wrapperProps={{ className: '' }}
        height="20vh"
        theme="vs-dark"
        defaultValue={code}
        language={language}
        options={{
          minimap: { enabled: false },
          wordWrap: 'wordWrapColumn',
          wordWrapColumn: 80,
          readOnly,
          formatOnPaste: true,
          formatOnType: true,
        }}
        onChange={handleEditorChange}
      />
    </div>
  );
};
