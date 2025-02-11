'use client';

import { useEffect } from 'react';

import { deleteAttachment } from '@/actions/attachments/deleteAttachment';
import { Button } from '@nextui-org/react';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import Icon from '../common/Icon';

export default function DeleteAttachmentForm({
  attachmentUrl,
  onDelete,
}: {
  attachmentUrl: string;
  onDelete: () => void;
}) {
  const [formState, action] = useFormState(
    deleteAttachment.bind(null, {
      attachmentUrl,
    }),
    {
      errors: {},
    },
  );

  const FORM_ID = 'delete-attachment';
  useEffect(() => {
    if (formState.success) {
      toast.success('Attachment deleted successfully');
      onDelete();
    }
    if (formState.errors._form?.length) {
      toast.error(formState.errors._form.join(', '));
    }
  }, [formState,onDelete]);
  return (
    <form action={action} id={FORM_ID}>
      <Button color='danger' type="submit" form={FORM_ID} startContent={<Icon name='trash'/>}>
        Delete
      </Button>
    </form>
  );
}
