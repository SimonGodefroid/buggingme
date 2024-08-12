import { Prisma } from "@prisma/client";

export type ReportWithTags = Prisma.ReportGetPayload<{
  include: { tags: true; user: true; StatusHistory: true; company: true };
}>;