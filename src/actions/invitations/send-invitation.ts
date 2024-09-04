'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import db from '@/db';
import { authMiddleware, validationMiddleware } from '@/middlewares';
import { InvitationStatus } from '@prisma/client';

const sendInvitationSchema = z.object({
  campaignId: z.string(),
});

interface SendInvitationFormState {
  errors: {
    status?: string[],
    _form?: string[],
  };
  success?: boolean
}

export async function sendInvitations(
  formState: SendInvitationFormState,
  formData: FormData
): Promise<SendInvitationFormState> {
  const campaignId = formData.get('campaignId');
  const result = sendInvitationSchema.safeParse({
    campaignId,
  });

  const validation = validationMiddleware(result);
  if (validation.errors) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  const auth = await authMiddleware();
  if (auth.errors) {
    return auth;
  }
  const authenticatedUser = auth.session.user;
  const user = await db.user.findUnique({ where: { id: authenticatedUser?.id }, include: { companies: true } });
  const invitedUsersId = formData.get('invitedUsers')?.toString().split(',') || [];
  const invitedUsers = await db.user.findMany({
    where: { id: { in: invitedUsersId } },
  });

  try {
    await db.$transaction(async (transaction) => {
      const campaign = await transaction.campaign.findFirst({
        where: { id: result.data?.campaignId }, include: { company: true }
      })

      if (campaign?.company.id !== user?.companies[0].id) {
        throw new Error('You are not authorized to perform this action');

      }
      if (!campaign) {
        throw new Error('Campaign not found')
      }

      const existingInvites = await transaction.invitation.findMany({
        where: {
          campaignId: result.data?.campaignId!,
          inviteeId: { in: invitedUsersId },
          status: InvitationStatus.Pending
        },
        include: { invitee: true }
      });

      if (existingInvites.length > 0) {
        throw new Error(`User already invited ${existingInvites.map(invited => invited.invitee?.name)} for this campaign`);
      }

      const invitationsData = invitedUsers.map((user) => ({
        status: InvitationStatus.Pending,
        userId: user.id,
        campaignId: result.data?.campaignId!,
        companyId: campaign.company.id!,
        invitorId: auth.session.user?.id!,
        inviteeId: user.id
      }));

      await transaction.invitation.createMany({
        data: invitationsData,
      });
    });

    revalidatePath('/invitations');
    return {
      success: true,
      errors: {},
    };
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

}