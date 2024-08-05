import db from "@/db";

export async function countReports() {
  const count = await db.report.count();
  return count;
}