'use server';

import { getAllUsersByUserType } from "@/queries";
import { UserType } from "@prisma/client";


export async function fetchAllUsersByUserType(userType: UserType) {
  return await getAllUsersByUserType(userType);
}