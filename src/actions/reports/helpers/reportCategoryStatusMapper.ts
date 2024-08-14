import { ReportCategory, ReportStatus } from "@prisma/client";

export const CATEGORY_STATUS_MAPPER = {
  // open
  [ReportCategory.New]: ReportStatus.Open,
  [ReportCategory.Valid]: ReportStatus.Open,
  [ReportCategory.InformationNeeded]: ReportStatus.Open,
  [ReportCategory.PendingCompanyReview]: ReportStatus.Open,
  [ReportCategory.Testing]: ReportStatus.Open,
  // closed
  [ReportCategory.Spam]: ReportStatus.Closed,
  [ReportCategory.Duplicate]: ReportStatus.Closed,
  [ReportCategory.Informative]: ReportStatus.Closed,
  [ReportCategory.NotApplicable]: ReportStatus.Closed,
  [ReportCategory.Resolved]: ReportStatus.Closed,
};



export const getCategoryStatus = (category: ReportCategory): ReportStatus => {
  if (!category) {
    throw Error('Missing category')
  } else {
    const status: ReportStatus = CATEGORY_STATUS_MAPPER?.[category];
    return status;
  }
}