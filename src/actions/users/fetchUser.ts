import db from "@/db";
import { User } from "@prisma/client";

export async function fetchUser(id: User['id']): Promise<User | null> {
  const user = await db.user.findUnique({ where: { id } })
  return user;
}