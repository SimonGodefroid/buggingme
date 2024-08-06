import db from "@/db";
import { UserType } from "@prisma/client";

export async function countContributors() {
  const count = await db.user.count(
    { where: { userTypes: { has: UserType.ENGINEER } } }
  );
  return count;
}