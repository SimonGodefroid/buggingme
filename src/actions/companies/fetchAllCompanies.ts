'use server';

import { getAllCompanies, } from '@/db/queries';

export async function fetchAllCompanies() {
  return await getAllCompanies();
}