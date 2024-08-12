/*
  Warnings:

  - Added the required column `newCategory` to the `StatusHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldCategory` to the `StatusHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StatusHistory" ADD COLUMN     "newCategory" "ReportCategory" NOT NULL,
ADD COLUMN     "oldCategory" "ReportCategory" NOT NULL;
