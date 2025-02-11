/*
  Warnings:

  - You are about to drop the column `currentBehavior` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `expectedBehavior` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "currentBehavior",
DROP COLUMN "expectedBehavior";
