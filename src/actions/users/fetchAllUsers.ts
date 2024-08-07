'use server';

import { getAllUsers } from '@/queries';

export async function fetchAllUsers() {
  return await getAllUsers();
}