'use server';

import { getAllCompanies, } from '@/queries';

export async function fetchAllCompanies() {
  return await getAllCompanies();
}