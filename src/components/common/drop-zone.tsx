'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@nextui-org/react';

export const FileUpload = ({
  imageUrl,
  setImageUrl,
}: {
  imageUrl: string;
  setImageUrl: Dispatch<SetStateAction<string>>;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select a file to upload.');
      return;
    }

    setUploading(true);

    for (const file of files) {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + '/api/upload',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        }
      );

      if (response.ok) {
        const { url, fields } = await response.json();

        const formData = new FormData();

        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });

        formData.append('file', file);

        const uploadResponse = await fetch(url, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const bucketImageUrl = uploadResponse.headers.get('Location') || '';
          setImageUrl(bucketImageUrl);
          alert('Upload successful!');
        } else {
          console.error('S3 Upload Error:', uploadResponse);
          alert('Upload failed.');
        }
      } else {
        alert('Failed to get pre-signed URL.');
      }
    }

    setUploading(false);
    setFiles([]); // Clear files after upload
  };

  const removeFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  const fileList = files.map(file => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
      <button onClick={() => removeFile(file.name)}>Remove</button>
    </li>
  ));

  return (
    <section className="container rounded p-4 bg-white">
      <h1>Upload a File to S3</h1>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drop files here or click to select files</p>
      </div>
      <aside>
        <ul>{fileList}</ul>
      </aside>
      <Button type="button" onClick={handleUpload} disabled={uploading}>
        Upload
      </Button>
    </section>
  );
};