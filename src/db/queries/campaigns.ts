import db from "@/db";

export async function countCampaigns() {
  const campaigns = await db.campaign.count();
  return campaigns;
}