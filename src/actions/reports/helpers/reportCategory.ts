import { ReportCategory, UserType } from "@prisma/client";
/*
// open
ReportCategory.New
ReportCategory.Valid
ReportCategory.InformationNeeded
ReportCategory.PendingCompanyReview
ReportCategory.Testing
//  closed
ReportCategory.Spam
ReportCategory.Duplicate
ReportCategory.Informative
ReportCategory.NotApplicable
ReportCategory.Resolved
*/

/* keeping as backup... but shouldn't be too precious about the category state machine */
export const REPORT_CATEGORY_STATE_MACHINE: Record<UserType, Record<ReportCategory, ReportCategory[]>> = {
  [UserType.GOD]: {
    // open
    [ReportCategory.New]: [],
    [ReportCategory.Valid]: [],
    [ReportCategory.InformationNeeded]: [],
    [ReportCategory.PendingCompanyReview]: [],
    [ReportCategory.Testing]: [],
    // closed
    [ReportCategory.Spam]: [],
    [ReportCategory.Duplicate]: [],
    [ReportCategory.Informative]: [],
    [ReportCategory.NotApplicable]: [],
    [ReportCategory.Resolved]: [],
  },
  [UserType.COMPANY]: {
    // open
    [ReportCategory.New]: Object.values(ReportCategory),
    [ReportCategory.Valid]: [ReportCategory.InformationNeeded, ReportCategory.Testing, ReportCategory.Spam, ReportCategory.Duplicate, ReportCategory.Informative, ReportCategory.NotApplicable, ReportCategory.Resolved],
    [ReportCategory.InformationNeeded]: [ReportCategory.Valid, ReportCategory.PendingCompanyReview, ReportCategory.Testing, ReportCategory.Spam, ReportCategory.Duplicate, ReportCategory.Informative, ReportCategory.NotApplicable, ReportCategory.Resolved],
    [ReportCategory.PendingCompanyReview]: [ReportCategory.Valid, ReportCategory.InformationNeeded, ReportCategory.Testing, ReportCategory.Spam, ReportCategory.Duplicate, ReportCategory.Informative, ReportCategory.NotApplicable, ReportCategory.Resolved],
    [ReportCategory.Testing]: [ReportCategory.Resolved],
    // closed
    [ReportCategory.Spam]: [ReportCategory.Duplicate, ReportCategory.NotApplicable, ReportCategory.Informative],
    [ReportCategory.Duplicate]: [ReportCategory.Spam, ReportCategory.NotApplicable, ReportCategory.Informative],
    [ReportCategory.Informative]: [ReportCategory.Duplicate, ReportCategory.Resolved],
    [ReportCategory.NotApplicable]: [ReportCategory.Spam, ReportCategory.Duplicate, ReportCategory.Informative, ReportCategory.Resolved],
    [ReportCategory.Resolved]: [],
  },
  [UserType.ENGINEER]: {
    // open
    [ReportCategory.New]: [],
    [ReportCategory.Valid]: [],
    [ReportCategory.InformationNeeded]: [],
    [ReportCategory.PendingCompanyReview]: [],
    [ReportCategory.Testing]: [],
    // closed
    [ReportCategory.Spam]: [],
    [ReportCategory.Duplicate]: [],
    [ReportCategory.Informative]: [],
    [ReportCategory.NotApplicable]: [],
    [ReportCategory.Resolved]: [],
  },
};



export const assertCategoryTransition = (currentCategory: ReportCategory, nextStatus: ReportCategory, role: UserType) => {
  if (!currentCategory || !nextStatus || role === UserType.ENGINEER) {
    return false;
  } else {
    const allowedCategoryChange: ReportCategory[] = REPORT_CATEGORY_STATE_MACHINE?.[role]?.[currentCategory];
    if (!(allowedCategoryChange.includes(nextStatus))) {
      return false;
    } else {
      return true;
    }
  }
}

/* To filter options in the selector dropdown 
{CLOSING_CATEGORIES.filter((cat: ReportCategory) => {
  return REPORT_CATEGORY_STATE_MACHINE[UserType.COMPANY][
    report.category
  ].includes(cat)
    ? cat
    : null;
})
  .filter(Boolean)
  .map((category) => (
  */