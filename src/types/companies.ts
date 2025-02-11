import { Prisma } from "@prisma/client";

export type CompanyWithReports = Prisma.CompanyGetPayload<{
  include: {
    reports: {
      include: { tags: true; user: true; StatusHistory: true; company: true, attachments: true, comments: true, campaign: true }
    }
  }
}>;