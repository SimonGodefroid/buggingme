-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ENGINEER', 'COMPANY', 'GOD');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userTypes" "UserType"[];
