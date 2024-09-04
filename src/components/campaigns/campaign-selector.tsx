import React, { Key, useEffect, useRef, useState } from 'react';

import { fetchContributorCampaigns } from '@/actions/campaigns/fetch-contributor-campaigns';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { User } from '@prisma/client';
import { toast } from 'react-toastify';

type Campaign = {
  id: string;
  name: string;
  companyId: string;
};

export default function CampaignSelector({
  onCampaignChange,
  user,
}: {
  onCampaignChange: (campaign: Campaign | null) => void;
  user: User;
}) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  // const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
  //   null,
  // );
  const [selectedCampaignId, setSelectedCampaignId] = useState<Key | null>(null);

  const campaignInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const allCampaigns = await fetchContributorCampaigns({
          userId: user.id,
        });
        setCampaigns(allCampaigns ?? []);
      } catch (error) {
        toast.error('Failed to load campaigns');
      }
    };
    loadCampaigns();
  }, [user.id]);

  const handleSelectionChange = (campaignId: Key | null) => {
    if (!campaignId) {
      setSelectedCampaignId(null);
      onCampaignChange(null);
    } else {
      const campaign = campaigns.find((c) => c.id === campaignId) || null;
      setSelectedCampaignId(campaignId);
      onCampaignChange(campaign);
    }

    // Update the hidden input value with the selected campaign ID
    if (campaignInputRef.current) {
      campaignInputRef.current.value = (campaignId as string) || '';
    }
  };

  return (
    <>
      {/* This is absolutely horrifying but the autocomplete always return the name and not the id of the campaign
    and storing with a normal hidden input just doesn't reset the value when the auto complete is cleared... */}
      <input type="hidden" name="campaignId" ref={campaignInputRef} />
      <Autocomplete
        label="Select a Campaign"
        selectedKey={selectedCampaignId as string}
        onSelectionChange={handleSelectionChange}
        allowsCustomValue={false}
        allowsEmptyCollection
      >
        {campaigns?.map((campaign) => (
          <AutocompleteItem key={campaign.id} textValue={campaign.name}>
            {campaign.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </>
  );
}
