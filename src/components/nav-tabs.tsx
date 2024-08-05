'use client';

import React from 'react';

import { usePathname } from 'next/navigation';

import {
  Button,
  Chip,
  Modal,
  ModalContent,
  Tab,
  Tabs,
  useDisclosure,
} from '@nextui-org/react';

import { ReportForm } from './reports/report-form';

export type Count = {
  companies: number;
  campaigns: number;
  contributors: number;
  reports: number;
};

export default function NavTabs({ count }: { count: Count }) {
  const [selected, setSelected] = React.useState<string | number>('reports');
  const modalProps = useDisclosure();

  const handleSelectionChange = (selected: any) => {
    setSelected(selected);
  };
  const path = usePathname();
  return (
    <div className="flex w-full justify-between flex-wrap gap-4">
      <div className="flex flex-col gap-4">
        <Tabs
          aria-label="Options"
          selectedKey={path}
          className="flex-wrap"
          onSelectionChange={handleSelectionChange}
          // isVertical={visualViewport?.width < 720}
        >
          <Tab
            key="/"
            title={
              <div className="flex items-center space-x-2">
                🏠&nbsp;
                <span>Home</span>
              </div>
            }
            href="/"
          />
          <Tab
            key="/reports"
            title={
              <div className="flex items-center space-x-2">
                <span>🐛&nbsp; Reports</span>
                <Chip size="sm" variant="faded">
                  {count.reports}
                </Chip>
              </div>
            }
            href="/reports"
          />
          <Tab
            key="/contributors"
            title={
              <div className="flex items-center space-x-2">
                <span>👷👷‍♀️&nbsp;Contributors</span>
                <Chip size="sm" variant="faded">
                  {count.contributors}
                </Chip>
              </div>
            }
            href="/contributors"
          />
          <Tab
            key="/companies"
            title={
              <div className="flex items-center space-x-2">
                <span>🏢&nbsp;Companies</span>
                <Chip size="sm" variant="faded">
                  {count.companies}
                </Chip>
              </div>
            }
            href="/companies"
          />
          <Tab
            key="/campaigns"
            title={
              <div className="flex items-center space-x-2">
                <span>📢&nbsp;Campaigns</span>
                <Chip size="sm" variant="faded">
                  {count.campaigns}
                </Chip>
              </div>
            }
            href="/campaigns"
          />
          <Tab
            key="/leaderboard"
            title={
              <div className="flex items-center space-x-2">
                <span>🏆&nbsp;Leaderboard</span>
                <Chip size="sm" color="danger">
                  New
                </Chip>
              </div>
            }
            href="/leaderboard"
          />
        </Tabs>
      </div>
      <div>
        <Button
          onPress={modalProps.onOpen}
          color="success"
          className="text-white"
        >
          Report bug
        </Button>
        <Modal
          isOpen={modalProps.isOpen}
          onOpenChange={modalProps.onOpenChange}
          size="5xl"
          // size='full'
          style={{ margin: 0 }}
          className="max-w-screen-xl overflow-auto max-h-[95vh]"
          classNames={{ closeButton: 'text-foreground-50 top-3' }}
          placement="auto"
        >
          <ModalContent>
            <ReportForm mode={'create'} handleCancel={modalProps.onClose} />
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
