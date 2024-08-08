import { Prisma } from "@prisma/client";

export type ContributorWithReports = Prisma.UserGetPayload<{
  include: { Report: true };
}>;

export type UserWithCompanies = Prisma.UserGetPayload<{
  include: { companies: true };
}>;