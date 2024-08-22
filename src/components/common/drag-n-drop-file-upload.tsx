'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

import { uploadAttachments } from '@/actions';
import { convertBytesToReadable } from '@/helpers';
import { ReportWithTags } from '@/types';
import { Button } from '@nextui-org/react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

const styles: { [key: string]: React.CSSProperties } = {
  base: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    maxHeight: '100px',
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
    width: 'auto',
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

interface DragNDropFileUploadProps {
  setImages: Dispatch<SetStateAction<{ url: string; filename: string }[]>>;
  images: { url: string; filename: string }[];
  report?: ReportWithTags;
  mode?: 'update' | 'creation';
}

export const DragNDropFileUpload: React.FC<DragNDropFileUploadProps> = ({
  report,
  mode = 'update',
  setImages,
  images,
}) => {
  interface FileWithPreview extends File {
    preview: string;
  }
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const attachmentsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Update the hidden input value whenever images change
    if (attachmentsInputRef.current) {
      attachmentsInputRef.current.value = JSON.stringify(
        images?.map((img) => img),
      );
    }
  }, [images]);

  const handleUpload = async () => {
    const form = new FormData();
    const attachments = files.map((file) => ({
      url: '', // URL will be set after upload
      filename: file.name,
      rawData: file, // Attach the raw file data
    }));

    files.forEach((file) => {
      form.append('fileUpload', file, file.name);
    });
    form.append('attachments', JSON.stringify(attachments)); // Attachments as JSON
    setUploading(true);
    startTransition(async () => {
      try {
        const { success, uploadedImages } = await uploadAttachments({
          id: report?.id!,
          form,
        });

        if (success) {
          setImages((prev) => [...prev, ...uploadedImages]);
          setFiles([]);
        }
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      } finally {
        setUploading(false);
      }
    });
  };

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { 'image/*': [] },
      maxSize: 10485760,
      onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        const mappedFiles = acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) }),
        );
        setFiles((prevFiles) => [...prevFiles, ...mappedFiles]);
      },
    });

  const style = useMemo(
    () => ({
      ...styles.base,
      ...(isFocused ? styles.focused : {}),
      ...(isDragAccept ? styles.accept : {}),
      ...(isDragReject ? styles.reject : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  const fileList = files.map((file) => (
    <li key={file.name}>
      <div className="flex gap-4 mt-4 items-center">
        <div className="flex">
          {file.name} - {`${convertBytesToReadable(file.size)}`}
        </div>
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

  const thumbs = files.map((file) => (
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
        <p>
          Drop files <strong>here</strong> or{' '}
          <strong style={{ cursor: 'pointer' }}>click</strong> to select files
        </p>
      </div>
      <aside style={styles.thumbsContainer}>{thumbs}</aside>
      <aside>
        <ul>{fileList}</ul>
      </aside>
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
      <input type="hidden" name="attachments" ref={attachmentsInputRef} />
    </section>
  );
};
