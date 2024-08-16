import db from "@/db";
import { cache } from "react";
// export const fetchUser = cache(async () => {
//   const authenticatedUser = await auth();
//   const id = authenticatedUser?.user?.id;
//   if (!id) {
//     return null;
//   } else {
//     const user = await db.user.findUnique({ where: { id }, include: { companies: true } });
//     return user;
//   }
// });



export const getAllCompanies = cache(async () => {
  const companies = await db.company.findMany();
  return companies;
});