'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';

import { Button } from '@nextui-org/react';
import { useDropzone } from 'react-dropzone';

export const DragNDropFileUpload = ({
  setImages,
}: {
  setImages: Dispatch<SetStateAction<{ id: number; url: string }[]>>;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
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
        },
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
          // setImageUrl(bucketImageUrl);
          console.log('bucketImageUrl', bucketImageUrl);
          setImages((prevImages) => {
            console.log('prevImages', prevImages);
            const images = [
              ...prevImages,
              { id: prevImages.length + 1, url: bucketImageUrl },
            ];
            return images;
          });
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
  };

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const fileList = files.map((file) => (
    <li key={file.name}>
      <div className="flex gap-4 mt-4 items-center">
        <div className="flex">
          {file.name} - {file.size} bytes
        </div>
        <div className="flex">
          <Button
            type="button"
            variant="bordered"
            size="sm"
            onClick={() => removeFile(file.name)}
          >
            {`Remove`}
          </Button>
        </div>
      </div>
    </li>
  ));

  return (
    <section className="container flex flex-col gap-2 rounded p-4 bg-white">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>
          Drop files <strong>here</strong> or{' '}
          <strong style={{ cursor: 'pointer' }}>click</strong> to select files
        </p>
      </div>
      <aside>
        <ul>{fileList}</ul>
      </aside>
      <Button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
        color="secondary"
        variant="light"
      >
        Upload
      </Button>
    </section>
  );
};
