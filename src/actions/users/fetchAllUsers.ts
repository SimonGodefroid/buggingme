'use server';

import { getAllUsers } from '@/db/queries';

export async function fetchAllUsers() {
  return await getAllUsers();
}