import { UserWithCompanies } from "@/app/@admin/admin/page";
import db from "@/db";
import { User } from "@prisma/client";

export async function fetchUser(id: User['id']): Promise<UserWithCompanies | null> {
  if (id) {

    const user = await db.user.findUnique({ where: { id }, include: { companies: true } });
    return user;
  } else {
    throw new Error('Missing id');
  }
}