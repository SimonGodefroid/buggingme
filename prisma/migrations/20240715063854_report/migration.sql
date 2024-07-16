/*
  Warnings:

  - You are about to drop the column `content` on the `Report` table. All the data in the column will be lost.
  - Added the required column `company` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentBehavior` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedBehavior` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snippets` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `steps` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suggestions` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "content",
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "currentBehavior" TEXT NOT NULL,
ADD COLUMN     "expectedBehavior" TEXT NOT NULL,
ADD COLUMN     "snippets" TEXT NOT NULL,
ADD COLUMN     "steps" TEXT NOT NULL,
ADD COLUMN     "suggestions" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
