
'use server';
import db from '@/db';
import { CommentWithAuthor } from '@/db/queries/comments';
import { CampaignWithCompany, InvitationWithCampaignAndParties, ReportWithTags } from '@/types';
export async function fetchEngineerDashboardData(userId: string) {
  const comments: CommentWithAuthor[] = await db.comment.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true, report: { include: { company: true } } },
  });

  const reports: ReportWithTags[] = await db.report.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { tags: true, user: true, StatusHistory: true, company: true, attachments: true, comments: true, campaign: true }
  })

  const campaigns: CampaignWithCompany[] = await db.campaign.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { company: true },
  });

  const invitations: InvitationWithCampaignAndParties[] = await db.invitation.findMany({
    where: { inviteeId: userId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { campaign: true, company: true, invitee: true, invitor: true },
  });

  return { comments, reports, campaigns, invitations };
}
