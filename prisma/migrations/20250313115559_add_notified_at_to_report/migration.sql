/*
  Warnings:

  - Added the required column `notifiedAt` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "notifiedAt" TIMESTAMP(3) NOT NULL;
