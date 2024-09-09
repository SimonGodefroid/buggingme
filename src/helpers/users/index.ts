import { UserWithCompanies } from "@/types";
import { User, UserType } from "@prisma/client";

export const isUser = (type: UserType, user: User) => { return user.userTypes?.includes(type) }
export const isEngineer = (user: User | UserWithCompanies) => { return user.userTypes?.includes(UserType.ENGINEER) }
export const isCompany = (user: User | UserWithCompanies) => { return user.userTypes?.includes(UserType.COMPANY) }
export const isAdmin = (user: User | UserWithCompanies) => { return user.userTypes?.includes(UserType.GOD) }
export const hasRoles = (user: User | UserWithCompanies, types: UserType[]) => { return types.some(type => user.userTypes?.includes(type)) }