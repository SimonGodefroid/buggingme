import { Company } from "@prisma/client";
export const getCompanyLogo = (company: Company) => {
  if (company.logo) return company.logo;
  if (company.domain)
    return `https://img.logo.dev/${company.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}`;
  return `https://placehold.co/200x200?text=${company.name}`;
};
