import db from "@/db";

export async function countContributors() {
  const count = await db.user.count(
    // { where: { 'role': 'engineer' } }
  );
  return count;
}