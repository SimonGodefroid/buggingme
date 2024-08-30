'use client';

import React, { useEffect, useState } from 'react';

import { redirect, useRouter } from 'next/navigation';

import { createCampaign } from '@/actions/campaigns';
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import {
  Button,
  Chip,
  DateRangePicker,
  DateValue,
  Input,
  RangeValue,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import { CampaignType } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import { UserWithCompanies } from '@/types';

export const CreateCampaignForm = ({
  user,
}: {
  user?: UserWithCompanies | null;
}) => {
  const FORM_ID = `create-campaign`;
  const router = useRouter();
  const min = today(getLocalTimeZone());
  const [formState, action] = useFormState(createCampaign, {
    errors: {},
  });
  const [value, setValue] = React.useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()),
  });

  useEffect(() => {
    if (formState.success) {
      toast.success(`Campaign creation successful !`);
      redirect(`/campaigns`);
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
                  label="Type"
                  name="type"
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
                  isInvalid={!!formState?.errors.name}
                  errorMessage={formState?.errors.name?.join(', ')}
                  name="name"
                  label="Name"
                  isRequired
                  placeholder="My company bug bounty campaign"
                />
                <input
                  hidden
                  name="startDate"
                  type="string"
                  value={value.start.toString()}
                />
                <input
                  hidden
                  name="endDate"
                  type="string"
                  value={value.end.toString()}
                />
                {/* <div className="flex w-full flex-wrap md:flex-nowrap gap-4"> */}
                <DateRangePicker
                  label="Start date - End date"
                  minValue={min}
                  defaultValue={value}
                  onChange={setValue}
                  visibleMonths={1}
                  isInvalid={
                    !!formState?.errors.startDate || !!formState?.errors.endDate
                  }
                  errorMessage={`${formState?.errors.startDate} ${formState?.errors.endDate}`}
                />
                {/* </div> */}
                <Textarea
                  label="Description"
                  minRows={4}
                  name="description"
                  isRequired
                  isInvalid={!!formState?.errors.description}
                  errorMessage={formState?.errors.description?.join(', ')}
                  placeholder={`In this campaign we would like to identify the possible bugs on the user module.\nThe scope is the user profile page.`}
                />
                <Textarea
                  label="Rules"
                  minRows={4}
                  name="rules"
                  isRequired
                  isInvalid={!!formState?.errors.rules}
                  errorMessage={formState?.errors.rules?.join(', ')}
                  placeholder={`Rule #1: Please only use the interface or curl to test the application.\nRule #2: Do not use automated tools.\nRule #3: Do not DDoS, spam or harm the application, this is not a penetration test.`}
                />

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
