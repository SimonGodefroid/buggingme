import db from "@/db";
import { UserType } from "@prisma/client";
import { ContributorWithReports } from "@/types";
import { cache } from "react";

export async function countContributors() {
  const count = await db.user.count(
    { where: { userTypes: { has: UserType.ENGINEER } } }
  );
  return count;
}

export const getContributors: () => Promise<ContributorWithReports[]> = cache(async () => {
  return await db.user.findMany({
    where: { userTypes: { has: UserType.ENGINEER } },
    include: { Report: true },
  });
})