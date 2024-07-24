'use client';

import React, { useEffect, useState } from 'react';

import { createReport } from '@/actions/reports/create';
import { faker } from '@faker-js/faker';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import { DragNDropFileUpload } from '@/components/common/drag-n-drop-file-upload';
import { EditorClient } from '@/components/common/editor';

const FORM_ID = 'create-report';
const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=Your+screenshot+here';

export const CreateReportForm = ({
  onOpen,
  isOpen,
  onOpenChange,
  onClose,
}: {
  onOpen: () => void;
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}) => {
  const [formState, action] = useFormState(createReport, {
    errors: {},
  });

  const [images, setImages] = React.useState<{ id: number; url: string }[]>(
    Array.from({ length: 1 }, (v, k) => ({ id: k, url: DEFAULT_IMAGE })),
  );

  useEffect(() => {
    if (formState.success) {
      toast.success('Report created successfully !');
      onClose();
    }
    if (formState.errors._form?.length) {
      toast.error(formState.errors._form.join(', '));
    }
  }, [formState]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        placement="auto"
      >
        <ModalContent>
          <div>
            <form
              className="flex flex-col bg-slate-900"
              id={FORM_ID}
              action={action}
            >
              <div className="flex flex-col gap-4 max-h-[80vh] overflow-auto">
                <div className="grid grid-cols-12 gap-4">
                  <div className=" col-span-6">
                    <div className="flex flex-col gap-4 m-4 ">
                      <div className="flex flex-col gap-4">
                        <h3 className="text-white">Summary</h3>
                        <Input
                          isInvalid={!!formState?.errors.title}
                          errorMessage={formState?.errors.title?.join(', ')}
                          defaultValue={`${faker.hacker.noun()} ${faker.hacker.ingverb()}`}
                          name="title"
                          isRequired
                          label="Title"
                          placeholder="Wrong user information in profile"
                        />
                        <Input
                          label="Company"
                          isRequired
                          defaultValue={`${faker.company.name()}`}
                          name="company"
                          // startContent={}
                          // endContent={}
                          placeholder="Example Inc."
                          isInvalid={!!formState?.errors.company}
                          errorMessage={formState?.errors.company?.join(', ')}
                        />
                        <Input
                          label="url"
                          name="url"
                          isRequired
                          placeholder="https://www.example.com"
                          defaultValue={faker.internet.url()}
                          isInvalid={!!formState?.errors.url}
                          errorMessage={formState?.errors.url?.join(', ')}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="flex flex-col gap-4">
                      <div className="m-4">
                        <img
                          src={
                            'https://placehold.co/600x400?text=Your+screenshot+here'
                          }
                          height="100"
                          className="rounded"
                        />
                      </div>
                      <div className="flex flex-col gap-4 mx-4">
                        <h3 className="text-white">Files</h3>
                        <DragNDropFileUpload setImages={setImages} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col m-4 gap-4">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-white">Behavior</h3>
                    <Textarea
                      label="Steps to reproduce"
                      name="steps"
                      defaultValue={`1. ${faker.hacker.verb()} ${faker.hacker.noun()}\n2. ${faker.hacker.verb()} ${faker.hacker.noun()}`}
                      isRequired
                      isInvalid={!!formState?.errors.steps}
                      errorMessage={formState?.errors.steps?.join(', ')}
                      placeholder={`1. Go to Settings\n2. Click on Personal information\n...`}
                    />
                    <Textarea
                      label="Current Behavior"
                      isRequired
                      isInvalid={!!formState?.errors.currentBehavior}
                      errorMessage={formState?.errors.currentBehavior?.join(
                        ', ',
                      )}
                      defaultValue={`It is currently ${faker.hacker.ingverb()} the ${faker.hacker.noun()}`}
                      name="currentBehavior"
                      placeholder="Displayed information is related to a different user than me"
                    />
                    <Textarea
                      label="Expected Behavior"
                      defaultValue={`It should ${faker.hacker.verb()} the ${faker.hacker.noun()}`}
                      name="expectedBehavior"
                      isRequired
                      isInvalid={!!formState?.errors.expectedBehavior}
                      errorMessage={formState?.errors.expectedBehavior?.join(
                        ', ',
                      )}
                      placeholder="Displayed information under my profile should be mine"
                    />
                  </div>
                </div>
                <div className="flex flex-col m-4 gap-4">
                  <h3 className="text-white">Suggestions</h3>
                  <Textarea
                    label="Suggestions"
                    name="suggestions"
                    defaultValue={`Try to ${faker.hacker.verb()} the ${faker.hacker.noun()}`}
                    placeholder="You should check around the API call being made to Identité Numérique you are likely not doing what's needed"
                    classNames={{
                      input: 'resize-y min-h-[40px] rounded text-white',
                    }}
                  />
                  <EditorClient />
                </div>
              </div>
            </form>
            <ModalFooter className=" justify-between">
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>

              <Button color="primary" type="submit" form={FORM_ID}>
                Submit
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
