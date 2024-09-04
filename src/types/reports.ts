import { Prisma, ReportCategory } from "@prisma/client";

export type ReportWithTags = Prisma.ReportGetPayload<{
  include: { tags: true; user: true; StatusHistory: true; company: true, attachments: true, comments: true, campaign: true };
}>;

export const CLOSING_CATEGORIES: ReportCategory[] = [ReportCategory.Spam, ReportCategory.Duplicate, ReportCategory.NotApplicable, ReportCategory.Informative, ReportCategory.Resolved];
export const OPEN_CATEGORIES: ReportCategory[] = [ReportCategory.New, ReportCategory.Valid, ReportCategory.InformationNeeded, ReportCategory.PendingCompanyReview, ReportCategory.Testing,];