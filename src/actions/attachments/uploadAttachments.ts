'use server';

import db from '@/db';
import { authMiddleware } from '@/middlewares';
import { revalidatePath } from 'next/cache';
import { computeFileHash } from '@/helpers'
interface UploadAttachmentsFormState {
  errors: {
    urls?: string[];
    _form?: string[];
  };
  uploadedImages: { url: string, filename: string }[];
  success?: boolean;
}


export async function uploadAttachments({
  id,
  form,
}: {
  id?: string;  // Optional id now
  form: FormData;
}): Promise<UploadAttachmentsFormState> {

  /* assert authn */
  const auth = await authMiddleware();
  if (auth.errors) {
    return { ...auth, uploadedImages: [] };
  }
  const session = auth.session;

  const uploadedImages: { url: string, filename: string }[] = [];
  const attachments = form.getAll('fileUpload') as File[];

  try {
    for (const attachment of attachments) {

      const hash = await computeFileHash(attachment);

      // Check if the hash already exists in the database
      const existingAttachment = await db.attachment.findUnique({
        where: { hash },
      });

      if (existingAttachment) {
        uploadedImages.push({
          url: existingAttachment.url,
          filename: existingAttachment.filename,
        });
        continue; // Skip upload if file is a duplicate
      }


      const { url, bucketImageUrl } = await uploadToS3(attachment);

      uploadedImages.push({ url: bucketImageUrl, filename: attachment.name });

      if (id) {
        // If id is present, create the attachment in the database
        await db.attachment.create({
          data: {
            reportId: id,
            url: bucketImageUrl,
            userId: session.user?.id!,
            filename: attachment.name,
          },
        });
        revalidatePath(`/reports/${id}`);
      }
    }

    return { success: true, uploadedImages, errors: {} };
  } catch (err: unknown) {
    console.error('Upload Error:', err);
    return handleUploadError(err);
  }
}

// Utility function to upload a file to S3
async function uploadToS3(attachment: File) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: attachment.name,
        contentType: attachment.type,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get pre-signed URL.');
  }

  const { url, fields } = await response.json();
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) =>
    formData.append(key, value as string)
  );

  const bytes = await attachment.arrayBuffer();
  const buffer = Buffer.from(bytes);
  formData.append('file', new Blob([buffer]));

  const uploadResponse = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error('S3 Upload Error');
  }

  const bucketImageUrl = uploadResponse.headers.get('Location') || url;
  return { url, bucketImageUrl };
}

// Utility function to handle errors
function handleUploadError(err: unknown): UploadAttachmentsFormState {
  const errorMsg =
    err instanceof Error ? err.message : 'Something went wrong';
  return {
    errors: { _form: [errorMsg] },
    uploadedImages: [],
  };
}