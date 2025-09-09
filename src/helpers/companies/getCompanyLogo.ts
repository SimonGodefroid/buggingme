import { Company } from '@prisma/client';

export const getCompanyLogo = (company: Company) => {
  if (company.logo) return company.logo;

  if (company.domain) {
    let hostname: string;
    try {
      hostname = new URL(company.domain).hostname;
    } catch {
      hostname = company.domain;
    }
    hostname = hostname.replace(/^www\./, '');
    return `https://img.logo.dev/${hostname}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}`;
  }
  return `https://placehold.co/200x200?text=${company.name}`;
};
