'use client';

import React, { useEffect } from 'react';

import { redirect, useRouter } from 'next/navigation';

import { editCampaign } from '@/actions/campaigns';
import {
  CampaignWithCompany,
  CampaignWithInvitations,
  UserWithCompanies,
} from '@/types';
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  DateRangePicker,
  Input,
  Link,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import { CampaignStatus, CampaignType } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import Icon from '@/components/common/Icon';

export const EditCampaignForm = ({
  campaign,
  user,
}: {
  campaign: CampaignWithInvitations;
  user?: UserWithCompanies | null;
}) => {
  const FORM_ID = `edit-campaign`;
  const router = useRouter();
  const min = today(getLocalTimeZone());
  const [formState, action] = useFormState(
    editCampaign.bind(null, { campaignId: campaign.id }),
    {
      errors: {},
    },
  );

  useEffect(() => {
    if (formState.success) {
      toast.success(`Campaign creation successful !`);
      redirect(`/campaigns/${campaign.id}`);
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
                <Card className="text-small bg-blue-300 text-background">
                  <CardHeader className="gap-2">
                    <Chip color="secondary" variant="faded" className="">
                      i
                    </Chip>
                    {campaign.status === CampaignStatus.Created
                      ? `Campaign edition`
                      : `This campaign was archived on ${campaign.updatedAt.toLocaleDateString('en-GB')}`}
                  </CardHeader>
                  <CardBody className="block">
                    {campaign.status === CampaignStatus.Created ? (
                      <>
                        We do not allow &nbsp;
                        <span className="font-bold">type, dates or rules</span>
                        &nbsp;to be edited to prevent contributors being taken
                        advantage of.
                        <br />
                        NB: If you need to change these, please archive this
                        campaign and create a new one.
                      </>
                    ) : (
                      <>You can no longer edit it</>
                    )}
                  </CardBody>
                </Card>
                <Select
                  label="Type"
                  name="type"
                  isDisabled
                  placeholder="Select a campaign type"
                  defaultSelectedKeys={[campaign.type]}
                  classNames={{ value: ['mt-1'] }}
                  renderValue={(selected) => {
                    return <Chip size="sm">{selected[0].textValue}</Chip>;
                  }}
                >
                  {Object.values(CampaignType).map((type) => (
                    <SelectItem key={type} textValue={type}>
                      <Chip>{type}</Chip>
                    </SelectItem>
                  ))}
                </Select>
                {campaign.type === CampaignType.InvitationOnly && (
                  <>
                    <Select
                      label="Invited users"
                      name="invitedUsers"
                      isDisabled
                      placeholder="Select users"
                      selectionMode="multiple"
                      selectedKeys={
                        campaign.invitations.map(
                          (invitation) => invitation.invitee?.id,
                        ) as string[]
                      }
                      multiple
                      isMultiline
                    >
                      {campaign.invitations.map(
                        (
                          invitation: CampaignWithInvitations['invitations'][number],
                        ) => (
                          <SelectItem
                            key={`${invitation?.id.toString()}`}
                            textValue={`${invitation.invitee?.name}`}
                          >
                            <Chip>{invitation.invitee?.name}</Chip>
                          </SelectItem>
                        ),
                      )}
                    </Select>
                    <p className="text-small text-default-500">
                      Invitations can be sent and revoked from the{' '}
                      <Link href={`/invitations?campaignId=${campaign.id}`}>
                        Invitations module&nbsp;
                        <Icon name="link-external" size="small" />
                      </Link>
                    </p>
                  </>
                )}
                <Input
                  isInvalid={!!formState?.errors.name}
                  errorMessage={formState?.errors.name?.join(', ')}
                  defaultValue={campaign.name}
                  isDisabled={campaign.status === CampaignStatus.Archived}
                  name="name"
                  label="Name"
                  isRequired
                  placeholder="My company bug bounty campaign"
                />

                <DateRangePicker
                  label="Start date - End date"
                  defaultValue={{
                    start: parseDate(
                      campaign?.startDate
                        ? new Date(campaign.startDate)
                            .toISOString()
                            .split('T')[0]
                        : '',
                    ),
                    end: parseDate(
                      campaign?.endDate
                        ? new Date(campaign.endDate).toISOString().split('T')[0]
                        : '',
                    ),
                  }}
                  isDisabled
                />
                <Textarea
                  label="Description"
                  minRows={4}
                  name="description"
                  defaultValue={campaign.description}
                  isRequired
                  isDisabled={campaign.status === CampaignStatus.Archived}
                  isInvalid={!!formState?.errors.description}
                  errorMessage={formState?.errors.description?.join(', ')}
                  placeholder={`In this campaign we would like to identify the possible bugs on the user module.\nThe scope is the user profile page.`}
                />
                <Textarea
                  label="Rules"
                  minRows={4}
                  name="rules"
                  isDisabled
                  defaultValue={campaign.rules}
                  placeholder={`Rule #1: Please only use the interface or curl to test the application.\nRule #2: Do not use automated tools.\nRule #3: Do not DDoS, spam or harm the application, this is not a penetration test.`}
                />

                {campaign.status !== CampaignStatus.Archived && (
                  <div className="flex justify-between">
                    <Button color="danger" variant="flat" onClick={router.back}>
                      Cancel
                    </Button>

                    <Button color="primary" type="submit" form={FORM_ID}>
                      Submit
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
