'use client';

import { ReportWithTags, UserWithFullReports } from '@/types';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Spacer,
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

type PartialReputationCategory =
  | typeof ReportCategory.Resolved
  | typeof ReportCategory.Informative
  | typeof ReportCategory.Spam;

export default function UserStats({
  user,
  tags,
}: {
  user: UserWithFullReports | null;
  tags: Tag[];
}) {
  const calculateStats = (reports: ReportWithTags[], tags: Tag[]) => {
    const stats: {
      byCategory: Record<ReportCategory, number>;
      byStatus: Record<ReportStatus, number>;
      byTag: Record<Tag['name'], number>;
      bySeverity: Record<Severity, number>;
      byImpact: Record<Impact, number>;
      reputation: Record<PartialReputationCategory, number>;
      totalReputation: number;
    } = {
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
      byTag: tags.reduce((acc, tag) => ({ ...acc, [tag.name]: 0 }), {}),
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
      reputation: {
        [ReportCategory.Resolved]: 0,
        [ReportCategory.Informative]: 0,
        [ReportCategory.Spam]: 0,
      },
      totalReputation: 0,
    };

    reports.forEach((report) => {
      if (report.category in stats.byCategory) {
        stats.byCategory[report.category as ReportCategory] += 1;
      }

      if (report.status in stats.byStatus) {
        stats.byStatus[report.status as ReportStatus] += 1;
      }

      if (report.severity in stats.bySeverity) {
        stats.bySeverity[report.severity as Severity] += 1;
      }

      if (report.impact in stats.byImpact) {
        stats.byImpact[report.impact as Impact] += 1;
      }

      report.tags.forEach((tag) => {
        if (tag.name in stats.byTag) {
          stats.byTag[tag.name] += 1;
        }
      });

      // Calculate reputation per category
      switch (report.category) {
        case ReportCategory.Resolved:
          stats.reputation[ReportCategory.Resolved] += 10;
          break;
        case ReportCategory.Informative:
          stats.reputation[ReportCategory.Informative] += 5;
          break;
        case ReportCategory.Spam:
          stats.reputation[ReportCategory.Spam] -= 5;
          break;
        default:
          break;
      }
    });

    // Calculate total reputation
    stats.totalReputation = Object.values(stats.reputation).reduce(
      (acc, rep) => acc + rep,
      0,
    );

    return stats;
  };

  const stats = calculateStats(user?.Report || [], tags || []);
  const statusItems = Object.entries(stats.byStatus).map(([status, count]) => ({
    status,
    count,
  }));

  const reputationItems = Object.entries(stats.reputation).map(
    ([category, reputation]) => ({ category, reputation }),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <User
          avatarProps={{ radius: 'lg', src: `${user?.image}` }}
          description={user?.email}
          name={user?.name}
        >
          {user?.name}
        </User>
        <h2>Reputation</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="p-2 md:p-4 shadow-lg">
            <CardHeader className="justify-center md:justify-start">
              <h4 className="text-xl font-semibold">User Reputation</h4>
            </CardHeader>
            <CardBody>
              <Table aria-label="User Reputation" isStriped>
                <TableHeader>
                  <TableColumn>Category</TableColumn>
                  <TableColumn>Reputation Change</TableColumn>
                </TableHeader>
                <TableBody>
                  {[
                    ...reputationItems.map((item) => (
                      <TableRow key={item.category}>
                        <TableCell>
                          <Category
                            category={item.category as ReportCategory}
                          />
                        </TableCell>
                        <TableCell>{item.reputation}</TableCell>
                      </TableRow>
                    )),
                    <TableRow key="total">
                      <TableCell>
                        <strong>Total</strong>
                      </TableCell>
                      <TableCell>
                        <strong>{stats.totalReputation}</strong>
                      </TableCell>
                    </TableRow>,
                  ]}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
          <Card className="p-2 md:p-4 shadow-lg">
            <CardHeader className="justify-center md:justify-start">
              <h4 className="text-xl font-semibold">
                Reputation Scoring Guide
              </h4>
            </CardHeader>
            <CardBody>
              <Table aria-label="Reputation Scoring Guide" isStriped>
                <TableHeader>
                  <TableColumn>Category</TableColumn>
                  <TableColumn>Reputation Change</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Resolved</TableCell>
                    <TableCell>+10</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Informative</TableCell>
                    <TableCell>+5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Spam</TableCell>
                    <TableCell>-5</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* User Statistics Section */}
      <Spacer y={2} />
      <div className="flex justify-center">
        <h2>Statistics</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Reports by Category */}
        <Card className="p-2 md:p-4 shadow-lg">
          <CardHeader className="justify-center md:justify-start">
            <h4 className="text-xl font-semibold">Reports by Category</h4>
          </CardHeader>
          <CardBody>
            <Table aria-label="Reports by Category" isStriped>
              <TableHeader>
                <TableColumn>Category</TableColumn>
                <TableColumn>Count</TableColumn>
              </TableHeader>
              <TableBody>
                {Object.entries(stats.byCategory).map(([category, count]) => (
                  <TableRow key={category}>
                    <TableCell>
                      <Category category={category as ReportCategory} />
                    </TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Reports by Status */}
        <Card className="p-2 md:p-4 shadow-lg">
          <CardHeader className="justify-center md:justify-start">
            <h4 className="text-xl font-semibold">Reports by Status</h4>
          </CardHeader>
          <CardBody>
            <Table aria-label="Reports by Status" isStriped>
              <TableHeader>
                <TableColumn>Status</TableColumn>
                <TableColumn>Count</TableColumn>
              </TableHeader>
              <TableBody items={statusItems}>
                {(item) => (
                  <TableRow key={item.status}>
                    <TableCell>
                      <Status status={item.status as ReportStatus} />
                    </TableCell>
                    <TableCell>{item.count}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Reports by Severity */}
        <Card className="p-2 md:p-4 shadow-lg">
          <CardHeader className="justify-center md:justify-start">
            <h4 className="text-xl font-semibold">Reports by Severity</h4>
          </CardHeader>
          <CardBody>
            <Table aria-label="Reports by Severity" isStriped>
              <TableHeader>
                <TableColumn>Severity</TableColumn>
                <TableColumn>Count</TableColumn>
              </TableHeader>
              <TableBody>
                {Object.entries(stats.bySeverity).map(([severity, count]) => (
                  <TableRow key={severity}>
                    <TableCell>
                      <SeverityChip severity={severity as Severity} />
                    </TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Reports by Impact */}
        <Card className="p-2 md:p-4 shadow-lg">
          <CardHeader className="justify-center md:justify-start">
            <h4 className="text-xl font-semibold">Reports by Impact</h4>
          </CardHeader>
          <CardBody>
            <Table aria-label="Reports by Impact" isStriped>
              <TableHeader>
                <TableColumn>Impact</TableColumn>
                <TableColumn>Count</TableColumn>
              </TableHeader>
              <TableBody>
                {Object.entries(stats.byImpact).map(([impact, count]) => (
                  <TableRow key={impact}>
                    <TableCell>
                      <ImpactChip impact={impact as Impact} />
                    </TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Reports by Tag */}
        <Card className="p-2 md:p-4 shadow-lg">
          <CardHeader className="justify-center md:justify-start">
            <h4 className="text-xl font-semibold">Reports by Tag</h4>
          </CardHeader>
          <CardBody>
            <Table aria-label="Reports by Tag" isStriped>
              <TableHeader>
                <TableColumn>Tag</TableColumn>
                <TableColumn>Count</TableColumn>
              </TableHeader>
              <TableBody>
                {Object.entries(stats.byTag).map(([tag, count]) => (
                  <TableRow key={tag}>
                    <TableCell>
                      <TagChip tag={{ name: tag } as Tag} />
                    </TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
