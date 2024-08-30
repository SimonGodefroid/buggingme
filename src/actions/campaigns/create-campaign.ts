'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import db from '@/db';
import { authMiddleware, validationMiddleware } from '@/middlewares';
import { Campaign, CampaignStatus, CampaignType } from '@prisma/client';

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

  console.log('company', company)
  if (!company) {
    return {
      success: false,
      errors: {
        _form: ['You must be part of a company to create a campaign.']
      }
    }
  }
  console.log('CampaignStatus.Created', CampaignStatus.Created)
  let campaign: Campaign;
  try {
    campaign = await db.campaign.create({
      data: {
        name: result.data!.name,
        description: result.data!.description,
        rules: result.data!.rules,
        startDate: result.data!.startDate,
        endDate: result.data!.endDate,
        type: result.data!.type,
        status: CampaignStatus.Created,
        companyId: company.id,
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
    // revalidatePath('/reports');
    return {
      errors: {},
      success: true,
    };
  }
}
