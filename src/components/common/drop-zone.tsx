'use client';

import React from 'react';

import { useDropzone } from 'react-dropzone';

export const DropzoneClient = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map((file: File) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container rounded p-4 bg-white">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drop files here or click to select files</p>
      </div>
      <aside>
        <ul>{files}</ul>
      </aside>
    </section>
  );
};
