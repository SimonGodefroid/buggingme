'use client';

import React, { useEffect, useState } from 'react';

import { redirect, useRouter } from 'next/navigation';

import { createCampaign } from '@/actions/campaigns';
import { sendInvitations } from '@/actions/invitations/send-invitation';
import { CampaignWithInvitations, UserWithCompanies } from '@/types';
import { Button, Chip, Select, Selection, SelectItem } from '@nextui-org/react';
import { User } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

export const SendInvitationsForm = ({
  user,
  users,
  campaigns,
}: {
  user?: UserWithCompanies | null;
  // users: { user: User }[];
  users: User[];
  campaigns: CampaignWithInvitations[] | null;
}) => {
  const FORM_ID = `send-invitations`;
  const router = useRouter();
  const [formState, action] = useFormState(sendInvitations, {
    errors: {},
  });

  const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (formState.success) {
      toast.success(`Invitations sent !`);
      redirect(`/invitations`);
    }
    if (formState.errors._form?.length) {
      toast.error(formState.errors._form.join(', '));
    }
  }, [formState]);

  return (
    <div>
      <form className="" id={FORM_ID} action={action}>
        <div className="flex flex-col m-4 gap-4">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-6">
              <div className="flex flex-col gap-4">
                <Select
                  label="Campaign"
                  name="campaignId"
                  placeholder="Select a campaign"
                >
                  {(campaigns || []).map((campaign) => (
                    <SelectItem key={campaign.id} textValue={campaign.name}>
                      <Chip>{campaign.name}</Chip>
                    </SelectItem>
                  ))}
                </Select>

                <>
                  <input
                    hidden
                    name="invitedUsers"
                    value={Array.from(invitedUsers).join(',')}
                  />
                  <Select
                    label="Invited users"
                    name="invitedUsers"
                    placeholder="Select users"
                    selectionMode="multiple"
                    onSelectionChange={(keys: Selection) => {
                      const selectedKeys = new Set(keys);
                      setInvitedUsers((prevUsers) => {
                        const updatedUsers = new Set(prevUsers); // Copy existing users
                        selectedKeys.forEach((user) =>
                          updatedUsers.add(user as string),
                        ); // Add new selections
                        return updatedUsers; // Update the state with the new set of selected users
                      });
                    }}
                    multiple
                  >
                    {/* Replace with actual users fetched from your DB */}
                    {users.map((user) => (
                      <SelectItem
                        key={user.id}
                        textValue={user.name?.toString()}
                      >
                        <Chip>{user.name}</Chip>
                      </SelectItem>
                    ))}
                  </Select>
                </>

                <div className="flex justify-between">
                  <Button color="danger" variant="flat" onClick={router.back}>
                    Cancel
                  </Button>

                  <Button color="primary" type="submit" form={FORM_ID}>
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
