import db from "@/db";

export async function countCompanies() {
  const count = await db.company.count();
  return count;
}