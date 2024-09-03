import db from "@/db";
import { CampaignType, InvitationStatus } from "@prisma/client";

export async function countCampaigns() {
  const campaigns = await db.campaign.count();
  return campaigns;
}

export async function getAllCampaigns() {
  const campaigns = await db.campaign.findMany();
  return campaigns;
}

export async function getContributorCampaigns({ userId }: { userId: string }) {
  try {
    const campaigns = await db.campaign.findMany({
      where: {
        OR: [
          {
            // Public campaigns
            type: CampaignType.Public,
          },
          {
            // Invitation-only campaigns where the user has accepted the invitation
            AND: [
              { type: CampaignType.InvitationOnly },
              {
                invitations: {
                  some: {
                    userId,
                    status: InvitationStatus.Accepted,
                  },
                },
              },
            ],
          },
        ],
      },
    });
    return campaigns;
  } catch (err) { console.log('err', err) }
}