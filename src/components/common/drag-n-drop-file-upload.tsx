'use client';

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Button } from '@nextui-org/react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { toast } from 'react-toastify';

const styles: { [key: string]: React.CSSProperties } = {
  base: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  },
  focused: {
    borderColor: '#2196f3',
  },
  accept: {
    borderColor: '#00e676',
  },
  reject: {
    borderColor: '#ff1744',
  },
  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box',
  },
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
  },
  img: {
    display: 'block',
    width: 'auto',
    height: '100%',
  },
};

interface Image {
  id: number;
  url: string;
}

interface DragNDropFileUploadProps {
  setImages: Dispatch<SetStateAction<Image[]>>;
}

export const DragNDropFileUpload: React.FC<DragNDropFileUploadProps> = ({
  setImages,
}) => {
  interface FileWithPreview extends File {
    preview: string;
  }
  
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select a file to upload.');
      return;
    }

    setUploading(true);

    await Promise.all(files.map(async (file) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, contentType: file.type }),
          }
        );

        if (response.ok) {
          const { url, fields } = await response.json();
          const formData = new FormData();
          Object.entries(fields).forEach(([key, value]) => formData.append(key, value as string));
          formData.append('file', file);

          const uploadResponse = await fetch(url, { method: 'POST', body: formData });

          if (uploadResponse.ok) {
            const bucketImageUrl = uploadResponse.headers.get('Location') || '';
            setImages(prevImages => [...prevImages, { id: prevImages.length + 1, url: bucketImageUrl }]);
            toast.success('Upload successful!');
          } else {
            console.error('S3 Upload Error:', uploadResponse);
            alert('Upload failed.');
          }
        } else {
          alert('Failed to get pre-signed URL.');
        }
      } catch (error) {
        console.error('Upload Error:', error);
        alert('Upload failed.');
      }
    }));
    setFiles([]);
    setUploading(false);
  };

  const removeFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: { 'image/*': [] },
    maxSize: 10485760,
    onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const mappedFiles = acceptedFiles.map(file =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setFiles(prevFiles => [...prevFiles, ...mappedFiles]);
    },
  });

  const style = useMemo(
    () => ({
      ...styles.base,
      ...(isFocused ? styles.focused : {}),
      ...(isDragAccept ? styles.accept : {}),
      ...(isDragReject ? styles.reject : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const fileList = files.map(file => (
    <li key={file.name}>
      <div className="flex gap-4 mt-4 items-center">
        <div className="flex">{file.name} - {file.size} bytes</div>
        <Button
          type="button"
          variant="bordered"
          size="sm"
          onClick={() => removeFile(file.name)}
        >
          Remove
        </Button>
      </div>
    </li>
  ));

  const thumbs = files.map(file => (
    <div style={styles.thumb} key={file.name}>
      <div style={styles.thumbInner}>
        <img
          src={file.preview}
          style={styles.img}
          onLoad={() => URL.revokeObjectURL(file.preview)}
        />
      </div>
    </div>
  ));

  return (
    <section className="container flex flex-col gap-2 h-full">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drop files <strong>here</strong> or <strong style={{ cursor: 'pointer' }}>click</strong> to select files</p>
      </div>
      <aside style={styles.thumbsContainer}>{thumbs}</aside>
      <aside><ul>{fileList}</ul></aside>
      {files.length > 0 && (
        <Button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          isLoading={uploading}
          color="secondary"
          variant="ghost"
        >
          Upload
        </Button>
      )}
    </section>
  );
};