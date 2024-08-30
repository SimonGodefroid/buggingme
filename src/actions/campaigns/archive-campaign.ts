'use server';

import { revalidatePath } from 'next/cache';
import db from '@/db';
import { authMiddleware, } from '@/middlewares';
import { Campaign, CampaignStatus, } from '@prisma/client';

interface ArchiveCampaignFormState {
  errors: {
    _form?: string[],
  };
  success?: boolean
}

export async function archiveCampaign(
  { campaignId }: { campaignId: string },
): Promise<ArchiveCampaignFormState> {

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
        status: CampaignStatus.Archived,
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
    revalidatePath(`/campaigns/${campaignId}`);
    return {
      errors: {},
      success: true,
    };
  }
}
