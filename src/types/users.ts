import { Prisma } from "@prisma/client";

export type ContributorWithReports = Prisma.UserGetPayload<{
  include: { Report: { include: { attachments: true } }, };
}>;

export type UserWithCompanies = Prisma.UserGetPayload<{
  include: { companies: true, };
}>;
export type UserWithFullReports = Prisma.UserGetPayload<{
  include: {
    companies: true,
    Report: {
      include: {
        tags: true,
        user: true,
        StatusHistory: true,
        company: true,
        attachments: true,
        comments: true,
        campaign: true,
      },
    },
  },
}>;