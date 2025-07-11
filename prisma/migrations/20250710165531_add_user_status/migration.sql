-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PendingVerification', 'Active', 'Blocked', 'Suspended', 'Deleted');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'PendingVerification';
