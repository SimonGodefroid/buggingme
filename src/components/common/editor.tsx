'use client';

import { useState } from 'react';

import { Editor } from '@monaco-editor/react';

import { LanguagePicker } from './language-picker';

export default function EditorClient() {
  const [code, setCode] = useState("// coucou c'est pour du js");
  const [language, setLanguage] = useState('javascript');
  const handleEditorChange = (value: string = '') => {
    setCode(value);
  };
  return (
    <div className="flex flex-col gap-4">
      <input hidden name="snippets" value={code} />
      <input hidden name="language" value={language} />
      <LanguagePicker setLanguage={setLanguage} language={language} />
      <Editor
        height="20vh"
        theme="vs-dark"
        defaultValue={code}
        language={language}
        options={{ minimap: { enabled: false } }}
        onChange={handleEditorChange}
      />
    </div>
  );
}
