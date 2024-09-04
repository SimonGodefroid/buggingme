'use server';

import { getContributorCampaigns, } from '@/db/queries';

// Needed cause the FE cannot run a db query in the browser
export async function fetchContributorCampaigns({ userId }: { userId: string }) {
  return await getContributorCampaigns({ userId });
}