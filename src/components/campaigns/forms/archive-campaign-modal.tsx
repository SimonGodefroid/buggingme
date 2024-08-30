'use client';

import React from 'react';

import { archiveCampaign } from '@/actions/campaigns';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { toast } from 'react-toastify';

import Icon from '@/components/common/Icon';

export default function ArchiveCampaignModal({
  campaignId,
}: {
  campaignId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button startContent={<Icon name="archive" />} onPress={onOpen}>
        Archive Campaign
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Archive the campaign
              </ModalHeader>
              <ModalBody>
                <p>
                  The campaign will still be visible but no one will be able to
                  raise new reports for it. You can use this if you want the
                  campaign to end.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={async () => {
                    try {
                      await archiveCampaign({ campaignId });
                      toast.success('Campaign archived');
                      onClose()
                    } catch (err) {
                      err instanceof Error
                        ? toast.error(err.message)
                        : toast.error('Something went wrong');
                    }
                  }}
                >
                  Archive
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
