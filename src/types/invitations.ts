import { Prisma, } from "@prisma/client";

export type InvitationWithUser = Prisma.InvitationGetPayload<{
  include: { invitor: true, };
}>;
export type InvitationWithCampaignAndParties = Prisma.InvitationGetPayload<{
  include: { company: true, campaign: true, invitee: true, invitor: true };
}>;
