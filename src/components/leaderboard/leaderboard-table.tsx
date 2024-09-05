'use client';

import { ReportWithTags, UserWithFullReports } from '@/types';
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
  User,
} from '@nextui-org/react';
import {
  Impact,
  ReportCategory,
  ReportStatus,
  Severity,
  Tag,
} from '@prisma/client';

import { Category } from '../common/category';
import { ImpactChip } from '../reports/impact';
import { SeverityChip } from '../reports/severity';
import { Status } from '../reports/status';
import { TagChip } from '../reports/tag';

type Stats = {
  byCategory: Record<ReportCategory, number>;
  byStatus: Record<ReportStatus, number>;
  bySeverity: Record<Severity, number>;
  byImpact: Record<Impact, number>;
  byTag: Record<Tag['name'], number>;
  companies: number;
  totalReputation: number;
};

export default function LeaderboardTable({
  users,
  tags,
}: {
  users: UserWithFullReports[];
  tags: Tag[];
}) {
  const calculateStats = (reports: ReportWithTags[]): Stats => {
    const stats: Stats = {
      byCategory: {
        [ReportCategory.Valid]: 0,
        [ReportCategory.PendingCompanyReview]: 0,
        [ReportCategory.Testing]: 0,
        [ReportCategory.InformationNeeded]: 0,
        [ReportCategory.New]: 0,
        [ReportCategory.Resolved]: 0,
        [ReportCategory.Informative]: 0,
        [ReportCategory.NotApplicable]: 0,
        [ReportCategory.Duplicate]: 0,
        [ReportCategory.Spam]: 0,
      },
      byStatus: {
        [ReportStatus.Cancelled]: 0,
        [ReportStatus.Closed]: 0,
        [ReportStatus.Open]: 0,
        [ReportStatus.Deleted]: 0,
      },
      bySeverity: {
        [Severity.Critical]: 0,
        [Severity.High]: 0,
        [Severity.Medium]: 0,
        [Severity.Low]: 0,
      },
      byImpact: {
        [Impact.SingleUser]: 0,
        [Impact.AllUsers]: 0,
        [Impact.SpecificBrowsersDevices]: 0,
        [Impact.SiteWide]: 0,
      },
      byTag: tags.reduce((acc, tag) => ({ ...acc, [tag.name]: 0 }), {}),
      companies: 0,
      totalReputation: 0,
    };

    const companiesSet = new Set<string>();

    reports.forEach((report) => {
      stats.byCategory[report.category]++;
      stats.byStatus[report.status]++;
      stats.bySeverity[report.severity]++;
      stats.byImpact[report.impact]++;

      report.tags.forEach((tag) => {
        if (tag.name in stats.byTag) {
          stats.byTag[tag.name]++;
        }
      });

      companiesSet.add(report.companyId);

      switch (report.category) {
        case ReportCategory.Resolved:
          stats.totalReputation += 10;
          break;
        case ReportCategory.Informative:
          stats.totalReputation += 5;
          break;
        case ReportCategory.Spam:
          stats.totalReputation -= 5;
          break;
      }
    });

    stats.companies = companiesSet.size;

    return stats;
  };

  return (
    <Card className="p-4 shadow-lg">
      <CardHeader className="justify-center md:justify-start">
        <h4 className="text-xl font-semibold">Top 5 Users - Leaderboard</h4>
      </CardHeader>
      <CardBody>
        {/* Table view for larger screens */}
        <Table aria-label="Leaderboard" isStriped className="hidden md:block">
          <TableHeader>
            <TableColumn>Rank</TableColumn>
            <TableColumn>User</TableColumn>
            <TableColumn>Companies</TableColumn>
            <TableColumn>Reports</TableColumn>
            <TableColumn>Reputation</TableColumn>
            <TableColumn>Reports by Category</TableColumn>
            <TableColumn>Reports by Status</TableColumn>
            <TableColumn>Reports by Severity</TableColumn>
            <TableColumn>Reports by Impact</TableColumn>
            <TableColumn>Reports by Tags</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => {
              const stats = calculateStats(user.Report);

              return (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <User
                      className="flex flex-col"
                      avatarProps={{ radius: 'lg', src: `${user.image}` }}
                      description={
                        <span>
                          {user.companies.map((c) => c.name).join(', ')}
                        </span>
                      }
                      name={user.name}
                    />
                  </TableCell>
                  <TableCell>{stats.companies}</TableCell>
                  <TableCell>{user.Report.length}</TableCell>
                  <TableCell>{stats.totalReputation}</TableCell>
                  <TableCell>
                    {Object.entries(stats.byCategory).map(
                      ([category, count]) => (
                        <div
                          key={category}
                          className="whitespace-nowrap flex justify-between gap-2 my-2"
                        >
                          <Category category={category as ReportCategory} />
                          <div>{count}</div>
                        </div>
                      ),
                    )}
                  </TableCell>
                  <TableCell>
                    {Object.entries(stats.byStatus).map(([status, count]) => (
                      <div
                        key={status}
                        className="whitespace-nowrap flex justify-between gap-2 my-2"
                      >
                        <Status status={status as ReportStatus} />
                        <div>{count}</div>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {Object.entries(stats.bySeverity).map(
                      ([severity, count]) => (
                        <div
                          key={severity}
                          className="whitespace-nowrap flex justify-between gap-2 my-2"
                        >
                          <SeverityChip severity={severity as Severity} />
                          <div>{count}</div>
                        </div>
                      ),
                    )}
                  </TableCell>
                  <TableCell>
                    {Object.entries(stats.byImpact).map(([impact, count]) => (
                      <div
                        key={impact}
                        className="whitespace-nowrap flex justify-between gap-2 my-2"
                      >
                        <ImpactChip impact={impact as Impact} />
                        <div>{count}</div>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {Object.entries(stats.byTag).map(([tag, count]) => (
                      <div
                        key={tag}
                        className="whitespace-nowrap flex justify-between gap-2 my-2"
                      >
                        <TagChip tag={{ name: tag } as Tag} />
                        <div>{count}</div>
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Card view for small screens */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {users.map((user, index) => {
            const stats = calculateStats(user.Report);

            return (
              <Card key={user.id} className="shadow-md">
                <CardHeader className="flex flex-col gap-4 justify-between items-center">
                  <h5 className="font-semibold">
                    {index + 1}. {user.name}
                  </h5>
                  <User
                    avatarProps={{ radius: 'lg', src: `${user?.image}` }}
                    name={user.name}
                  />
                </CardHeader>
                <CardBody>
                  <div className="flex flex-col items-center gap-2">
                    <div>
                      <strong>Companies:</strong> {stats.companies}
                    </div>
                    <div>
                      <strong>Reports:</strong> {user.Report.length}
                    </div>
                    <div>
                      <strong>Reputation:</strong> {stats.totalReputation}
                    </div>
                    <Divider className="m-4" />

                    {/* Categories */}
                    <div className="flex flex-col items-start gap-2 w-full m-4">
                      <strong>Categories:</strong>
                      <div className="flex flex-col gap-2 w-full">
                        {Object.entries(stats.byCategory).map(
                          ([category, count]) => (
                            <div
                              key={category}
                              className="flex justify-between"
                            >
                              <Category category={category as ReportCategory} />
                              <div>{count}</div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                    <Divider className="m-4" />

                    {/* Severity */}
                    <div className="flex flex-col items-start gap-2 w-full m-4">
                      <strong>Severity:</strong>
                      <div className="flex flex-col gap-2 w-full">
                        {Object.entries(stats.bySeverity).map(
                          ([severity, count]) => (
                            <div
                              key={severity}
                              className="flex justify-between"
                            >
                              <SeverityChip severity={severity as Severity} />
                              <div>{count}</div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                    <Divider className="m-4" />

                    {/* Status */}
                    <div className="flex flex-col items-start gap-2 w-full m-4">
                      <strong>Status:</strong>
                      <div className="flex flex-col gap-2 w-full">
                        {Object.entries(stats.byStatus).map(
                          ([status, count]) => (
                            <div key={status} className="flex justify-between">
                              <Status status={status as ReportStatus} />
                              <div>{count}</div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                    <Divider className="m-4" />

                    {/* Impact */}
                    <div className="flex flex-col items-start gap-2 w-full m-4">
                      <strong>Impact:</strong>
                      <div className="flex flex-col gap-2 w-full">
                        {Object.entries(stats.byImpact).map(
                          ([impact, count]) => (
                            <div key={impact} className="flex justify-between">
                              <ImpactChip impact={impact as Impact} />
                              <div>{count}</div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                    <Divider className="m-4" />

                    {/* Tags */}
                    <div className="flex flex-col items-start gap-2 w-full m-4">
                      <strong>Tags:</strong>
                      <div className="flex flex-col gap-2 w-full">
                        {Object.entries(stats.byTag).map(([tag, count]) => (
                          <div key={tag} className="flex justify-between">
                            <TagChip tag={{ name: tag } as Tag} />
                            <div>{count}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
