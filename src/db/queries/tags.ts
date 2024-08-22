import db from "@/db";

export async function getAllTags() {
  const tags = await db.tag.findMany();
  return tags;
}