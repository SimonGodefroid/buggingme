/*
  Warnings:

  - You are about to drop the column `email` on the `Invitation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Invitation_email_campaignId_key";

-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "email";
