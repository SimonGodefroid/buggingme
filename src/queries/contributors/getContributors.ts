import { ContributorWithReports } from "@/types";
import { cache } from "react";
import db from '@/db';
import { UserType } from "@prisma/client";
export const getContributors: () => Promise<ContributorWithReports[]> = cache(async () => {

  return await db.user.findMany({
    where: { userTypes: { has: UserType.ENGINEER } },
    include: { Report: true },
  });
})