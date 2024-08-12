'use server';
import { auth } from "@/auth";
import db from "@/db";

export async function fetchUser() {
  const authenticatedUser = await auth();
  const id = authenticatedUser?.user?.id;
  if (!id) {
    return null;
  } else {
    const user = await db.user.findUnique({ where: { id }, include: { companies: true } });
    return user;
  }
}