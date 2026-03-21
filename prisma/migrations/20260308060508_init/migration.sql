/*
  Warnings:

  - The required column `userId` was added to the `Notes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "userId" TEXT NOT NULL;
