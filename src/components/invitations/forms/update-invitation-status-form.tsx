'use client';

import { useEffect } from 'react';

import { updateInvitationStatus } from '@/actions/invitations/update-invitation-status';
import { Button, ButtonProps } from '@nextui-org/react';
import { Invitation, InvitationStatus } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import { statusColorMap } from '../status';

export default function UpdateInvitationStatusForm({
  id,
  status,
  disabled,
}: {
  id: Invitation['id'];
  status: InvitationStatus;
  disabled?: boolean;
}) {
  const FORM_ID = `${status}-invitation-${id}`;
  const [formState, action] = useFormState(
    updateInvitationStatus.bind(null, {
      id,
      status,
    }),
    { errors: {} },
  );
  useEffect(() => {
    if (formState.success) {
      toast.success('Invitation status updated');
    }
    if (formState.errors._form?.length) {
      toast.error(formState.errors._form.join(', '));
    }
  }, [formState]);

  const label: Record<InvitationStatus, string> = {
    [InvitationStatus.Accepted]: 'Accept',
    [InvitationStatus.Rejected]: 'Reject',
    [InvitationStatus.Pending]: 'Set to Pending',
    [InvitationStatus.Revoked]: 'Revoke',
    [InvitationStatus.Cancelled]: 'Cancel',
  };
  const buttonProps = { ...statusColorMap[status], label } as {
    color: ButtonProps['color'];
    variant: ButtonProps['variant'];
  };

  return (
    <form
      action={action}
      id={FORM_ID}
      className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    >
      <Button
        size="sm"
        {...buttonProps}
        type="submit"
        form={FORM_ID}
        isDisabled={disabled}
      >
        {label?.[status]}
      </Button>
    </form>
  );
}
