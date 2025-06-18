'use client';

import React, {
  Dispatch,
  SetStateAction,
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
import { MarkerArea } from 'markerjs2';
import { v4 as uuidv4 } from 'uuid';

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

interface FileWithPreview extends File {
  preview: string;
  _id: string;
}

export const DragNDropFileUpload: React.FC<DragNDropFileUploadProps> = ({
  report,
  mode = 'update',
  setImages,
  images,
}) => {
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const attachmentsInputRef = useRef<HTMLInputElement>(null);
  const imgRefs = useRef<Record<string, HTMLImageElement | null>>({});
  const currentMarkerRef = useRef<MarkerArea | null>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = item.getAsFile();
        
        if (blob) {
          // Create a File object with a generated name
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const fileName = `clipboard-image-${timestamp}.png`;
          
          const file = new File([blob], fileName, { type: blob.type }) as FileWithPreview;
          const id = uuidv4();
          
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            _id: id,
          });

          setFiles((prevFiles) => [...prevFiles, file]);
          toast.success('Image pasted from clipboard!');
        }
        break;
      }
    }
  };

  useEffect(() => {
    const dropzone = dropzoneRef.current;
    if (dropzone) {
      dropzone.addEventListener('paste', handlePaste);
      return () => dropzone.removeEventListener('paste', handlePaste);
    }
  }, []);

  useEffect(() => {
    if (attachmentsInputRef.current) {
      attachmentsInputRef.current.value = JSON.stringify(images);
    }
  }, [images]);

  const handleUpload = async () => {
    const form = new FormData();
    files.forEach((file) => {
      form.append('fileUpload', file, file.name);
    });
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

  const removeFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
  };

  const dataURLtoBlob = (dataUrl: string): Blob => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const cleanupPreviousMarker = () => {
    if (currentMarkerRef.current) {
      try {
        currentMarkerRef.current.close();
      } catch (e) {
        // Ignore errors when closing
      }
      currentMarkerRef.current = null;
    }
    
    // Clean up any orphaned marker elements
    const existingMarkers = document.querySelectorAll('[data-markerjs]');
    existingMarkers.forEach(el => el.remove());
    
    // Clean up any hidden images we might have added
    const hiddenImages = document.querySelectorAll('img[style*="-9999px"]');
    hiddenImages.forEach(img => img.remove());
  };

  const annotateImage = async (file: FileWithPreview) => {
    if (isAnnotating) {
      toast.info('Please finish the current annotation before starting a new one');
      return;
    }

    setIsAnnotating(true);
    cleanupPreviousMarker();

    try {
      // Read file as data URL directly to avoid blob URL issues
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const img = new Image();
      img.src = dataUrl;
      
      img.onload = () => {
        // Add to DOM temporarily for MarkerJS2
        document.body.appendChild(img);
        img.style.position = 'absolute';
        img.style.top = '-9999px';
        img.style.left = '-9999px';
        img.style.visibility = 'hidden';
        
        runMarker(img, file);
      };

      img.onerror = (e) => {
        toast.error('Failed to load image for annotation');
        setIsAnnotating(false);
      };
    } catch (error) {
      toast.error('Failed to read file for annotation');
      setIsAnnotating(false);
    }
  };

  const runMarker = (img: HTMLImageElement, file: FileWithPreview) => {
    try {
      const markerArea = new MarkerArea(img);
      currentMarkerRef.current = markerArea;
      
      markerArea.settings.displayMode = 'popup';

      markerArea.addEventListener('render', (event) => {
        const dataUrl = event.dataUrl;
        const newFile = new File([dataURLtoBlob(dataUrl)], file.name, {
          type: file.type,
        }) as FileWithPreview;

        Object.assign(newFile, {
          preview: dataUrl,
          _id: file._id,
        });

        setFiles((prevFiles) =>
          prevFiles.map((f) => (f._id === file._id ? newFile : f))
        );

        // Cleanup
        img.remove();
        currentMarkerRef.current = null;
        setIsAnnotating(false);
      });

      markerArea.addEventListener('close', () => {
        // Cleanup if user closes without saving
        img.remove();
        currentMarkerRef.current = null;
        setIsAnnotating(false);
      });

      markerArea.show();
    } catch (error) {
      console.error('MarkerJS2 error:', error);
      toast.error('Failed to initialize annotation tool');
      img.remove();
      currentMarkerRef.current = null;
      setIsAnnotating(false);
    }
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      cleanupPreviousMarker();
    };
  }, [files]);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { 'image/*': [] },
      maxSize: 10485760,
      onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        const mappedFiles = acceptedFiles.map((file) => {
          const id = uuidv4();
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
            _id: id,
          });
        });
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
    [isFocused, isDragAccept, isDragReject]
  );

  const fileList = files.map((file) => (
    <li key={file._id}>
      <div className="flex gap-4 mt-4 items-center">
        <div className="flex">
          {file.name} - {`${convertBytesToReadable(file.size)}`}
        </div>
        <Button
          type="button"
          variant="flat"
          size="sm"
          onClick={() => annotateImage(file)}
          disabled={isAnnotating}
        >
          {isAnnotating ? 'Annotating...' : 'Annotate'}
        </Button>
        <Button
          type="button"
          variant="bordered"
          size="sm"
          onClick={() => removeFile(file._id)}
        >
          Remove
        </Button>
      </div>
    </li>
  ));

  const thumbs = files.map((file) => (
    <div style={styles.thumb} key={file._id}>
      <div style={styles.thumbInner}>
        <img
           ref={(el) => {
            if (el) {
              imgRefs.current[file._id] = el;
            }
          }}
          src={file.preview}
          style={styles.img}
          crossOrigin="anonymous"
        />
      </div>
    </div>
  ));

  return (
    <section className="container flex flex-col gap-2 h-full" ref={dropzoneRef} tabIndex={0}>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>
          Drop files <strong>here</strong>, <strong style={{ cursor: 'pointer' }}>click</strong> to select files, or <strong>paste</strong> from clipboard
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