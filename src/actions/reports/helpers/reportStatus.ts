import { ReportStatus, UserType } from "@prisma/client";

export const REPORT_STATUS_STATE_MACHINE = {
  [UserType.GOD]: {
    [ReportStatus.Open]: [ReportStatus.Cancelled],
    [ReportStatus.Closed]: [],
    [ReportStatus.Cancelled]: [ReportStatus.Open],
    [ReportStatus.Deleted]: []
  },
  [UserType.ENGINEER]: {
    [ReportStatus.Open]: [ReportStatus.Cancelled],
    [ReportStatus.Closed]: [],
    [ReportStatus.Cancelled]: [ReportStatus.Open],
    [ReportStatus.Deleted]: []
  },
  [UserType.COMPANY]: {
    [ReportStatus.Open]: [],
    [ReportStatus.Closed]: [],
    [ReportStatus.Cancelled]: [],
    [ReportStatus.Deleted]: []
  }
};



export const assertStatusTransition = (currentStatus: ReportStatus, nextStatus: ReportStatus, role: UserType) => {
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