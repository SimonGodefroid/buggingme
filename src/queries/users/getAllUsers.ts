import db from "@/db";

export async function getAllUsers() {
  const users = await db.user.findMany({ include: { companies: true } });
  return users;
}