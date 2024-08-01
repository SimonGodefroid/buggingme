import db from "@/db";

export async function getAllCompanies() {
  const companies = await db.company.findMany();
  return companies;
}