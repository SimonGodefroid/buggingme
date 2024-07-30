import { ReportStatus } from "@prisma/client";

export enum RoleType {
  Engineer = 'Engineer',
  Company = 'Company'
}
export const REPORT_STATUS_STATE_MACHINE = {
  [RoleType.Engineer]: {
    [ReportStatus.Open]: [ReportStatus.Cancelled],
    [ReportStatus.InProgress]: [],
    [ReportStatus.Resolved]: [ReportStatus.Closed],
    [ReportStatus.UnderReview]: [],
    [ReportStatus.Closed]: [],
    [ReportStatus.Deferred]: [],
    [ReportStatus.Cancelled]: [ReportStatus.Open],
    [ReportStatus.Rejected]: [],
    [ReportStatus.Deleted]: []
  },
  [RoleType.Company]: {
    [ReportStatus.Open]: [ReportStatus.UnderReview,],
    [ReportStatus.UnderReview]: [ReportStatus.InProgress, ReportStatus.Deferred, ReportStatus.Rejected],
    [ReportStatus.InProgress]: [ReportStatus.Resolved, ReportStatus.Deferred],
    [ReportStatus.Resolved]: [],
    [ReportStatus.Closed]: [],
    [ReportStatus.Deferred]: [],
    [ReportStatus.Cancelled]: [],
    [ReportStatus.Rejected]: [],
    [ReportStatus.Deleted]: []
  }
};



export const assertStateTransition = (currentStatus: ReportStatus, nextStatus: ReportStatus, role: RoleType) => {
  if (!currentStatus || !nextStatus || !role) {
    return false;
  } else {
    const allowedStatusChange: ReportStatus[] = REPORT_STATUS_STATE_MACHINE[role][currentStatus] || [];
    if (!(allowedStatusChange.includes(nextStatus))) {
      return false;
    } else {
      return true;
    }
  }
}