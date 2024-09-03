'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import db from '@/db';
import { authMiddleware, validationMiddleware } from '@/middlewares';
import { InvitationStatus } from '@prisma/client';

const updateInvitationStatusSchema = z.object({
  status: z.nativeEnum(InvitationStatus),
});

interface UpdateInvitationStatusFormState {
  errors: {
    status?: string[],
    _form?: string[],
  };
  success?: boolean
}

export async function updateInvitationStatus(
  { id, status }: { id: string, status: InvitationStatus },
  formState: UpdateInvitationStatusFormState,
  formData: FormData
): Promise<UpdateInvitationStatusFormState> {
  const result = updateInvitationStatusSchema.safeParse({
    status,
  });

  const validation = validationMiddleware(result);
  if (validation.errors) {
    console.error('validation.errors'.repeat(200),validation.errors)
    return {
      success: false,
      errors: validation.errors,
    };
  }

  const auth = await authMiddleware();
  if (auth.errors) {
    return auth;
  }
  try {
    const invitation = await db.invitation.update({
      where: { id },
      data: { status }
    });
  } catch (err: unknown) {

    if (err instanceof Error) {
      console.error('err', err.message)

      return {
        success: false,
        errors: {
          _form: [err.message],
        },
      };
    } else {
      console.error('err', err)
      return {
        success: false,
        errors: {
          _form: ['Something went wrong'],
        },
      };
    }
  }
  revalidatePath(`/invitations`);
  return { success: true, errors: {} }
}