'use server';

import db from '@/db';
import { authMiddleware, } from '@/middlewares';

interface DeleteAttachmentFormState {
  errors: {
    url?: string[],
    _form?: string[],
  };
  success?: boolean
}

export async function deleteAttachment(
  { attachmentUrl }: { attachmentUrl: string },
  formState: DeleteAttachmentFormState,
  formData: FormData
): Promise<DeleteAttachmentFormState> {


  /* assert authn */
  const auth = await authMiddleware();
  if (auth.errors) {
    return auth;
  }
  /* assert authz */
  const session = auth.session;
  const attachment = await db.attachment.findFirst({ where: { url: attachmentUrl }, include: { user: true } });
  if (attachment?.userId !== session.user?.id) {
    return {
      success: false,
      errors: {
        _form: ["Attachment not found"],
      },
    };
  }

  try {
    await db.$transaction(async (tx) => {
      const attachment = await tx.attachment.findFirst({
        where: { url: attachmentUrl },
      });

      if (!attachment) {
        throw new Error('Attachment not found.');
      }
      const deletedAttachment = await tx.attachment.delete({ where: { id: attachment.id } });
    });

    return { success: true, errors: {} };
  } catch (err: unknown) {
    console.error('error' + '>'.repeat(200), err)
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ['Something went wrong'],
        },
      };
    }
  }
}