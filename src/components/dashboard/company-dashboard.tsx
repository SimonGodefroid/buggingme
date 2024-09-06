'use client';

import { useRouter } from 'next/navigation';

import { CommentWithAuthor } from '@/db/queries/comments';
import {
  CampaignWithCompany,
  InvitationWithCampaignAndParties,
  ReportWithTags,
} from '@/types';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';

import { Category } from '../common/category';
import { Status } from '../reports/status';

export default function CompanyDashboard({
  comments,
  campaigns,
  reports,
  invitations,
}: {
  comments: CommentWithAuthor[];
  campaigns: CampaignWithCompany[];
  reports: ReportWithTags[];
  invitations: InvitationWithCampaignAndParties[];
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 m-4">
      {/* Nested Card for Reports */}
      <Card className="md:hidden p-2 shadow-lg">
        <CardHeader className="justify-center">
          <h4 className="text-xl font-semibold">Last 5 Reports</h4>
        </CardHeader>
        <CardBody className="text-center">
          <div className="flex flex-col">
            {reports.slice(0, 5).map((report, index) => (
              <>
                <Card
                  key={report.id}
                  className="flex flex-col items-center gap-4 m-2"
                  isPressable
                  onPress={() => router.push(`/reports/${report.id}`)}
                >
                  <CardBody className="flex flex-col text-center gap-4">
                    <dl>
                      <dd>
                        <strong>{report.title}</strong>
                      </dd>
                    </dl>
                    <dd>{report.campaign?.name}</dd>
                    <div>
                      <Category category={report.category} />
                    </div>
                    <dl>
                      <dd>
                        <Status status={report.status} />
                      </dd>
                    </dl>
                  </CardBody>
                </Card>
                {index !== reports.length - 1 && <Divider className="m-4" />}
              </>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Nested Card for Comments */}
      <Card className="md:hidden p-2 shadow-lg">
        <CardHeader className="justify-center">
          <h4 className="text-xl font-semibold">Last 5 Comments</h4>
        </CardHeader>
        <CardBody className="text-center">
          <div className="flex flex-col">
            {comments.slice(0, 5).map((comment, index) => (
              <>
                <Card
                  key={comment.id}
                  className="flex flex-col items-center gap-4 m-2"
                  isPressable
                  onPress={() => router.push(`/reports/${comment.report?.id}`)}
                >
                  <CardBody className="flex flex-col text-center gap-4">
                    <dl>
                      <dd>
                        <strong>{comment.report?.title}</strong>
                      </dd>
                    </dl>
                    <p>{comment.content}</p>
                  </CardBody>
                </Card>
                {index !== comments.length - 1 && <Divider className="m-4" />}
              </>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Nested Card for Invitations */}
      <Card className="md:hidden p-2 shadow-lg">
        <CardHeader className="justify-center">
          <h4 className="text-xl font-semibold">Last 5 Invitations</h4>
        </CardHeader>
        <CardBody className="text-center">
          <div className="flex flex-col">
            {invitations.slice(0, 5).map((invitation, index) => (
              <>
                <Card
                  key={invitation.id}
                  className="flex flex-col items-center gap-4 m-2"
                  isPressable
                  onPress={() =>
                    router.push(`/campaigns/${invitation.campaign?.id}`)
                  }
                >
                  <CardBody className="flex flex-col text-center gap-4">
                    <dl>
                      <dd>
                        <strong>{invitation.campaign?.name}</strong>
                      </dd>
                    </dl>
                  </CardBody>
                </Card>
                {index !== invitations.length - 1 && (
                  <Divider className="m-4" />
                )}
              </>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Nested Card for Campaigns */}
      <Card className="md:hidden p-2 shadow-lg">
        <CardHeader className="justify-center">
          <h4 className="text-xl font-semibold">Last 5 Campaigns</h4>
        </CardHeader>
        <CardBody className="text-center">
          <div className="flex flex-col">
            {campaigns.slice(0, 5).map((campaign, index) => (
              <>
                <Card
                  key={campaign.id}
                  className="flex flex-col items-center gap-4 m-2"
                  isPressable
                  onPress={() => router.push(`/campaigns/${campaign.id}`)}
                >
                  <CardBody className="flex flex-col text-center gap-4">
                    <dl>
                      <dd>
                        <strong>{campaign.name}</strong>
                      </dd>
                    </dl>
                  </CardBody>
                </Card>
                {index !== campaigns.length - 1 && <Divider className="m-4" />}
              </>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Row 1: Reports and Comments */}
      <div className="hidden md:flex md:flex-wrap gap-4">
        {/* Reports Table */}
        <div className="flex-1 min-w-[45%]">
          <div className="m-4">
            <h2>Last 5 Reports on Your Campaigns</h2>
          </div>
          <Table
            className="hidden md:flex"
            aria-label="Reports table"
            isStriped
            topContentPlacement="outside"
          >
            <TableHeader
              columns={[
                { uid: 'title', name: 'Title' },
                { uid: 'campaign', name: 'Campaign' },
                { uid: 'category', name: 'Category' },
                { uid: 'status', name: 'Status' },
              ]}
            >
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>

            <TableBody emptyContent={'No report found'}>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.campaign?.name}</TableCell>
                  <TableCell>
                    <Category category={report.category} />
                  </TableCell>
                  <TableCell>
                    <Status status={report.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Comments Table */}
        <div className="flex-1 min-w-[45%]">
          <div className="m-4">
            <h2>Last 5 Comments on Your Reports</h2>
          </div>
          <Table
            className="hidden md:flex"
            aria-label="Comments table"
            isStriped
            topContentPlacement="outside"
          >
            <TableHeader
              columns={[
                { uid: 'report', name: 'Report' },
                { uid: 'comment', name: 'Comment' },
              ]}
            >
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>

            <TableBody emptyContent={'No comment found'}>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>{comment.report?.title}</TableCell>
                  <TableCell>{comment.content}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Row 2: Invitations and Campaigns */}
      <div className="hidden md:flex md:flex-wrap gap-4">
        {/* Invitations Table */}
        <div className="flex-1 min-w-[45%]">
          <div className="m-4">
            <h2>Last 5 Invitations Sent by Your Company</h2>
          </div>
          <Table
            className="hidden md:flex"
            aria-label="Invitations table"
            isStriped
            topContentPlacement="outside"
          >
            <TableHeader
              columns={[
                { uid: 'campaign', name: 'Campaign' },
                { uid: 'invitee', name: 'Invitee' },
              ]}
            >
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>

            <TableBody emptyContent={'No invitation found'}>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>{invitation.campaign?.name}</TableCell>
                  <TableCell>{invitation.invitee?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Campaigns Table */}
        <div className="flex-1 min-w-[45%]">
          <div className="m-4">
            <h2>Last 5 Campaigns Created by Your Company</h2>
          </div>
          <Table
            className="hidden md:flex"
            aria-label="Campaigns table"
            isStriped
            topContentPlacement="outside"
          >
            <TableHeader
              columns={[
                { uid: 'campaign', name: 'Campaign' },
                { uid: 'description', name: 'Description' },
              ]}
            >
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>

            <TableBody emptyContent={'No campaign found'}>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{campaign.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
