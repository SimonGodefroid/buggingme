'use client';

import React from 'react';

import { CampaignWithCompany, UserWithCompanies } from '@/types';
import { parseDate } from '@internationalized/date';
import {
  Chip,
  DateRangePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import { CampaignType } from '@prisma/client';

export const ViewCampaignForm = ({
  campaign,
  user,
}: {
  campaign: CampaignWithCompany;
  user?: UserWithCompanies | null;
}) => {
  return (
    <div>
      <div className="flex flex-col m-4 gap-4 ">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-6 hover:cursor-not-allowed">
            <div className="flex flex-col gap-4">
              <Select
                label="Type"
                name="type"
                isDisabled
                placeholder="Select a campaign type"
                defaultSelectedKeys={[CampaignType.Public]}
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
              <Input
                isDisabled
                name="name"
                label="Name"
                value={campaign.name}
                isReadOnly
                placeholder="My company bug bounty campaign"
              />
              <DateRangePicker
                isDisabled
                label="Start date - End date"
                defaultValue={{
                  start: parseDate(
                    campaign?.startDate
                      ? new Date(campaign.startDate).toISOString().split('T')[0]
                      : '',
                  ),
                  end: parseDate(
                    campaign?.endDate
                      ? new Date(campaign.endDate).toISOString().split('T')[0]
                      : '',
                  ),
                }}
              />
              <Textarea
                label="Description"
                minRows={4}
                value={campaign.description}
                name="description"
                isDisabled
              />
              <Textarea
                label="Rules"
                minRows={4}
                name="rules"
                isDisabled
                value={campaign.rules}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
