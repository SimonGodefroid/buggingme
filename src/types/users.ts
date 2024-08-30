import { Prisma } from "@prisma/client";

export type ContributorWithReports = Prisma.UserGetPayload<{
  include: { Report: { include: { attachments: true } }, };
}>;

export type UserWithCompanies = Prisma.UserGetPayload<{
  include: { companies: true, };
}>;