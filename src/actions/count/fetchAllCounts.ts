'use server';

import { countCampaigns, countCompanies, countContributors, countReports } from "@/queries";


export async function fetchAllCounts() {
  try {
    const [companies, reports, campaigns, contributors] = await Promise.all([
      countCompanies(),
      countReports(),
      countCampaigns(),
      countContributors(),
    ]);

    return { companies, reports, campaigns, contributors };
  } catch (error) {
    console.error('Failed to load counts:', error);
    return { companies: 0, reports: 0, campaigns: 0, contributors: 0 };
  }
}