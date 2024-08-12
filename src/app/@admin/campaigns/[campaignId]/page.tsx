export default function CampaignView({
  params,
}: {
  params: { campaignId: string };
}) {
  return <div className="flex flex-col gap-4">{params.campaignId}</div>;
}
