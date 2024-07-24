'use client';

import React, { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { createReport } from '@/actions/reports/create';
import { faker } from '@faker-js/faker';
import {
  Button,
  Chip,
  Modal,
  modal,
  ModalContent,
  Tab,
  Tabs,
  useDisclosure,
} from '@nextui-org/react';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import { EditReportForm, FormMode } from './reports/edit-report-form';

const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=Your+screenshot+here';

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
          size="4xl"
          placement="auto"
        >
          <ModalContent>
            <EditReportForm mode={'create'} handleCancel={modalProps.onClose} />
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
