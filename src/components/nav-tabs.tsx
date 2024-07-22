'use client';

import React from 'react';

import { usePathname } from 'next/navigation';

import { Button, Chip, Tab, Tabs, useDisclosure } from '@nextui-org/react';

import { CreateReportForm } from './reports/create-report-form';

export default function NavTabs() {
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
                  9
                </Chip>
              </div>
            }
            href="/reports"
          />
          <Tab
            key="/contributors"
            title={
              <div className="flex items-center space-x-2">
                <span>👷👷‍♀️ &nbsp;Contributors</span>
                <Chip size="sm" variant="faded">
                  9
                </Chip>
              </div>
            }
            href="/contributors"
          />
          <Tab
            key="/companies"
            title={
              <div className="flex items-center space-x-2">
                <span>🏢 &nbsp;Companies</span>
                <Chip size="sm" variant="faded">
                  9
                </Chip>
              </div>
            }
            href="/companies"
          />
        </Tabs>
      </div>
      <div>
        <Button onPress={modalProps.onOpen}>Report bug</Button>
        <CreateReportForm {...modalProps} />
      </div>
    </div>
  );
}
