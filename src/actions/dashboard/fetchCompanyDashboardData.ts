
'use server';
import db from '@/db';
import { CommentWithAuthor } from '@/db/queries/comments';
import { CampaignWithCompany, InvitationWithCampaignAndParties, ReportWithTags } from '@/types';

export async function fetchCompanyDashboardData(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId }, include: { companies: true } });
  console.log('user', user)

  const comments: CommentWithAuthor[] = await db.comment.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true, report: { include: { company: true } } },
  });

  const reports: ReportWithTags[] = await db.report.findMany({
    where: {
      companyId: {
        in: user?.companies?.[0]?.id ? [user.companies[0].id] : [],
      },
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      tags: true,
      user: true,
      StatusHistory: true,
      company: true,
      attachments: true,
      comments: true,
      campaign: true,
    },
  });

  console.log('userId', userId)
  const campaigns: CampaignWithCompany[] = await db.campaign.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { company: true },
  });

  const invitations: InvitationWithCampaignAndParties[] = await db.invitation.findMany({
    where: { invitorId: userId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { campaign: true, company: true, invitee: true, invitor: true },
  });

  return { comments, reports, campaigns, invitations };
}
