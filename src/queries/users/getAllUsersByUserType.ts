import db from "@/db";
import { UserType } from "@prisma/client";

export async function getAllUsersByUserType(userType: UserType) {
  const users = await db.user.findMany({ where: { userTypes: { has: userType } }, include: { companies: true } });
  return users;
}