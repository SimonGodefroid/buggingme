'use server';

import { countCampaigns, countCompanies, countContributors, countReports } from "@/queries";


export async function fetchAllCounts() {
  const contributors = await countContributors();
  const companies = await countCompanies();
  const reports = await countReports();
  const campaigns = await countCampaigns();

  return {
    contributors,
    companies,
    reports,
    campaigns,
  };
}