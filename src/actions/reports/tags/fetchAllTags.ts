'use server';

import { getAllTags } from '@/queries';

export async function fetchAllTags() {
  return await getAllTags();
}