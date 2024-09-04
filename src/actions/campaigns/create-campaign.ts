'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import db from '@/db';
import { authMiddleware, validationMiddleware } from '@/middlewares';
import {  CampaignStatus, CampaignType, InvitationStatus } from '@prisma/client';

const createCampaignSchema = z.object({
  name: z.string().min(10),
  description: z.string().min(10),
  rules: z.string().min(10),
  startDate: z.date(),
  endDate: z.date(),
  type: z.nativeEnum(CampaignType),
});

interface CreateCampaignFormState {
  errors: {
    name?: string[],
    description?: string[],
    rules?: string[],
    startDate?: string[],
    endDate?: string[],
    _form?: string[],
  };
  success?: boolean
}

export async function createCampaign(
  formState: CreateCampaignFormState,
  formData: FormData
): Promise<CreateCampaignFormState> {
  const result = createCampaignSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    rules: formData.get('rules'),
    startDate: new Date(formData.get('startDate') as string),
    endDate: new Date(formData.get('endDate') as string),
    type: formData.get('type'),
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

  const company = await db.company.findFirst({ where: { users: { some: { id: auth.session.user?.id } } } });
  if (!company) {
    return {
      success: false,
      errors: {
        _form: ['You must be part of a company to create a campaign.']
      }
    };
  }

  const invitedUsersId = formData.get('invitedUsers')?.toString().split(',') || [];
  const invitedUsers = await db.user.findMany({
    where: { id: { in: invitedUsersId } },
  });


  try {
    await db.$transaction(async (transaction) => {
      // 1. Create the campaign
      const campaign = await transaction.campaign.create({
        data: {
          name: result.data!.name,
          description: result.data!.description,
          rules: result.data!.rules,
          startDate: result.data!.startDate,
          endDate: result.data!.endDate,
          type: result.data!.type,
          status: CampaignStatus.Created,
          companyId: company.id,
          userId: auth.session.user?.id, // Assign the creator
        },
      });

      // 2. Create invitations
      const invitationsData = invitedUsers.map((user) => ({
        status: InvitationStatus.Pending,
        userId: user.id,
        campaignId: campaign.id,
        companyId: company.id,
        invitorId: auth.session.user?.id!,
        inviteeId: user.id
      }));

      await transaction.invitation.createMany({
        data: invitationsData,
      });
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
  revalidatePath('/campaigns');
  return {
    success: true,
    errors: {},
  };
}