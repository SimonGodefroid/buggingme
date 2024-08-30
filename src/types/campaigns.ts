import { Prisma } from "@prisma/client";

export type CampaignWithCompany = Prisma.CampaignGetPayload<{ include: { company: true, User: true } }>