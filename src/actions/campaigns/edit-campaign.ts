'use server';

import { z } from 'zod';
import db from '@/db';
import { authMiddleware, validationMiddleware } from '@/middlewares';
import { Campaign, } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const editCampaignSchema = z.object({
  name: z.string().min(10),
  description: z.string().min(10),
});

interface EditCampaignFormState {
  errors: {
    name?: string[],
    description?: string[],
    _form?: string[],
  };
  success?: boolean
}

export async function editCampaign(
  { campaignId }: { campaignId: string },
  formState: EditCampaignFormState,
  formData: FormData
): Promise<EditCampaignFormState> {

  const result = editCampaignSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
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
    }
  }

  let campaign: Campaign;
  try {
    campaign = await db.campaign.update({
      where: { id: campaignId },
      data: {
        name: result.data!.name,
        description: result.data!.description,
      }
    });
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
  } finally {
    revalidatePath('/campaigns');
    return {
      errors: {},
      success: true,
    };
  }
}
