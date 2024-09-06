import { Prisma } from "@prisma/client";

export type CampaignWithInvitations = Prisma.CampaignGetPayload<{ include: { company: true, invitations: { include: { invitee: true, invitor: true } }, } }>
export type CampaignWithCompany = Prisma.CampaignGetPayload<{ include: { company: true, } }>