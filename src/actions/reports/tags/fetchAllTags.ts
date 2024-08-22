'use server';

import { getAllTags } from '@/db/queries/tags';

export async function fetchAllTags() {
  return await getAllTags();
}